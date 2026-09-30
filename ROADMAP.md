# Roadmap — Tree of Life

The decision record for this project. `CLAUDE.md` describes how the code works
today; this file describes **why it is that way** and what is still open.

---

## Where things stand

Two things on one domain, in English, Hebrew and Russian, as static files with
no build step. **Kin**, the front page (`/`), is a one-minute daily game about
how every living thing is related. The **Atlas** (`/atlas.html`) is an
interactive visualisation of 3.8 billion years of evolution that the game opens
onto.

Every push and pull request runs three things: 34 unit tests for the game's
rules and the service worker; `scripts/play-check.mjs`, **495 checks** of the
game in Chromium; and `scripts/smoke.mjs`, **574 checks across six scenarios**
of the Atlas — desktop and phone, in all three languages, plus a desktop pass in
the light theme. Both browser suites run again against production after every
deploy. All green.

---

## Open questions

Things waiting on a decision rather than on work.

| Question | Why it matters |
|---|---|
| **What phase 3 says after four weeks** | Kin is the front page (30 Sep 2026). The gate the plan put before that — testers replaying or sharing — was waived, so the launch is the experiment: D1 ≥ 25%, D7 ≥ 10% and one share per twenty finished dailies, read from the counters once counting is on. Counting needs a site code (GoatCounter recommended) and one line in `vercel.json`; until then the numbers do not exist. See `docs/PLAY_STRATEGY.md`. |
| **A native reader for the Hebrew and Russian copy** | The game, its Home, the streak and install text and the stats screen have about seventy strings in each language written by the same hand as the rest and never read by a native speaker. The Hebrew name קרובים and the Russian Родня are still the working names. |
| **Switching GitHub Pages off** | `deploy.yml` is gone, so Pages no longer updates, but it keeps serving its last build until disabled in Settings → Pages. Only reachable by hand. |
| **Vercel's recommended `www` CNAME** | Vercel suggests `www → 2f3b9f3357c6e4e5.vercel-dns-017.com.` and notes the legacy records keep working, so this is tidiness rather than a fix. |

### Answered

| Question | Answer |
|---|---|
| Phone layout for a wide tree | **Leave it.** The horizontal fit is acceptable; a portrait-specific layout is not worth the complexity. |
| Localising species names | **Major taxonomic groups only.** The 50 ranked groups are translated; individual species stay English. See `js/taxonNames.js`. |
| Content-Security-Policy | **Added**, defined in `vercel.json` and enforced by `serve.js` so the smoke suite checks the real policy. |
| `SECURITY.md` | **Rewritten** for what this project actually is: a static site with no backend and no releases. |
| The custom domain | **Live at `www.treeoflife.wiki`**, verified by running the full suite against the deployed site rather than assuming it worked. Pages retired afterwards. |
| Turning the site into a daily game (Kin) | **Done, 30 Sep 2026**: Kin is `index.html`, the front page; the encyclopedia is `atlas.html`. Built as three pull requests — Home and the return loop, the home screen and offline, then the front-door change. See the decision log and `docs/PLAY_STRATEGY.md`. |
| Deleting three unreachable modules | **Deleted** with the front-door change: `js/trivia.js`, `js/quiz.js` and `js/imagePrompts.js` (1,101 lines nothing imported). The service worker's old precache list named all three, which is why that list was replaced before they went. |
| The 31 inline `onclick` handlers | **Gone**, along with 23 more the modules generated at runtime. `script-src` is now `'self'` with no `'unsafe-inline'`. See the decision log below. |

---

## Decision log

### 2026-09 — Kin becomes the front page

