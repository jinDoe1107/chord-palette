import { useState } from "react";
import { createPortal } from "react-dom";
import { SECTION_TYPES, MOODS } from "../data/musicData.js";
import { songDurationSeconds, formatDuration } from "../lib/duration.js";
import { PLAYBACK_SPEEDS } from "../lib/playbackSpeed.js";
import { GUITAR_TONES } from "../lib/guitarTones.js";
import ChordPicker from "./ChordPicker.jsx";

const PICKER_WIDTH = 280;

export default function LeadSheet({ song, aiStatus, aiProgress, hasWebGPU, onToggleSectionAi, cursor, playing, playingSection, speed, onChangeSpeed, tone, onChangeTone, onPlay, onPlaySection, onStop, onRegenerate, onCopy, copied, onChangeChord, onAddSection, onRemoveSection, onReorderSections, onRegenerateSection, onUpdateSection }) {
  const [editing, setEditing] = useState(null); // { section, bar, top, left }
  const [dragIndex, setDragIndex] = useState(null);
  const [newType, setNewType] = useState(SECTION_TYPES[0].id);
  const [newBars, setNewBars] = useState(8);

  const addSectionCard = (
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
  );

  if (!song) {
    return (
      <>
        <div className="empty">
          「＋ セクションを追加」で一からコード進行を作成できます。<br />
          「⚙ 設定」の「コード進行を生成」でおまかせ生成もできます
        </div>
        {addSectionCard}
      </>
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
        <select value={tone} onChange={(e) => onChangeTone(e.target.value)} aria-label="ギター音色">
          {GUITAR_TONES.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
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
            <button
              type="button"
              className={`sec-ai-toggle ${section.ai ? "on" : ""}`}
              onClick={() => onToggleSectionAi(si)}
              aria-pressed={!!section.ai}
              title="AIアシスト（βテスト機能）。初回はAIモデル（約0.4GB）のダウンロードが必要です"
              aria-label={`${section.label}のAIアシスト`}
            >✨ AI</button>
            <select
              className="mood-override"
              value={section.moodId}
              onChange={(e) => onUpdateSection(si, { moodId: e.target.value })}
              aria-label={`${section.label}のムード`}
            >
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
          {section.ai && (
            <div className="section-ai">
              <input
                className="hint-input section-hint"
                type="text"
                value={section.hint || ""}
                maxLength={120}
                onChange={(e) => onUpdateSection(si, { hint: e.target.value || null })}
                onKeyDown={(e) => { if (e.key === "Enter") onRegenerateSection(si); }}
                placeholder="✨ AIへのヒント（Enterでこのセクションを再生成）"
                aria-label={`${section.label}のAIヒント`}
              />
              {aiStatus !== "ready" && aiStatus !== "loading" && aiStatus !== "error" && (
                <div className="ai-note">βテスト機能・初回はAIモデル（約0.4GB）のダウンロードが必要です</div>
              )}
              {aiStatus === "loading" && (
                <div className="ai-status">βテスト機能・モデルを準備中… {Math.round(aiProgress * 100)}%（初回のみ約0.4GBをダウンロード）</div>
              )}
              {aiStatus === "error" && (
                <div className="ai-status error">モデルの読み込みに失敗しました。オフ→オンで再試行できます</div>
              )}
              {aiStatus === "ready" && !hasWebGPU && (
                <div className="ai-status">WebGPU非対応のため生成に時間がかかることがあります</div>
              )}
            </div>
          )}
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

      {addSectionCard}
    </>
  );
}
