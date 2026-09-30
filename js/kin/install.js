// ══════════════════════════════════════════════════════
// KIN — WHEN TO OFFER THE HOME SCREEN
//
// The rules for asking a player to install the game, kept apart from the page
// so they can be tested without a browser. Kin is a thing you come back to, so
// the home screen is where it belongs — but the ask has to be earned: never to
// a first-time visitor, never in the middle of a game, never twice in a month
// to someone who said no, and never to someone who already has it.
//
// Two forms. Where the browser offers its own install dialog (Chrome, Edge,
// Samsung Internet, on phones and desktops) the card has an Install button and
// the dialog does the rest. iPhones and iPads have no such dialog — the only
// way on is Share ▸ Add to Home Screen — so there the card says how.
// ══════════════════════════════════════════════════════

import { dayNumber } from './calendar.js';

/** Finished dailies before the first ask: two days of play is a habit starting, one is curiosity. */
export const AFTER_DAILIES = 2;
/** How long "Not now" is respected. */
export const COOLDOWN_DAYS = 30;

/**
 * What to show on Home: 'prompt' (the browser's install dialog is available),
 * 'ios' (explain Share ▸ Add to Home Screen), or null (say nothing).
 *
 *   standalone   already running as an installed app
 *   installed    the browser told us it was installed (appinstalled)
 *   canPrompt    a beforeinstallprompt event is waiting to be used
 *   ios          an iPhone or iPad, which installs by hand
 *   dismissedOn  YYYY-MM-DD of the last "Not now", or null
 *   dailies      Kins finished so far
 *   today        YYYY-MM-DD in the player's calendar
 */
export function installOffer({ standalone = false, installed = false, canPrompt = false, ios = false, dismissedOn = null, dailies = 0, today }) {
  if (standalone || installed) return null;
  if (dailies < AFTER_DAILIES) return null;
  if (dismissedOn && dayNumber(today) - dayNumber(dismissedOn) < COOLDOWN_DAYS) return null;
  if (canPrompt) return 'prompt';
  if (ios) return 'ios';
  return null;
}

/** Whether this browser is an iPhone or iPad (an iPad asks for the desktop site, so it says it is a Mac). */
export function isIOS(nav) {
  const ua = nav.userAgent || '';
  return /iPhone|iPad|iPod/.test(ua) || (nav.platform === 'MacIntel' && (nav.maxTouchPoints || 0) > 1);
}

/** Whether the page is running as an installed app rather than in a browser tab. */
export function isStandalone(win) {
  try {
    if (win.navigator.standalone === true) return true;
    return !!(win.matchMedia && win.matchMedia('(display-mode: standalone)').matches);
  } catch {
    return false;
  }
}
