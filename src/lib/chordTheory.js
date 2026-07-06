import { NOTE_NAMES, MAJOR_SCALE, ROMAN } from "../data/musicData.js";

/* ------------------------------------------------------------------ */
/* Token parsing & chord building                                       */
/* Tokens: I..vii (case = quality), optional b prefix (借用),           */
/* optional 7 / M7. Uppercase+7 = dominant (e.g. III7, bVII7).          */
/* Optional /bass degree for slash chords (e.g. IV/V, I/iii).           */
/* ------------------------------------------------------------------ */

const NUMERAL = "VII|VI|IV|V|III|II|I|vii|vi|iv|v|iii|ii|i";
const TOKEN_RE = new RegExp(`^(b)?(${NUMERAL})(M7|7)?(?:/(b)?(${NUMERAL}))?$`);
const numeralMap = { i: 0, ii: 1, iii: 2, iv: 3, v: 4, vi: 5, vii: 6 };

export function parseToken(token) {
  const m = token.match(TOKEN_RE);
  if (!m) return { degree: 0, flat: false, minor: false, ext: "", bassDegree: null, bassFlat: false };
  return {
    degree: numeralMap[m[2].toLowerCase()],
    flat: !!m[1],
    minor: m[2] === m[2].toLowerCase(),
    ext: m[3] || "",
    bassDegree: m[5] ? numeralMap[m[5].toLowerCase()] : null,
    bassFlat: !!m[4],
  };
}

export function tokenToChord(token, keyIndex, scale = MAJOR_SCALE) {
  const { degree, flat, minor, ext, bassDegree, bassFlat } = parseToken(token);
  const rootPc = (keyIndex + scale[degree] + (flat ? 11 : 0)) % 12;
  let name = NOTE_NAMES[rootPc];
  if (minor) name += "m";
  if (ext === "M7") name += "M7";
  else if (ext === "7") name += "7";
  let degreeLabel = (flat ? "♭" : "") + (minor ? ROMAN[degree].toLowerCase() : ROMAN[degree]);
  if (ext) degreeLabel += ext;
  let bassPc = null;
  if (bassDegree !== null) {
    bassPc = (keyIndex + scale[bassDegree] + (bassFlat ? 11 : 0)) % 12;
    if (bassPc !== rootPc) {
      name += "/" + NOTE_NAMES[bassPc];
      degreeLabel += "/" + (bassFlat ? "♭" : "") + ROMAN[bassDegree];
    } else {
      bassPc = null; // 分母がルートと同じなら通常コード扱い
    }
  }
  return { name, degreeLabel, rootPc, minor, ext, bassPc };
}

export function maybeAddSeventh(token, prob, rng) {
  if (token.includes("/")) return token; // 分数コードはセブンス付加の対象外
  const p = parseToken(token);
  if (p.ext || p.flat) return token;
  if (rng() > prob) return token;
  if (p.minor) return token + "7";
  if (p.degree === 4) return token + "7"; // V -> V7
  return token + "M7";
}

export function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

/* Returns frequencies (Hz) for a chord's notes, for simple synth playback.
   `chord.intervals` (set by chordCatalog for custom/edited chords) takes precedence
   over the legacy minor/ext-derived triad, so any chord quality can be played back. */
export function chordFrequencies(chord) {
  const rootMidi = 48 + chord.rootPc; // C3 base
  let intervals = chord.intervals;
  if (!intervals) {
    intervals = chord.minor ? [0, 3, 7] : [0, 4, 7];
    if (chord.ext === "7") intervals = [...intervals, 10];
    else if (chord.ext === "M7") intervals = [...intervals, 11];
  }
  const midis = intervals.map((i) => rootMidi + i);
  if (chord.bassPc != null && chord.bassPc !== chord.rootPc) {
    midis.unshift(36 + chord.bassPc); // C2基準のベース音
  }
  return midis.map((m) => 440 * Math.pow(2, (m - 69) / 12));
}
