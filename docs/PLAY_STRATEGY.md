# Kin — the play strategy for treeoflife.wiki

**Status (30 Sep 2026):** phase 3 is built and shipped, and Kin is the front
page of `treeoflife.wiki`; the encyclopedia is `atlas.html`. Phase 1's gate
(testers replaying or sharing) was never measured — Gabi asked for the
redesign to be implemented and launched, so the launch is the experiment and
phase 3's own gate (D1 ≥ 25%, D7 ≥ 10%, one share per twenty finished
dailies, after four weeks) is the number to read. Phase 2 was built on the
way: 122 creatures and 1,112 questions (1,047 generated from the tree), a
frozen calendar, the service worker fixed for Kin, the Atlas's misplaced
species refiled, a credit on every photo and silhouette, and the game in
Russian. Open Tree of Life disagrees with none of it — no question and none of
the 272,398 relationships the key states. Still owed, and not something a
session can do: a native speaker's review of the Hebrew and Russian text, a
site code for counting (it ships switched off), and the four weeks.
**Visual version, with a playable prototype:** https://claude.ai/artifact/9yBbHFjxeC2Nj4ZPispQ2P
(private to Gabi until shared).

This file is the plan future sessions execute. `CLAUDE.md` still describes how
the code works today; `ROADMAP.md` records decisions once they are made.

---

## Phase 1 as built — what changed from the plan

- **Dates are sourced from open publications, not TimeTree.** The repository
  is public and the game is meant to be, and TimeTree forbids redistribution, so every
  age in `js/kin/dates.js` cites an openly reachable source; TimeTree was
  only used to cross-check. That settles the licence question for every
  phase (open decision 3): no permission is needed, because nothing of
  TimeTree's is shipped. Two cited studies calibrated their own clocks with
  ages taken from TimeTree; what the game shows is their published result,
  cited to them.
- **The answer key is a small curated tree** (`js/kin/tree.js`, 80 creatures),
  not the site's `TREE`, and answers are derived from it. Open Tree of Life
  agrees with every question it can judge (`npm run kin:opentree`: 42 of 44;
  it cannot place T. rex or the mammoth).
- **The Hebrew name is קרובים.** "Kin" in Hebrew letters is קין, Cain — a
  point for the naming decision.
- **44 questions** instead of 40; days 1–4 hand-picked, later days seeded.
  Three drafted questions (crab, rabbit, hamster) were cut because no open
  source dates the split they turn on.
- **Phase 2, first step (30 Sep):** the tree now writes most questions. 527
  are generated — one per target and pair of dated splits, with the most
  surprising pair of candidates, the trivial ones dropped — and 44 stay
  hand-written: 571 in all, past the phase-2 gate of 500. The daily comes
  from a calendar laid out 200 days ahead in one file (`js/kin/schedule.js`),
  as the truth-engine section asks, and CI fails if a played day changes.
- **Phase 2, second step (30 Sep): 42 more creatures, not ~150.** Pets,
  farm animals, big cats, dinosaurs, fruit and vegetables, with 21 new
  hand-written hooks (T. rex nearer the chicken than the brontosaurus; the
  zebra a striped donkey; chocolate a cousin of hibiscus; a peanut a pea).
  The cap is the emoji: cards draw the device's own, and familiar organisms
  that have one are now nearly all in. The rest — most dinosaurs, the
  platypus, the starfish — need a picture on the card, which is a design
  decision for phase 3, not a data task. Every new date was read in its
  source. Where none could be found, the split stays undated so no question
  can hinge on it (sheep vs goat), or the creature waits (beans, which would
  have needed pea vs bean).
- **Phase 2, third step (30 Sep): credits and licences.** Every photograph
  now shows its author and licence and links to its Commons page; the 17
  non-commercial silhouettes are replaced; `credits.html` lists every photo,
  silhouette and date source, built from the same modules the site draws
  from.