| Decision | Rationale |
|---|---|
| The game is `/`, the encyclopedia is `/atlas.html` | The plan's front-door rule: a first visit is question one, and the tree is one click away, opened on demand. `git mv` kept both files' history. `play.html` stays as a stub so the addresses testers were sent keep working. |
| Old addresses are forwarded by the page, not by the host | The encyclopedia's own Share button made `/?node=…&view=…&lang=…` and those links are out in the world, as are `play.html?kin=3` from the test. A Vercel redirect depends on the host forwarding the query string — not something this environment can prove before the change is live — and a link that arrives without its species or its day is worse than one that takes one more hop. `js/kin/front.js` (a classic script in `<head>`) and `js/kin/legacy.js` forward with the query and the hash, before the game draws anything. Four checks watch them, each seen failing. |
| The opening is the encyclopedia's entrance, not a toll | With the game in front, a visitor may go to the tree and back several times. It plays on the first entrance in a visit and never for a link that names a species or a view. `js/boot.js` decides before first paint so nothing flashes; `sessionStorage` carries the mark, so a new visit gets it again. The tour prompt and the tree's entrance animation follow the opening, so they go with it. |
| `boot.js` is shared | Theme, language and direction before the first paint were the encyclopedia's; the game now has the same need, and two copies of the language lists would drift. Kin ignores the opening decision. |
| The encyclopedia has a way back | A pill in the rail's Tools group, "Kin · daily game", in three languages with its own binding in the i18n sweep. Home's Atlas tile and Kin's footer are the way in. |
| The three dead modules are deleted | `trivia.js`, `quiz.js`, `imagePrompts.js`: nothing imports them. The service worker's old list named all three; replacing the list in the previous pull request is what made deleting them safe. |
| The front page is indexable | `noindex` is gone and the canonical URL is `/`; the encyclopedia's canonical is `/atlas.html`. Kin's link-preview card is `assets/og-kin.png`. |
| `start_url` is `/?source=pwa` | An installed game opens the game. `id` stays `/` so a device that installed it during the test is updated rather than duplicated. |
| Production is checked with Kin's own checks too | `verify-deployment.yml` runs the smoke suite against the encyclopedia and now the play checks against the front page (the offline check needs a server it can stop, so it is skipped against a deployed site). |
| Service-worker cache `tol-v13` | The shell list changed (`/` and `/index.html` are the game now). |

### 2026-09 — Kin: the home screen, offline, and counting (off)

| Decision | Rationale |
|---|---|
| The game is installable, and asks late | A daily game belongs on the home screen, but an install prompt to a first-time visitor is the same mistake as the name prompt. The card is on Home only, after two finished Kins, never inside the installed app, and "Not now" holds for 30 days. `beforeinstallprompt` is held (`preventDefault`) and used when the player taps Install, so Chrome's own mini-infobar never interrupts a game. |
| An iPhone gets instructions, not a button | iOS has no install dialog; the only way on is Share ▸ Add to Home Screen. The same card says so and offers "Got it". iOS also ignores an SVG touch icon, hence real PNGs. |
| Icons are drawn from one mark by a script | The dial from the opening with the smallest tree Kin asks about — a target and two candidates — inside it. `scripts/build-icons.mjs` writes the SVGs and renders 192, 512, maskable 512, the 180 touch icon and a 32 favicon, so they cannot drift. The Atlas's tree-of-dots icons are deleted; the Atlas's touch icon is the same PNG. |
| A link-preview card for Kin | `assets/og-kin.png` beside the Atlas's. Shared results link to their own Kin, so this is what a friend sees first. `make-og-image.mjs` renders either or both. |
| The worker precaches the game, not the encyclopedia | The worker's shell list was sixty Atlas files. Once the game registers it too, every Kin visitor would download them on first visit. Now the shell is Kin's page and the modules it imports; the Atlas is cached as it is used. |
| Each shell entry is added on its own | `cache.addAll` rejects if any URL fails, and a worker that fails to install never updates. The old list named `quiz.js`, `trivia.js` and `imagePrompts.js`, which the front-door change deletes; with `addAll` that would have stranded every returning visitor on the old worker for good. A unit test holds the list to the files on disk and to what `main.js` imports. |
| Pages are cached by path, and beacons never | A shared link's query string is the same page; keying on it would store one copy per link and find none offline. Counting beacons carry a fresh query each time and would have added an entry per visit. |
| Counting is written and switched off | Phase 3's gate needs D1, D7 and shares per finished daily. All three can be read from counts without knowing anyone: a device announces `visit/dN` once a day (N = days since it first played), plus `daily/finish` and `share`. It needs a site code Gabi has not chosen, so it does nothing until a page names an endpoint, and the stats screen says which is true. Do Not Track and Global Privacy Control are honoured. The endpoint is meant to be this domain, rewritten to a counter, so no third party sees a visitor. |
| Workers are blocked in every test context but one | A service worker answers requests before `page.route` can see them, so a test that routes requests must not have one. The offline check is the one context that allows it. |
| The offline checks were vacuous until they were mutated | Four deliberate breakages of the worker were run against the new checks; three went unnoticed. The first version took the network away with Playwright's `setOffline`, which reaches the page but not the service worker's own requests, so the game "opened offline" with the cache fallback deleted. The check now kills a real server. The shell check also compared the cache with the worker's own list, which can only agree with itself; it now compares the cache with what the page actually loaded, and the list itself is held to the module graph by a unit test. Every mutation after the fix turns the right check red: 12 against the browser checks, 5 against the worker's unit tests. |
| A bug found while reading, not by a check | The stats screen said "nothing is sent anywhere" on every device. True today; false the day counting is switched on. The note is now chosen by whether counting is on. |
| Hebrew and Russian copy unreviewed | Seven new strings each (the card, the iOS instruction, the counted-stats note). |

