import { useState } from "react";
import { DEFAULT_PLAYBACK_SPEED } from "../lib/playbackSpeed.js";

/**
 * Playback is currently a no-op: `play`/`stop` intentionally do nothing.
 * State and the play/stop/setSpeed surface are kept so callers (App.jsx,
 * LeadSheet.jsx) don't need to change while audio output is unimplemented.
 * Returns { playing, playingSection, cursor, speed, setSpeed, play, stop }.
 */
export function usePlayback() {
  const playing = false;
  const playingSection = null; // 単一セクション再生中のindex
  const cursor = null; // { section, bar }
  const [speed, setSpeed] = useState(DEFAULT_PLAYBACK_SPEED);

  const stop = () => {};
  const play = () => {};

  return { playing, playingSection, cursor, speed, setSpeed, play, stop };
}