- **Phase 2, last step (30 Sep): Russian.** The game is Родня in Russian,
  with every creature, group line and explanation written for Russian
  grammar rather than filled into the English sentence, and a switcher that
  offers the other two languages. It has not had a native speaker's review,
  and neither has the Hebrew (open decision 6).
- **Phase 2 is built and its gate is met:** Open Tree disagrees with nothing
  (`npm run kin:opentree`), every scheduled question passes, and there are
  1,112 questions against a gate of 500. What phase 2 still owes is a
  person, not a session: the native review of the Hebrew and Russian text.
- **No analytics yet.** `play.html?stats=1` shows what a tester's device
  remembers, which is enough to see whether someone came back.

---

## Phase 3 as built

The phase-1 gate (≥ 6 of 10 testers play a second round or share unprompted)
was never measured. Gabi asked for the rest of the redesign to be implemented
and launched on the main site (30 Sep), which waives it, and the launch is
the experiment instead: the numbers the gate stood in for (D1, D7, shares per
finished daily) are what phase 3's own gate reads after four weeks.

It is built as three pull requests, so each can be checked and reverted on its
own:

1. **Home and the return loop (on `play.html`, still unlinked).** A first visit
   is question one and nothing before it. Anyone who has played lands on Home:
   a seven-tick dial of the week with the streak at its centre, today's Kin,
   the Arcade and the Atlas. The streak is forgiving — a freeze (earned by 10
   in one Arcade run, at most two held) covers one missed day, and a longer
   gap starts over quietly. Shared links carry the game: `?kin=N` opens a
   friend's Kin, `?c=&s=` a run to beat. The stats are a screen, not a URL.
   Nothing leaves the device. The page borrows the opening's look — the plaque,
   the dial, the ruled scale under the header.
2. **The home screen, offline, and counting (off).** Home offers the install
   prompt after two finished Kins (an iPhone is told how, since iOS has no
   dialog), real PNG icons and a link-preview card, the service worker registered
   from the game with a shell of just the game, and a counter that does nothing
   until a page names an endpoint and then sends event names and noise — no id,
   no cookie — from which D1, D7 and shares per finished daily can be read.
3. **The front door.** Kin at `/`, the Atlas at `/atlas.html` with the opening
   as its entrance (once per visit, never for a link to a species), the old
   addresses forwarded with their query, the dead modules deleted, and both
   browser suites run against production after every deploy.

## The decision in one paragraph

Turn the front door from an encyclopedia you read into a one-minute daily game
you play. The game is **Kin** (working title): a target creature and two
candidates, tap the closer relative, and watch the three lineages trace back in
time until they meet. Ten questions a day, the same for everyone, with a
spoiler-free result to share; an endless Arcade for more; later a collection
album built on the tree. The encyclopedia stays, behind a tab called Atlas,
as the reward. Five phases, each ending in a gate. Lean: **go**, gated on
phase 1 — if 5–10 people handed the prototype with no instructions do not play
a second round unprompted, the mechanic changes before anything else is built.

---

## Why — what the site is today

Each finding was checked on `main` at `d511164`, by running the site in
Chromium and reading the modules.

1. **The game already exists, out of sight.** `js/game.js` has six modes
   (Daily Challenge, Quick Quiz, Classic Trivia, Survival, Who Appeared First?,
   Family or Foe?), with 200 trivia questions (`js/triviaData.js`), 30 curated
   trios (`js/familyFoe.js`), 22 achievements (`js/achievements.js`) and a
   per-device leaderboard (`js/profile.js`). It is reachable only from the side
   menu. The daily is one multiple-choice question, and a wrong answer resets
   the streak to zero (`showDailyResults`).
