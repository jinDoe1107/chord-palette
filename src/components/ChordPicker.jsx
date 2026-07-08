import { useState } from "react";
import { NOTE_NAMES } from "../data/musicData.js";
import { QUALITIES, buildChordForKey } from "../lib/chordCatalog.js";
import { suggestChords } from "../lib/suggestChords.js";

export default function ChordPicker({ chord, nextChord, keyIndex, keyMode, onSelect, onClose, style }) {
  const [root, setRoot] = useState(chord.rootPc);
  const [qualityId, setQualityId] = useState(chord.qualityId || (chord.ext === "7" ? "7" : chord.ext === "M7" ? "maj7" : chord.minor ? "min" : "maj"));
  const [bass, setBass] = useState(chord.bassPc ?? -1); // -1 = 指定なし（ルート）

  const groups = suggestChords({ keyIndex, keyMode, chord, nextChord });

  return (
    <div className="chord-picker" style={style} onClick={(e) => e.stopPropagation()}>
      <div className="chord-picker-head">
        <span>コードを編集</span>
        <button className="x" onClick={onClose} aria-label="閉じる">×</button>
      </div>

      {groups.map((g) => (
        <div className="suggest-group" key={g.title}>
          <div className="suggest-title">{g.title}</div>
          <div className="suggest-chips">
            {g.items.map((item, i) => (
              <button key={i} className="chip small" onClick={() => onSelect(item)}>
                {item.name}
                <span className="deg-inline">{item.degreeLabel}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="suggest-title">自由に設定</div>
      <div className="row">
        <select value={root} onChange={(e) => setRoot(Number(e.target.value))} aria-label="ルート音">
          {NOTE_NAMES.map((n, i) => (
            <option key={n} value={i}>{n}</option>
          ))}
        </select>
        <select value={qualityId} onChange={(e) => setQualityId(e.target.value)} aria-label="コードの種類">
          {QUALITIES.map((q) => (
            <option key={q.id} value={q.id}>{q.label}</option>
          ))}
        </select>
        <select value={bass} onChange={(e) => setBass(Number(e.target.value))} aria-label="ベース音">
          <option value={-1}>ベース：ルート</option>
          {NOTE_NAMES.map((n, i) => (
            <option key={n} value={i}>ベース：{n}</option>
          ))}
        </select>
        <button
          className="tool primary"
          onClick={() => onSelect(buildChordForKey(root, qualityId, keyIndex, keyMode, bass === -1 ? null : bass))}
        >
          適用
        </button>
      </div>
    </div>
  );
}
