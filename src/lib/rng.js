/* シード付き決定的乱数(mulberry32)。Math.randomはプロジェクト方針で不使用。 */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let fallbackCounter = 0;
export function randomSeed() {
  const c = globalThis.crypto;
  if (c?.getRandomValues) return c.getRandomValues(new Uint32Array(1))[0]; // ブラウザ/Node19+
  // グローバルcryptoが無い環境(Node18でのテスト実行など)向けフォールバック
  fallbackCounter = (fallbackCounter + 0x9e3779b9) >>> 0;
  return (Date.now() ^ fallbackCounter) >>> 0;
}
