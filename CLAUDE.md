# CLAUDE.md — Tree of Life Project Guide

## Working Agreement

How Gabi and Claude work on this project. This section takes precedence over
any default behaviour.

### Ownership of git & GitHub

Gabi never deals with git or GitHub mechanics. Claude owns the whole loop:
branch, commit, push, open the PR, watch CI, fix failures, merge, delete the
branch. Outcomes are reported in plain language — never as diffs or command
transcripts.

- **Spend pushes sparingly.** At most two pushes (so two PRs, each one squashed
  commit) per week per project, counting from Monday, unless Gabi has allowed
  more in advance. Batch related work, run the full checks locally first so CI
  does not need a fix-up commit, and check `git log origin/main --since="last
  monday"` before pushing. At the cap, stop and ask — even for "ship it".
- Always work on a feature branch. Never commit directly to `main`.
- Never end a session with unpushed work.
- Every PR that changes the site must be visually verified before merge
  (see *Visual verification* below).

### Code words

| Word | Means |
|---|---|
| **ship it** | Commit, push, open PR, get CI green, merge, delete the branch. |
| **checkpoint** | Commit and push. No PR. |
| **status** | Plain-language summary of where things stand. No diffs. |
| **hold** | Push and open the PR, then stop and wait for Gabi's approval to merge. |

### Ending a session

Every session ends with a **handover prompt** — a block Gabi can paste
straight into a new session. It carries what the next Claude cannot infer from
the code:

- the branch, and whether its PR is open, merged or absent;
- what is deployed versus what is only on the branch;
- what was verified, and by what means;
- what is known-broken or known-unverified, and why;
- the next one or two things worth doing.

Not a changelog — git holds that. The point is the things that would otherwise
be rediscovered the hard way: which environment limits bite, which checks do
not cover what they appear to, which fixes are unverified on real devices.

Write it unprompted, at the end, alongside the plain-language summary.

### Language

Reply in whichever language Gabi used last — English, Hebrew and Russian are
all fine. Code, commit messages, PR text and documentation stay in English.

### Visual verification

Before merging anything that changes the site, open it in a real browser
(Chromium is preinstalled for Playwright) and confirm it looks right:

- **Desktop** (1440×900) **and phone** (390×844) viewports.
- **Hebrew** as well as English — the site is trilingual and Hebrew is RTL.
- Show Gabi screenshots, not diffs.

`node scripts/smoke.mjs` automates the mechanical half of this; screenshots
land in `.smoke-out/`. It is not a substitute for looking at the result.

---

## Project Overview

**Tree of Life** is two things on one domain. The front page, **Kin**, is a one-minute daily game — "who is the closer cousin?" — about how every living thing is related (`index.html`, see *Kin*). Behind it, one click away, the **Atlas** is an interactive, browser-based phylogenetic visualization of 3.8 billion years of evolutionary history: users explore the tree of life, expand taxonomic nodes, search for species, and view detailed information panels with photos, Wikipedia summaries, and conservation status data (`atlas.html`). Most of this file is about the Atlas, because it is the larger program; Kin has its own section.

- **Tech stack:** Vanilla JavaScript, HTML5, CSS3. **No D3** — earlier docs
  claimed a D3 CDN dependency, but `atlas.html` has exactly one script tag
  (`js/app.js`) and the renderer is hand-written SVG.
- **No build step** — open `index.html` or `atlas.html` directly or use `node serve.js`
- **No package manager for the site** — the page itself ships zero npm
  dependencies. `package.json` exists only to pin Playwright for the smoke
  tests, and is never shipped to the browser.
- **Deployment:** Vercel, on every push and pull request (see *Deployment*).

---

## Repository Structure

```
tree-of-life/
├── index.html           # The front page: Kin, the daily game (see *Kin*)
├── atlas.html           # The Atlas — SPA, pure HTML markup (~462 lines)
├── play.html            # Forwards to / with its query: where Kin was tested, and what testers were sent
├── credits.html         # Who made the photos, silhouettes and dates (see *Credits*)
├── serve.js             # Local dev server (port 5555): node serve.js
├── docs/PLAY_STRATEGY.md # Why the site is becoming a game, and the phased plan
├── tests/kin.test.mjs   # Unit tests for Kin's engine and answer key (npm test)
├── tests/tree.test.mjs  # Unit tests for the Atlas's tree data: ids, dates, extinction, map regions, photos
├── mockups/opening/     # Concept gallery for the opening: four live scenes, no part of the site
├── css/                 # External stylesheets (16 files)
│   ├── variables.css    # CSS custom properties, reset, focus styles
│   ├── layout.css       # Header, search, breadcrumb, nav controls
│   ├── chrome.css       # Left rail, floating controls, search pill
│   ├── splash.css       # Opening: first paint, words, plaque, reduced motion
│   ├── profile.css      # Player profile overlay, and the name offer after a game
│   ├── sapiens.css      # Human-origins deep dive
│   ├── tree.css         # SVG tree rendering, node/branch styles
│   ├── timeline.css     # Era browser, extinction markers, playback
│   ├── panel.css        # Species detail panel, hero images, cards
│   ├── hominin.css      # Hominin deep-dive overlay, compare cards
│   ├── features.css     # Legend, zoom, tooltip, quiz, DNA, evo path, tours
│   ├── theme.css        # Light theme overrides, dark mode polish
│   ├── explore.css      # Drill-down shell — unfolding rows, path dots
│   ├── orbit.css        # Orbit, the third view — bubbles, rings, the action row
│   ├── rtl.css          # Hebrew RTL layout overrides
│   ├── responsive.css   # Mobile breakpoints, reduced motion, high contrast
│   └── kin.css          # index.html only — self-contained, see *Kin*
├── robots.txt · sitemap.xml # Both apps are indexable: /, /atlas.html, the story and credits
├── manifest.json        # The installed game: Kin's name, icons, start page (see *Kin*)
├── sw.js                # Service worker shared by both apps — see *Kin*
├── assets/
│   ├── placeholder.svg  # Fallback image when taxon photo is unavailable
│   ├── icon.svg · icon-maskable.svg # The dial and its three-leaf tree, drawn by scripts/build-icons.mjs
│   ├── icon-192.png · icon-512.png · icon-maskable-512.png · apple-touch-icon.png · favicon-32.png # rendered from those
│   ├── og-image.png · og-kin.png # Link-preview cards (scripts/make-og-image.mjs): the Atlas, and Kin
│   └── silhouettes/*.svg # PhyloPic outlines, one per taxon that has one (337)
└── js/                  # All ES modules — single entry: app.js
    ├── # ── Data modules ──
    ├── data.js          # Barrel re-exports for widely-shared constants
    ├── treeData.js      # TREE object — full phylogenetic tree data
    ├── treeExpansion.js  # expandTree() — adds 300+ species with IUCN data
    ├── speciesData.js   # PHOTO_MAP, WIKI_TITLES, ENRICHMENT
    ├── uiData.js        # DEPTH_R, ERA_NAMES, EXTINCTIONS, TRANSLATIONS
    ├── factLibrary.js   # FACTS — random facts for discovery feature
    ├── imageLoader.js   # ImageLoader — resolves a node to a URL at a given size
    ├── photoSnapshot.js # GENERATED — every species photo, two sizes each
    ├── labelMetrics.js  # One source of truth for label size, placement, footprint
    ├── dnaSimilarity.js # DNA_KNOWN, estimateDnaSimilarity(), findLCA()
    ├── taxonRank.js     # rankKey(), subtreeDepth() — a node's rank and how deep it runs
    ├── eraNames.js      # eraLabel() — a node's era string in Hebrew/Russian; unknown strings stay English
    ├── nodeIcons.js     # NODE_ICONS SVG paths + getIconGroup()
    ├── triviaData.js    # TRIVIA_QUESTIONS — 200+ quiz questions
    ├── primateData.js   # PRIMATE_DATA — taxonomy, genome, traits
    ├── geoData.js       # GEO_DATA + BRANCH_DATA — geographic data
    ├── mapPaths.js      # MAP_PATHS — continent outlines for mini-map
    ├── tours.js         # Guided tour engine (3 tours)
    ├── # ── Application modules ──
    ├── actions.js       # Delegated data-action dispatch — the only click wiring
    ├── app.js           # Entry point — init(), action registry, event listeners
    ├── state.js         # Shared mutable state object + constants
    ├── utils.js         # reducedMotion(), preprocess(), hominin helpers
    ├── layout.js        # layout(), layoutRadial/Cladogram/Chronological/Playback
    ├── zoom.js          # applyT(), smoothPanTo(), centerOnTree/Root, pointer handlers
    ├── renderer.js      # render(), branchPath(), scheduleRender()
    ├── navigation.js    # navStack, pushNav/navBack/navHome, breadcrumb, tooltip
    ├── search.js        # buildSearchIndex(), searchEntities(), fuzzy matching
    ├── timeline.js      # Era slider, extinction markers, presets, sparkline
    ├── panel.js         # renderPanelContent(), showMainPanel(), species cards
    ├── hominin.js       # buildHomininTree(), compare mode
    ├── dnaCalc.js       # DNA similarity calculator modal
    ├── evoPath.js       # Evolutionary path comparison tool
    ├── game.js          # The Games panel: Quick, Classic, Survival and Daily, and their results
    ├── whoFirst.js      # Who Appeared First? — a mode of the Games panel
    ├── familyFoe.js     # Family or Foe? — a mode of the Games panel
    ├── profile.js       # Players on this device, the leaderboard, and the name offer — see *The name, asked for after a game*
    ├── playback.js      # Time-lapse playback mode
    ├── theme.js         # t(), setLang(), applyI18n(), toggleTheme()
    ├── explore.js       # Drill-down shell — see *The two shells*
    ├── orbit.js         # Orbit, the third view — see *Orbit*
    ├── wayfinder.js     # Back / Home / Share — see *Getting out, and sharing*
    ├── boot.js          # Classic script in <head>, not a module: theme, language, direction before first paint
    ├── splashScene.js   # The opening's picture — the Astrolabe, a pure function of time
    ├── splash.js        # The opening's lifecycle — see *The opening screen*
    ├── engagement.js    # Toast notifications, idle timer, intro, particles
    └── kin/             # Kin, the daily game — see *Kin*
        ├── tree.js      # The answer key: a curated tree of every creature
        ├── key.js       # Reads the key: MRCA, resolve(), the margin rule
        ├── dates.js     # Sourced age of each branching point, with citations
        ├── groups.js    # One line per dated branch — the "why" of generated questions
        ├── creatures.js # Emoji, names with grammatical forms, LOOKS (folk tags), SPECIES
        ├── glyph.js     # Swaps an emoji the device cannot draw for its kingdom's sign
        ├── questions.js # Hand-written questions, their "why", days 1–4, hooks
        ├── generate.js  # Build-time only: picks questions from the tree, lays out days
        ├── bank.js      # GENERATED: every generated question
        ├── schedule.js  # GENERATED: the frozen calendar, one line per day
        ├── calendar.js  # EPOCH, day numbers, the last day playable anywhere
        ├── engine.js    # Pure: all questions, validation, daily, arcade, streak + freezes, stats, links, share
        ├── strings.js   # Every word the player reads, English, Hebrew and Russian
        ├── reveal.js    # The three-line tree drawn after each answer
        ├── front.js     # Classic script in <head>: a link to a species or a view goes to atlas.html
        ├── legacy.js    # Classic script of play.html: forwards to / keeping the query
        ├── main.js      # index.html's only module
        ├── install.js   # Pure: when to offer the home screen, and in which form
        ├── analytics.js # Counting that is off until a page names an endpoint — see *Kin*
        ├── rng.js · store.js · sfx.js
```

---

## Kin — the daily game (`index.html`)