### 2026-09 — Kin: Home and the return loop

| Decision | Rationale |
|---|---|
| Launch without the phase-1 gate | Gabi asked for the remaining redesign to be implemented and launched on the main site. The gate (≥ 6 of 10 testers replaying or sharing) was never measured, so the launch is the experiment and phase 3's own numbers (D1, D7, shares per finished daily, after four weeks) are what is read. Stated plainly in the strategy doc so nobody later thinks it passed. |
| Three pull requests, not one | Home and the return loop (still on the unlinked `play.html`), then the install prompt and analytics hook, then the front-door flip. The flip is the only one that moves URLs, so it is the only one that needs a revert plan; the other two can ship and be tested on their own. |
| A first visit is question one, and Home is for people who come back | The plan's front-door rule. `start()` decides in one place: stats, challenge, a friend's Kin, resuming half a Kin, Home, question one. Someone part-way through today's Kin is put back at their question, not shown a menu. |
| The streak never says "you lost it" | Loss framing is the thing daily games are criticised for. A freeze (earned by 10 in one Arcade run, at most two) covers one missed day; any longer gap starts over with a sprout and an invitation, never a broken number. `streakNow` is read-only, so opening the page can never change the record, and the rules are tested at their edges (a gap of one day, of two with and without a freeze, of three or more). |
| Links carry the game, and are read strictly | `?kin=N` plays a past Kin once, leaving the streak and the record alone; `?c=&s=` replays an Arcade run with a score to beat; both carry `?lang=` so the recipient reads the sender's language for that visit and never has it written back. Every number must be a plain integer inside its range or it is ignored, so a hand-edited address asks for nothing. Shared text is a number, ten squares and a link, with no spoilers. |
| Stats are a screen on the device, erased in two taps | The `?stats=1` page testers were sent to is now reachable from Home and worded for players. Nothing leaves the device, and the site raises no native dialog, so erasing asks again in place. |
| The look of the opening, in small | The plaque (a hairline plate with a diamond at each end), the ruled scale under the header and a seven-tick dial of the week — distance from the centre is time, as on the Astrolabe. The dial's centre is the streak, or a sprout when there is none. |
| Header dots give way instead of the row | Found in screenshots, not by a check: in Russian on a 360px phone the ten dots sat on top of the day number and the Arcade's status ran into the name. Dots now shrink from 9px to fit, and the Arcade's status takes a row of its own on a phone. The header check had measured the dots' container, which overflowed silently; it now measures the dots. |
| A check that found its own bug | `home-fits-and-is-reachable` reported a link "covered" when it was merely below the fold at 640px: `elementFromPoint` answers null off-screen. The check now brings each control into view first. |
| `play:check` learned `--only` | Same reason as the smoke runner's: a new check has to be watched failing, and the full run takes three minutes. A filtered run says it is not a full pass. |
| The CI job limit is 20 minutes | The Kin job was allowed ten. It now covers Home, stats and the long stories in four scenarios as well as the first visit, about three minutes on this machine; Chromium's install has taken up to six on a runner. |
| Hebrew and Russian copy unreviewed | About forty new strings in each; a native reader has not seen them. |

### 2026-09 — The name is asked for after a game

