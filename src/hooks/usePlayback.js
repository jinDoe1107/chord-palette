import { useEffect, useRef, useState } from "react";
import { DEFAULT_PLAYBACK_SPEED } from "../lib/playbackSpeed.js";
import { GUITAR_TONES, DEFAULT_GUITAR_TONE, findTone } from "../lib/guitarTones.js";
import { barSeconds, flattenSteps, playbackMidisForTone } from "../lib/playbackCore.js";
import { sampleUrl, clampMidiToRange, collectStepMidis } from "../lib/guitarSamples.js";

const LOOKAHEAD = 0.06; // s: schedule the first bar slightly ahead of the audio clock
const STRUM_MS = 14; // per-note delay, low string → high string
const RELEASE_MS = 60; // fade each bar out just before it ends (no click into the next)
const STOP_FADE_MS = 40; // fade the whole mix out on stop

/**
 * Plays a generated song through Web Audio using guitar samples (see guitarSamples.js).
 * Interface is unchanged from the original no-op stub, plus `tone`/`setTone`:
 *   { playing, playingSection, cursor, speed, setSpeed, tone, setTone, play, stop }.
 * `play(song, sectionIndex?)` sounds one chord per bar and advances `cursor`;
 * `stop()` is idempotent (callers stop() on regenerate/reorder even when idle).
 */
