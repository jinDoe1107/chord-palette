import { NOTE_NAMES, ROMAN, MAJOR_SCALE, MINOR_SCALE } from "../data/musicData.js";

/* Chord qualities available for free-form editing.
   `suffix` is appended to the note name (e.g. "C" + "m7" = "Cm7").
   `degreeSuffix` is appended to the roman-numeral degree label.
   `minorish` decides upper/lower case for the degree label. */
export const QUALITIES = [
  { id: "maj", label: "メジャー", suffix: "", degreeSuffix: "", minorish: false, intervals: [0, 4, 7] },
  { id: "min", label: "マイナー", suffix: "m", degreeSuffix: "", minorish: true, intervals: [0, 3, 7] },
  { id: "7", label: "セブンス", suffix: "7", degreeSuffix: "7", minorish: false, intervals: [0, 4, 7, 10] },
  { id: "maj7", label: "メジャーセブンス", suffix: "M7", degreeSuffix: "M7", minorish: false, intervals: [0, 4, 7, 11] },
  { id: "min7", label: "マイナーセブンス", suffix: "m7", degreeSuffix: "7", minorish: true, intervals: [0, 3, 7, 10] },
  { id: "dim", label: "ディミニッシュ", suffix: "dim", degreeSuffix: "°", minorish: true, intervals: [0, 3, 6] },
  { id: "dim7", label: "ディミニッシュセブンス", suffix: "dim7", degreeSuffix: "°7", minorish: true, intervals: [0, 3, 6, 9] },
  { id: "m7b5", label: "ハーフディミニッシュ", suffix: "m7b5", degreeSuffix: "ø7", minorish: true, intervals: [0, 3, 6, 10] },
  { id: "aug", label: "オーギュメント", suffix: "aug", degreeSuffix: "+", minorish: false, intervals: [0, 4, 8] },
  { id: "sus2", label: "sus2", suffix: "sus2", degreeSuffix: "sus2", minorish: false, intervals: [0, 2, 7] },
  { id: "sus4", label: "sus4", suffix: "sus4", degreeSuffix: "sus4", minorish: false, intervals: [0, 5, 7] },
  { id: "6", label: "シックス", suffix: "6", degreeSuffix: "6", minorish: false, intervals: [0, 4, 7, 9] },
  { id: "m6", label: "マイナーシックス", suffix: "m6", degreeSuffix: "6", minorish: true, intervals: [0, 3, 7, 9] },
];

export function findQuality(qualityId) {
  return QUALITIES.find((q) => q.id === qualityId) || QUALITIES[0];
}

/* Roman-numeral degree label for an arbitrary root/quality relative to a key,
   mirroring tokenToChord's (♭ + case + extension) convention. */
function degreeLabelFor(rootPc, keyIndex, scale, quality) {
  const interval = (((rootPc - keyIndex) % 12) + 12) % 12;
  let idx = scale.indexOf(interval);
  let flat = false;
  if (idx === -1) {
    idx = scale.indexOf((interval + 1) % 12);
    flat = idx !== -1;
  }
  if (idx === -1) idx = 0; // shouldn't happen: every pitch class is at most a semitone from a scale degree
  const base = quality.minorish ? ROMAN[idx].toLowerCase() : ROMAN[idx];
  return (flat ? "♭" : "") + base + quality.degreeSuffix;
}

/* Uppercase roman-numeral label for a bass note relative to the key (e.g. "Ⅴ", "♭Ⅵ"). */
const BASS_QUALITY = { minorish: false, degreeSuffix: "" };

/**
 * Build a full chord object (for display + playback) from a root/quality pair,
 * labeled relative to the given key. Used both for music-theory suggestions and
 * for fully free-form manual chord edits.
 * @param {number|null} [bassPc] - bass pitch class for slash chords (null = root bass)
 */
export function buildChordForKey(rootPc, qualityId, keyIndex, keyMode, bassPc = null) {
  const scale = keyMode === "minor" ? MINOR_SCALE : MAJOR_SCALE;
  const quality = findQuality(qualityId);
  const pc = ((rootPc % 12) + 12) % 12;
  let name = NOTE_NAMES[pc] + quality.suffix;
  let degreeLabel = degreeLabelFor(pc, keyIndex, scale, quality);
  let bass = bassPc == null ? null : ((bassPc % 12) + 12) % 12;
  if (bass === pc) bass = null; // ルートと同じ分母は通常コード扱い
  if (bass != null) {
    name += "/" + NOTE_NAMES[bass];
    degreeLabel += "/" + degreeLabelFor(bass, keyIndex, scale, BASS_QUALITY);
  }
  return {
    name,
    degreeLabel,
    rootPc: pc,
    minor: quality.minorish,
    ext: qualityId === "7" ? "7" : qualityId === "maj7" ? "M7" : "",
    qualityId,
    intervals: quality.intervals,
    bassPc: bass,
    custom: true,
  };
}
