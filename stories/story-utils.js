// ══════════════════════════════════════════════════════
// STORY-UTILS — shared helpers for story exhibits
// ══════════════════════════════════════════════════════

/**
 * Returns true if user prefers reduced motion.
 */
export function reducedMotion() {
  return matchMedia('(prefers-reduced-motion:reduce)').matches;
}

/**
 * Observe an element and fire callback when it enters the viewport.
 * Respects reducedMotion unless opts.essential is true.
 * @param {Element} el - Element to observe
 * @param {Function} callback - Called with (el) when visible
 * @param {Object} opts - { threshold: 0.2, repeat: false, essential: false }
 * @returns {IntersectionObserver} The observer (for cleanup)
 */
export function onVisible(el, callback, opts = {}) {
  if (reducedMotion() && !opts.essential) {
    callback(el);
    return null;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        callback(e.target);
        if (!opts.repeat) obs.unobserve(e.target);
      }
    });
  }, { threshold: opts.threshold || 0.2 });
  obs.observe(el);
  return obs;
}

/**
 * Returns 0–1 scroll progress of element through viewport.
 * 0 = element top just entered viewport bottom.
 * 1 = element top has reached viewport top.
 */
export function scrollProgress(el) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const raw = 1 - (rect.top / vh);
  return Math.max(0, Math.min(1, raw));
}

/**
 * Auto-reveal: finds all .reveal elements in container,
 * adds .revealed class when they scroll into view.
 * Returns array of observers for cleanup.
 */
export function revealOnScroll(container) {
  const els = container.querySelectorAll('.reveal');
  const observers = [];
  els.forEach(el => {
    if (reducedMotion()) {
      el.classList.add('revealed');
      return;
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    obs.observe(el);
    observers.push(obs);
  });
  return observers;
}
