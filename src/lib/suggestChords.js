import { MAJOR_SCALE, MINOR_SCALE } from "../data/musicData.js";
import { buildChordForKey } from "./chordCatalog.js";

const MAJOR_DIATONIC_Q = ["maj", "min", "min", "maj", "maj", "min", "dim"]; // I ii iii IV V vi vii°
const MINOR_DIATONIC_Q = ["min", "dim", "maj", "min", "min", "maj", "maj"]; // i ii° III iv v VI VII

/**
 * Suggest music-theory-informed chord substitutions for a given position in the song.
 * @param {object} ctx
 * @param {number} ctx.keyIndex
 * @param {"major"|"minor"} ctx.keyMode
 * @param {object} [ctx.chord] - the chord currently at this position
 * @param {object} [ctx.nextChord] - the chord that follows (for secondary dominants)
 * @returns {Array<{title: string, items: object[]}>}
 */
export function suggestChords({ keyIndex, keyMode, chord, nextChord }) {
  const isMinor = keyMode === "minor";
  const scale = isMinor ? MINOR_SCALE : MAJOR_SCALE;
  const diatonicQ = isMinor ? MINOR_DIATONIC_Q : MAJOR_DIATONIC_Q;
  const groups = [];

  groups.push({
    title: "ダイアトニックコード（そのキーの基本7和音）",
    items: scale.map((offset, i) => buildChordForKey(keyIndex + offset, diatonicQ[i], keyIndex, keyMode)),
  });

  if (nextChord) {
    groups.push({
      title: `次のコード ${nextChord.name} へのセカンダリードミナント`,
      items: [buildChordForKey(nextChord.rootPc + 7, "7", keyIndex, keyMode)],
    });
  }

  if (chord) {
    const relRoot = chord.minor ? chord.rootPc + 3 : chord.rootPc + 9;
    const relQuality = chord.minor ? "maj" : "min";
    groups.push({
      title: "代理コード（平行調のトニック）",
      items: [buildChordForKey(relRoot, relQuality, keyIndex, keyMode)],
    });

    if (chord.ext === "7" && !chord.minor) {
      groups.push({
        title: "裏コード（トライトーン代理）",
        items: [buildChordForKey(chord.rootPc + 6, "7", keyIndex, keyMode)],
      });
    }

    // 分数コード: 現コードの転回形 + キー定番の IV/V
    const qualityId = chord.qualityId || (chord.ext === "7" ? "7" : chord.ext === "M7" ? "maj7" : chord.minor ? "min" : "maj");
    const third = chord.minor ? 3 : 4;
    groups.push({
      title: "分数コード（転回形・定番オンコード）",
      items: [
        buildChordForKey(chord.rootPc, qualityId, keyIndex, keyMode, chord.rootPc + third), // 第1転回形
        buildChordForKey(chord.rootPc, qualityId, keyIndex, keyMode, chord.rootPc + 7), // 第2転回形
        buildChordForKey(keyIndex + 5, "maj", keyIndex, keyMode, keyIndex + 7), // IV/V
      ],
    });
  }

  groups.push({
    title: isMinor ? "和声的短音階・同主長調から借用" : "同主短調から借用",
    items: isMinor
      ? [
          buildChordForKey(keyIndex + 7, "7", keyIndex, keyMode), // ハーモニックマイナーのV7
          buildChordForKey(keyIndex + 11, "dim7", keyIndex, keyMode), // 導音のvii°7
          buildChordForKey(keyIndex + 5, "maj", keyIndex, keyMode), // 借用IV(メジャー)
        ]
      : [
          buildChordForKey(keyIndex + 5, "min", keyIndex, keyMode), // 借用iv
          buildChordForKey(keyIndex + 8, "maj", keyIndex, keyMode), // ♭VI
          buildChordForKey(keyIndex + 10, "maj", keyIndex, keyMode), // ♭VII
          buildChordForKey(keyIndex + 3, "maj", keyIndex, keyMode), // ♭III
        ],
  });

  return groups;
}
