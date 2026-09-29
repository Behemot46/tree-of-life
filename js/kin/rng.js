// ══════════════════════════════════════════════════════
// KIN — SEEDED RANDOMNESS
//
// The daily set has to be the same on every phone, so it cannot use
// Math.random. mulberry32 is a small, well-distributed 32-bit generator;
// hashString turns a label such as "day-7" into its seed.
// ══════════════════════════════════════════════════════

export function hashString(s) {
  let h = 2166136261 >>> 0;                 // FNV-1a
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffled(list, rand) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
