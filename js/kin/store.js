// ══════════════════════════════════════════════════════
// KIN — WHAT THIS DEVICE REMEMBERS
//
// One versioned record in localStorage. Every access is guarded: private
// windows and blocked site data make storage throw or come back empty, and
// the game has to play the same either way, just without memory.
//
// Nothing here leaves the device. The stats screen (and ?stats=1, which
// testers were sent to) reads from this same record.
// ══════════════════════════════════════════════════════

const KEY = 'kin-v1';

const fresh = () => ({
  daily: null,          // { day, picks: [bool], done: bool } for the current Kin
  streak: { last: null, count: 0, best: 0, freezes: 0, froze: false },
  history: {},          // Kin number -> score out of ten, for the stats screen
  sound: false,
  seenIntro: false,
  stats: { firstSeen: null, days: [], dailies: 0, answers: 0, correct: 0, arcadeRuns: 0, bestArcade: 0, shares: 0 },
});

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    const data = JSON.parse(raw);
    const base = fresh();
    return { ...base, ...data, stats: { ...base.stats, ...(data.stats || {}) }, streak: { ...base.streak, ...(data.streak || {}) }, history: { ...(data.history || {}) } };
  } catch {
    return fresh();
  }
}

export function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage unavailable: play on */ }
}

export function reset() {
  try { localStorage.removeItem(KEY); } catch { /* nothing to clear */ }
}

/* The site's own keys, shared so Kin opens in the language and theme the
   visitor already chose on the encyclopedia. */
export function siteGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
export function siteSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* ignore */ }
}
