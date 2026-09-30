// ══════════════════════════════════════════════════════
// KIN — COUNTING, IF ANYONE TURNS IT ON
//
// Off. Nothing here sends anything until the page names an endpoint:
//
//   <meta name="kin-analytics" content="/_c/count">
//
// Phase 3's gate is about return rates (D1, D7) and how many finished dailies
// get shared. Both can be read without knowing who anyone is, so nothing here
// knows: no name, no id, no cookie, no referrer, no screen size, nothing kept
// between visits that a stranger could link. What is sent is a counter.
//
//   visit/dN       once a day per device, N = days since that device first
//                  played (0 to 30). The count of d7 over the count of d0, a week
//                  apart, is D7.
//   daily/finish   a Kin was finished
//   share          a result or a challenge was handed to the share sheet
//   arcade/start   a run began
//   install        the game was put on a home screen
//   link/kin, link/challenge   someone arrived by a friend's link
//
// The endpoint is meant to be this site's own domain, rewritten by the host to
// a counter such as GoatCounter (cookie-free and open source). Same-origin
// means the Content-Security-Policy needs no new origin, the visitor's browser
// never talks to a third party, and a blocker has no list to put it on. A
// request is an image load: `?p=/kin/<event>&t=<event>&e=true&rnd=<noise>`.
//
// A browser that sends Do Not Track or Global Privacy Control is not counted.
// The stats screen says what is counted (strings.statsNoteCounted) whenever
// this is on, and says "nothing is sent" whenever it is off.
// ══════════════════════════════════════════════════════

import { dayNumber } from './calendar.js';

const CAP = 30;

/** 'd0' on the day a device first played, 'd1' the next, … 'd30' for a month or more. */
export function visitBucket(firstSeen, today) {
  if (!firstSeen) return 'd0';
  const n = dayNumber(today) - dayNumber(firstSeen);
  return `d${Math.max(0, Math.min(CAP, n))}`;
}

/** The endpoint the page names, or '' when it names none or the visitor asked not to be counted. */
export function endpoint(doc = typeof document === 'undefined' ? null : document, nav = typeof navigator === 'undefined' ? {} : navigator) {
  if (!doc) return '';
  const meta = doc.querySelector('meta[name="kin-analytics"]');
  const url = meta ? (meta.getAttribute('content') || '').trim() : '';
  if (!url) return '';
  if (nav.doNotTrack === '1' || nav.doNotTrack === 'yes' || nav.globalPrivacyControl === true) return '';
  return url;
}

export const enabled = (doc, nav) => endpoint(doc, nav) !== '';

/** The address one event is sent to. Pure, so a test can read it. */
export function beaconURL(base, event, noise = Math.random().toString(36).slice(2)) {
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}p=${encodeURIComponent(`/kin/${event}`)}&t=${encodeURIComponent(event)}&e=true&rnd=${noise}`;
}

/** Counts one event. Returns whether anything was sent, which is false unless the page turned counting on. */
export function track(event) {
  const base = endpoint();
  if (!base) return false;
  try {
    new Image().src = beaconURL(base, event);
    return true;
  } catch {
    return false;
  }
}
