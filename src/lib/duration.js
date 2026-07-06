/** Assumes 4/4 time (4 beats per bar), matching usePlayback's bar duration. */
export function songDurationSeconds(totalBars, bpm) {
  if (!bpm) return 0;
  return totalBars * 4 * (60 / bpm);
}

export function formatDuration(seconds) {
  const total = Math.max(0, Math.round(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
