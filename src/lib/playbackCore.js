import { chordMidiNotes } from "./chordTheory.js";

/* Seconds per bar. Assumes 4/4 (4 beats per bar); `speed` is a playback multiplier
   (×2 speed → half the time). Matches duration.js's song-length math. */
export function barSeconds(bpm, speed) {
  const tempo = bpm > 0 ? bpm : 120;
  const mult = speed > 0 ? speed : 1;
  return 240 / tempo / mult;
}

export function midiToHz(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/* Flatten a song (or a single section) into an ordered list of playable steps,
   one per bar: { si: sectionIndex, bi: barIndex, chord }. */
export function flattenSteps(song, sectionIndex = null) {
  if (!song || !song.sections) return [];
  const steps = [];
  song.sections.forEach((section, si) => {
    if (sectionIndex != null && si !== sectionIndex) return;
    section.chords.forEach((chord, bi) => {
      steps.push({ si, bi, chord });
    });
  });
  return steps;
}

/* MIDI notes to actually sound for a chord in a given tone.
   Distortion sounds muddy on stacked thirds, so — like a real guitarist — we voice
   the distortion tone as a power chord (root + fifth + octave), keeping any slash bass.
   Clean and crunch use the full chord voicing unchanged. */
export function playbackMidisForTone(chord, toneId) {
  if (toneId !== "distortion") return chordMidiNotes(chord);
  const shift = 12 * (chord.octave || 0);
  const root = 48 + chord.rootPc + shift;
  const midis = [root, root + 7, root + 12];
  if (chord.bassPc != null && chord.bassPc !== chord.rootPc) {
    midis.unshift(36 + chord.bassPc + shift);
  }
  return midis;
}
