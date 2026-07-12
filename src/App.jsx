import { useState, useMemo, useEffect, useRef } from "react";
import "./App.css";
import { NOTE_NAMES, MOODS, GENRES, LENGTH_RANGE } from "./data/musicData.js";
import { songDurationSeconds, formatDuration } from "./lib/duration.js";
import { usePlayback } from "./hooks/usePlayback.js";
import StructureEditor from "./components/StructureEditor.jsx";
import LeadSheet from "./components/LeadSheet.jsx";
import { templateEngine } from "./lib/engine.js";
import { lmSelectorEngine } from "./lib/lmEngine.js";
import { mulberry32, randomSeed } from "./lib/rng.js";
import { buildSongSection } from "./lib/generateProgression.js";
import { buildStandardStructure } from "./lib/structurePreset.js";

const suggestTempo = (genre, mood) => Math.round(genre.tempo * mood.tempoMod);

function SectionHeader({ label, open, onToggle }) {
  return (
    <h2 className="section-toggle-label">
      <button type="button" className="section-toggle" onClick={onToggle} aria-expanded={open}>
        <span className={`toggle-switch ${open ? "on" : ""}`} aria-hidden="true" />
        <span>{label}</span>
      </button>
    </h2>
  );
}

export default function App() {
  const [genreId, setGenreId] = useState("jpop");
  const [moodId, setMoodId] = useState("wistful");
  const [keyIndex, setKeyIndex] = useState(0);
  const [keyMode, setKeyMode] = useState("major");
  const [structure, setStructure] = useState([]);
  const [targetSeconds, setTargetSeconds] = useState(LENGTH_RANGE.default);
  const [open, setOpen] = useState({ genre: true, mood: true, key: true, bpm: true, structure: true });
  const toggleSection = (k) => setOpen((prev) => ({ ...prev, [k]: !prev[k] }));
  const [settingsOpen, setSettingsOpen] = useState(true); // 初回は設定モーダルを開いた状態で開始
  const [bpm, setBpm] = useState(() => suggestTempo(GENRES.find((g) => g.id === "jpop"), MOODS.find((m) => m.id === "wistful")));
  const [song, setSong] = useState(null);
  const [copied, setCopied] = useState(false);
  const [aiStatus, setAiStatus] = useState("idle"); // idle | loading | ready | error
  const [aiProgress, setAiProgress] = useState(0);
  const aiReadyRef = useRef(false);
  const hasWebGPU = typeof navigator !== "undefined" && !!navigator.gpu;

  const { playing, playingSection, cursor, speed, setSpeed, tone, setTone, play, stop } = usePlayback();

  // モーダル表示中: Escapeで閉じる + 背景スクロールをロック
  useEffect(() => {
    if (!settingsOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setSettingsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [settingsOpen]);

  const genre = useMemo(() => GENRES.find((g) => g.id === genreId), [genreId]);
  const mood = useMemo(() => MOODS.find((m) => m.id === moodId), [moodId]);
  const previewTempo = suggestTempo(genre, mood);

  const selectGenre = (g) => {
    setGenreId(g.id);
    setBpm(suggestTempo(g, mood));
  };
  const selectMood = (m) => {
    setMoodId(m.id);
    setBpm(suggestTempo(genre, m));
  };

  const totalBars = structure.reduce((sum, s) => sum + s.bars, 0);
  const durationPreview = formatDuration(songDurationSeconds(totalBars, bpm));
  const keyModeLabel = keyMode === "minor" ? "マイナー" : "メジャー";

  /* AIモデルの準備(冪等)。成功でtrue、失敗はfalse=テンプレへフォールバック */
  const ensureAiReady = async () => {
    if (aiReadyRef.current) return true;
    setAiStatus("loading"); // 初回のみモデルDL(進捗表示)
    try {
      await lmSelectorEngine.init((loaded, total) => setAiProgress(total ? loaded / total : 0));
      aiReadyRef.current = true;
      setAiStatus("ready");
      return true;
    } catch {
      setAiStatus("error");
      return false;
    }
  };

  const runEngine = async (sections, key, tempo) => {
    // AIオンのセクションが生成対象に含まれるときだけAIエンジンを使う(オフのセクションは従来ロジックで選択)
    const useAi = sections.some((s) => s.ai && !s.fixedTokens);
    const engine = useAi && (await ensureAiReady()) ? lmSelectorEngine : templateEngine;
    return engine.generate({
      genreId, moodId, keyIndex: key.keyIndex, keyMode: key.keyMode,
      bpm: tempo, sections, hint: null,
      rng: mulberry32(randomSeed()), // 実行毎に新シード
    });
  };

  const generate = async () => {
    if (structure.length === 0) return;
    stop();
    const sections = structure.map((s) => ({ type: s.type, bars: s.bars, moodId: s.moodId ?? null, ai: s.ai ?? false, hint: s.hint ?? null, fixedTokens: null }));
    const tokenSections = await runEngine(sections, { keyIndex, keyMode }, bpm);
    setSong({
      genreLabel: genre.label, moodLabel: mood.label, tempo: bpm, keyIndex, keyMode,
      sections: structure.map((s, i) => buildSongSection(s, tokenSections[i], keyIndex, keyMode)),
    });
    setSettingsOpen(false); // 生成できたらモーダルを閉じてシートを見せる
  };

  const makeStructure = () => {
    setStructure(
      buildStandardStructure({
        bpm,
        genreId,
        targetSeconds,
        rng: mulberry32(randomSeed()), // 押すたびに新シード=毎回ランダム
      })
    );
  };

  const updateChord = (si, bi, newChord) => {
    setSong((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((sec, i) =>
          i !== si ? sec : { ...sec, chords: sec.chords.map((c, j) => (j === bi ? newChord : c)) }
        ),
      };
    });
  };

  const addSection = async (type, bars) => {
    const newSec = { type, bars, moodId: null, ai: false, hint: null };
    setStructure((prev) => [...prev, newSec]);
    if (!song) return; // シート未生成なら構成のみ追加
    stop();
    const sections = [
      ...song.sections.map((s) => ({ type: s.type, bars: s.bars, moodId: s.moodId ?? null, ai: s.ai ?? false, hint: s.hint ?? null, fixedTokens: s.tokens ?? null })),
      { ...newSec, fixedTokens: null },
    ];
    const tokenSections = await runEngine(sections, song, song.tempo);
    setSong((prev) => prev && {
      ...prev,
      sections: [...prev.sections, buildSongSection(newSec, tokenSections[tokenSections.length - 1], prev.keyIndex, prev.keyMode)],
    });
  };

  const updateSectionSettings = (si, patch) => {
    setStructure((prev) => prev.map((sec, i) => (i === si ? { ...sec, ...patch } : sec)));
    // song側はムード変更時にランプ色(moodAccent)も追随させる
    const songPatch = "moodId" in patch
      ? { ...patch, moodAccent: patch.moodId ? (MOODS.find((m) => m.id === patch.moodId)?.accent ?? null) : null }
      : patch;
    setSong((prev) => {
      if (!prev) return prev;
      return { ...prev, sections: prev.sections.map((sec, i) => (i === si ? { ...sec, ...songPatch } : sec)) };
    });
  };

  const toggleSectionAi = (si) => {
    const next = !(song?.sections[si]?.ai);
    updateSectionSettings(si, { ai: next });
    if (next) ensureAiReady(); // オンにしたら先回りでモデルを準備(冪等)
  };

  const regenerateSection = async (si) => {
    if (!song) return;
    stop();
    const sections = song.sections.map((s, i) => ({
      type: s.type, bars: s.bars, moodId: s.moodId ?? null, ai: s.ai ?? false, hint: s.hint ?? null,
      fixedTokens: i === si ? null : s.tokens ?? null,
    }));
    const tokenSections = await runEngine(sections, song, song.tempo);
    setSong((prev) => prev && {
      ...prev,
      sections: prev.sections.map((sec, i) =>
        i === si ? buildSongSection(sec, tokenSections[si], prev.keyIndex, prev.keyMode) : sec),
    });
  };

  const removeGeneratedSection = (si) => {
    setStructure((prev) => prev.filter((_, i) => i !== si));
    setSong((prev) => (prev ? { ...prev, sections: prev.sections.filter((_, i) => i !== si) } : prev));
  };

  const reorderGeneratedSection = (from, to) => {
    if (from === to) return;
    stop();
    const reorder = (arr) => {
      const copy = [...arr];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    };
    setStructure((prev) => reorder(prev));
    setSong((prev) => (prev ? { ...prev, sections: reorder(prev.sections) } : prev));
  };

  const copyText = () => {
    if (!song) return;
    const head = `[${song.genreLabel} × ${song.moodLabel} / ${NOTE_NAMES[keyIndex]}${keyModeLabel} / ♩=${song.tempo}]`;
    const text =
      head +
      "\n" +
      song.sections.map((s) => `${s.label}: ${s.chords.map((c) => c.name).join(" | ")}`).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div className="app" style={{ "--acc": mood.accent, "--acc-soft": mood.accentSoft }}>
      <div className="wrap">
        <header>
          <div className="logo">Chord Palette</div>
          <div className="tag">ジャンル × ムードで作るコード進行</div>
        </header>

        <div className="settings-bar">
          <button className="tool" onClick={() => setSettingsOpen(true)} aria-haspopup="dialog">
            ⚙ 設定
          </button>
          <div className="combo">
            <b>{genre.label}</b> × <b>{mood.label}</b> ・ {NOTE_NAMES[keyIndex]}{keyModeLabel} ・ ♩={bpm}
          </div>
        </div>

        {/* Sheet */}
        <div className="sheet">
          <LeadSheet
            song={song}
            aiStatus={aiStatus}
            aiProgress={aiProgress}
            hasWebGPU={hasWebGPU}
            onToggleSectionAi={toggleSectionAi}
            cursor={cursor}
            playing={playing}
            playingSection={playingSection}
            speed={speed}
            onChangeSpeed={setSpeed}
            tone={tone}
            onChangeTone={setTone}
            onPlay={() => play(song)}
            onPlaySection={(si) => (playingSection === si ? stop() : play(song, si))}
            onStop={stop}
            onRegenerate={generate}
            onCopy={copyText}
            copied={copied}
            onChangeChord={updateChord}
            onAddSection={addSection}
            onRemoveSection={removeGeneratedSection}
            onReorderSections={reorderGeneratedSection}
            onRegenerateSection={regenerateSection}
            onUpdateSection={updateSectionSettings}
          />
        </div>

        {/* Settings modal */}
        {settingsOpen && <div className="modal-backdrop" onClick={() => setSettingsOpen(false)} />}
        {settingsOpen && (
          <div className="panel settings-modal" role="dialog" aria-modal="true" aria-label="設定">
            <div className="settings-modal-head">
              <span className="settings-modal-title">設定</span>
              <button className="x" onClick={() => setSettingsOpen(false)} aria-label="設定を閉じる">×</button>
            </div>
            <SectionHeader label="ジャンル" open={open.genre} onToggle={() => toggleSection("genre")} />
            {open.genre && (
              <div className="chips" role="group" aria-label="ジャンル選択">
                {GENRES.map((g) => (
                  <button
                    key={g.id}
                    className={`chip ${g.id === genreId ? "genre-on" : ""}`}
                    onClick={() => selectGenre(g)}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            )}

            <SectionHeader label="ムード" open={open.mood} onToggle={() => toggleSection("mood")} />
            {open.mood && (
              <div className="chips" role="group" aria-label="ムード選択">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    className={`chip ${m.id === moodId ? "on" : ""}`}
                    style={m.id === moodId ? { background: m.accent, borderColor: m.accent } : {}}
                    onClick={() => selectMood(m)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}

            <SectionHeader label="キー" open={open.key} onToggle={() => toggleSection("key")} />
            {open.key && (
              <div className="row">
                <div className="chips" role="group" aria-label="キーの種類">
                  <button
                    className={`chip ${keyMode === "major" ? "genre-on" : ""}`}
                    onClick={() => setKeyMode("major")}
                  >
                    メジャー
                  </button>
                  <button
                    className={`chip ${keyMode === "minor" ? "genre-on" : ""}`}
                    onClick={() => setKeyMode("minor")}
                  >
                    マイナー
                  </button>
                </div>
                <select value={keyIndex} onChange={(e) => setKeyIndex(Number(e.target.value))} aria-label="キー">
                  {NOTE_NAMES.map((n, i) => (
                    <option key={n} value={i}>{n} {keyModeLabel}</option>
                  ))}
                </select>
              </div>
            )}

            <SectionHeader label="BPM" open={open.bpm} onToggle={() => toggleSection("bpm")} />
            {open.bpm && (
              <>
                <div className="row">
                  <div className="stepper">
                    <button onClick={() => setBpm((v) => Math.max(40, v - 1))} aria-label="BPMを減らす">−</button>
                    <input
                      className="bpm-input"
                      type="number"
                      min={40}
                      max={240}
                      value={bpm}
                      onChange={(e) => setBpm(Math.min(240, Math.max(40, Number(e.target.value) || 0)))}
                      aria-label="BPM"
                    />
                    <button onClick={() => setBpm((v) => Math.min(240, v + 1))} aria-label="BPMを増やす">＋</button>
                  </div>
                  <span className="duration">全{totalBars}小節 ・ 約{durationPreview}</span>
                </div>
                <button className="add" onClick={() => setBpm(previewTempo)}>提案値({previewTempo})に戻す</button>
              </>
            )}

            <SectionHeader label="曲構成" open={open.structure} onToggle={() => toggleSection("structure")} />
            {open.structure && (
              <>
                <div className="row structure-length">
                  <span className="length-label">長さ</span>
                  <div className="stepper">
                    <button
                      onClick={() => setTargetSeconds((v) => Math.max(LENGTH_RANGE.min, v - LENGTH_RANGE.step))}
                      aria-label="曲の長さを短くする"
                    >
                      −
                    </button>
                    <span>{formatDuration(targetSeconds)}</span>
                    <button
                      onClick={() => setTargetSeconds((v) => Math.min(LENGTH_RANGE.max, v + LENGTH_RANGE.step))}
                      aria-label="曲の長さを長くする"
                    >
                      ＋
                    </button>
                  </div>
                </div>
                <button className="make-structure" onClick={makeStructure}>
                  ✦ 曲構成を作成（{genre.label}・おまかせ）
                </button>
                {structure.length === 0 && (
                  <div className="structure-empty">
                    上のボタンでおまかせ作成するか、下からセクションを追加してください
                  </div>
                )}
                <StructureEditor structure={structure} onChange={setStructure} />
              </>
            )}

            <button className="gen" onClick={generate} disabled={structure.length === 0}>
              コード進行を生成
            </button>
            <div className="combo">
              <b>{genre.label}</b> × <b>{mood.label}</b> ・ {NOTE_NAMES[keyIndex]}{keyModeLabel} ・ ♩={bpm}
            </div>
          </div>
        )}

        <footer className="credits">
          ギター音源:{" "}
          <a href="https://github.com/gleitz/midi-js-soundfonts" target="_blank" rel="noopener noreferrer">
            FluidR3_GM
          </a>{" "}
          by Frank Wen — ライセンス{" "}
          <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">
            CC BY 3.0
          </a>
        </footer>
      </div>
    </div>
  );
}