The site is turning into a game; `docs/PLAY_STRATEGY.md` says why and in what
order. `index.html` — the front page of treeoflife.wiki since 30 Sep 2026 — is
a one-minute daily ("who is the closer cousin?"), an endless Arcade, a Home for
people who come back, streaks with freezes, stats and friends' links, in
English, Hebrew and Russian. The encyclopedia it grew out of is `atlas.html`,
one tile away; the two link to each other (Home's Atlas tile and the footer one
way, the rail's "Kin · daily game" pill the other).

- **The old addresses still work, and keep their query.** The encyclopedia used
  to be `/`: its Share button made `/?node=humans&view=map&lang=he`, and those
  links are out in the world. `js/kin/front.js`, a classic script in Kin's
  `<head>`, sends any address naming `node` or `view` to `atlas.html` with its
  whole query and hash before the game draws anything. The game was tested at
  `play.html`: that page is now a stub whose `js/kin/legacy.js` forwards to `/`
  keeping `?kin=3&lang=he`. Both are client-side on purpose: a server redirect
  depends on the host forwarding the query string, and a link that arrives
  without its species or its day is worse than one that takes an extra hop.

Things worth knowing before changing it:

- **Answers are derived, never typed.** `js/kin/tree.js` is a curated tree of
  every creature; a question only names a target and two candidates. The
  engine finds where each pair meets, and a question is valid only if the
  target meets its nearer relative strictly inside the node where it meets the
  farther one. `npm test` fails if any question stops being true. The site's
  own `TREE` was not usable for this: it files a lobster under Insects.
- **Only uncontested branching is resolved.** Disputed orders (bats among the
  hoofed mammals and carnivores, the inside of Neoaves, the three arctoid
  families, the placental root, giraffes vs deer vs cattle, the four orders of
  the nitrogen-fixing clade, where magnoliids like the avocado sit) are left
  as polytomies, so no question can hinge on them. "Superasterids" (cactus
  with the asterids) was collapsed because Open Tree disagrees with it —
  nothing was dated there, so no question changed.
- **Dates belong to nodes, and none come from TimeTree.** Its terms allow
  personal research and teaching use and forbid redistribution. Every age in
  `js/kin/dates.js` cites an open source; the tests fail on a missing citation,
  on a `timetree.org` URL, and on any ancestor dated younger than a
  descendant. A question needs both of its splits dated; a node nobody has
  an open number for stays undated, and no question can land on it. Today
  that is crab vs lobster, sheep vs goat, and orange vs lemon — the last
  because both are hybrids, so "when did they split" has no tree-shaped
  answer. Published estimates disagree by 10–20% on most nodes and far more
  on the deepest; the comment beside each value says whether it is a
  midpoint or the end of a range chosen so that it nests. Sapindales (citrus
  vs maple, ~60–125 Ma across studies) and the eukaryote root are the least
  certain.
- **A fossil beats a model when they disagree.** Särkinen et al. 2013 put
  chili vs tomato at 19.1 Ma, but a 52.2-million-year-old lantern-fruit
  fossil sits inside that split, so the node carries the fossil as a minimum
  ("more than 52 million years"). Dog vs fox is the same kind of call:
  published estimates run 7.8–21.5 Ma by method, so the node says only what a
  7-million-year-old fox fossil proves. Every value was checked against its
  source's own text before it went in; the one source that could not be read
  from here (a fossil monograph giving ~12 Ma for dog vs fox) was not used.
- **`npm run kin:opentree`** checks the key against Open Tree of Life (CC0) —
  needs the network (`NODE_USE_ENV_PROXY=1` behind a proxy), so it is manual.
  It replays every question, hand-written and generated, and then every
  relationship the key states, question or not: for any three creatures where
  ours says two meet before either meets the third, Open Tree must agree or
  be unresolved. The second pass is the one that covers questions the
  generator has not written yet, and it is what caught "superasterids". Each
  creature's stand-in species is `SPECIES` in `creatures.js` — change it there,
  not in the script. Open Tree places fossils such as T. rex and the mammoth
  by taxonomy only (`incertae_sedis`), and its taxonomy keeps birds out of
  Theropoda, so questions touching them are reported as undecided rather than
  failed. Its `extinct` flag is useless for this: it is set on *Homo sapiens*.
- **The Hebrew name is קרובים, not a transliteration.** "Kin" written in
  Hebrew letters is קין — Cain. Hebrew "you" is gendered, so the human card
  reads אנחנו. Sentences are built per language (`le` and `def` forms in
  `creatures.js`), not translated from one template.
- **The Russian name is Родня** ("kin"), and the human card reads Мы, as in
  Hebrew. The prompt «С кем в более близком родстве…» ends where the target
  card begins, so the card keeps its plain name — "closer to…" would have
  needed a dative on the card. Sentences take the genitive: `g` for the pair
  in the headline, `line` after «Предки…» (plural where Russian counts the
  thing, singular for rice or coffee). A few names are deliberately narrower
  than the English — Макака, since обезьяна would include the gorilla it is
  compared with; Черешня and Голубика, the stand-in species' own names;
  Яблоня, the tree, since a fruit has no ancestors. None of the Russian text
  has had a native speaker's review yet.
- **The switcher offers every other language**, each labelled by the `code`
  and `name` it gives itself in `strings.js`, so adding a language touches no
  other. The third button made the bar wider; `play:header-fits` holds it on
  a 360px phone.
- **The reveal mirrors in Hebrew** so time runs right to left, and every word
  on it is HTML over the SVG — SVG text has no dependable bidi handling.
- **Emoji are the device's own, so a new one can come out as an empty box.**
  The donkey, jellyfish, ginger and pea pod date from 2022 and the coral and
  beans from 2021; Windows 10 and older Android phones cannot draw them.
  `glyph.js` draws each emoji twice on a hidden canvas in two inks — a colour
  emoji ignores the ink, a missing glyph's box does not — and shows the
  kingdom's sign (🐾 🌿 🍄) instead of a box. Testing for colour instead
  would reject the zebra and the panda, which are grey. The name stays on the
  card either way. `play:missing-emoji-falls-back` feeds it a code point no
  font has, because CI's Chromium draws every creature.
- **`css/kin.css` is self-contained on purpose.** `css/variables.css` sets
  `overflow:hidden` and a grab cursor on `<body>` for the map, which would
  freeze a page that scrolls.
- **Days are numbered from `EPOCH` in `engine.js`** in each player's own
  calendar. Days 1–4 are hand-picked; later days are seeded draws, the same on
  every phone. One `localStorage` record, `kin-v1`, holds progress; the site's
  `tol-lang` and `theme` keys are shared. `?lang=he` from a shared link is
  honoured for the visit and not written back.
- **A first visit is question one, and nothing else is in front of it**: no
  opening, no tour, no menu. Anyone who has answered before lands on **Home**
  (`renderHome` in `main.js`) — a seven-tick dial of the last week with the
  streak in its centre, today's Kin on a plaque (Play, Continue at question N,
  or the finished result with Share), and tiles for the Arcade and the Atlas.
  Someone part-way through today's Kin is put back at their question rather
  than shown Home, and the result of a Kin closed on its last reveal is
  shown, not an eleventh question. The name in the header is a button that
  leads Home. `start()` holds the whole rule, in order: stats, challenge,
  friend's Kin, resume, Home, question one.
- **The streak is forgiving, and never says "you lost it".** `nextStreak`
  counts a day played the day after the last one; one missed day is covered by
  a *freeze* if the player holds one (spent when they next finish a Kin); any
  longer gap starts over quietly — Home shows a sprout and an invitation to
  start a new streak, never a broken number or a zero. A freeze is earned by scoring 10 in one Arcade run,
  and at most two are held (`FREEZE_AT`, `MAX_FREEZES` in `engine.js`).
  `streakNow` is what Home shows; it is read-only, so opening the page can
  never change the record. A finished Kin is written to `history` (Kin number →
  score) for the stats screen.
- **Links carry the game, and are read strictly.** `?kin=N` plays a past Kin
  once, with a banner and no effect on the streak or the record (a link to
  today's Kin is just today's Kin); `?c=SEED&s=SCORE` replays an Arcade run and
  names the score to beat; `?lang=` is the sender's language; `?stats=1` opens
  the stats. `parseLaunch` accepts only plain integers inside their ranges
  and ignores everything else, so a hand-edited address asks for nothing. The
  Share button builds `kinURL`/`challengeURL` from `location.origin +
  location.pathname`, so a link points at whichever page the game is served
  from. Shared text is a number, ten squares and a link — no spoilers.
- **Stats are a screen, and stay on the device.** Home links to it, `?stats=1`
  still opens it directly (it is how testers were sent to their numbers):
  streak and best streak, Kin finished, average and best score, questions
  answered, Arcade runs and best, results shared, first day, and how many
  finished Kins reached each title. Rows carry `data-stat` so a check reads
  a number and not a position. Erasing is two taps in place — the button asks
  again — because the site raises no native dialog. Nothing leaves the device.
- **Most questions are generated, not written.** The tree answers far more
  than anyone could write: `js/kin/generate.js` takes every target and every
  pair of creatures meeting it at two different dated nodes, keeps one per
  shape with the most surprising pair, and drops the trivial ones. Surprise
  comes from `LOOKS` in `creatures.js` — what a casual player lumps a
  creature with (sea, furry, fruit…): a question is hard when the wrong
  answer shares more of those with the target than the right one does. A
  generated question's "why" is the line in `groups.js` for the node where
  the target meets its nearer relative, so each line names *that* group and
  never a broader one. `npm run kin:build` rewrites `bank.js` and extends
  `schedule.js`; `npm test` fails if `bank.js` differs from a fresh run.
- **The margin rule applies to generated questions only**: the far split
  must be ≥ 15% older than the near one (`MARGIN` in `key.js`), because
  closer than that the published error bars overlap. Hand-written questions
  are checked by a person and keep their dates.
- **The calendar is frozen; the past never changes.** `schedule.js` holds
  every day's ten ids, one line per day. The builder copies every day up to
  the last one playable anywhere (today in UTC+14) and only rebuilds later
  ones, and `play.yml` runs `scripts/kin-check-schedule.mjs` against main so
  a PR that alters a played day fails. It also fails when fewer than 30 days
  remain: extend with `npm run kin:build -- --days N`. Generated ids are
  readable (`target.nearer.farther`), so a day stays resolvable after the
  bank is rebuilt; a tree fix that makes a played question false fails the
  tests rather than silently changing it.
- **How a day is laid out**: an opener whose wrong answer is a strong decoy,
  then nine rising in difficulty — gentle Mondays, hard Saturdays, a themed
  Sunday — with no target, no meeting node, and no creature more than twice
  in one day, and no question again within 45 days. When a day cannot be
  filled, the rules give way one at a time (a Sunday's theme first), but a
  question never returns within a week.
- **The service worker fetches all code network-first.** Kin first, because a stale
  copy would hand a returning player a different daily puzzle from everyone else's;
  then the Atlas's pages, scripts, styles and JSON too, after an iPhone home-screen app
  ran a new `orbit.js` against the previous `uiData.js` (modules are cached one file at
  a time, so "serve cached, refresh behind" mixes versions) and drew the raw key
  `orbit_compare_stop` on a button. Only images, icons and silhouettes stay
  stale-while-revalidate. Bump `CACHE_VERSION` to drop everyone's old copies. The bullets below say the rest of what it does.
- **The home screen is offered, not pushed.** `installOffer` in `install.js`
  decides, and only Home draws it: never to a first-time visitor (two finished
  Kins first), never mid-game or on a result, never inside the installed app,
  never again for 30 days after "Not now", never to a device that has it.
  Where the browser has its own install dialog (`beforeinstallprompt`, held
  until the player taps Install) the card has an Install button; an iPhone or
  iPad has none, so the card says *Share ▸ Add to Home Screen* and offers
  "Got it". The event is held with `preventDefault()` so Chrome's mini-infobar
  does not interrupt, and the card redraws only if it changes what Home shows.
  `manifest.json` is Kin's (name, PNG icons at 192 and 512, a maskable one, the
  SVG); `apple-touch-icon` is a PNG because iOS ignores an SVG. The icons are
  drawn by `scripts/build-icons.mjs` from one mark, so they cannot drift apart.
- **The service worker precaches the game and nothing else.** A visitor who
  came for Kin should not download sixty Atlas modules, so `APP_SHELL` in
  `sw.js` is Kin's page, stylesheet, dispatcher and every module it imports;
  the Atlas is cached as it is used. Each entry is added on its own
  (`allSettled`): `cache.addAll` rejects as a whole, and a worker that cannot
  install never updates, so one deleted file would have stranded everyone on
  the version they had. A unit test holds the list to the files on disk and to
  the modules `main.js` actually imports. A page is cached under its path
  alone — a shared link's query string is the same page, and keying on it
  filled the cache with one copy per link and found none of them offline — and
  `/_c/` (counting beacons) is never intercepted. The game registers the worker
  on `load`, so it never delays the first question; the play check blocks
  workers in every context but the one that tests them, because a worker
  answers requests before `page.route` can see them.
- **Counting is off, and what it would send names no one.** `analytics.js`
  does nothing until the page carries `<meta name="kin-analytics"
  content="/_c/count">`. Then it sends an image request per event — `visit/dN`
  (once a day per device, N = days since that device first played, so D1 and
  D7 are read off counts with no identifier), `daily/finish`, `share`,
  `arcade/start`, `install`, `link/kin`, `link/challenge` — carrying an event
  name and noise and nothing else: no cookie, id, referrer or screen size. A
  browser that sends Do Not Track or Global Privacy Control is not counted.
  The endpoint is meant to be this site's own domain rewritten by Vercel to a
  counter such as GoatCounter, so the CSP needs no new origin and no third
  party sees the visitor. The stats screen says "nothing is sent" when it is
  off and says what is counted when it is on. To turn it on: add the meta tag
  and a `rewrites` entry in `vercel.json`; nothing else changes.
