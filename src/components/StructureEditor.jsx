import { useState } from "react";
import { SECTION_TYPES, MOODS } from "../data/musicData.js";

function reorder(arr, from, to) {
  const copy = [...arr];
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
}

export default function StructureEditor({ structure, onChange }) {
  const [dragIndex, setDragIndex] = useState(null);

  const updateSection = (i, patch) => {
    onChange(structure.map((sec, j) => (j === i ? { ...sec, ...patch } : sec)));
  };
  const removeSection = (i) => onChange(structure.filter((_, j) => j !== i));
  const addSection = () => onChange([...structure, { type: "chorus", bars: 8, moodId: null }]);

  return (
    <>
      {structure.map((sec, i) => (
        <div
          className={`section-row ${dragIndex === i ? "dragging" : ""}`}
          key={i}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragIndex !== null && dragIndex !== i) onChange(reorder(structure, dragIndex, i));
            setDragIndex(null);
          }}
        >
          <div className="row">
            <span
              className="drag-handle"
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragEnd={() => setDragIndex(null)}
              aria-label={`セクション${i + 1}をドラッグして並び替え`}
            >⠿</span>
            <select
              value={sec.type}
              onChange={(e) => updateSection(i, { type: e.target.value })}
              aria-label={`セクション${i + 1}の種類`}
            >
              {SECTION_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            <div className="stepper">
              <button onClick={() => updateSection(i, { bars: Math.max(1, sec.bars - 1) })} aria-label="小節を減らす">−</button>
              <span>{sec.bars}小節</span>
              <button onClick={() => updateSection(i, { bars: Math.min(16, sec.bars + 1) })} aria-label="小節を増やす">＋</button>
            </div>
            <select
              className="mood-override"
              value={sec.moodId || ""}
              onChange={(e) => updateSection(i, { moodId: e.target.value || null })}
              aria-label={`セクション${i + 1}のムード`}
            >
              <option value="">ムード：共通</option>
              {MOODS.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <button className="x" onClick={() => removeSection(i)} aria-label="セクションを削除">×</button>
          </div>
        </div>
      ))}
      <button className="add" onClick={addSection}>＋ セクションを追加</button>
    </>
  );
}
