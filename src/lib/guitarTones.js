/* Guitar tones offered in the playback toolbar.
   `instrument` is the FluidR3_GM sample folder name (also the on-disk directory
   under public/samples/guitar/), so tone id ⇄ sample set is defined in one place. */
export const GUITAR_TONES = [
  { id: "clean", label: "クリーン", instrument: "electric_guitar_clean" },
  { id: "crunch", label: "クランチ", instrument: "overdriven_guitar" },
  { id: "distortion", label: "ディストーション", instrument: "distortion_guitar" },
];

export const DEFAULT_GUITAR_TONE = "clean";

export function findTone(toneId) {
  return GUITAR_TONES.find((t) => t.id === toneId) || GUITAR_TONES[0];
}
