// ══════════════════════════════════════════════════════
// WAYFINDER — back, home and share, reachable from anywhere
// ══════════════════════════════════════════════════════
//
// The three controls a reader needs when they are lost, and the one thing they
// all had in common before this: none of them was reachable at the moment they
// were wanted.
//
// #nav-ctrl existed, but it sat at z-index 250 with the detail panel at 400,
// the games at 1000, the hominin overlay at 1100 and a guided tour at 10000 —
// so it was painted over by every single thing a reader could open. It also
// carried `display:none !important` below 769px, which is to say it did not
// exist at all on the device the drill-down was built for. And it was hidden
// unless the map's navStack was non-empty, which the drill-down never touches.
// Back and Home were present, correct, translated and unreachable.
//
// Three things follow, and they are the whole design:
//
//   * It is one fixed cluster above everything, and it says what "back" means
//     by unwinding *layers*, not screens. Whatever is on top comes off first;
//     only when nothing is open does back belong to the shell underneath.
//
//   * Back is never disabled. A disabled state has to be refreshed from every
//     place that opens or closes anything — nine modules here — and any one
//     that forgets leaves a live control greyed out or a dead one lit. At the
//     root, back falls through to home, which always does something coherent.
//     Nothing to keep in sync, so nothing to get out of sync.
//
//   * Share carries the view and the language, not just the node. Both live in
//     localStorage, so a link that named only the node opened in the
//     *recipient's* last-used shell and language — a Hebrew drill-down sent to
//     someone who last used the map in Russian arrived as a Russian map. The
//     link now says which of the two front doors it came from and which
//     language it was read in, and the receiving page honours both for that
//     visit without overwriting what the recipient had chosen for themselves.

import { state, navStack } from './state.js';
import { registerActions } from './actions.js';
import { t } from './theme.js';

let D = {};
export function initWayfinderDeps(deps) { Object.assign(D, deps); }

const byId = (id) => document.getElementById(id);
const isOpen = (id, cls) => !!byId(id)?.classList.contains(cls || 'open');

/* Layers, topmost first. Order is paint order, not importance: a reader who
   opened a tour on top of a species panel expects one Back to take the tour
   away and leave the panel where it was. */
const LAYERS = [
  { id: 'tour',    open: () => !!document.querySelector('.tour-overlay'),          close: () => D.endTour?.() },
  { id: 'tourpick',open: () => !!document.querySelector('.tour-selector-overlay'), close: () => document.querySelector('.tour-selector-overlay')?.remove() },
  { id: 'kbd',     open: () => isOpen('kbd-help', 'visible'),                      close: () => byId('kbd-help')?.classList.remove('visible') },
  { id: 'profile', open: () => isOpen('profile-panel'),                            close: () => D.closeProfile?.() },
  { id: 'game',    open: () => isOpen('game-panel'),                               close: () => D.closeGame?.() },
  { id: 'compare', open: () => isOpen('species-compare-panel'),                    close: () => D.closeSpeciesCompare?.() },
  /* Hominin compare is a *mode*, not a panel: it puts a banner up and turns
     the next two clicks into picks. Cancelling it is what a reader means by
     back, and it has to come before the overlay it runs inside. */
  { id: 'homcmp',  open: () => !!document.querySelector('.compare-banner.visible'), close: () => D.cancelCompare?.() },
  { id: 'hominin', open: () => isOpen('hominin-view'),                             close: () => D.closeHomininOverlay?.() },
  { id: 'sapiens', open: () => !!document.querySelector('.sapiens-overlay'),       close: () => D.closeSapiens?.() },
  { id: 'panel',   open: () => isOpen('panel'),                                    close: () => D.closePanel?.() },
];

function topLayer() {
  for (const l of LAYERS) { try { if (l.open()) return l; } catch (e) { /* absent module */ } }
  return null;
}

const shell = () => document.body.getAttribute('data-view') === 'map' ? 'map' : 'explore';

/* Back: take off whatever is on top; failing that, climb one level in the
   shell underneath. In the drill-down that is one fold up the lineage, which
   is the meaning the unfold gave the word — the previous *screen* stopped
   existing when screens did. */
export function goBack() {
  const layer = topLayer();
  if (layer) { layer.close(); return; }
  if (shell() === 'explore') { if (D.exploreUp?.()) return; }
  /* navStack, not just navBack: on an empty stack navBack() returns having
     done nothing, and delegating to it unconditionally is how the map's Back
     became a dead press at the root — the fall-through below never ran. */
  else if (D.navBack && navStack.length) { D.navBack(); return; }
  goHome();
}

/* Home: everything off, and the shell back to the origin of life. */
export function goHome() {
  for (const l of LAYERS) { try { if (l.open()) l.close(); } catch (e) { /* absent module */ } }
  if (shell() === 'explore') D.exploreHome?.();
  else D.navHome?.();
}

// ── Share ─────────────────────────────────────────────────────────────────

/* What the link should point at, in the order the reader would name it: the
   species whose panel is open, else where they are standing in the drill-down,
   else the branch the map is focused on. The root is not a destination — a
   link to LUCA is a link to the site, so it is left off. */
function shareNode() {
  if (state.currentPanelNode) return state.currentPanelNode.id;
  if (shell() === 'explore') {
    const sel = D.exploreSelection?.();
    if (sel && sel._parent) return sel.id;
    return null;
  }
  const focused = state.currentPanelNode || state.focusedBranch;
  if (focused && focused._parent) return focused.id;
  return state.highlightedId || null;
}

export function shareUrl() {
  const p = new URLSearchParams();
  const node = shareNode();
  if (node) p.set('node', node);
  p.set('view', shell());
  p.set('lang', state.currentLang || 'en');
  return location.origin + location.pathname + '?' + p.toString();
}

/* navigator.share where the platform has it — on a phone that is the system
   sheet, which is what "share" means there. Everywhere else the clipboard,
   and if that is refused (it is, in a headless browser and on any page the
   user has denied the permission) the link is put in the toast so it can
   still be read and copied by hand. Every branch ends with the reader either
   holding the link or seeing it; none of them ends silently. */
export function shareCurrent() {
  const url = shareUrl();
  const done = () => D.showToast?.({ text: t('share_copied') });
  const fallback = () => D.showToast?.({ text: t('share_link') + ' ' + url });

  if (navigator.share) {
    navigator.share({ title: t('title'), url }).catch(() => { /* dismissed, or unsupported payload */ });
    return url;
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(done, fallback);
    return url;
  }
  fallback();
  return url;
}

// ── Wiring ────────────────────────────────────────────────────────────────

export function initWayfinder() {
  registerActions({
    'way:back':  () => goBack(),
    'way:home':  () => goHome(),
    'way:share': () => shareCurrent(),
  });
}