| Decision | Rationale |
|---|---|
| No dialog on a first visit | A native `prompt()` asked for a name five seconds after a first visit began — about half a second after the new opening ended, so the first thing a visitor met after it was a browser dialog. They had done nothing yet to be named for, and the box blocks the page, cannot be styled, and was English on every screen. |
| Asked on the results of the first game that scored, once | That is the moment a name means something: there is a score to keep. `tol-name-asked` is set when the card is *shown*, whatever is done with it, so the answer to "not now" is respected. A visitor with a player, or with storage blocked, is never asked. |
| A card, not a modal | It sits above Play Again, can be ignored, is translated, and follows the reading direction. Nothing waits on it; closing the game is as good an answer as "Not now". |
| A game that scored nothing does not ask, and neither does the Daily Challenge | "Keep your score?" needs a score on screen. The Daily scores internally but shows no points, and a wrong first Survival answer scores nothing; neither uses up the one ask. |
| The leaderboard had never shown a point | Found while wiring the offer: `updatePlayerScore()` had no caller, so every player on every device sat on 0 for as long as profiles had existed. Each game's results now credit the active player, and the game that raised the offer is credited once a name is kept. A results screen reached twice would now score twice, so each is guarded. |
| The Guest migration is deleted | `_migrateOldData()` turned anyone with a `tol-explored` record into a "Guest" on their next visit. With the prompt gone that would have made a Guest of every visitor who looked around first — the ordinary one — and settled the question of a name before it was asked. Nothing it did carried data: progress and achievements are stored globally, and the panel already reads "Guest" with no player. Caught by reading what else touches `tol-players`, not by a check; `profile:looking-around-does-not-make-a-guest` now holds it. |
| Playwright's silence had hidden it | A dialog with no listener is dismissed without a word, and `prompt()` then returns null — so every smoke run made a Guest of its page, for as long as the prompt existed, and nothing failed. The runner now records every dialog, `load:no-native-dialogs` fails on one, and `dialogs:none-in-source` reads the source so a path no run walks is covered too. |
| The field is 16px and the controls are 44px | Under 16px iOS Safari zooms the page in when a text field takes focus, and this is the one field that is asked for on phones far more than anywhere else. The existing add-player field, whose input is 13px with the outline removed, was the starting point; the offer overrides both. The leaderboard's own field still has the 13px and is left alone. |
| Every check was watched failing, and some failed for the wrong reason first | Twenty-three deliberate breakages. The first run of them caught every one — and showed that a missing offer surfaced as a 30-second `fill` timeout in six checks at once. The probe now keeps what it measured up to the step that failed, skips steps that need an offer that is not there, and each check reads only what it needs, so one broken thing reads as one broken thing. |
| `mutate-opening.mjs` is now `mutate-checks.mjs` | It had a second customer. Each mutation runs the group its first required check belongs to (`--opening-only` or the new `--profile-only`). |
| Service-worker cache bumped to `tol-v11` | Scripts, strings and a stylesheet changed together, and a new `profile.js` paired with a stale `uiData.js` would show the offer as raw key names for a visit. The same reason as the last two bumps. |
| CI job limit raised from 15 to 30 minutes | The run on `main` after the merge finished the job in 14 min 52 s: the suite step now takes about nine minutes (it took seven and a half) and Chromium's install, which has taken anywhere from half a minute to nearly six, was on its slow side. A slow install on another day would have failed a green suite for a reason that is not a defect. Both jobs that run it (`smoke.yml` and `verify-deployment.yml`) now have 30. |
| Hebrew and Russian copy unreviewed | Six short strings each, written by the same hand as the rest; a native reader has not seen them. The offer is where a visitor is asked for something personal, so it is worth one look. |

### 2026-09 — The Astrolabe opening

