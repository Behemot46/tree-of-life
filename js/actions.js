// ══════════════════════════════════════════════════════
// ACTIONS.JS — one delegated dispatcher for every control
//
// A control says what it does in markup — `data-action="lang:set"
// data-arg="he"` — and a single listener on `document` looks the name up
// here and calls it. Nothing is wired per element, so a button rendered
// into `innerHTML` long after start-up works the moment it exists, which
// is what the panels, the game and the compare overlay all rely on.
//
// The reason this exists is the Content-Security-Policy. `onclick="…"` is
// a script the browser parses out of an attribute, so permitting one
// means sending `script-src 'unsafe-inline'` — and that same keyword
// permits any `<script>` an injection manages to place on the page. The
// policy could restrict *where* code came from but never *whether* it
// ran. With the attributes gone the site refuses inline script outright.
//
// Handlers are called as (arg, arg2, ctx), where arg/arg2 come from
// `data-arg`/`data-arg2` and ctx is `{ el, event }`. Arity is fixed so a
// handler that only wants the element can still reach it.
// ══════════════════════════════════════════════════════

const ACTIONS = new Map();

/**
 * Register handlers, keyed by action name. Called by whichever module owns
 * the behaviour, so the mapping sits next to the code it names rather than
 * in one central table that drifts.
 */
export function registerActions(map) {
  for (const [name, fn] of Object.entries(map)) ACTIONS.set(name, fn);
}

function dispatch(el, event) {
  const name = el.dataset.action;
  const fn = ACTIONS.get(name);
  if (!fn) {
    // Loud rather than silent: a typo in an attribute is otherwise a
    // button that simply does nothing, with no clue where to look.
    console.warn(`[actions] no handler registered for "${name}"`);
    return;
  }
  fn(el.dataset.arg, el.dataset.arg2, { el, event });
}

document.addEventListener('click', (e) => {
  const el = e.target?.closest?.('[data-action]');
  if (el) dispatch(el, e);
});

/* Keyboard activation for the controls the browser will not activate on its
   own. A <button> already synthesises a click from Enter and Space, but a
   div carrying role="button" does not — the legend rows had been mouse-only
   for exactly that reason, and moving off onclick is what surfaced it. */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const t = e.target;
  if (!t?.closest) return;
  if (t.matches('input, select, textarea, [contenteditable="true"]')) return;
  const el = t.closest('[data-action]');
  if (!el) return;
  if (el.matches('button, a[href], input, select, textarea')) return;  // native already fires
  e.preventDefault();
  dispatch(el, e);
});

/* Image fallbacks. `error` does not bubble, so a listener on `document`
   only sees it during the capture phase — hence the `true`. Every picture
   on the page is a remote Wikimedia file that can 404, and each call site
   wanted one of these three behaviours. */
document.addEventListener('error', (e) => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement)) return;
  const mode = img.dataset.onError;
  if (!mode) return;
  if (mode === 'text') {
    // The compare slots fall back to the taxon's emoji, not a gap.
    img.replaceWith(document.createTextNode(img.dataset.fallbackText || ''));
    return;
  }
  img.style.display = 'none';
  if (mode === 'hide-show-next' && img.nextElementSibling) {
    img.nextElementSibling.style.display = 'flex';
  }
}, true);