2. **The answer key is wrong.** *(Fixed 30 Sep 2026: all of the species below
   are refiled, and the destroying angel's photo, facts and range no longer
   belong to the fly agaric.)* At least 14 species sit in the wrong group,
   almost all added by `js/treeExpansion.js`:
   - under Insects: emperor scorpion, golden orb-weaver, American lobster,
     Japanese spider crab;
   - under Mammals: gastric-brooding frog (`platypus-frog`), blue-ringed octopus;
   - under Actinopterygii: Australian lungfish (a lobe-finned fish);
   - under Bacteria: bdelloid rotifer (an animal);
   - under Amoebozoa: Volvox (a green alga) and Radiolaria (Rhizaria);
   - under Flowering Plants: sensitive fern;
   - beside Mammals rather than inside it: pangolin, star-nosed mole, honey badger.
   Also: lar gibbon and aye-aye sit outside Primates; `fly-agaric` is the id of
   "Destroying angel"; Lokiarchaeota is listed beside Asgard rather than in it.
3. **The tree is flat where people care.** 41 mammal leaves hang directly off
   `mammals`, 28 off `birds`, 24 off `angiosperms`. Of 200,000 random leaf
   triples (hominins excluded), 58% have any "who is closer?" answer, and some
   of those are wrong because of finding 2.
4. **The games are English-only.** The templates in `game.js`, `whoFirst.js`
   and `familyFoe.js` hardcode English; in Hebrew they render right to left
   with the punctuation on the wrong side.
5. **The tests never see a first visit.** `scripts/smoke.mjs` seeds
   `tol-tour-done` and `tol-splash-seen` for every scenario. First visit today
   is a 4.5 s opening, then a "Choose a Guided Tour" dialog. Game logic has no
   tests.
6. **Heavy start.** 45 JS modules (2.1 MB uncompressed) and 15 stylesheets load
   before the first interaction (local server; production is compressed).
7. **Image credits.** *(Fixed 30 Sep 2026: no non-commercial silhouette is
   left, every photo shows its author and licence where it appears, and
   `credits.html` lists all of them.)* `js/silhouettes.js` says anything not public domain needs
   attribution wherever shown. 110 of 267 silhouettes are CC BY or BY-SA and no
   silhouette credit is rendered anywhere; 17 are CC BY-NC or BY-NC-SA. The game
   cards in `whoFirst.js` and `familyFoe.js` show Wikimedia photos with no
   credit.

---

## The game

### The atom — "Closer?"

- A target and two candidates. One tap. The reveal is the reward.
- **Reveal:** a three-leaf cladogram. The near pair joins at `x ∝ dNear/dFar`
  of the way from "now" to the far split, which sits at the left edge. Lines
  draw from the leaves back in time, the near join pops with its date, then the
  far join. Very recent or near-equal splits are nudged (at most ~30 px) so both
  joins stay visible; labels always carry the real numbers. Mirrored in RTL.
- **Copy:** a verdict line ("Yes, the hippo." / "Surprise, it's the hippo."),
  then one bold sentence with both dates, then one sentence of why. The first
  words name the answer.
- **Variants later, same engine:** odd one out of four; tie questions (a shark
  is exactly as related to a salmon as to you).
- The prototype in the artifact implements all of this in ~300 lines; reuse its
  structure (`treeSVG`, the creature table with `p`/`the` phrases, the
  question tuple).

### The daily — "Kin #N"

- 10 questions, same worldwide, new at local midnight. Mon gentle → Sat hard,
  Sun themed.
- Share text (no spoilers):
  ```
  Kin #142 · 8/10 🌳
  🟩🟩🟥🟩🟩🟩🟩🟩🟥🟩
  treeoflife.wiki/?kin=142&lang=he
  ```
  Web Share API on phones, clipboard fallback. The link opens that day's Kin in
  the sender's language (the share-link machinery in `js/wayfinder.js` already
  carries `lang`).
- Streak = days played, not days perfect. Freezes are earned in Arcade. A broken
  streak is never shown as a loss; the copy offers a fresh start.
- Results titles: 10 Tree of Life · 8–9 Old growth · 6–7 Sapling · 4–5 Sprout ·
  0–3 Seedling.

### Arcade

- Three lives, rising difficulty, combo chime whose pitch climbs a semitone per
  correct answer in a row.
- Challenge link `?c=<seed>&s=<score>`: the friend gets the same questions and
  a score to beat. No server.

