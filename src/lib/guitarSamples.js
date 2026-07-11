import { playbackMidisForTone } from "./playbackCore.js";

/* FluidR3_GM sample file names use flats (Db, not C#); MIDI 60 = C4, 21 = A0. */
const SAMPLE_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

// Downloaded sample range: C1..C6 covers every note our chords can produce.
export const SAMPLE_MIN_MIDI = 24; // C1
export const SAMPLE_MAX_MIDI = 84; // C6

export function midiToSampleName(midi) {
  const name = SAMPLE_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${name}${octave}`;
}

/* Keep the pitch class, shift by whole octaves into the available sample range.
   A safety net for notes outside [MIN, MAX] (current chords stay in range). */
export function clampMidiToRange(midi, min = SAMPLE_MIN_MIDI, max = SAMPLE_MAX_MIDI) {
  let m = midi;
  while (m < min) m += 12;
  while (m > max) m -= 12;
  return m;
}

/* Public URL of one sample. `base` is import.meta.env.BASE_URL (passed in so this
   stays a pure, testable function); a trailing slash is normalized. */
export function sampleUrl(base, instrument, midi) {
  const root = base.endsWith("/") ? base : `${base}/`;
  return `${root}samples/guitar/${instrument}/${midiToSampleName(midi)}.mp3`;
}

/* Unique, in-range, ascending MIDI notes needed to play `steps` in `toneId`.
   Used to preload exactly the samples a song requires before playback. */
export function collectStepMidis(steps, toneId) {
  const set = new Set();
  for (const step of steps) {
    for (const midi of playbackMidisForTone(step.chord, toneId)) {
      set.add(clampMidiToRange(midi));
    }
  }
  return [...set].sort((a, b) => a - b);
}