| Decision | Rationale |
|---|---|
| Four directions as live scenes before choosing one | An opening is judged by watching it, and a still mock-up cannot show timing, weight or what a slow phone does to it. Division, the Astrolabe, Stickers and Descent were each built as a function of time in a gallery (`mockups/opening/`), captured on a phone and a desktop in all three languages and both themes, and compared side by side. The other three stay there as sketches; only the Astrolabe was tuned for production. |
| The Astrolabe | It is the one where the drawing is the claim: distance from the centre is time, so the picture says what the site is about before a word appears. It draws over the real `TREE`, as the opening it replaced did, and it holds together at 390px in both themes. |
| Radius is time, on a power scale | Linear time gives the last 700 million years — where most of the animals a visitor knows first appear — the outer 18% of the dial. A power scale (exponent 0.45) gives the last 100 million years 19% of the radius. The two microbial domains sit at the ends of the arc; in the site's own order they took a lopsided quarter of the dial. |
| Every word is HTML, the picture is canvas | Text on a canvas drawn at reduced resolution is soft, has no bidi handling and cannot be translated without touching the art. As DOM the words stay sharp at any canvas size, lay out right-to-left for free, and fit themselves to the plaque by measurement. No string was added: the opening reuses the four `splash_*` keys and `title`. |
| A first paint that needs no script | Forty modules take a second or more on a phone, and until they arrived the screen was blank. The ring and its point are plain CSS placed by arithmetic that mirrors the JS geometry; the canvas fades in over them. Keeping two descriptions of one geometry in step is a cost, so a check fails when they drift by more than 1.5px. |
| `js/boot.js` decides theme, language and direction before paint | A light-theme reader watched a dark screen turn cream, a Hebrew reader watched a left-to-right screen lay itself out again, and the browser's own canvas was white until the stylesheets arrived. Only a classic script in `<head>` can run before paint. It cannot import, so its language lists are written by hand and a static check holds them to `TRANSLATIONS` and to `js/theme.js`. |
| A returning visitor gets the same show at 1.7× | About 2.6 seconds instead of 4.5. A separate short cut would be a second animation to keep right in three languages and two themes. |
| Reduced motion gets the finished plate, not a fallback | The old opening swapped in a static screen with neither the picture nor the title plaque. The finished plate is where the animation is going, has everything, and needs no clock — which also made it measurable: the checks read it instead of waiting three seconds of animation. |
| A check found a bug the day it was written | Measured under reduced motion, the English line under the title came out at 8.6px instead of 10 on a phone. `responsive.css` gives every element a 0.01ms transition under reduced motion, a transition answers a same-task read with the size it started from, and the fitting reads the size it has just set. The spans now opt out of transitions. Only visitors who ask for reduced motion ever saw it, so every check that ran in the default mode passed. See constraint 13 in `CLAUDE.md`. |
| The plate belongs to the splash | A leftover rule in `theme.css` flattened `#splash` to a plain colour in the dark theme only, so the plate's glow and the vignette vanished on every dark visit and nobody saw it. It is deleted, and a check asserts the gradient is painted in both themes. |
| A late font fits the title and nothing else | Looking at a finished frame with no scale labels in it: laying the words out again when a web font arrived rebuilt the scale, and a rebuilt label fades in from nothing, so the scale blinked out mid-show. The scale is laid out once; the title alone is fitted again. |
| The readout sits above the plaque | Found in a frame captured mid-reveal: the counter and the title plaque shared one spot, so for about half a second the plaque's rules struck through the word "present". The counter now lives in the gap between the dial and the plaque, and the collision check measures it. |
| The show follows the wall clock | Found by looking at a screenshot of the finished plate that had no plate in it. Adding up capped frame steps made a slow CPU play the show in slow motion, and the safety-net dismissal on the wall clock then arrived first: at a sixth of this machine's speed the title never appeared. Time is now `performance.now() − start − hidden`, read when the frame runs (the timestamp a frame is handed is when it began, stale by any long task in front of the first one), and the safety net is armed by the first frame rather than by the script. Frames are dropped instead of time. A check simulates a slow device in the page, so it means the same on any runner. The slow-device mode also resizes only the live canvas rather than laying the scene out again. |
| A scene that throws cannot trap a visitor | The opening does more work than the one it replaced, on more kinds of device. `initSplash` is wrapped: an error takes the curtain down, the site carries on, and the error is thrown again from a timer so it is reported rather than swallowed. A check breaks the scene module on purpose to keep it that way. |
| Skip is named by its text | It carried an English `aria-label`, so a Hebrew screen reader announced "Skip intro". |
| Service-worker cache bumped to `tol-v10` | `index.html`'s opening markup, `css/splash.css` and two scripts changed together, and stale-while-revalidate would otherwise let an interrupted background update pair a new page with an old stylesheet for one visit. The same reason as the earlier bump for the Stories pill. |

### 2026-08 — A new opening screen