export function usePlayback() {
  const [playing, setPlaying] = useState(false);
  const [playingSection, setPlayingSection] = useState(null);
  const [cursor, setCursor] = useState(null); // { section, bar }
  const [speed, setSpeed] = useState(DEFAULT_PLAYBACK_SPEED);
  const [tone, setTone] = useState(DEFAULT_GUITAR_TONE);

  const ctxRef = useRef(null);
  const masterRef = useRef(null); // GainNode → DynamicsCompressor → destination
  const playGainRef = useRef(null); // per-playback gain, faded out on stop
  const genRef = useRef(0); // generation token; bumps invalidate old timers/loads
  const timerRef = useRef(null);
  const speedRef = useRef(speed);
  const toneRef = useRef(tone);
  const stepsRef = useRef([]); // current playback's steps (for background preloads)
  const baseToneRef = useRef(DEFAULT_GUITAR_TONE); // tone fully loaded before playback
  const buffersRef = useRef(new Map()); // `${instrument}:${midi}` → AudioBuffer
  const inflightRef = useRef(new Map()); // `${instrument}:${midi}` → Promise<AudioBuffer>

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    toneRef.current = tone;
  }, [tone]);

  function ensureContext() {
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const compressor = ctx.createDynamicsCompressor(); // safety limiter for stacked notes
      compressor.threshold.value = -18;
      compressor.knee.value = 20;
      compressor.ratio.value = 8;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;
      const master = ctx.createGain();
      master.gain.value = 0.8;
      master.connect(compressor);
      compressor.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    return ctxRef.current;
  }

  function decodeAudio(ctx, arrayBuffer) {
    // Promise form isn't supported on older Safari, which only takes callbacks.
    return new Promise((resolve, reject) => {
      const ret = ctx.decodeAudioData(arrayBuffer, resolve, reject);
      if (ret && typeof ret.then === "function") ret.then(resolve, reject);
    });
  }

  function getBuffer(instrument, midi) {
    return buffersRef.current.get(`${instrument}:${midi}`);
  }

  function loadBuffer(ctx, instrument, midi) {
    const key = `${instrument}:${midi}`;
    if (buffersRef.current.has(key)) return Promise.resolve(buffersRef.current.get(key));
    if (inflightRef.current.has(key)) return inflightRef.current.get(key);
    const url = sampleUrl(import.meta.env.BASE_URL, instrument, midi);
    const promise = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
        return res.arrayBuffer();
      })
      .then((ab) => decodeAudio(ctx, ab))
      .then((buffer) => {
        buffersRef.current.set(key, buffer);
        inflightRef.current.delete(key);
        return buffer;
      })
      .catch((err) => {
        inflightRef.current.delete(key);
        throw err;
      });
    inflightRef.current.set(key, promise);
    return promise;
  }

  function preload(ctx, steps, toneId) {
    const instrument = findTone(toneId).instrument;
    const midis = collectStepMidis(steps, toneId);
    return Promise.allSettled(midis.map((m) => loadBuffer(ctx, instrument, m)));
  }

  function playChord(ctx, chord, toneId, startTime, barSec) {
    const midis = playbackMidisForTone(chord, toneId)
      .map(clampMidiToRange)
      .sort((a, b) => a - b);
    const primary = findTone(toneId).instrument;
    const fallback = findTone(baseToneRef.current).instrument; // always fully loaded

    const bus = ctx.createGain();
    bus.gain.value = 0.9 / Math.sqrt(Math.max(1, midis.length));
    bus.connect(playGainRef.current);

    const endTime = startTime + barSec;
    const releaseStart = Math.max(startTime, endTime - RELEASE_MS / 1000);
    bus.gain.setValueAtTime(bus.gain.value, releaseStart);
    bus.gain.linearRampToValueAtTime(0.0001, endTime);

    midis.forEach((midi, i) => {
      const buffer = getBuffer(primary, midi) || getBuffer(fallback, midi);
      if (!buffer) return; // not loaded yet (e.g. just switched tone) — skip this note
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(bus);
      src.start(startTime + (i * STRUM_MS) / 1000);
      src.stop(endTime + 0.05);
    });

    const freeAfter = Math.max(0, (endTime - ctx.currentTime + 0.2) * 1000);
    setTimeout(() => {
      try {
        bus.disconnect();
      } catch {
        /* already torn down */
      }
    }, freeAfter);
  }

  function stop() {
    genRef.current++;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const ctx = ctxRef.current;
    const playGain = playGainRef.current;
    if (ctx && playGain) {
      const now = ctx.currentTime;
      try {
        playGain.gain.cancelScheduledValues(now);
        playGain.gain.setValueAtTime(playGain.gain.value, now);
        playGain.gain.linearRampToValueAtTime(0.0001, now + STOP_FADE_MS / 1000);
      } catch {
        /* context may be closing */
      }
      setTimeout(() => {
        try {
          playGain.disconnect();
        } catch {
          /* already gone */
        }
      }, STOP_FADE_MS + 80);
    }
    playGainRef.current = null;
    setPlaying(false);
    setPlayingSection(null);
    setCursor(null);
  }

  function play(song, sectionIndex = null) {
    if (!song) return;
    stop();
    const gen = ++genRef.current;
    const ctx = ensureContext();
    if (ctx.state === "suspended") ctx.resume(); // sync, inside the click gesture

    const steps = flattenSteps(song, sectionIndex);
    if (steps.length === 0) return;
    stepsRef.current = steps;

    setPlaying(true);
    setPlayingSection(sectionIndex);

    const baseTone = toneRef.current;
    baseToneRef.current = baseTone;

    preload(ctx, steps, baseTone).then(() => {
      if (genRef.current !== gen) return; // stopped/restarted while loading

      const playGain = ctx.createGain();
      playGain.gain.value = 1;
      playGain.connect(masterRef.current);
      playGainRef.current = playGain;

      // Warm the other tones so switching mid-playback doesn't drop notes.
      GUITAR_TONES.forEach((t) => {
        if (t.id !== baseTone) preload(ctx, steps, t.id);
      });

      const startPerf = performance.now();
      let nextTickAt = startPerf; // wall-clock target (cumulative → no drift)
      let audioAt = ctx.currentTime + LOOKAHEAD; // audio-clock start of the current bar
      let i = 0;

      const tick = () => {
        if (genRef.current !== gen) return;
        const step = steps[i];
        setCursor({ section: step.si, bar: step.bi });
        const barSec = barSeconds(song.tempo, speedRef.current);
        const at = Math.max(audioAt, ctx.currentTime + 0.02);
        playChord(ctx, step.chord, toneRef.current, at, barSec);
        audioAt = at + barSec;
        i++;
        if (i >= steps.length) {
          timerRef.current = setTimeout(() => {
            if (genRef.current === gen) stop();
          }, barSec * 1000);
          return;
        }
        nextTickAt += barSec * 1000;
        timerRef.current = setTimeout(tick, Math.max(0, nextTickAt - performance.now()));
      };
      tick();
    });
  }

  function changeTone(toneId) {
    setTone(toneId);
    const ctx = ctxRef.current;
    if (ctx && stepsRef.current.length) preload(ctx, stepsRef.current, toneId);
  }

  useEffect(() => {
    return () => {
      genRef.current++;
      if (timerRef.current) clearTimeout(timerRef.current);
      const ctx = ctxRef.current;
      ctxRef.current = null;
      masterRef.current = null;
      playGainRef.current = null;
      if (ctx) ctx.close().catch(() => {});
    };
  }, []);

  return { playing, playingSection, cursor, speed, setSpeed, tone, setTone: changeTone, play, stop };
}