- **`npm run play:check`** drives the page in Chromium as a first-time visitor
  (phone and desktop, English, Hebrew and Russian): first question within
  3 s, the header fits and its ten dots stay on one row, reveal labels fit and
  do not collide, the figure mirrors, no Latin text in Hebrew or Russian, the
  result grid stays on one line, share text and link, a finished Kin coming
  back as Home, arcade end, CSP. Then, in every scenario, as someone who has
  played before: Home (streak, freeze, dial, language, fits above the fold,
  nothing covered), half a Kin resumed, the stats screen against a record with
  known numbers, and erasing it. In one scenario per language and kind of
  screen it also plays the long stories — a friend's Kin leaving the record
  alone, a challenge link, ten in the Arcade earning a freeze, a missed day
  spending it, a broken streak starting over without blame. In every scenario
  it also checks the home-screen offer (who gets it, what it says in each
  language, that it fits, that Install uses the browser's dialog once, that
  "Not now" is remembered for a month, the iPhone variant, never inside the
  app or a game), and once each: the service worker caching the whole game and
  the game opening, playing and opening a friend's link with the network off;
  and counting — nothing sent by default, four events when on, no identifier,
  Do Not Track honoured; and the front door — the old `play.html` and the
  encyclopedia's old `/?node=…&view=…` addresses forwarding with their query,
  a link to a species showing no opening (in a context of its own: once one
  entrance has played it, every later load in the tab is skipped anyway), the
  way between the two apps both ways, and Credits going back to whichever
  opened it. A **fresh** sweep holds the service-worker rule above: it visits the Atlas
  until the worker has cached its modules, then "deploys" by having a proxy in front of
  `serve.js` append one export to `js/uiData.js`, and asks the module the page *loaded*
  whether it has it (`play:a-returning-visitor-gets-the-new-code-on-the-next-visit`; red
  against the pre-#224 worker, green now; skipped with `--url`). Seeded records are
  written once, because an init script runs
  again on every navigation. `--only front-door,offline,fresh` runs just those
  sweeps; against a deployed site (`--url`) the offline sweep is skipped, since
  it needs a server it can stop, and `verify-deployment.yml` runs the rest.
  Screenshots in `.play-out/`. It also draws **every** question's reveal
  on a 360px phone in every language (`play:every-reveal-fits-*`), because a
  day only ever shows ten of them — that sweep found a Hebrew fossil-minimum
  date running out of the figure on its first run, and later the Russian bat,
  «Летучая мышь», 2px too wide as the bold target, which is why a leaf name
  now wraps at a space rather than overflow. It runs in CI as its own
  workflow (`play.yml`), apart from the smoke suite.

## Running Locally

```bash
node serve.js          # serves on http://localhost:5555
```

No install step needed. Open `http://localhost:5555` in a browser for the game
and `http://localhost:5555/atlas.html` for the encyclopedia. Opening either page
straight off disk also works, but skips the Content-Security-Policy that
`serve.js` mirrors from `vercel.json`, so prefer the dev server.

---

## Architecture

### Modular Architecture

**CSS layer:** 15 external stylesheets in `css/` directory, loaded via `<link>` tags.

**Data layer:** 14 ES module files with explicit exports. Widely-shared constants re-exported via `js/data.js` barrel.

**Application layer:** 18 ES modules loaded via `<script type="module" src="js/app.js">`. No build step — native browser module support.

**Shared state:** All mutable state lives in `js/state.js` as a single exported `state` object. Modules import and mutate it directly.

**Dependency injection:** Cross-module calls use late-binding (`initXxxDeps()` functions) to avoid circular imports. `app.js` wires all dependencies at startup.

### Actions — how clicks are wired

Controls declare what they do in markup and `js/actions.js` dispatches from a
single delegated listener on `document`:

```html
<button data-action="view:set" data-mode="cladogram">Cladogram</button>
```

```js
registerActions({ 'view:set': (_a, _b, { el }) => setViewMode(el.dataset.mode) });
```

Handlers are called as `(arg, arg2, ctx)` — `data-arg` and `data-arg2`, then
`{ el, event }`. Arity is fixed so a handler that only wants the element can
still reach it. Register in the module that renders the markup naming the
action, not centrally; `app.js` registers only what `atlas.html` uses.

Three things follow from this that are worth knowing:

- **Delegation is why runtime markup works.** Panels, the game and the compare
  overlay build their HTML into `innerHTML` long after start-up, and a button
  works the moment it exists because nothing is wired per element.
- **The point is the CSP.** `onclick="…"` is script parsed out of an attribute,
  so permitting one means `script-src 'unsafe-inline'` — which equally permits
  any `<script>` an injection places on the page. There were 54 of these
  attributes; removing them let the policy drop the keyword.
- **A missed action is a silent dead button**, so two static checks guard it:
  `csp:no-inline-handlers` fails on any handler attribute in source, and
  `actions:every-action-has-a-handler` fails on a `data-action` no module
  registers. Both catch controls no browser test happens to click.

Where an element already carries its value (`data-lang`, `data-mode`,
`data-domain`), the handler reads it from there instead of repeating it in a
`data-arg` that could drift.

### The two shells

The Atlas has three views, switched from the rail and remembered in
`localStorage` under `tol-shell-view`. `body[data-view]` carries the choice and
the CSS hides the others wholesale. **Orbit** (see *Orbit*) is what a visitor
with no stored choice lands on; someone who picked Explore or the map keeps it.
This section describes the first two.

**Explore** (`js/explore.js`) is the list: the thing a visitor landed on before Orbit.
One tree, unfolding in place: tapping a group leaves it where it is and opens
its children directly beneath it, indented a step, while the branches you did
not take stay on the page greyed. There is no camera — nothing can be panned
off-screen, zoomed into nothing, or collapsed out from under you, and every tap
has exactly one meaning.

It used to be one screen per level — tap a card, the page is wiped and
repainted as a fresh grid of boxes under a new heading. That was legible but it
was not a tree: every level looked like every other level, and nothing on
screen said the rows you were now reading had come out of the row you tapped.
Boxes hanging under a title is a menu. The unfold is what makes the shape of
the thing visible, which is the entire subject of the site.

**Map** is the radial tree. It is an expert visualisation: lovely once you know
what a clade is, and on a 390px phone it showed four circles in the corner of a
black void with 85% of the screen empty. It is the identity of the site and
worth keeping — it just should not be the front door.

Things worth knowing before changing Explore:

- **It reads every child, ignoring `_hiddenByToggle`.** That flag belongs to
  the map's "show all species" switch, which exists to stop three hundred discs
  crowding the canvas. A list has no such problem, and honouring it made every
  phylum look childless — most of the tree was unreachable.
- **A leaf opens the detail panel** rather than descending into an empty
  screen. `showMainPanel` is injected via `initExploreDeps()` to keep this
  module clear of `panel.js`.
- **Only one lineage is ever open**, and the open path is derived from a single
  `_selected` node rather than stored. The two can therefore never disagree,
  and arriving from search is free: set `_selected` and every ancestor is open
  by construction. It also bounds the page to the depth of the tree (nine) and
  never to its size (379 nodes), so no lazy rendering is needed.
- **The nesting is drawn, not implied.** Each branch is wrapped in its own
  `.ex-branch`, and that wrapper is what makes the tree drawable: it spans the
  row *and everything below it*, which is the extent a limb has to cover. A
  trunk runs down each level's gutter (`.ex-kids`) and every row reaches out of
  it on a curve. Both are borders on pseudo-elements rather than an SVG — they
  take their weight and colour from properties the renderer already sets per
  node, and every offset is a logical property, so the tree grows from the
  right edge in Hebrew without one mirrored rule.

  It was an indent and nothing else before, which is what a nested *list* looks
  like: nothing joined a row to the row it came out of, so the view read as an
  outline with good manners rather than as a tree — on a site whose whole
  subject is the shape.
- **Two numbers carry the scale, and they are the two the rows only stated in
  words.** A limb's thickness comes from `subtreeSize()` on a log scale, so
  Mammals leaves its parent visibly heavier than Chondrichthyes; a trunk is
  always at least as heavy as the limbs leaving it, because its subtree
  contains theirs. Log, because the counts are not: LUCA carries 379
  descendants and over half the rows carry none, so a linear scale draws one
  thick line and three hundred identical hairlines. And trunks fade with
  distance from the level the reader is standing on (`--near`, 0 at the root
  and 1 at the open level) — eight nested levels at one opacity are eight
  identical lines down the side of a phone, and graded they read as eight
  distances.
- **The indent staircase is load-bearing, and it is easy to invert.** Rows get
  denser with depth — nine levels of the old 132px cards does not fit a phone —
  and the first attempt shrank the media box by 22px while gaining only 12px of
  indent, so depth 2 rendered *further left* than depth 1 and the nesting
  stopped reading exactly where it mattered. The indent step must exceed the
  media-size drop. Measure the inline-start inset per level rather than
  eyeballing a screenshot; it reads identically in Hebrew when it is right.

  **It was then capped at four steps, which is the same failure by another
  route.** Ten real steps of indent eats a 390px phone, so levels five through
  ten all rendered at the same offset and the deepest half of the tree was
  drawn flat — while every check on this view stayed green, because the rows
  were present, translated, contrasty, correctly counted and stacked in a
  straight line. Drawing the nesting costs one narrow gutter per level instead
  of a whole indent step, so the cap could go; `explore:depth-is-drawn` is what
  keeps it gone.
- **The limb hangs on the row, not on the branch.** A branch box spans its
  whole open subtree, so a percentage of it is meaningless and the elbow has to
  be placed at a guessed pixel offset instead — which drifts the moment a
  subtitle wraps to two lines, as "Family · 5 inside · 3 levels deep" does on a
  phone. The row's own box is the one whose middle is worth knowing, and 50% of
  it is exact at any height.
- **`scrollIntoView` cannot see the path ribbon.** It scrolls until the row is
  inside the scroll container and stops, and the bottom 69px of that container
  is covered by the view's own fixed bar — so arriving from search on a
  six-deep node parked it at y=796 in an 844px window, correctly scrolled-to
  and entirely hidden. Measure against the ribbon's top edge, not the
  viewport's. `explore:deep-landing-is-visible` is the guard, and the probe's
  own descent cannot catch this because it starts at the root and never travels
  far enough to need scrolling at all.
- **A row carries its own replacement picture.** `data-on-error="hide"` was the
  whole fallback, and hiding an `<img>` inside a fixed 36px media box leaves a
  hole, not an absence — a species with no photograph and a page still loading
  look identical. The silhouette (or the emoji) is now rendered alongside the
  photograph, hidden, and revealed by the error handler in `actions.js`. That
  handler clears the sibling's inline `display` rather than setting one:
  `hide-show-next` used to force `flex`, which suited the one call site it was
  written against and made a masked silhouette block into a flex container.
  A URL that resolves is not a URL that loads — Commons files get renamed and
  deleted, and the visitor's connection gets an opinion too.
- **`_selected` always has children, unconditionally.** The guard in
  `openInExplore` used to read `if (!childrenOf(node).length && _showMainPanel)`,
  so the invariant held only while `app.js` had the panel wired. That left a
  translated "this is as deep as this branch goes" message in the render path
  for a state the running site never reaches — dead copy in three languages,
  kept alive by a dependency check. Both are gone. State an invariant plainly
  or it grows code to serve the case it forbids.
- **Grey is a contrast problem, not a paint job.** Dimmed rows stay tappable,
  so WCAG gives them no disabled-control exemption. They use `--text-secondary`
  (8.3:1 dark, 8.6:1 light), not a low opacity — and note that
  `a11y:explore-text-contrast` *stops* protecting anything faded below
  `opacity: 0.15`, because the sweep skips it.
- **Its coverage is separate from the map's, and has to be.** The suite seeds
  `tol-shell-view = 'map'` so the tree geometry is measured against the tree,
  which means no sweep written for the canvas can see this view. Explore is
  therefore checked from its own probe — usability, language and contrast. See
  *Explore's own checks* below for what runs there and why each one had to be
  written twice.
- **Rows state their rank, their width and their depth.** "43 inside" answers
  half of what a reader wants before opening something: mammals and insects
  both read as a wall of rows and only one of them has four more levels
  underneath. A group row now reads `Class · 43 inside · 4 levels deep`, and a
  group only one level deep reads `Phylum · 5 species` instead — the same fact
  in the word the site already uses for it. `js/taxonRank.js` supplies both
  halves.

  **Depth is deliberately not named by the rank it ends at**, which was the
  obvious idea and is measurably useless on this data: all 49 groups bottom out
  at Species, so "down to species" prints the same phrase on every row on the
  page. Measure the distribution before choosing a label.

  Rank comes only from an explicit prefix in `latin`. Inferring "two words,
  capital then lower, so it is a binomial" is wrong here and quietly so —
  `invertebrates` carries "Multiple phyla" and `gymnosperms` carries "Various
  families", and both would have been labelled Species on a page whose subject
  is that they are not.

  Russian needs three plural forms, so the Slavic rule is written out in
  `plural()` rather than sampled from the numbers that happen to occur today.
- **The map's furniture is hidden here, and hiding it has a cost.** The era
  slider filters the canvas and does nothing to a card grid, so `#timeline`
  joins the zoom controls and the reveal panel in being hidden — it was also
  painting over the path dots, which is what made this urgent. But a hidden
  strip cannot measure itself (constraint 11), and a language switch, a theme
  toggle or a plain first visit all rebuild it while it is hidden. That is why
  `setShellView` rebuilds the era segments and the density curve on the way
  back into the map. Hide any other self-measuring component here and it needs
  the same treatment.

### Orbit — the third view

Pick a creature and it sits at the top; every other creature is laid out below
it by how long ago the two of you last shared an ancestor. Press any bubble and
it becomes the centre; press the centre and its species panel opens. It starts
on the person (`h_sapiens`) and has no wrong tap. It was sketched three ways
(Orbit, Dive, Time — `claude/explore-play`, `mockups/play/`) and this was the
one picked. Reached from the rail's *Orbit* button or `?view=orbit[&node=…]`.

Things worth knowing before changing it:

- **It is `body[data-view="orbit"]`, a peer of `explore` and `map`.** The CSS
  hides the other two wholesale, as Explore does for the map's furniture, and
  `setShellView` repaints it on the way in because a hidden view has no box to
  measure (constraint 11). `js/wayfinder.js` knows three shells now: Back walks
  the way the reader came (the trail), then up the tree; Home returns to the
  person; Share carries `view=orbit&node=<focus>`.
- **`layoutOrbit()` is pure and is the thing worth testing.** Rings are the
  ancestors from the focus to the root, nearest first; a ring's bubbles are
  that ancestor's *other* children. Placement is a search, not a force — each
  bubble takes the first free spot along its ring, then a little in or out,
  then further out — so nothing oscillates and nothing lands on anything else.
- **The "+N" bubble is placed first.** Placed last it found its ring full (the
  shown bubbles drift to the first free spot, and the slot kept for it was one
  of them), and every relative behind it was then unreachable. 385 rings did
  this on a desktop, 562 on a phone. `orbit:every-focus-fits-and-accounts-for-everyone`
  runs `layoutOrbit` with each of the tree's 410 nodes at the centre and fails
  when a relative is neither drawn nor counted in a "+N" that is itself drawn.
  A deep lineage (a hominin is nine rings down) gets only as many rings as the
  window's height holds; the rest merge into the last ring.
- **The person is found at paint time, not in `initOrbit()`.** The hominin
  nodes are grafted into the tree after start-up and `homo-sapiens` becomes
  `h_sapiens`; a lookup made too early quietly fell back to LUCA. Parents are
  worked out on every paint for the same reason (`_parent` is set by
  `preprocess`, which has not always run).
- **Bubbles are anchored at the physical left, always.** The layout engine
  already mirrors the fan in Hebrew and its x is a physical offset; anchoring
  at `right:0` in RTL pushed everything off-screen. The chrome uses logical
  offsets.
- **Time on a chip is written in the reader's language.** "541 Ma" is a Latin
  run in an RTL paragraph; Hebrew reads `541 מל"ש`, `2.1 מיליארד`, Russian
  `541 млн`, `2.1 млрд` (`chipAge`). Species names stay English (data) and
  carry `data-i18n-exempt`; ranked groups take `displayName`.
- **No emoji, anywhere in it.** A bubble is the silhouette, else the kind's line
  icon, with the photograph fading in over it when it has decoded.
- **Levels are navigable four ways, and they are different things.** The *lineage
  strip* along the top is the path from the origin of life to the centre, one chip
  per ancestor, one tap to any of them (it scrolls to keep the centre in view; the
  current chip is not a button). *Up* is the first control in it and is always the
  parent. *Back* (the trail beside Surprise me, and the wayfinder) is history: where
  you came from, which after a jump is not the parent. *Ring labels* sit on each
  ring's arc — "Primates · 85 Ma" — and centre on that ancestor.
- **A label never costs a relative its place.** Labels are placed after every
  bubble in the ring, in whatever is left; a ring with no room goes unlabelled
  (`orbit:rings-are-labelled-and-tappable` allows 35%). Placed first they took the
  room the "+N" bubble needed and 230 rings on a phone left relatives unreachable.
- **A press travels.** The pressed bubble keeps its element and grows into the
  centre (the face's size and the button's width transition, not just its
  position); going up, the old centre glides out as a child. `layoutOrbit` takes
  the centre just left as `prefer` and keeps it among the children even when it
  would be behind "+N" — a leaf in a big group, otherwise, vanished at the moment
  it was the answer to "where was I?". Reduced motion has no transitions at all
  (`transition: none`; a 1ms one was not finished on a busy runner).
- **Orbit is the front door.** A visitor with no stored `tol-shell-view` lands in
  it, the rail lists it first, and `<body data-view="orbit">` is in the markup so
  the first frame is the right view. A stored choice of Explore or the map is
  honoured; `?view=` still wins for a visit and is not written back.
  `orbit:the-front-door-is-orbit-and-choices-are-kept` loads a first visit, a
  stored Explore and a stored map and asserts all three.
- **Swipe, keys, and a hint.** Swipe up is Up (dragging a page up brings the next
  ring to the top), swipe down is Back. A drag must be ≥64px, mostly vertical and
  start anywhere but the strip, the action row and the ring labels; a drag that
  counts swallows the click right behind it (80ms) so a swipe that began on a
  bubble never also presses it, and the picture follows the finger a little and
  eases back. Keys: ↑ up, ↓ back, ← → the neighbours (the parent's other
  children, wrapping; mirrored in Hebrew), Home the start — and nothing while
  typing, with a panel or game open, or in a tour. A first visit sees one hint for
  seven seconds (`tol-orbit-hint`), in the reader's language, with
  `pointer-events: none` so it cannot sit over a tap.
- **The phone probe sends a finger, not a mouse.** A held mouse button in a
  mobile-emulated page took this sandbox's Chromium down entirely — page, context
  and browser — and the run then hung rather than failed. It reproduced on the
  code from before the gestures, so it is the emulation and not the handler; a
  finger (`Input.dispatchTouchEvent`) is what a phone has anyway. If a phone
  probe hangs with "unsettled top-level await", suspect the browser dying and
  trace the phases with `SMOKE_TRACE=1`.
- **A move says why.** After every press, Up, Back or jump, a line stands in the
  legend's place for nine seconds: "Homo sapiens · Homo habilis: last shared
  ancestor 2.4 Ma ago (Genus Homo)" — the last ancestor the old and new centres
  share (`whyOf`), dated with `chipAge`. When one is inside the other there is no
  meeting, so it says containment instead. Names are `<bdi data-i18n-exempt>`
  data; the words come from `orbit_why` / `orbit_why_in`, one template per
  language with no inflection of the names (Hebrew and Russian wording
  unreviewed). It is `pointer-events: none` and hides the legend while up, so it
  never covers a tap; it replaces the one-time hint if both would show.
  `orbit:a-move-says-why-they-are-where-they-are` (mutation-tested).
- **Compare pins one creature, and says so in the strip.** The *Compare* pill at the
  end of the lineage strip pins the current centre (`_pin`). While pinned, the
  strip's breadcrumb path is replaced by a two-line `.orb-cmp-line` about the pinned
  creature and the centre ("A · B: last shared ancestor 7 Ma ago (Hominini)", or
  containment; `cmpLine`), and the pill reads *Stop* (`aria-pressed`). Pressing the
  pinned creature itself says "Comparing with X — press any creature". It sat in
  the legend's slot at the foot first, and a tester on an iPhone home-screen app saw
  the pill turn and no line at all — the bottom edge there is under the home
  indicator — so the answer now sits beside the button that asks for it. The cost:
  crumbs are hidden while comparing (Up and ring labels still navigate). Strings
  are shortened to fit two lines at 360px (the Russian drops "последний… жил"); at
  320px it clamps. The pin survives moves, Home, a language switch and a reload (its id is kept in `tol-orbit-pin`; an id no longer in the tree is dropped).
  `orbit:compare-pins-one-creature-and-keeps-saying-how-it-relates` checks the line
  is wholly on screen and not cut off (mutation-tested).
- **One row at the foot.** The way back, *Surprise me*, and Home share one row
  that the layout reserves; on a phone Home is an icon and only the newest
  trail entry shows. The legend sits under it and `orbit:nothing-overlaps-on-the-page`
  fails when it is under a pill (mutation-tested).

Checks: `node scripts/smoke.mjs --orbit-only --only desktop-en,phone-he` runs
just the `orbit:` group (plus `i18n:orbit-translated`, `a11y:orbit-text-contrast`),
about a minute a scenario. It reads the layout for every node, then paints
eight foci for real and measures them, then plays a press, Back, Home, the
centre opening the panel, a trip out to Explore and back, a language switch and
a shared link. The probe runs under reduced motion so positions are read after
the transition has landed (constraint 13).

### Getting out, and sharing

`js/wayfinder.js` owns three controls in one fixed cluster (`#nav-ctrl`): Back,
Home and Share. They work in both shells, on both viewports and over every
overlay.

They did not before. The cluster existed and was translated, and it sat at
`--z-nav + 50` — under the detail panel (400), the games (1000), the hominin
overlay (1100) and a guided tour (10000) — so it was painted over by every
single thing a reader can open. Below 769px it was `display:none` outright. Its
geometry was described in three stylesheets with three different anchors and an
RTL `transform` hack, and it only appeared when the *map's* `navStack` was
non-empty, which the drill-down never touches.

Things worth knowing before changing it:

- **Back takes off one layer, not all of them.** `LAYERS` in `wayfinder.js` is
  ordered topmost-first: tour, tour picker, keyboard help, profile, games,
  species compare, hominin compare *mode*, hominin overlay, the sapiens
  overlay, the detail panel. Only when none is open does back belong to the
  shell — one fold up the drill-down, one step back on the map. A reader who
  opened a tour on top of a species panel expects one Back to take the tour
  away and leave the panel standing, which is also what
  `nav:back-unwinds-one-layer` asserts.
- **Escape and the Back button share that list.** Escape used to carry its own
  copy of "which overlay closes first", so the two could — and did — disagree.
  `app.js` keeps only what the wayfinder does not own: playback mode, the fact
  toast and the search dropdown.
- **Back is never disabled**, and that is a design decision rather than an
  omission. A disabled state has to be refreshed from every module that opens
  or closes anything — nine of them here — and any one that forgets leaves a
  live control greyed out or a dead one lit. `updateNavButtons()` is now an
  empty hook for exactly this reason. At the root, Back falls through to Home,
  which always does something coherent.
- **It is above everything, so everything is beneath it.** `--z-wayfinder` is
  10050 and `--z-splash` was raised to 10500 to stay over it. The cost is that
  the cluster can no longer be *covered* — it can only cover. Its placement was
  chosen by measuring, and four plausible corners were wrong:

  | Corner | What is actually there |
  |---|---|
  | top inline-start | the site title, which `elementFromPoint` sees straight through — the header has no pointer events |
  | mid-row inline-start | the search field, which grows to 280px on a desktop and full width on a phone |
  | inline-start below the header | the left rail, which follows the *start* edge into Hebrew |
  | top inline-end | the detail panel's ✕ — measured at [1398,58]–[1430,90] against a cluster at [1332,56]–[1428,92] |

  That last one was not cosmetic: outranking the panel made the drawer
  impossible to close, on an English desktop only — Hebrew opens it on the
  other edge and a phone opens it as a bottom sheet. It surfaced as a click
  timeout in `interact:expand-all-refits`, three checks away and naming nothing.
  Desktop now uses the gutter below the rail and above the era strip; a phone
  has no gutter, so it uses the corner under the theme cluster and stands aside
  while the search field is expanded.
- **The share link carries the shell and the language, not only the node.**
  Both come from `localStorage` otherwise, so a link naming just the node opened
  in whatever the *recipient* last used. `?node=&view=&lang=` is honoured for
  that visit and never written back — reading someone else's link is not the
  same as changing your own mind, which is why `setShellView()` takes
  `{ persist }` and `init()` validates `?lang=` against `TRANSLATIONS` rather
  than a hardcoded list.
- **The address bar is not the share link.** `showMainPanel` still writes a bare
  `?node=` through `history.replaceState` and `closePanel` still wipes it, so
  after following a shared link the visible URL loses `view` and `lang`. The
  Share button always rebuilds a complete one. Unifying the two means deciding
  what the URL means when no panel is open, which this change did not settle.

### The opening screen

The opening is an **Astrolabe**: an engraved dial where distance from the
centre is time. A point of light at the centre is LUCA, 3.8 billion years ago;
the site's own `TREE` grows outward from it generation by generation; every
lineage still alive runs out to the rim and lights up, clockwise; a ring of
"now" leaves the centre; and a plaque unfolds beneath the dial carrying the
title. It runs **4.5 seconds** the first time and about **2.6** once a visitor
has seen it, and can be skipped from the first frame.

Four directions were built as live scenes before this one was chosen — Division
(cell division drawn as a tree), the Astrolabe, Stickers (a specimen sheet) and
Descent (a dive through strata). They are still in `mockups/opening/`, which is
a gallery and no part of the site: `mockups/opening/index.html?scene=astrolabe&lang=he&theme=light`,
and `&still=1&t=3.2` for one frame. Only the Astrolabe was tuned for production
— speed, three languages, both themes, phone and desktop. The other three are
sketches: they draw, but nobody has fitted their words or measured their cost.

Four files, in the order they matter:

| File | Owns |
|---|---|
| `js/boot.js` | Theme, language, direction and "have they been here before", decided before the first paint |
| `css/splash.css` | The first paint (a ring and a point that need no script), the words, the plaque, reduced motion |
| `js/splashScene.js` | The picture: `geometry(W, H)` and `buildScene()` — the dial, the tree, the rim, the ring of now |
| `js/splash.js` | The lifecycle: laying canvases and words out, the clock, the frame-rate watch, leaving |

Things worth knowing before changing it:

- **Every scene is a pure function of time.** `scene.draw(ctx, dpr, t)` draws
  frame `t` from `t` and from what was built at construction, nothing carried
  between frames. That is what lets the gallery scrub, screenshots land on
  exact times, and reduced motion paint the finished frame by asking for
  `DURATION`. A scene that accumulated state would need another way of doing
  all three.
- **The radius is time, on a power scale, and the two microbial domains sit at
  the ends of the arc.** Linear time puts the last 700 million years in the
  outer 18% of the dial. The radius is `1 − (age / 3.8 Ga)^0.45`, which gives
  the last 100 Ma 19% of it; the rings are labelled 2.0, 1.0, 0.5 and 0.1 Ga
  down the empty wedge at the bottom. Order matters as much as scale: with the
  domains in the site's order the microbes took a lopsided quarter of the dial,
  so bacteria and archaea are placed at the two ends of the arc, where their
  long lines fall as roots either side of the scale.
- **Every word is HTML; the picture is canvas.** Text drawn on a canvas at
  reduced resolution is soft, has no bidi handling and cannot be translated
  without touching the art. The counter, the scale, the title, the line beneath
  it, the hint and Skip are DOM over the canvases, and the plaque's frame is an
  SVG inside a `clip-path` that opens from the middle. `fit()` sizes the title
  and the line to the plaque, so "Дерево жизни" and "עץ החיים" are laid out by
  measurement rather than by a font size per breakpoint. The readout counting
  down to the present sits in the gap between the dial and the plaque. It used
  to share the plaque's spot, and for half a second while the plaque opened its
  rules ran through the word "present"; `opening:nothing-collides` measures the
  readout against the plaque now.
- **Two canvases.** `#splash-under` holds what never moves (grain, dial, ticks)
  and is drawn once per layout; `#splash-canvas` is cropped to the dial and
  redrawn every frame at a device-pixel ratio capped at 2. In software raster
  the cost of a frame was dominated by large-area alpha blends, not by how many
  lines were drawn: a full-window vignette, big glows and soft bokeh accounted
  for nearly all of it, with `shadowBlur` and a DPR above 2 next. So the
  vignette is a CSS gradient, glows are pre-rendered sprites stamped where
  needed, strokes are batched by style, and nothing blurs live.
- **The first paint needs no script.** `.splash-pre` in `css/splash.css` is a
  ring, an inner ring, a scan arc and a point, placed with `calc()`, `min()`
  and `max()` arithmetic that mirrors `geometry()`. `js/splash.js` then
  overwrites `--cx`, `--cy` and `--Rc` with the exact numbers and the canvas
  fades in over it (`#splash.is-live`). Forty modules take long enough to load
  on a phone that the first second was otherwise a blank page. The two
  descriptions of the same geometry have to stay in step;
  `opening:first-paint-matches-the-canvas` fails when the ring would jump more
  than 1.5px at the hand-over.
- **`js/boot.js` decides theme, language and direction before the first
  paint.** It is a classic script in `<head>`, because a module cannot run
  before paint, and it only reads: `theme` and `tol-lang` (or `?lang=`) from
  `localStorage`, setting `data-theme`, `lang`, `dir` and the `color-scheme`
  meta, and `data-return` when `tol-splash-seen` is set. Without it a
  light-theme reader watched a dark screen turn cream, a Hebrew reader watched
  a left-to-right screen lay itself out again, and the browser's own canvas was
  white until the stylesheets arrived. It cannot import, so its language list
  and its right-to-left list are written by hand;
  `static/opening:boot-knows-every-language` fails when `TRANSLATIONS` or the
  rule in `js/theme.js` disagree with them. `js/app.js` validates everything
  again, so a wrong guess costs a flicker and never a wrong state.
  `manifest.json`'s `background_color` and `theme_color` are the same dark
  `#070C11` for the same reason.
- **The opening is an entrance, not a toll.** The encyclopedia is one click
  from the game now, and a visitor may go there and back several times. It
  plays once per visit, and not at all for a link that names a species or a
  view (`?node=`, `?view=`) — someone following a link wants what it points
  at. `js/boot.js` decides before first paint: it sets `data-no-opening` on
  `<html>` from the query, or from `tol-opening-played` in `sessionStorage`;
  `css/splash.css` then hides `#splash` outright (`display:none !important` —
  it is never dismissed, it never appears) and `js/app.js` starts nothing and
  follows it with nothing: no tree entrance and no tour prompt, because someone
  who came for a species did not come for either. `initSplash` sets the mark
  when it starts, so a reload in the same tab does not replay it; a second tab,
  or a new visit, does. With session storage blocked it plays every time, as it
  always did. `js/boot.js` is shared with the game for theme, language and
  direction and ignores the rest.
- **A returning visitor gets the same show, faster** — speed 1.7, so about 2.6
  seconds, and the safety-net dismissal comes sooner by the same factor. A
  shorter cut would have been a second animation to keep right in three
  languages and two themes.
- **The show follows the wall clock, and it watches its own frame rate.** After
  22 frames, if the average frame is over 38 ms, the live canvas drops to one
  device pixel per CSS pixel and the glows are left out; only that canvas is
  resized, because laying the whole scene out again mid-show cost a visible
  hitch. Time is `now − start − time spent hidden`, never a sum of capped steps.
  Capping each step is the obvious way to stop a backgrounded tab from jumping,
  and it turns a slow phone into slow motion: throttled to a sixth of this
  machine's speed, the title had not been engraved when the safety net took the
  opening down, so those visitors never saw it. Three more things had to be
  right, each found by taking the previous fix and simulating a worse phone:
  the clock is `performance.now()` read when the frame runs, because the
  timestamp `requestAnimationFrame` hands over is when the frame *began* and a
  long task in front of the first frame (the rest of `init()`, seconds on a slow
  phone) leaves it stale by that long, so the show would start already that far
  in and skip to its end; the safety net is armed by the first frame and not by
  the script, or that same task eats its time (a fifteen-second net covers a
  page whose frames never come); and the title may not arrive early either.
  `opening:a-slow-phone-still-gets-the-title` simulates the device in the page —
  a four-second stall after start-up, then a frame every 150 ms, by busy-waiting
  rather than throttling the CPU, so it means the same on any runner — and wants
  the title between 2.5 and 5 seconds after the first frame, and before the
  opening leaves.
- **`fit()` reads a size the instant it sets it, and a transition answers with
  the size it started from.** `responsive.css` gives every element a `0.01ms`
  transition on all properties under reduced motion. That is enough for the
  span inside the title to inherit a font size that is still in flight: every
  fit measured the starting size, ran to its floor, and the English line came
  out at 8.6px instead of 10 on a phone — for visitors who ask for reduced
  motion and no one else, which is the setting no one tests with. The spans now
  say `transition-property: none`, and constraint 13 is the general form.
- **A web font arriving fits the title again — and only the title.** Every
  width the title was fitted against changes when Inter replaces the fallback,
  and `loadingdone` re-runs `placeWords()`. It does not rebuild the scale
  labels, which depend on no font: a rebuilt label fades in from nothing, so a
  font that landed at 4 s used to blink the whole scale out of the finished
  picture (found in a screenshot where the labels were missing).
  `opening:a-late-font-does-not-blink-the-scale` sends the event by hand,
  because a real font's arrival cannot be timed.
- **Reduced motion paints the finished plate once** and leaves after 2.5
  seconds. The plate is what the animation is *for*, so it is the right still
  frame — it has the same picture and the same words as the full show, where
  the fallback that used to stand in for it had neither.
- **With no 2D canvas at all** the words stand on their own (`#splash-fallback`)
  and the same ways out work — click, Enter, Space, Escape, or four seconds.
- **The splash owns its background, and nothing else may set it.** `theme.css`
  carried `[data-theme="dark"] #splash{background:var(--bg)}` from the opening
  before. It outranks `#splash`, so in the dark theme it flattened the plate's
  glow and the vignette on every visit while the light theme kept them — and
  nothing failed, because nothing asserted a gradient. Removed;
  `opening:first-paint-shows-the-instrument` now asks for the gradient in
  whichever theme the scenario loads. Constraint 8's family: an override at a
  stronger level cannot be released at a weaker one.
- **A scene that throws cannot trap a visitor.** `js/app.js` wraps `initSplash`:
  on an error it takes the curtain down, carries on into the site, and throws
  the error again from a timer so it reaches the console and any error report
  instead of being swallowed. The opening is decoration; the site is the point.
- **Skip is a `<button>` pinned with logical offsets**, so it sits in the
  other corner in Hebrew, and it is named by its translated text. The
  `aria-label` it used to carry read "Skip intro" to a Hebrew screen reader.
- **Measurements are drawn `dir="ltr"` even in Hebrew.** `"720 Ma"` is a Latin
  run; laid out RTL it comes back as `"Ma 720"`, the same reordering the detail
  panel avoids on Latin names.
- **`init()` still restores theme and language before the splash starts.**
  `boot.js` does it for the stylesheet; `init()` does it for the state the
  splash reads at construction. When that ran afterwards, the opening was
  English furniture around a Hebrew title.

**Its checks.** The runner seeds `tol-splash-seen` and clicks Skip, so by the
time any sweep runs the opening is a `display:none` div; the `opening:` group
gives it five page loads of its own per scenario (six in two of them), each in
a fresh context in that scenario's viewport, language and theme.

| Pass | What it is | Checks |
|---|---|---|
| first paint | `js/app.js` aborted | `opening:first-paint-needs-no-script`, `opening:first-paint-shows-the-instrument` |
| the plate | reduced motion, which paints the finished frame at once | `opening:first-paint-matches-the-canvas`, `opening:words-are-in-the-readers-language`, `opening:title-fits-the-plaque`, `opening:nothing-collides`, `opening:canvas-draws`, `opening:reduced-motion-holds-still`, `opening:skip-sits-in-the-inline-end-corner` |
| live | a first visit, sampled while it runs, then left by keyboard | `opening:animates`, `opening:leaves-by-keyboard` |
| no canvas | `getContext` refused for the opening's own canvases | `opening:no-canvas-fallback` |
| broken | `js/splashScene.js` replaced by a module that throws while building | `opening:a-broken-opening-does-not-trap-the-visitor` |
| entrance | a link to a species, then two entrances to the encyclopedia in one tab (`desktop-en` and `phone-en` only, a few seconds each) | `opening:a-link-to-a-species-has-no-opening`, `opening:the-opening-plays-once-per-visit` |
| slow | a first visit on a simulated slow device: a four-second stall after start-up, then six frames a second (`desktop-en` and `phone-en` only, ~15 s each) | `opening:a-slow-phone-still-gets-the-title` |

`opening:runs-clean` reads the others for uncaught errors and CSP violations. The
plate is measured rather than the moving picture because the moving picture is
a function of time: a check that has to wait 3.15 seconds of animation to reach
the title is a check that flakes on a slow runner, and the plate is the same
layout. The canvas thresholds sit at a third to a half of what a healthy frame
measures on every viewport (tree 17–19% painted, dial 1.9–2.4%), so a slow
runner cannot trip them and a canvas that draws nothing, or draws in the wrong
place, always does.

### The name, asked for after a game

`js/profile.js` keeps the players on a device (`tol-players`, `tol-active-player`)
and the leaderboard. A name used to be asked for by a native `prompt()` five
seconds into a first visit — about half a second after the opening ended, before
the visitor had done anything to be named for, in a box that blocks the page,
cannot be styled and was English on every screen. It is now asked for once, on
the results of the first game that scored, by `offerNameAfterGame()`,
which every game's results screen calls (`game.js` for Quick, Classic, Survival
and Daily; `whoFirst.js`; `familyFoe.js`).

