import { useState } from "react";
import { createPortal } from "react-dom";
import { SECTION_TYPES, MOODS } from "../data/musicData.js";
import { songDurationSeconds, formatDuration } from "../lib/duration.js";
import { PLAYBACK_SPEEDS } from "../lib/playbackSpeed.js";
import ChordPicker from "./ChordPicker.jsx";

const PICKER_WIDTH = 280;

export default function LeadSheet({ song, cursor, playing, playingSection, speed, onChangeSpeed, onPlay, onPlaySection, onStop, onRegenerate, onCopy, copied, onChangeChord, onAddSection, onRemoveSection, onReorderSections, onRegenerateSection, onUpdateSection }) {
  const [editing, setEditing] = useState(null); // { section, bar, top, left }
  const [dragIndex, setDragIndex] = useState(null);
  const [newType, setNewType] = useState(SECTION_TYPES[0].id);
  const [newBars, setNewBars] = useState(8);

  if (!song) {
    return (
      <div className="empty">
        ジャンルとムードを掛け合わせて<br />
        「コード進行を生成」を押すと、ここにリードシートが表示されます
      </div>
    );
  }

  const totalBars = song.sections.reduce((sum, s) => sum + s.bars, 0);
  const duration = formatDuration(songDurationSeconds(totalBars, song.tempo));

  return (
    <>
      <div className="toolbar">
        <button className="tool primary" onClick={playing ? onStop : onPlay}>
          {playing ? "■ 停止" : "▶ 再生"}
        </button>
        <select value={speed} onChange={(e) => onChangeSpeed(Number(e.target.value))} aria-label="再生速度">
          {PLAYBACK_SPEEDS.map((s) => (
            <option key={s} value={s}>×{s}</option>
          ))}
        </select>
        <button className="tool" onClick={onRegenerate}>↻ 再生成</button>
        <button className="tool" onClick={onCopy}>{copied ? "✓ コピーしました" : "⧉ コピー"}</button>
        <span className="duration">全{totalBars}小節 ・ 約{duration}</span>
      </div>

      {song.sections.map((section, si) => (
        <div
          className={`section-card ${dragIndex === si ? "dragging" : ""}`}
          key={si}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragIndex !== null && dragIndex !== si) onReorderSections(dragIndex, si);
            setDragIndex(null);
          }}
        >
          <div className="section-head">
            <span
              className="drag-handle"
              draggable
              onDragStart={() => setDragIndex(si)}
              onDragEnd={() => setDragIndex(null)}
              aria-label={`${section.label}をドラッグして並び替え`}
            >⠿</span>
            <span className="sec-lamp" style={section.moodAccent ? { "--lamp": section.moodAccent } : {}} aria-hidden="true" />
            <span className="sec-name">{section.label}</span>
            <button
              className="psec"
              onClick={() => onPlaySection(si)}
              aria-label={playingSection === si ? `${section.label}の再生を停止` : `${section.label}を再生`}
            >{playingSection === si ? "■" : "▶"}</button>
            <button className="resec" onClick={() => onRegenerateSection(si)} aria-label={`${section.label}を再生成`}>↻</button>
            <button className="x" onClick={() => onRemoveSection(si)} aria-label={`${section.label}を削除`}>×</button>
          </div>
          <div className="section-meta">
            <select
              className="mood-override"
              value={section.moodId || ""}
              onChange={(e) => onUpdateSection(si, { moodId: e.target.value || null })}
              aria-label={`${section.label}のムード`}
            >
              <option value="">ムード：共通設定を使用</option>
              {MOODS.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <div className="stepper">
              <button onClick={() => onUpdateSection(si, { bars: Math.max(1, section.bars - 1) })} aria-label="小節を減らす">−</button>
              <span>{section.bars}小節</span>
              <button onClick={() => onUpdateSection(si, { bars: Math.min(16, section.bars + 1) })} aria-label="小節を増やす">＋</button>
            </div>
            <span className="sec-time">{formatDuration(songDurationSeconds(section.bars, song.tempo))}</span>
          </div>
          <div className="bars">
            {section.chords.map((c, bi) => {
              const isEditing = editing && editing.section === si && editing.bar === bi;
              const nextChord = section.chords[bi + 1] || song.sections[si + 1]?.chords[0];
              return (
                <div
                  key={bi}
                  className={`bar ${cursor && cursor.section === si && cursor.bar === bi ? "now" : ""}`}
                >
                  <button
                    className="chord"
                    onClick={(e) => {
                      if (isEditing) {
                        setEditing(null);
                        return;
                      }
                      const r = e.currentTarget.getBoundingClientRect();
                      const maxLeft = window.scrollX + window.innerWidth - PICKER_WIDTH - 12;
                      setEditing({
                        section: si,
                        bar: bi,
                        top: r.bottom + window.scrollY + 6,
                        left: Math.min(r.left + window.scrollX, Math.max(window.scrollX + 12, maxLeft)),
                      });
                    }}
                  >
                    {c.name}
                  </button>
                  <div className="deg">{c.degreeLabel}</div>
                  <div className="oct">
                    <button
                      className={(c.octave || 0) > 0 ? "on" : ""}
                      disabled={(c.octave || 0) >= 1}
                      onClick={() => onChangeChord(si, bi, { ...c, octave: (c.octave || 0) + 1 })}
                      aria-label={`${c.name}を1オクターブ上げる`}
                    >▲</button>
                    <button
                      className={(c.octave || 0) < 0 ? "on" : ""}
                      disabled={(c.octave || 0) <= -1}
                      onClick={() => onChangeChord(si, bi, { ...c, octave: (c.octave || 0) - 1 })}
                      aria-label={`${c.name}を1オクターブ下げる`}
                    >▼</button>
                  </div>
                  {isEditing && createPortal(
                    <>
                      <div className="picker-backdrop" onClick={() => setEditing(null)} />
                      <ChordPicker
                        style={{ "--picker-top": `${editing.top}px`, "--picker-left": `${editing.left}px` }}
                        chord={c}
                        nextChord={nextChord}
                        keyIndex={song.keyIndex}
                        keyMode={song.keyMode}
                        onSelect={(newChord) => {
                          onChangeChord(si, bi, { ...newChord, octave: c.octave || 0 });
                          setEditing(null);
                        }}
                        onClose={() => setEditing(null)}
                      />
                    </>,
                    document.body
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="section-card add-section-card">
        <div className="row">
          <select value={newType} onChange={(e) => setNewType(e.target.value)} aria-label="追加するセクションの種類">
            {SECTION_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
          <div className="stepper">
            <button onClick={() => setNewBars((v) => Math.max(1, v - 1))} aria-label="小節を減らす">−</button>
            <span>{newBars}小節</span>
            <button onClick={() => setNewBars((v) => Math.min(16, v + 1))} aria-label="小節を増やす">＋</button>
          </div>
        </div>
        <button className="add" onClick={() => onAddSection(newType, newBars)}>＋ セクションを追加</button>
      </div>
    </>
  );
}