### Your Tree (phase 4)

- Every creature met lands on the player's tree; unmet ones are grey
  silhouettes (`color: transparent; text-shadow: 0 0 0 <grey>` works on emoji
  and SVG alike). A finished branch blooms with the `js/splash.js` animation.
- Rarity tiers; ranks Seed → Sprout → Sapling → Tree → Grove → Forest → Tree of Life.
- The Explore drill-down (`js/explore.js`) is the album's natural shape.

### Feel

- Sounds synthesised with Web Audio: no files, nothing new for the CSP. Start
  only after a user gesture; a visible toggle; off by default until tested.
- `navigator.vibrate` where it exists (not on iOS Safari).
- `prefers-reduced-motion`: no drawing, popping or bursts.

### Ethics (non-negotiable)

No ads, no paywall, no guilt notifications, no accounts, no personal data.

---

## Front door and what happens to existing features

First visit: question one within three seconds — no opening, no tour, no menu.
After the first reveal, one line explains Kin and offers the rest of the day's
set. Returning players land on Home (today's Kin, streak, Arcade, Your Tree).
The Atlas loads on demand.

| Today | In Kin | Why |
|---|---|---|
| Explore drill-down | becomes Your Tree | already the shape of a collection |
| Radial map + camera | keep in Atlas, one layout | identity and trophy view |
| Species panel, photos, silhouettes, facts | keep; feeds every card and reveal | the content moat |
| Six modes in `game.js` | rebuild as Closer / Kin / Arcade | Family or Foe? is the right mechanic |
| 200 general trivia questions | cut from the main loop | not about kinship |
| Who Appeared First? | later mode, Timeline | good second mechanic |
| Opening, tours, tour picker | cut from first visit | question one replaces them |
| Playback, cladogram/radial toggles, depth slider, era strip | freeze inside Atlas | expert controls |
| DNA calculator | one line in the reveal | detail, not a tool |
| Hominins, Sapiens, Stories | themed weeks | reuse the long-form content |
| Household profiles | keep | pass-the-phone play |
| `quiz.js`, `trivia.js`, `imagePrompts.js` | delete | 1,101 lines nothing imports |

---

## The truth engine

1. **Topology from Open Tree of Life** (synthetic tree, CC0 where not otherwise
   restricted). `tnrs/match_names` → OTT ids; `tree_of_life/induced_subtree` →
   Newick for our species list. Committed as a snapshot by a script, the same
   pattern as `scripts/build-photo-snapshot.mjs`.
2. **Dates — licence first.** TimeTree (timetree.org, Kumar et al. 2022,
   *Mol Biol Evol* 39(8): msac174) allows "personal research and teaching use"
   and forbids redistribution. A public game shipping its dates needs written
   permission (request address on timetree.org/faqs). Fallback: node ages from
   published papers and Open Tree's dated trees, one citation per node. Fossil
   taxa use fossil minimums (e.g. the bird–tyrannosaur split predates the late
   Middle Jurassic *Proceratosaurus* and *Kileskus*).
3. **Answers come from the branching, never from the dates.** TimeTree's
   pairwise medians disagree with each other: falcon–parrot comes out at 74 Myr
   and falcon–eagle at 70, although falcons are closer to parrots. Its adjusted
   ages tie them (70.6 and 70.6) because its synthesis is unresolved there.
   Dates are for display only; a question whose dates contradict its topology
   does not ship.
4. **Frozen daily schedule.** Generate a year of dailies into one file and
   freeze it. CI fails if a past or current day changes, so a data fix never
   alters a puzzle already played or shared.
5. **Margin rule.** Ship only if the branching is uncontested and the far split
   is ≥ 15% older than the near one; otherwise mark it shape-only (no dates).
   The 15% is a starting estimate.
6. **Names.** Hebrew and Russian names from Wikidata labels (CC0), reviewed by
   a native speaker.

TimeTree API, for re-verification during development (research use):
`GET https://timetree.org/api/taxon/<Scientific%20name>` → `taxon_id`;
`GET https://timetree.org/api/pairwise/<id>/<id>` → CSV with `precomputed_age`
(median) and `adjusted_age`. It does not allow cross-origin calls, which does
not matter because nothing may call it from the browser anyway.

---

## Engineering

- **Stack stays:** static files, no build, ES modules, strict CSP, delegated
  `data-action` dispatch, `t()` / RTL system, `ImageLoader`, silhouettes.
- **Game shell under 150 KB** (estimate/target) before question one; Atlas
  modules loaded by dynamic `import()` when opened.
- **Pure, testable core:** `js/kin/engine.js` (MRCA, validity, margin),
  `js/kin/daily.js` (schedule lookup), `js/kin/rng.js` (seeded),
  `js/kin/store.js` (versioned localStorage, safe in private mode),
  `js/kin/share.js`, `js/kin/sfx.js`, screens in `js/kin/ui/`. Tested with
  `node --test` in milliseconds.
- **Browser checks:** a small game suite (first visit, daily, arcade, share) on
  phone EN, phone HE and desktop EN, with **no seeded "already seen" keys** in
  the first-visit scenario. Run the Atlas suite only when Atlas files change
  (path filters in `.github/workflows/smoke.yml`).
- **Service worker:** network-first for code and the daily file. Today
  `sw.js` serves same-origin files stale-while-revalidate, so the first visit
  after a deploy runs the previous build.
- **Analytics:** GoatCounter with `count.js` served from our own domain (keeps
  `script-src 'self'`; its endpoint goes into `connect-src`). Vercel's Hobby
  plan has no custom events and its documented snippet is inline.
- **`CLAUDE.md`:** 54 KB loaded into every session. Keep the working rules;
  move the Atlas war stories to `docs/atlas.md`.

---

## Phases

| # | Phase | Build | Gate | Effort (estimate) |
|---|---|---|---|---|
| 1 | Find the fun | Hidden `play.html` with its own light entry module: Closer, reveal, 10-question daily, share, Arcade, sound; ~40 hand-checked questions; EN + HE. Tested on a **Vercel preview deployment** of an unmerged PR, so production does not change. | 5–10 people, own phones, no instructions: ≥ 6 in 10 play a second round or share unprompted. | 1–2 sessions |
| 2 | Make it true | Truth engine + unit tests; fix the 14 misplacements; +~150 familiar organisms (pets, farm, fruit & veg, dinosaurs); HE/RU names; credits page and per-card credits; replace the 17 NC silhouettes; settle the date licence. | 0 disagreements with Open Tree; every scheduled question passes; ≥ 500 valid questions. | 2–3 sessions + ~2 h HE review |
| 3 | Launch the daily | New front door; Kin daily from a frozen year; streaks, freezes, stats; share; Arcade; challenge links; install prompt; analytics; Atlas on demand; freeze list; delete dead code; seed communities in launch week. | After 4 weeks: D1 ≥ 25%, D7 ≥ 10%, ≥ 1 in 20 finished dailies shared (estimates). | 3–5 sessions |
| 4 | Your Tree | Album, rarity, blooms, ranks, achievements rewritten around play. | D30 return beats the phase-3 cohort. | 2–3 sessions |
| 5 | More ways to play | Odd one out, ties, Timeline, themed weeks; a mystery-creature daily only if data asks (Metazooa already owns it). At most one mode a month. | A mode stays only if it lifts returns. | 1–2 sessions each |

Later, only if numbers justify a small server: "64% missed #6 today", teacher
links for a class, friend leagues.

---

## Phase-1 question seed list

Topology is textbook-consensus. Divergence times for every row were checked
against TimeTree on 29 Sep 2026 for research; they are deliberately **not**
reproduced here (see the licence note above). Representative species used for
the lookups are in brackets.

| Target | Closer | Farther | Why (one line) |
|---|---|---|---|
| You | Mushroom (*Agaricus bisporus*) | Daisy (*Bellis perennis*) | Fungi and animals are sister kingdoms |
| Koala | Kangaroo | Bear | Marsupials |
| Whale (*Balaenoptera musculus*) | Hippo | Shark | Whales descend from hoofed land mammals |
| Tomato | Potato | Apple | Same genus, *Solanum* |
| Chicken | T. rex (fossil minimum) | Crocodile | Birds are theropod dinosaurs |
| Dog (*Canis lupus*) | Bear | Cat | Caniforms vs feliforms |
| Lobster | Bee | Snail | Insects grew out of the crustacean branch |
| Strawberry | Rose | Blueberry | Rose family vs heather family |
| Flamingo | Pigeon | Duck | Neoaves vs Galloanserae |
| Bat (*Myotis lucifugus*) | Horse | Mouse | Laurasiatheria vs Euarchontoglires |
| Sunflower | Lettuce | Rose | Both Asteraceae |
| Coffee | Tomato | Cocoa (chocolate) | Asterids vs rosids; cocoa is a cousin of cotton |
| Giraffe | Cow | Horse | Ruminants |
| Snake | Lizard | Crocodile | Snakes are legless lizards |
| Turtle | Crocodile | Lizard | Archelosauria (tight margin: hard) |
| Frog (*Xenopus laevis*) | Lizard | Salmon | Tetrapods |
| Butterfly | Bee | Spider | Insects vs arachnids |
| Mosquito | Fly | Bee | True flies |
| Octopus | Snail | Salmon | Molluscs |
| Rabbit | Mouse | Cat | Glires |
| Gorilla | You | Orangutan | African great apes |
| Pig | Hippo | Horse | Even-toed vs odd-toed |
| Camel | Cow | Horse | Even-toed vs odd-toed |
| Penguin | Eagle | Duck | Neoaves vs Galloanserae |
| Kiwifruit | Blueberry | Apple | Ericales |
| Cucumber | Watermelon | Tomato | Gourd family |
| Corn | Rice | Apple | Grasses |
| Cherry | Peach | Grape | Genus *Prunus* |
| Horse | Rhino | Cow | Odd-toed ungulates |
| Banana | Palm | Apple | Monocots |
| Crocodile | Chicken | Lizard | Archosaurs |

Do **not** use: falcon/parrot/eagle, owl/eagle/falcon, penguin/albatross/puffin
(dates tie or nearly tie; shape-only at most); garlic/onion (TimeTree median
16.3 vs adjusted 4.7 — too uncertain to display); zebra/horse (TimeTree's
Equus split looks too old against the literature).

---

## Open decisions (Gabi)

1. Testers for phase 1 (5–10, mixed ages, ≥ 3 reading Hebrew).
2. Name: Kin (working), after a trademark search.
3. ~~Date source~~ Settled: every date comes from an open publication, so
   no TimeTree permission is needed (see *Status*).
4. Analytics: GoatCounter recommended.
5. Money: none / donations / sponsorship — decides how urgently the NC
   silhouettes go.
6. Hebrew review of ~500 names in phase 2; a Russian reviewer.
7. Freeze the Atlas (bug fixes only) through phases 1–3.

---

## Precedents (sourced in the artifact's research notes)

- **Wordle:** 90 daily players (Nov 2021) → 2 M within weeks after the emoji
  share; bought by the NYT on 31 Jan 2022, "low-seven figures".
- **Metazooa / Metaflora** (Trainwreck Labs, maker of Globle): daily mystery
  organism, typed guesses joining a tree at the deepest shared group (NCBI
  taxonomy); its maker's second most successful game; viral on Tumblr in 2023.
  No player numbers published. English only, as are GuessKin and Phylo.
- **The Higher Lower Game:** one-tap binary comparison, 4.8 M plays in its first
  six months (agency's figure).
- **Wikitrivia:** static site built from saved Wikidata queries.
- **Cell to Singularity:** 10 M+ Google Play downloads.
- **Duolingo:** 7-day streak learners 3.6× likelier to finish; broken-streak
  messages reduce later engagement (Barasch et al., seven studies).