Things worth knowing before changing it:

- **The card can be ignored.** It sits above Play Again on the results screen
  and "Not now" removes it. Nothing waits on it, and closing the game is as good
  an answer as any.
- **Asked once, and only when there is a score to keep.** `tol-name-asked` is set
  when the card is *shown*, whatever the visitor does with it. A game that scored
  nothing does not use the ask up, and the Daily Challenge — which shows no
  points — never raises it. Nobody who already has a player is asked, and neither
  is anyone whose storage is blocked: an ask that cannot be remembered would be
  repeated after every game.
- **Points go to whoever is playing, asked or not.** `updatePlayerScore()` had
  no caller at all, so the leaderboard showed every player on 0 points for as
  long as it had existed. Each game's results now credit its score to the active
  player, and the game that raised the offer is credited once a name is kept.
  Each results function is guarded (`resultsShown`) against being run twice,
  because the second run would score the game again.
- **No Guest is made up.** `_migrateOldData()` used to turn anyone with a
  `tol-explored` record into a "Guest" on their next visit. Under the old prompt
  that only ever touched people from before profiles existed; with the name asked
  for after a game it would have made a Guest of every visitor who looked around
  first — the ordinary one — and settled the question of a name before it was
  asked. It is deleted; the panel already reads "Guest" for a header with no
  player behind it.
