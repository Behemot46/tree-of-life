/* ══════════════════════════════════════════════════════
   BOOT — the few decisions that have to be made before the first paint.

   A classic script, in <head>, ahead of the stylesheets and the modules. It is
   the one piece of the page that cannot wait for js/app.js: by the time the
   module graph has loaded, the visitor has already been looking at the opening
   for a second or more, and it should have been in their theme, language and
   direction the whole time. Without it a light-theme reader saw a dark screen
   turn cream, and a Hebrew reader's screen laid itself out left-to-right first.

   It only reads: theme, language and whether they have been here before. Every
   value is validated again by js/app.js, so a wrong guess here costs a flicker,
   never a wrong state. Anything it cannot read (private mode) falls back to
   the page's own defaults, dark and English.

   The languages and the right-to-left ones are listed here by hand because this
   file cannot import. `static/boot-knows-every-language` fails if
   TRANSLATIONS gains one that is missing from either list.
   ══════════════════════════════════════════════════════ */
(function () {
  var LANGS = ['en', 'he', 'ru'];
  var RTL = ['he'];
  var root = document.documentElement;
  try {
    var theme = localStorage.getItem('theme');
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      // the browser's own canvas, before any stylesheet has arrived
      var meta = document.querySelector('meta[name="color-scheme"]');
      if (meta) meta.setAttribute('content', 'light');
    }
    var wanted = new URLSearchParams(location.search).get('lang') || localStorage.getItem('tol-lang');
    if (LANGS.indexOf(wanted) > -1) {
      root.lang = wanted;
      root.dir = RTL.indexOf(wanted) > -1 ? 'rtl' : 'ltr';
    }
    // someone who has seen the opening gets a shorter one (js/splash.js)
    if (localStorage.getItem('tol-splash-seen')) root.setAttribute('data-return', '');
  } catch (e) { /* storage blocked: the defaults stand */ }
})();