| Decision | Rationale |
|---|---|
| Four and a half seconds, not twelve | The old opening ran a four-phase DNA-helix sequence and auto-dismissed at twelve seconds. Nothing on a website earns twelve seconds before it can be used. Skip is now live from the first frame rather than fading in after one. |
| The tree it shows is the tree the site draws | The old screen unravelled a helix into a flat fan that appears nowhere in the app, so the first thing a visitor learned was wrong. The opening is radial, reads the real `TREE`, and rehearses the actual default view. |
| Deep time as the running caption | One number counting 3,800 Ma down to the present says what the site is about. It replaced three static captions — a species count, a domain count, a fact — that each said less. |
| An empty wedge for the words | The old title was drawn on top of the branches and fought them for legibility. Leaving an angular gap at the bottom and anchoring every line inside it means the text never crosses a branch, and the tree keeps its full size. |
| The title measures itself | "Дерево жизни" and "עץ החיים" are much wider than "Tree of Life", and a phone leaves under 200px of clear width. Fitting to the measured gap beats picking a font size per breakpoint and hoping. |
| Theme tokens, not constants | The old canvas hardcoded `#141618` and stayed dark behind a light page. Reading the same custom properties the stylesheet defines is what makes the opening follow the theme. |
| Theme and language restored before the splash runs | Found by looking: the skip button read "Skip" in Hebrew. `initSplash` sets its one-off copy at construction and samples `documentElement.lang`, and both were being set seventy lines later — so the opening was English furniture around a Hebrew title, and canvas text never went RTL. |
| Measurements forced LTR | `"720 Ma"` rendered as `"Ma 720"` in Hebrew. It is a Latin run in an RTL paragraph, the same case the detail panel already handles with `dir="ltr"` on Latin names. Caught in a screenshot, not by a check. |
| Skip is a real button | It had been a `<div>`, so it could not be reached or activated from the keyboard. |

### 2026-08 — Inline handlers removed, CSP tightened

| Decision | Rationale |
|---|---|
| One delegated dispatcher, not per-element listeners | Half the handlers were in template strings the modules write into `innerHTML` after start-up. Wiring those individually means re-wiring on every re-render; one listener on `document` means a control works the moment it exists. |
| The real count was 54, not 31 | The roadmap line said 31, which was the markup. Another 23 lived inside JS template strings, and CSP governs those identically — an attribute is an attribute whoever wrote it. Scope was checked before the work started rather than discovered halfway. |
| `style-src` keeps `'unsafe-inline'` | Not the same risk and not the same cost. Label sizes must be inline to outrank the stylesheet (CLAUDE.md constraint 7), the renderer sets geometry per element, and an injected `style` attribute cannot execute anything. |
| Action names read from existing data-attributes | The language, view and legend controls already carried `data-lang`, `data-mode`, `data-domain`. Repeating those values in a `data-arg` would have created two sources of truth that drift. |
| `game.js`'s dispatcher folded into the shared one | It had grown its own `data-action` vocabulary and its own listener. Two dispatchers watching the same attribute means every game click is a candidate for running twice. Its names kept their original spelling — renaming thirty markup sites for consistency would risk a silent dead button. |
| Two static checks, not just the runtime one | The existing CSP check only sees violations from handlers that actually fire during the interaction phase. `csp:no-inline-handlers` reads the source, so it covers files a given run never reaches, and `actions:every-action-has-a-handler` catches the new failure mode this pattern introduces: an action nothing registered, which fails by doing nothing at all. |
| Both new checks were tested by breaking them | A check that cannot fail is worse than no check. Each was run against a deliberately injected defect and confirmed red before being trusted. |
| Globals deleted rather than left behind | Forty-odd `window.x = x` lines existed solely so `onclick="x()"` could reach them. One survives (`navigateTo`), because two modules genuinely call it across the circular-import boundary. |

### 2026-08 — Takeover and polish

