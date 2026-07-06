import { useRef, useState, useEffect } from "react";
import { chordFrequencies } from "../lib/chordTheory.js";

/**
 * Handles Web Audio playback of a generated song (sections of chords).
 * Returns { playing, cursor, play, stop }.
 */
export function usePlayback() {
  const [playing, setPlaying] = useState(false);
  const [cursor, setCursor] = useState(null); // { section, bar }
  const audioRef = useRef(null);
  const timerRef = useRef([]);

  const stop = () => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    if (audioRef.current) {
      audioRef.current.close().catch(() => {});
      audioRef.current = null;
    }
    setPlaying(false);
    setCursor(null);
  };

  useEffect(() => stop, []);

  const play = (song) => {
    if (!song) return;
    stop();
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioRef.current = ctx;
    const barDur = (60 / song.tempo) * 4;
    let t = 0;
    const timers = [];

    song.sections.forEach((section, si) => {
      section.chords.forEach((chord, bi) => {
        const when = t;
        timers.push(
          setTimeout(() => {
            setCursor({ section: si, bar: bi });
            const now = ctx.currentTime;
            chordFrequencies(chord).forEach((f) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = "triangle";
              osc.frequency.value = f;
              gain.gain.setValueAtTime(0.0001, now);
              gain.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + barDur * 0.95);
              osc.connect(gain).connect(ctx.destination);
              osc.start(now);
              osc.stop(now + barDur);
            });
          }, when * 1000)
        );
        t += barDur;
      });
    });

    timers.push(setTimeout(() => stop(), t * 1000 + 100));
    timerRef.current = timers;
    setPlaying(true);
  };

  return { playing, cursor, play, stop };
}
