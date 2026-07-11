/* Downloads guitar samples for playback into public/samples/guitar/<instrument>/<Note>.mp3.
 *
 * Source: gleitz/midi-js-soundfonts (FluidR3_GM by Frank Wen, MIT license).
 * Idempotent: existing files are skipped, so re-running only fetches what's missing.
 * Run with: npm run samples
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const BASE = "https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/FluidR3_GM";
const INSTRUMENTS = ["electric_guitar_clean", "overdriven_guitar", "distortion_guitar"];
const NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const MIN_MIDI = 24; // C1
const MAX_MIDI = 84; // C6
const CONCURRENCY = 6;
const RETRIES = 2;

function midiToName(midi) {
  return `${NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function fetchWithRetry(url, retries) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      if (attempt >= retries) throw err;
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
}

async function main() {
  const tasks = [];
  for (const instrument of INSTRUMENTS) {
    for (let midi = MIN_MIDI; midi <= MAX_MIDI; midi++) {
      tasks.push({ instrument, name: midiToName(midi) });
    }
  }

  let next = 0;
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  async function worker() {
    while (next < tasks.length) {
      const { instrument, name } = tasks[next++];
      const dir = join(ROOT, "public", "samples", "guitar", instrument);
      const file = join(dir, `${name}.mp3`);
      if (await exists(file)) {
        skipped++;
        continue;
      }
      try {
        const buf = await fetchWithRetry(`${BASE}/${instrument}-mp3/${name}.mp3`, RETRIES);
        await mkdir(dir, { recursive: true });
        await writeFile(file, buf);
        downloaded++;
      } catch (err) {
        failed++;
        console.error(`FAIL ${instrument}/${name}.mp3: ${err.message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log(`samples: ${downloaded} downloaded, ${skipped} skipped, ${failed} failed (of ${tasks.length})`);
  if (failed > 0) process.exit(1);
}

main();
