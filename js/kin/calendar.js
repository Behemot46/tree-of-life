// ══════════════════════════════════════════════════════
// KIN — THE CALENDAR
//
// Kin #1 is the first day of the test. Every phone numbers days from here in
// its own calendar, so a puzzle turns over at each player's local midnight.
// Pure: nothing here reads the clock unless a date is passed in.
// ══════════════════════════════════════════════════════

export const EPOCH = '2026-09-29';

/** YYYY-MM-DD in the player's own calendar. */
export function localDateString(date = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

/** Kin number for a calendar date; counted in whole calendar days, so a
    daylight-saving change never skips or repeats one. */
export function dayNumber(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [ey, em, ed] = EPOCH.split('-').map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(ey, em - 1, ed)) / 86400000) + 1;
}

/** The calendar date of a Kin number, YYYY-MM-DD. */
export function dateOfDay(n) {
  const [ey, em, ed] = EPOCH.split('-').map(Number);
  return new Date(Date.UTC(ey, em - 1, ed + n - 1)).toISOString().slice(0, 10);
}

/** 0 Sunday … 6 Saturday, for a Kin number. */
export function weekdayOf(n) {
  const [y, m, d] = dateOfDay(n).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function msUntilMidnight(now = new Date()) {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next - now;
}

/**
 * The last Kin number anyone on Earth can already be playing: today in the
 * earliest time zone (UTC+14), which is at most one day ahead of UTC. Days up
 * to here are history and must never change (scripts/kin-check-schedule.mjs).
 */
export function lastPlayableDay(now = new Date()) {
  return dayNumber(now.toISOString().slice(0, 10)) + 1;
}
