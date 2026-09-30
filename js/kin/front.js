/* ══════════════════════════════════════════════════════
   FRONT — which app this address is for.

   A classic script in <head>, ahead of everything that paints. This address
   used to be the encyclopedia, and links to it are out in the world:
   `/?node=humans&view=map&lang=he`, from the Share button. The encyclopedia is
   now atlas.html, and a link that names a species or a view is sent there with
   its whole query and hash, before the game has drawn a thing.

   Nothing else in the query is this script's business: ?kin=, ?c=&s=, ?lang=
   and ?stats= are the game's own and are read by js/kin/main.js. A browser
   that cannot redirect simply shows the game.
   ══════════════════════════════════════════════════════ */
(function () {
  try {
    if (/[?&](node|view)=/.test(location.search)) {
      location.replace('atlas.html' + location.search + location.hash);
    }
  } catch (e) { /* the game is what they get */ }
})();