- **The field is 16px and the controls are 44px.** Under 16px iOS Safari zooms
  the page in when a text field takes focus, and this is the one field on the
  site that is asked for on phones far more than anywhere else.
  `.lb-add-player input` also removes the focus ring, so the offer puts it back.
- **Nothing on the site may raise a native dialog.** `dialogs:none-in-source`
  reads the source for `alert(`, `confirm(` and `prompt(`, and
  `load:no-native-dialogs` fails on any that opens during a run. Playwright
  dismisses a dialog in silence by default, which is how the old prompt made a
  Guest of every visitor in every smoke run without anyone seeing it; the
  runner now records each one.

Ten `profile:` checks cover it, and two more guard the dialog rule (see *The
name offer's checks* below). They play the games rather than reading the code,
and drive each one from the page's own answer key — the right or the wrong
answer is looked up, so a run means the same on every runner and a quiz that
scored nothing is never mistaken for a missing offer.

### Rendering

- **Library:** Pure vanilla JavaScript + SVG (no D3 layout algorithms)
- **Layout:** Custom `layout()` function computes `_x`, `_y` positions for each node
- **Zoom/Pan:** Manual transform `{x, y, s}` applied via `setAttribute('transform', ...)`
- **Node icons:** Photo thumbnails via `ImageLoader.getBestUrl(node,'thumb')`,
  emoji fallback

### The roster, and how it grows

The tree is curated, not exhaustive: it cannot show all of life, so it shows
what a visitor expects to find and what teaches the shape. Obscure microbes are
dropped before charismatic animals are.

- **Extinct life is in the tree.** `extinct` holds the Mya the lineage died out
  in (`archaeopteryx` and the hominin groups predate this and use `true`);
  `nodeInEra()` reads it as a number, the renderer as a flag, and
  `tests/tree.test.mjs` insists an extinct node says `iucn:'EX'` and did not die
  before it appeared. Non-avian dinosaurs are a group beside the birds under
  Reptiles rather than the parent of them: the group's own text says birds are
  dinosaurs, and nesting 29 birds one level deeper was not worth the layout cost.
- **A species is five edits** — its node in `treeExpansion.js`, a title in
  `WIKI_TITLES`, map regions in `GEO_DATA`, quick facts in `BRANCH_DATA`, and
  then the photograph and silhouette from `photo-refresh.yml` and
  `silhouettes.yml`. Both workflows open a pull request against whatever branch
  they were dispatched on, so run them on the feature branch and merge theirs
  into it. A new species is red in `tests/tree.test.mjs` ("has a photograph")
  until that has happened, deliberately.
- **Data can outlive its node.** Dozens of `GEO_DATA`, `BRANCH_DATA` and
  `PHOTO_MAP` entries exist for species that were never in the tree (hammerhead,
  piranha, tuna, lichen...). 17 were given nodes by reusing their ids; the
  remainder are still orphans and cost nothing.
- **Search names its obvious answer.** An entry in `SEARCH_ALIASES` may carry a
  `lead` pattern: among aliased matches the shortest name wins otherwise, which
  put Triceratops above the group it belongs to. Typing "cat" answers Domestic
  cat, not Lion.

### Node Data Shape (in `treeData.js`)

```js
{
  id:        string,       // unique, e.g. 'luca', 'bacteria', 'humans'
  icon:      string,       // emoji
  color:     string,       // hex color
  r:         number,       // circle radius (8–26)
  appeared:  number,       // million years ago (Mya)
  name:      string,       // display name
  latin:     string,       // scientific name
  era:       string,       // human-readable era string
  desc:      string,       // description
  detail:    string,       // deeper detail paragraph
  facts:     [{l, v}],     // label/value pairs
  tags:      string[],     // trait chips
  children:  Node[]        // nested children (undefined = leaf)
}
```

### Naming Conventions

- **Functions/variables:** camelCase
- **HTML IDs:** kebab-case (`#tree-container`, `#search-input`, `#panel`)
- **Data attributes:** `data-theme`, `data-tab`, `data-lang`

---

## Styling & Theming

### CSS Architecture

- CSS lives in 15 external files in the `css/` directory, loaded via `<link>` tags
- Organized by concern: variables, layout, tree, timeline, panel, hominin, features, theme, rtl, responsive
- **CSS custom properties** control all colors — defined in `:root` (dark default) and `[data-theme="light"]`
- `data-theme` attribute on `<html>` controls the active theme
- Theme preference persisted in `localStorage` key `theme`

### Key CSS Variables

```css
--bg            /* Main background */
--surface       /* Card/panel surfaces */
--text          /* Primary text */
--parchment     /* Secondary text */
--gold          /* Primary accent */
--font-head     /* 'Inter', 'Heebo' — headings */
--font-body     /* 'Inter', 'Heebo' — body text */
--font-sans     /* 'Inter' — UI elements */
```

### Fonts

- **Inter** — all UI text, headings, labels
- **JetBrains Mono** — data values, monospaced displays
- **Heebo** — Hebrew and Cyrillic text support

---

## Internationalization (i18n)

- Supported languages: **English** (`en`), **Hebrew** (`he`, RTL), **Russian** (`ru`)
- Translations live in `TRANSLATIONS` object in `js/uiData.js`
- `t(key)` returns translated string, falls back to English
- `applyI18n()` imperatively sets `textContent` on element IDs
- Language preference stored in `localStorage` key `tol-lang`
- Hebrew triggers `dir="rtl"` on `<html>`; CSS uses `[dir="rtl"]` selectors

### Adding Translations

1. Add the key to **all three** language objects in `TRANSLATIONS`
   (`js/uiData.js`). Non-ASCII is written as `\uXXXX` escapes to match the
   surrounding file.
2. Apply it — either give the element `data-i18n="some.key"` (dots become
   underscores, so that reads `some_key`), or set it explicitly by id in
   `applyI18n()` (`js/theme.js`).
3. Add the element to `I18N_BINDINGS` in `scripts/smoke.mjs` so the smoke
   suite fails if it ever stops being translated.

`t(key)` already falls back to English and then to the key itself, so a key written in
no language shows as its own name (an iPhone once drew `orbit_compare_stop` on a button).
`tests/translations.test.mjs` (`npm test`) reads the source for every `t('…')` and
`data-i18n` key and fails when one is missing from any language — including a key chosen
by `t(cond ? 'a' : 'b')`, but not one built from a template string.

### Adding a Language

`setLang()` currently treats Hebrew as the only RTL language. To add another
(Arabic, Farsi), generalise the check in `js/theme.js`:

```js
const RTL_LANGS = ['he', 'ar', 'fa'];
document.documentElement.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';
```

Then add the language object to `TRANSLATIONS` and a `.lang-btn` in
`atlas.html` (and a button in `js/kin/strings.js`, which lists its own).

### What is *not* translated

**Major taxonomic groups and eras are translated; individual species are not.** (`js/eraNames.js` translates the era line on Explore rows; `tests/era.test.mjs` fails when a node carries an era it cannot translate.)

`js/taxonNames.js` holds Hebrew and Russian names for the 50 ranked groups —
domains, kingdoms, phyla, classes, orders and the like. `displayName(node)` in
`js/utils.js` resolves a node's name for the active language and falls back to
English, so adding a group node never breaks a language. It is used for tree
labels, tooltips and the detail panel.

The boundary is the `latin` field: ranked groups carry a rank prefix
(`Class Mammalia`), species carry a binomial (`Panthera leo`). Species
descriptions and facts stay English too — a half-translated tree reads worse
than a consistently English one.

### One icon per control

A control wears one icon or none, and `i18n:one-icon-per-control` measures the
**assembled** label to say so. The markup and the translation are two places to
write a glyph and neither can see the other, so the Compare pill carried a
microscope in `atlas.html` while `compare_btn` opened with a scale, and every
visitor in every language read "🔬 ⚖ Compare Mode". Nothing failed:
`i18n:controls-translated` compares the bound element against its translation
and the two matched exactly, which is all it was ever asking. Put a glyph in
one place — the markup, by preference, since it is the same in all three
languages — and read the rendered result to check.

`i18n:taxon-labels-translated` in the smoke suite fails if a group node renders
its English name in Hebrew or Russian. Elements that legitimately show English
data — the species-of-the-day badge — carry `data-i18n-exempt` so the leak
check skips them rather than being weakened.

### Explore's own checks, and why they are duplicates

The map-view sweeps cannot see the drill-down. The smoke runner seeds
`tol-shell-view=map` before it measures — it has to, because the tree geometry
has to be measured against the tree — so for a while the view a visitor
actually lands on had no language coverage at all, and the suite reported
green over untranslated English and an English paragraph laid out
right-to-left.

**The same blind spot cost the contrast sweep, and it was hiding a real
failure.** `a11y:text-contrast` walked the whole body, but it walked it in map
view, so the drill-down's colours had never been measured. They were not fine:
in the light theme the accent gold sat at 4.40 against text's 4.5 on the back
button and the path label — the two controls that say how to leave and where
you are. Legible enough to pass a glance, and not enough to pass a
measurement. `--accent` was darkened to `#8a5e23`, which is the same fix
`--text-secondary` had already had for the same reason.

Twelve checks now cover the drill-down, from the probe that already walks it:

| Check | Fails when |
|---|---|
| `i18n:explore-no-latin-leak` | a Hebrew screen shows Latin-script chrome |
| `i18n:explore-prose-reads-as-english` | English data is laid out RTL |
| `i18n:explore-taxa-translated` | a card names a ranked group in English |
| `a11y:explore-text-contrast` | drill-down text falls below AA on any screen |
| `explore:controls-are-not-covered` | something is painted over a card or a control |
| `explore:view-switch-closes-the-panel` | the species panel survives the shell switch |
| `explore:descending-unfolds-in-place` | a descent discards the chain above it |
| `explore:deep-landing-is-visible` | arriving from search parks the node behind the ribbon |
| `explore:rows-state-breadth-and-depth` | a group row understates its width or its depth |
| `explore:a-broken-photo-still-shows-something` | a row whose photograph fails is left an empty hole |
| `explore:depth-is-drawn` | a level of the lineage is not inset past its parent |
| `explore:rows-are-joined-to-their-parent` | a row is drawn hanging unattached |

`explore:depth-is-drawn` measures the **inline** start, not the left edge. The
tree grows from the right in Hebrew, where a left-edge measurement reads a
correct staircase as one running the wrong way — and would have read the
genuinely broken flat one as fine. `explore:rows-are-joined-to-their-parent`
reads the limb's own **border width**, because a pseudo-element with no border
still reports a box: a size-only assertion passes at full marks while the tree
draws nothing at all, which is exactly what the mutation test showed.

`explore:a-broken-photo-still-shows-something` **breaks an image rather than
looking for a broken one**, and that is the only form of it that means the same
thing everywhere. The sandbox cannot reach Wikimedia at all, so "every row
shows a picture" is red there for a reason that is not a defect; CI can reach
it, so "no row failed" is green there for a reason that is not a fix. Pointing
one row at a file that does not exist fails identically in both. The 404 it
asks for is named as a single literal in the runner so
`load:no-failed-requests` can skip that one URL and nothing else.

`explore:rows-state-breadth-and-depth` compares each row against the tree
rather than against a pattern — the row has to state the real child count and
the real number of levels below it. A regex for "a number and a word" passes
just as happily on the wrong number.

### The wayfinder's checks

Four more, run from the map pass with a species panel already open, because
"reachable" is the claim and an empty page is the one state in which it was
never in doubt:

| Check | Fails when |
|---|---|
| `chrome:wayfinder-is-reachable` | a Back, Home or Share button is covered — tested with a panel open, and again with a game on top of it |
| `chrome:wayfinder-clears-the-chrome` | the cluster is painted over the title, the rail, the era strip, the panel's ✕, the reveal panel or the zoom rail |
| `nav:back-unwinds-one-layer` | Back closes the game *and* the panel underneath, or neither |
| `share:link-names-node-view-and-language` | the share link omits the shell or the language, or the button produces no toast |
| `share:link-restores-the-senders-view` | following `?node=&view=&lang=` opens in the recipient's shell or language, or rewrites their stored preference |

`chrome:wayfinder-clears-the-chrome` compares *boxes*, not hit tests, and has
to: the header has no pointer events, so `elementFromPoint` reports the canvas
straight through the site title and would have called the original placement
clear while it sat squarely on the words. It found a real bug on its first run
that had nothing to do with the wayfinder — `#left-rail-toggle` pinned a
physical `left`, so on a Hebrew phone the ☰ sat on the opposite edge from the
rail it opens (constraint 8).

`share:link-restores-the-senders-view` needs its own page load, so it is the
last thing `probePage()` does. The runner seeds the *opposite* of what the link
asks for — the map, in the scenario's own language — because a page that
ignored the query string would otherwise look exactly like every other scenario
and pass by accident.

The contrast arithmetic itself is written once, not twice.
`installContrastSweep()` puts it on the page as `window.__contrastSweep(root)`
and both passes call it — the map's over `document.body`, Explore's over
`#explore`. A second copy would be a second set of thresholds to drift out of
step with the first, and then the two views would be held to quietly different
standards. Explore's pass is scoped to its own subtree rather than the body
because the shared chrome above it is already covered by the map pass;
measuring it twice only reports the same failure twice.

**`data-i18n-exempt` is the hinge, and it cannot be used to buy silence.**
An element without it must be translated; an element with it has declared
itself English data, which enrols it in the direction rule instead. So
exempting something moves it from one check to the other rather than out of
both.

Names take `dir="auto"` rather than `dir="ltr"`, because the same element
holds a Hebrew group name on one screen and a Latin binomial on the next —
`auto` resolves the direction from the content, which is measurably `rtl`
for `חיידקים` and `ltr` for `Panthera leo`. Prose that is English by policy
(`.ex-desc`, `.ex-latin`) takes `dir="ltr"` outright.

### The name offer's checks

The offer is measured from `nameProbe()`, which plays games in contexts of its
own — a name is asked for on a first visit, so a fresh one is the state under
test — and runs in every scenario, in that scenario's language, viewport and
theme. Desktop-English and phone-Hebrew also carry the rest of the story, and
phone-English adds Russian: the longest text in the narrowest window, and the
one combination the matrix does not load.

| Check | Fails when |
|---|---|
| `load:no-native-dialogs` | an alert, confirm or prompt opens on the page — at load, five seconds in, or after a game |
| `dialogs:none-in-source` | *(static)* a file in `js/` calls `alert(`, `confirm(` or `prompt(` |
| `i18n:name-offer-in-every-language` | *(static)* a language lacks one of the six strings, has the English text, or loses `{name}` or `{pts}` |
| `profile:a-first-visit-is-not-interrupted` | seven quiet seconds bring a dialog, an offer, a player or a record of having asked |
| `profile:looking-around-does-not-make-a-guest` | a visitor with `tol-explored` and no player is made one on arrival |
| `profile:the-name-is-asked-after-a-game-that-scored` | a game that scored nothing, or the Daily Challenge, asks or uses up the ask; or the first game that scores (Who Appeared First? for a visitor, a Quick Quiz for a returning explorer) carries no card |
| `profile:the-offer-speaks-the-readers-language` | any of its five strings differs from the translation, or the field or the card has no accessible name |
| `profile:the-offer-fits-and-is-reachable` | the card runs off the screen or reads the wrong way; a control leaves it, is under 40px tall or is under something else; the field is under 16px; Save wraps away from the field; the page scrolls sideways |
| `profile:the-offer-is-legible` | any of its text is below AA contrast in the scenario's theme |
| `profile:keeping-the-name-keeps-the-score` | Save (Enter on a desktop, a tap on a phone) stores another name, makes someone else active, credits other than the score shown, or confirms in the wrong words |
| `profile:a-declined-offer-is-not-repeated` | "Not now" leaves the card, makes a player, is forgotten, or is followed by another ask |
| `profile:a-named-player-earns-points-without-being-asked-again` | a game after the name is kept does not add its score, or asks again |
| `profile:a-game-is-scored-once` | a game whose results are reached twice is credited twice |

Things worth knowing:

- **The games are driven from the page's own data, not played.** The right or
  the wrong answer to a quiz question is looked up in `TRIVIA_QUESTIONS`, and the
  older of two species in Who Appeared First? in the tree, so a run scores the
  same on every runner. Picking at random left a one-in-a-thousand run that
  scored nothing and looked exactly like a missing offer.
- **A pass keeps what it measured up to the step that failed.** The first version
  threw its measurements away at the first error, so a missing offer became a
  30-second `fill` timeout in six checks at once. Each check now reads only what
  it needs, and one that needs a step the pass never reached says where it
  stopped and why. Finding this took the mutations: catching every one was not
  enough, the message had to name the right thing
  (`node scripts/mutate-checks.mjs --group profile`, 23 of them).
- **The Daily Challenge is played to prove it does not ask.** It scores inside
  but shows no points, and it has Close where every other game has Play Again, so
  the probe closes and reopens Games as a player would. The first version pressed
  Play Again and timed out on a button that does not exist.
- **A saved name is checked by what is stored**, not by what is drawn: the
  stored player, the active player, and the points against the score the results
  screen showed. A card that says "Saved" over an empty `tol-players` is the
  failure this exists for.
- **`SMOKE_DUMP_NAME=1`** prints everything the probe measured, one JSON line
  per scenario.

---

## Images & Attribution

Two layers. The tree draws a **PhyloPic silhouette** on each disc — pure shape,
which is the only thing that reads at 40px — and the panel shows a **Wikimedia
Commons photograph** at 1280px, where it can actually be seen.

`assets/species/` used to hold ten "commissioned illustrations" above both.
They were AI-generated marketing-page mockups — LUCA's was a web page for
"ancientoceans.org", complete with a body-copy column; vertebrates' had a LEARN
MORE button — and being first in the chain they beat the silhouettes and the
real photographs for the ten most prominent nodes on screen. Deleted.

`ImageLoader.getBestUrl(node, size)` is the single resolver. Its chain, best
first:

1. `PHOTO_SNAPSHOT` (`js/photoSnapshot.js`) — Wikipedia's current lead image
2. `PHOTO_MAP` (`js/speciesData.js`) — hand-pinned Commons URLs
3. `node.img`
4. the node's emoji

Silhouettes are resolved separately, by `js/silhouettes.js` — see
*Silhouettes* below.

**`size` is not optional in spirit.** Pass `'thumb'` (400px) for tree discs and
`'hero'` (1280px) for the panel. `PHOTO_MAP` served one 960px file to both,
so every 40px node icon downloaded roughly thirty times the pixels it could
display.

### Why there is a snapshot

Hand-pinned Commons URLs are file paths, and they die when a file is renamed,
re-uploaded or deleted. The old `photo-check.yml` could only *report* that rot;
someone then had to find a replacement by hand, and nobody did.

`scripts/build-photo-snapshot.mjs` resolves every `WIKI_TITLES` entry through
the Wikipedia REST summary endpoint, which always returns whatever image the
article carries today, and writes `js/photoSnapshot.js`.
`.github/workflows/photo-refresh.yml` runs it weekly and opens a PR when
anything moved — so a dead photo repairs itself.

The browser never calls that API. It loads the committed snapshot, which is why
a Wikipedia outage cannot take the pictures down.

```bash
node scripts/build-photo-snapshot.mjs             # rebuild from Wikipedia
node scripts/build-photo-snapshot.mjs --bootstrap # offline: re-cut PHOTO_MAP
node scripts/build-photo-snapshot.mjs --check     # exit 1 if stale
node scripts/build-photo-snapshot.mjs --credits-only  # re-read authors and licences only
```

`--bootstrap` needs no network; it re-cuts the URLs already in `PHOTO_MAP` to
the two sizes. Use it when working offline.

`assets/placeholder.svg` is the fallback when nothing resolves.

### Credits

Commons photographs are mostly CC BY-SA and PhyloPic silhouettes mostly CC0 or
CC BY; both licences ask for the author, the licence and a link wherever the
work is shown. So:

- **The snapshot records who took each photo.** The builder reads each file's
  Artist and LicenseShortName from Commons and commits them with the file
  page (`by`, `lic`, `page` in `photoSnapshot.js`). `--credits-only` re-reads
  them without changing any photo. The panel's hero and the Explore reveal
  both show `📷 author · licence`, linked to the file page, through
  `ImageLoader.creditLine()`; the panel hides the line when its photo fails to
  load, rather than crediting a picture nobody sees. It used to say "Wikipedia
  / Wikimedia Commons" for all 386 photos, which names neither.
- **The Wikipedia API now answers on `thumb.wikimedia.org`**, which the CSP
  does not allow. It serves the same files at the same paths as
  `upload.wikimedia.org`, so the builder rewrites the host and refuses to write
  any other; without that, the next weekly refresh would have blanked every
  photo.
- **Non-commercial silhouettes are refused at build time.** Seventeen CC BY-NC
  images had arrived as some taxon's featured PhyloPic image; the builder now
  takes another image of the same taxon, then of the genus, and never of a
  larger clade — on PhyloPic's tree the Asgard archaea contain every
  eukaryote, so "any image in the clade" can be a mushroom.
- **PhyloPic is matched by exact name.** Its name search returns every node a
  name touches, and taking the first drew the snow leopard with the tiger's
  subgenus image and the Japanese macaque as a fish (*Haemulon sciurus* comes
  first for "macaca"). A single result is accepted as a synonym (Cyanobacteria
  is Cyanobacteriota there); several with no exact name are refused.
  `SEARCH_AS` and `EXTRA_NAMES` in the builder name a group by hand where the
  taxon's own name is too broad or missing, and `--only a,b` rebuilds just
  those taxa and keeps every other silhouette.
- **`credits.html` lists all of it** — every photo, every silhouette, every
  source Kin cites for a date — built at load time from the same modules the
  site draws from, so a new photo or silhouette is credited with no further
  step. The Atlas links it from the rail's foot, Kin from its footer.

---

## Known Constraints & Important Notes

1. **Tests are browser smoke checks, not unit tests** — `node scripts/smoke.mjs`
   opens the real page in Chromium and asserts 598 things about layout, i18n,
   contrast and rendering. See *Smoke tests* below.
2. **No linter/formatter config** — maintain consistent 2-space indentation.
3. **atlas.html** is pure HTML markup (~462 lines). CSS is in `css/`, JS is in `js/`.
4. **ES modules everywhere** — all data and application files use `export`/`import`. No global `<script>` tags.
5. **No D3** — `atlas.html` has exactly one script tag (`js/app.js`); the
   renderer is hand-written SVG.
6. **CORS** — all APIs permit browser-side calls. Do not add a server proxy unless needed.
7. **Label geometry lives in one place.** `js/labelMetrics.js` decides how big a
   label is, where it sits and how much room a node needs. The renderer draws
   from it and the camera frames from it; when those two estimated separately
   they disagreed, and names were clipped against the edges of the screen.
   Label *sizes* must be set as inline styles, not `font-size` attributes — a
   stylesheet declaration outranks a presentation attribute, which is how every
   label in the tree ended up rendering at the same 10px.
8. **Physical offsets need logical properties.** A floating control that pins
   `left` or `right` with `!important` cannot be released by an RTL override,
   and an element pinned at both edges with no width stretches across the whole
   window as an invisible sheet over the map. Use `inset-inline-start/end`.
   `chrome:no-stretched-overlay` fails on the structural signature.
9. **No inline event handlers — they will not run.** `script-src 'self'`
   forbids them, so an `onclick="…"` added to markup or to a template string
   is a control that does nothing, with no error to notice. Use
   `data-action` + `registerActions()` (see *Actions*), and `data-on-error`
   for image fallbacks. Two static checks fail the build on a relapse.
10. **A class cannot close what an inline style opened.** If visibility is
    toggled by a class — `#search-results{display:none}` plus
    `.show{display:block}` — then setting `el.style.display='block'` anywhere
    in JS wins permanently, and the handler that removes the class can no
    longer hide the element. The search dropdown was stuck open over every
    view for the rest of the session after a visitor typed a query and deleted
    it. Toggle the class and nothing else. Same family as constraint 8: an
    override applied at a stronger level cannot be released at a weaker one.
11. **A hidden element cannot measure itself, and will not notice it failed.**
    Anything that sizes itself from a box — trimming labels to their column,
    sizing a canvas to its rect — is written to bail when the box is zero,
    which is correct and silent. So hiding a component means every rebuild it
    receives while hidden is quietly skipped, and it is revealed still carrying
    whatever it last computed. Hiding `#timeline` in Explore did this twice
    over: era names came back sliced mid-word (`ARBONIFEROL`) and the density
    curve came back drawn in the previous theme's ink, because `applyI18n()`
    and `applyTheme()` rebuild both, and start-up builds them *after*
    `setShellView()` has already hidden the strip. Rebuild on reveal —
    `setShellView` does, on the way into the map.
12. **Being in the DOM is not being on screen.** Checks that read
    `textContent`, `aria-label` or `getBoundingClientRect` cannot see that
    something else is painted on top. The drill-down's path dots sat under the
    timeline on both viewports from the day they were written while
    `explore:says-where-you-are` passed, and before that the left rail hid the
    LUCA title on every desktop visit under 312 green checks. Ask
    `document.elementFromPoint` what is actually there —
    `explore:controls-are-not-covered` does.
13. **A transition answers every same-task read with the value it started
    from.** Set a size, read the layout, and while a transition on that
    property is running you get the old size back. `responsive.css` gives
    *every* element a `0.01ms` transition on all properties under
    `prefers-reduced-motion`, so anything that sets a style and measures in the
    same task — fitting a title, trimming labels to a column, centring — reads
    stale values for reduced-motion visitors and for nobody else. Every check
    that runs in the default mode passes. The opening's title fitting ran to
    its floor this way and left the English line at 8.6px on a phone;
    `transition-property: none` on whatever is measured fixes it, and
    `opening:title-fits-the-plaque` measures under reduced motion so it stays
    fixed.

---

## Development Workflow

### Making Changes

1. Edit files directly — no build step required
2. Test in browser at `http://localhost:5555` (run `node serve.js`)
3. Edit CSS in the appropriate file under `css/` (organized by concern)
4. Run `npm run smoke` and look at the screenshots in `.smoke-out/`
5. Verify all three languages if touching UI text. **Note:** there is no
   `?lang=` URL parameter — the language is read from the `tol-lang`
   localStorage key at startup. Switch with the language buttons, or seed
   `localStorage.setItem('tol-lang','he')` before load (which is what the
   smoke runner does).

### Adding a New Data Module

1. Create `js/newmodule.js` with `export const` declarations
2. Import it in consuming ES modules (e.g., `import { FOO } from './newmodule.js'`)
3. If widely shared (4+ consumers), add a re-export to `js/data.js`

### Deployment

**Vercel** (`sinapsa/tree-of-life`) deploys every push and pull request through
the GitHub integration. There is no deploy workflow in this repo — Vercel runs
its own build.

Addresses, all serving the same site:

| URL | Role |
|---|---|
| `https://www.treeoflife.wiki/` | Production. Canonical, and what `og:url` points at. |
| `https://treeoflife.wiki/` | Apex — 308-redirects to `www`. |
| `https://tree-of-life-sand.vercel.app/` | Vercel's own production alias. |

GitHub Pages has been retired: `deploy.yml` was deleted once the custom domain
passed the full smoke suite. The old `behemot46.github.io/tree-of-life` URL
will keep serving its last build until Pages is switched off in the
repository's Settings → Pages, which has to be done by hand.

`vercel.json` skips dependency installation — the site is static, and
`package.json` exists only to pin Playwright for the tests. It also sets
cache headers: **nothing may be cached immutably**, because no asset is
content-hashed and a stale `js/app.js` would strand visitors on old code
with no way to bust it. ETags make revalidation cheap.

The **Content-Security-Policy** lives in `vercel.json`. `serve.js` reads that
same header block, so the dev server and the smoke suite enforce exactly what
production serves — a policy that would break the deployed site breaks locally
first. `scripts/smoke.mjs` fails on any CSP violation, and reads them *after*
the interaction phase because inline handlers only fire when clicked.

`script-src` is now `'self'` alone — no `'unsafe-inline'`, no `'unsafe-eval'`.
The policy refuses inline script outright rather than only restricting where
external script may come from, which is the difference between narrowing an
injection and stopping one. See *Actions* below for what that cost.

`style-src` keeps `'unsafe-inline'`, and that is not an oversight waiting to be
tidied. Inline `style` attributes are load-bearing here: label sizes have to be
inline to outrank the stylesheet (constraint 7), and the renderer sets
per-element geometry on the fly. An injected `style` attribute also cannot
execute anything, so the two keywords are not comparable risks.

Allowed origins are deliberately narrow — `fonts.googleapis.com` (styles),
`fonts.gstatic.com` (fonts), `upload.wikimedia.org` (every one of the 393
`PHOTO_MAP` images). Species "learn more" links point at ~200 other hosts, but
those are anchor targets, not loaded resources, so CSP does not govern them.

`.github/workflows/verify-deployment.yml` runs the full smoke suite against
the deployed URL whenever Vercel publishes to production, so a green build is
never mistaken for a working page.

---

## Smoke Tests

`scripts/smoke.mjs` opens the real page in Chromium and asserts **598 checks**
— ~94 per scenario across six scenarios (desktop in English, Hebrew and Russian,
phone in English and Hebrew, and a desktop pass in the light theme), and seven
static checks that read the source before the browser starts. Scenarios differ
in count because some checks are language- or viewport-specific. It runs on every
push and pull request via `.github/workflows/smoke.yml`, and replaces the old
`deploy-check.yml`, which only checked that files existed.

**CI runs the six scenarios side by side.** `smoke.yml` is a matrix, one job per
scenario (`node scripts/smoke.mjs --only <id>`), so the wall-clock is the slowest
scenario plus a Chromium install (half a minute to nearly six), not their sum:
the single job had grown to 17 of its 30 minutes. Each scenario also runs the
static checks, which cost seconds. A final job still named **Browser smoke
checks** needs the matrix and is red unless every scenario was green, so a rule
or a reader looking for that name still finds it. Screenshots upload per scenario
(`smoke-screenshots-<id>`). `verify-deployment.yml` still runs the whole suite in
one job against production. A new probe should still be timed on a runner: this
sandbox runs the whole matrix in about half an hour and says little about it.

The light theme is loaded rather than toggled at runtime: switching themes also
rebuilds the era strip and the density curve in JS, so a half-applied theme
measures a page nobody ever sees.

```bash
npm run smoke                                      # serve ./ and check it
node scripts/smoke.mjs --url https://example.com   # check a deployed site
node scripts/smoke.mjs --proxy http://host:port    # run from behind a proxy
node scripts/smoke.mjs --only desktop-he           # one scenario, ~1 min
node scripts/smoke.mjs --opening-only --only phone-en  # just the opening group, ~15 s
node scripts/smoke.mjs --profile-only --only desktop-en # just the name offer, ~45 s
node scripts/mutate-checks.mjs                     # break the opening 26 ways and the name offer 23, watch each check go red (~12 min)
node scripts/mutate-checks.mjs --group profile     # one group's
npm run smoke:update-baseline                      # re-record known failures
```

`--only` exists for one job: proving a new check can fail. Break the code,
watch the check go red, put the code back. The full matrix is a ~35 minute
round trip, which is too slow to do that honestly, and a check nobody has
watched fail is a check nobody has tested. It takes a comma-separated list.

`--opening-only` and `--profile-only` are the same idea for the opening and for
the name offer: each skips the scenario's own page load and every probe but its
own. `scripts/mutate-checks.mjs` is that loop automated — one deliberate
breakage per check, in a scratch copy of the site, each run in the scenario that
should notice and in the group its first required check belongs to. Run it
after changing `js/splash.js`, `js/splashScene.js`, `js/boot.js`,
`css/splash.css` or the `opening:` checks; or `js/profile.js`, a game's results,
`css/profile.css` or the `profile:` checks. A mutation whose target text has
moved reports `PATCH FAILED` and wants updating beside the code it names.
`SMOKE_DUMP_OPENING=1` and `SMOKE_DUMP_NAME=1` print everything the probe
measured, one JSON line per scenario: the numbers the thresholds were chosen
from, and the first thing to read when one goes red on a runner you cannot see.

Never read a filtered run as a green branch — the summary counts only what
ran and says so. It refuses `--update-baseline` outright, since rewriting the
baseline from a subset would silently delete every entry the skipped
scenarios own.

Screenshots for every scenario land in `.smoke-out/` (git-ignored, and uploaded
as a CI artifact on every run).

### What it checks

| Group | Covers |
|---|---|
| `load:` | uncaught errors, failed requests, SVG render errors, splash dismissal, nothing covering the stage, **no native alert, confirm or prompt at any point** |
| `opening:` | **the opening screen, in five page loads of its own per scenario**: the first paint with no script at all, the finished plate under reduced motion (title fitted, nothing colliding, both canvases drawn, Skip in the right corner, and Russian on a phone though the matrix has no such scenario), a first visit running for real and left by keyboard, the path with no 2D canvas, and a scene that throws while building |
| `profile:` | **the name offer, in contexts of its own**: a first visit that only looks around is not interrupted for seven seconds; a returning explorer is not made a Guest; the first game that scores (and no other) carries the offer, in the reader's language, inside the screen, with thumb-sized controls that nothing covers, legible in the scenario's theme; keeping the name stores the player and credits the score shown; "Not now" is remembered; later games credit the player without asking; a game reached twice is credited once; focus is not lost when the card goes |
| `tree:` | node and branch counts, **NaN coordinates**, fit-to-stage, spill, root visibility, horizontal scroll, **cladogram leaf labels on the outward side in both directions of writing** (the tree is mirrored in Hebrew; its labels once were not, and the camera fitted at 0.3 against English's 0.4) |
| `chrome:` | header/timeline visible, reveal panel vs. zoom controls and timeline, closed panel off-screen, tooltip and fact toast vs. header, tooltip vs. the node it describes, nothing printed over the species name, **no floating control stretched across the window**, **the wayfinder reachable over every overlay and painted over nothing** |
| `timeline:` | geological era labels clipped or colliding, **and both the labels and the density curve rebuilt on the way back from the drill-down**, where the strip is hidden and cannot measure itself |
| `chrome:` (rail) | after-load pass, in a page loaded into the drill-down: **the rail's View buttons are inside the window and hit-testable (on a phone, after pressing ☰); Radial and Cladogram clicked from the drill-down take the reader to the map, and on a phone close the rail over it; a language switched at runtime re-draws the drill-down's rows** — the runner seeds language and shell before load, so none of these had ever been performed by any check |
| `i18n:` | document direction and lang, every bound control matches its translation, missing translation keys, Latin text leaking into Hebrew, search placeholder, English species prose laid out left-to-right, **the map tooltip's fun fact laid out as English under a translated label**, **no control wearing two icons at once**, and the same three rules again **inside the drill-down**, which the map-view sweep cannot reach |
| `a11y:` | every text node meets AA contrast against its effective background, **in the drill-down as well as the map** |
| `explore:` | the drill-down renders, descends and climbs back; **the nesting is drawn — every level inset past its parent and every row joined to it**; **a descent unfolds in place rather than wiping the page**; every screen names where you are; nothing scrolls sideways; nothing is painted over a card or a control; the species panel is dismissed when the shell switches; **every group row states its real width and depth**; **a row whose photograph fails falls back to its silhouette rather than to an empty box** |
| `nav:` / `share:` | **Back takes off one layer and leaves the one beneath it**; the share link names the shell and the language as well as the node; following such a link opens in the sender's view without overwriting the recipient's stored preference |
| `search:` | eight canonical queries return the answer a person would call correct; every common-name alias still matches something |
| `interact:` | zoom buttons, reset re-fits, parent expands, leaf opens panel, search returns results, camera settles |
| `static/` | Runs before the browser starts, over `atlas.html`, `index.html`, `play.html`, `credits.html`, `js/` (recursively), `css/` and `stories/`: CSS custom properties used but never defined; inline event-handler attributes; `script-src` still forbidding inline and eval; every `data-action` resolving to a registered handler; `js/boot.js` listing every language and every right-to-left one; no file in `js/` calling `alert`, `confirm` or `prompt`; the name offer's six strings present and translated in every language |

### The baseline

`scripts/smoke-baseline.json` records checks that are **known to fail today**.
This lets the suite land red-in-truth but green-in-CI, so it can be written
before the bugs are fixed.

The run fails if:

- a check that is **not** baselined fails — a regression, or a newly found bug;
- a check that **is** baselined starts passing — the fix landed, so its entry
  must be deleted. This is deliberate: it makes each fix delete its own
  baseline entry, and the file shrinks to nothing as the backlog clears.

When adding a translated control, add a row to `I18N_BINDINGS` in
`scripts/smoke.mjs` so it is covered.

---

## Git Conventions

- Descriptive commit messages (imperative mood: "Add ...", "Fix ...", "Update ...")
- Prefix: `feat:` / `fix:` / `style:` / `chore:` / `docs:` / `data:` / `perf:` / `a11y:`
- Work on feature branches; merge to `master` for deployment
- No commit hooks or pre-push checks configured
