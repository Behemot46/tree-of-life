/* ══════════════════════════════════════════════════════
   LEGACY — play.html, which the game was tested at before it became the front
   door. Testers' links (`play.html?kin=3&lang=he`) still work: the address
   changes and the query and hash stay.
   ══════════════════════════════════════════════════════ */
(function () {
  try { location.replace('./' + location.search + location.hash); } catch (e) { /* the link in the page is there */ }
})();