| Decision | Rationale |
|---|---|
| Verification before fixes | The suite was written and landed *before* any bug was fixed, so every later change had something to prove itself against. It found three problems nobody had reported. |
| Baseline file of known failures | Let the suite land red-in-truth but green-in-CI. The run fails both on a new failure **and** on a baselined check that starts passing, so each fix has to delete its own entry. The file went 44 → 0 over three stages and is now empty. |
| Smoke checks replace `deploy-check.yml` | The old workflow only asserted that files existed. It could not have caught a single one of the reported problems. |
| One `fitTreeToStage()` for all framing | The camera had been pinned to a hardcoded `scale(0.18)` in five places. Start-up, reset, view switches and resize now share one path, so they cannot drift apart again. |
| Fit measures the rendered bbox, not node positions | Labels extend past their nodes. Because labels are sized in world units, `getBBox()` is independent of zoom, so one pass is exact instead of iterative. |
| The "stage" excludes header, timeline and side rail | Fitting to the raw viewport hides part of the tree behind chrome. Corner widgets are deliberately *not* subtracted — reserving their full height would waste most of the screen. |
| Nothing is cached immutably | No asset is content-hashed, so an `immutable` header on `js/app.js` would strand visitors on old code with no way to bust it. ETags make revalidation cheap. |
| Species names exempt from i18n checks | The tree data is English-only. Marked `data-i18n-exempt` in the markup so the boundary is explicit and the check still guards everything else. |
| Era labels hide rather than clip | Segment widths are proportional to geological time, so no fixed heuristic fits every language. A missing label reads as deliberate; `Paleoproterozo` reads as broken. The full name moved to the tooltip. |
| Pages stays until the domain works | Two hosts briefly, rather than a window with none. |
| Proxy support is opt-in (`--proxy`) | Reading `HTTPS_PROXY` automatically broke plain `--url` runs against a local server — the mode CI uses. Shipped, then corrected once tested. |
| CSP lives in `vercel.json`, read by `serve.js` | One source of truth. A policy that would break the deployed site breaks locally and in CI first, instead of only being discovered in production. |
| CSP violations are read *after* the interaction phase | Inline event handlers are only evaluated when they fire, so reading on load would miss every `script-src` mistake. Found by testing the check rather than trusting it. |
| Only ranked taxa are translated | A half-translated tree reads worse than a consistently English one. The rank prefix in the `latin` field is the boundary, so the rule is data-driven rather than a hand-maintained list. |
| `photo-check.yml` fails on an empty extraction | It had been matching zero of 393 URLs for months and reporting success. A checker that cannot tell "nothing broken" from "nothing checked" is worse than none. |

### Earlier decisions

| Date | Decision | Rationale |
|---|---|---|
| 2026-03-11 | Inter + JetBrains Mono + Heebo | Modern scientific look with Hebrew and Cyrillic coverage |
| 2026-03-12 | SVG silhouette icons over emoji | Cross-platform consistency |
| 2026-03-13 | `ImageLoader` fallback chain | Generated → `PHOTO_MAP` → emoji; degrades gracefully |
| 2026-03-28 | J-series replaced the p-series | Fresh start after an audit |
| 2026-03-29 | Unified nav stack | `panelHistory`/`panelBack` removed in favour of one stack |
| 2026-04-03 | CSS extracted from `index.html` into `css/` | The "keep all CSS inline" decision from 2026-03-10 no longer held once the file grew past readability |
| 2026-04-03 | JS split into ES modules with late-bound deps | Avoids circular imports without a bundler |

---

## Shipped

Condensed from the p- and J-series logs, which are no longer kept as separate
files. Git history has the detail.

**p-series (2026-03)** — data extracted to modules; fuzzy trilingual search;
hominin lineage (28 species); interactive geological timeline; mobile
responsiveness with touch and pinch-zoom; alternate tree views; navigation
history stack; species image system with `PHOTO_MAP`; rich species panels; DNA
similarity calculator.

**J-series (2026-03 → 2026-04)** — design-system cleanup (z-index scale, accent
token consolidation); navigation polish; code modularisation into ES modules;
accessibility foundation; SVG performance and viewport culling; discovery and
fun features; data enrichment; offline/PWA support; guided tours.

**2026-04** — collapsed-by-default tree; superarchaic DNA story exhibit; game
modes and achievements; Reveal panel (depth slider + species toggle).

**2026-08** — browser smoke suite in CI; fit-to-stage camera; the rendering,
layout and i18n fixes listed in the decision log above.

**2026-09** — Kin phase 2 (a generated question bank, a frozen calendar,
Russian); a credits page for photos, silhouettes and dates; the map tooltip's
fun fact in three languages; the Astrolabe opening, with its own group of smoke
checks (see the decision log above).

---

## Architectural principles

1. **No build step** — static files, CDN dependencies, ES modules natively.
2. **No runtime dependencies** — `package.json` exists only to pin Playwright
   for the tests and is never shipped to the browser.
3. **Vanilla JS** — no frameworks.
4. **Data-driven** — content lives in JS data files, separate from rendering.
5. **Trilingual, RTL-aware** — Hebrew is a first-class layout, not a translation
   layer bolted on.
6. **Verified in a real browser** — anything that changes the site is checked on
   desktop and phone, in Hebrew as well as English, before it merges.
