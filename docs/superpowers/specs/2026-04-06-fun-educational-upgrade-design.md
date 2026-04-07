# Fun & Educational Experience Upgrade — Design Spec

**Date:** 2026-04-06
**Branch:** TBD (feature branch from main)
**Goal:** Transform the Tree of Life into an addictive learning experience through gamification, feature consolidation, and contextual education.

---

## 1. Consolidation

### 1.1 Remove: Minimap
- Delete `js/minimap.js` and all references
- Remove `#minimap` element from `index.html`
- Remove any CSS targeting `#minimap`
- Rationale: visual noise, being replaced by world map in species panels

### 1.2 Remove: Idle Toast Facts
- Remove the 45-second idle timer and `showIdleToast()` from `js/engagement.js`
- Remove `TOAST_IDLE_INTERVAL` and `TOAST_DISMISS_DELAY` constants
- Keep the toast *infrastructure* (DOM element, show/dismiss functions) — achievements will reuse it
- Rationale: interruptive, not user-initiated

### 1.3 Merge: DNA Calculator + Evo Path → Unified Species Compare
- Combine `js/dnaCalc.js` and `js/evoPath.js` into a single `js/speciesCompare.js`
- Single panel: `#species-compare-panel`
- Single entry point: one button in the floating action bar replacing two
- Input flow: pick 2 species (slots A & B) via search or presets
- Output sections (all shown together):
  - **DNA Similarity** — percentage with animated counter, source citation, badge (Published / Estimated / Not Available)
  - **Evolutionary Path** — ancestor chain visualization with node icons
  - **Divergence Time** — Mya value with Scale of Time context (see 3.3)
  - **Shared Ancestor** — card with name, icon, photo, description
  - **"Show on Tree"** — button to highlight path on tree
- Dice button (🎲) for random pair
- **DNA accuracy rule:** Only show percentages from `DNA_KNOWN` (sourced data with citation). For estimated pairs, show "Estimated ~X%" with method note. Never present estimated data as fact. If `estimateDnaSimilarity()` returns a value, label it clearly as "Estimated based on phylogenetic distance" and do NOT show a source citation. Show "Data not available" rather than inventing a number.

---

## 2. New Game Modes

All new game modes live inside the existing Game panel (`#game-panel` / `game.js`). They appear as additional mode cards in the mode selector alongside Quick Quiz, Classic Trivia, and Survival.

### 2.1 "Who Appeared First?"
- **Concept:** Show two species side by side with photos. Player guesses which appeared first in evolutionary history.
- **UI:** Two species cards (photo from PHOTO_MAP, name, icon) with a "?" divider. Player taps the one they think is older.
- **Answer reveal:** Correct card highlights green, incorrect red. Show both `appeared` values. Then show a **bridge fact** — a one-line micro-lesson connecting the two species. Example: "Cyanobacteria appeared 2 billion years before the first plants — and plants carry their descendants (chloroplasts) inside every cell."
- **Bridge facts source:** Use `tipFact`, `funFact`, or `altFacts` from relevant nodes/ENRICHMENT. If no suitable existing fact connects the pair, use a generic template: "[Older] appeared X million years before [Newer] — that's [Scale of Time comparison]."
- **Scoring:** 10 points per correct answer. Streak bonus: +5 for every consecutive correct answer.
- **Round structure:** 10 rounds per game. Dice button to get a new random pair (skip current).
- **Data:** `appeared` field on every node, `PHOTO_MAP` for images.

### 2.2 "Family or Foe?"
- **Concept:** Show three species (A, B, C). Player guesses: "Is A more closely related to B or C?"
- **UI:** Species A prominently displayed at top. Species B and C as two choice cards below. Player taps B or C.
- **Question curation:** Pre-select ~30 surprising trios where the intuitive answer is wrong. Examples:
  - "Are hippos closer to whales or pigs?" → WHALES
  - "Are mushrooms closer to humans or plants?" → HUMANS
  - "Are birds closer to crocodiles or lizards?" → CROCODILES
- **Fallback:** For random/dice rounds, generate trios dynamically using `findLCA()` — pick species where the closer pair has a deeper (more recent) LCA than the intuitive pairing.
- **Answer reveal:** Highlight correct answer. Show LCA node name and divergence time. Show **bridge fact** connecting the surprising pair. Example: "Hippos and whales shared a land-walking ancestor ~55 million years ago — before hippos, whales walked on land."
- **Scoring:** 15 points per correct (harder than "Who Appeared First?"). Same streak bonus.
- **Round structure:** 8 rounds per game (fewer because each is more complex). Dice button for random trio.
- **Data:** Tree hierarchy, `findLCA()`, `PHOTO_MAP`, curated trios array.

### 2.3 Smart Quiz Enhancements (applies to all existing quiz modes)
- **Randomize answer order** per question — shuffle the `answers[]` array, update `correct` index accordingly.
- **No position repetition** — don't place the correct answer in the same slot (A/B/C/D) more than twice consecutively.
- **Session dedup** — track question IDs answered correctly this session (in-memory Set, not localStorage). Don't re-ask correctly answered questions. If the pool runs low, allow repeats with a "seen" indicator.

---

## 3. Contextual Education Features

### 3.1 Dice/Random Button — Universal
- **Placement:** Every tool/game that has species selection gets a 🎲 button.
- **Locations:** Species Compare (both slots), all game modes (skip to random), zoom controls (already exists).
- **Behavior:** Consistent everywhere — picks a random leaf node from `nodeMap`, navigates or fills slot.
- **Visual:** Same icon (🎲), same size, same position (top-right of the relevant container), same micro-animation (brief spin on click).
- **Implementation:** Single shared utility function `getRandomSpecies()` in `utils.js`.

### 3.2 Scale of Time Contextualizer
- **Where it appears:** Species panels (next to "Appeared: X Mya"), Species Compare (divergence time), game answer reveals.
- **Format:** Italicized subtitle below the Mya value. Rotate between 3 metaphors:
  1. **24-hour clock:** "If Earth's history were 24 hours, this species appeared at 5:47 AM"
  2. **Calendar year:** "If Earth's history were a calendar year, this species appeared on March 12"
  3. **Marathon:** "If Earth's history were a marathon, humans appeared in the last 3 centimeters"
- **Rotation:** Deterministic per species (hash species ID to pick metaphor). Same species always shows same metaphor for consistency. Different species show different metaphors for variety.
- **Implementation:** Pure function `getTimeContext(appearedMya, speciesId)` in `utils.js`. Returns `{metaphor, text}`.
- **Math:**
  - 24h clock: `hours = (1 - appeared/3800) * 24`, format as HH:MM
  - Calendar: `dayOfYear = (1 - appeared/3800) * 365`, format as month + day
  - Marathon: `km = (1 - appeared/3800) * 42.195`, show as "at the X km mark" or "in the last Y centimeters". Edge case: LUCA (3800 Mya) → "at the starting line"

### 3.3 Species of the Day
- **Trigger:** Small badge in header or on splash screen.
- **Selection:** Deterministic from date: `speciesIndex = hashCode(YYYY-MM-DD) % leafNodes.length`. Same species all day, different each day.
- **Display:** Icon + name + "Species of the Day" label. Tap navigates to that species panel.
- **Cycle:** With 358 species, cycles roughly yearly.
- **Implementation:** ~20 lines in `engagement.js` or a new lightweight function.

---

## 4. Gamification Infrastructure

### 4.1 Player Profiles (Household Leaderboard)
- **Storage:** localStorage key `tol-players` → JSON array of player objects.
- **Player object shape:**
  ```js
  {
    name: string,           // display name, max 20 chars
    createdAt: number,      // timestamp
    lastActive: number,     // timestamp
    exploredSpecies: [],    // array of node IDs
    achievements: [],       // array of achievement IDs
    scores: {
      quickQuiz: { best: 0, total: 0, gamesPlayed: 0 },
      classicTrivia: { best: 0, total: 0, gamesPlayed: 0 },
      survival: { best: 0, streak: 0 },
      whoFirst: { best: 0, total: 0, streak: 0 },
      familyFoe: { best: 0, total: 0, streak: 0 },
      dailyChallenge: { streak: 0, lastDate: null }
    },
    totalPoints: 0          // sum across all games
  }
  ```
- **Player switching:** Simple name-entry field. Type a name → creates new profile or loads existing (case-insensitive match). No passwords, no accounts.
- **Active player:** `tol-active-player` localStorage key stores current player name.
- **Default:** On first visit, prompt for name (optional — "Guest" if skipped).
- **Migration:** Existing `exploredSpecies` and achievement data in localStorage migrates to the first player profile.

### 4.2 Achievement System
- **Total:** 25 achievements (22 visible + 3 secret).
- **Categories and badges:**

**Explorer (7):**
| Badge | Name | Condition |
|---|---|---|
| 🔭 | First Contact | Visit your first species |
| 🌱 | Budding Biologist | Visit 10 species |
| 🧭 | Seasoned Explorer | Visit 50 species |
| 🌍 | World Traveler | Visit 100 species |
| 👑 | Master Naturalist | Visit all species |
| 🍄 | Kingdom Collector | Visit all species in any one kingdom |
| 💀 | Extinction Witness | Visit all extinct species |

**Scholar (6):**
| Badge | Name | Condition |
|---|---|---|
| 📝 | Quiz Taker | Complete your first quiz |
| 🏆 | Quiz Champion | Perfect score in Quick Quiz |
| 🧠 | Trivia Master | Score 100+ in Classic Trivia |
| ♾️ | Survival Expert | 15+ streak in Survival mode |
| 🎓 | Tour Graduate | Complete all 3 guided tours |
| 📚 | Know-It-All | Answer 100 questions correctly (cumulative) |

**Pathfinder (4):**
| Badge | Name | Condition |
|---|---|---|
| 🧬 | DNA Detective | Use Species Compare for the first time |
| 🔗 | Chain Finder | Find a path with 8+ ancestors |
| 🤝 | Unlikely Cousins | Compare species from different kingdoms |
| 🎲 | Lucky Roller | Use the dice button 20 times |

**Time Traveler (2):**
| Badge | Name | Condition |
|---|---|---|
| ⏳ | Time Traveler | Complete a full playback from 3.8 Bya to present |
| 💥 | Survivor | Watch all 5 extinction events in playback |

**Secret (3):**
| Badge | Name | Condition | Hint shown after unlock |
|---|---|---|---|
| 🦉 | Night Owl | Explore 20 species after midnight (local time) | "The best discoveries happen after dark" |
| 🏠 | Family Game Night | 3+ players on the same device | "Science is better together" |
| 🔬 | Deep Diver | Expand every single branch on the tree | "You've seen it all... or have you?" |

- **Unlock notification:** Reuse toast infrastructure. Gold-bordered toast with badge icon, name, and a one-line description. Auto-dismiss after 5s. Celebration particle burst (reuse existing particle system from engagement.js).
- **Check timing:** `checkAchievements()` runs after: panel open (explorer badges), quiz completion (scholar badges), compare use (pathfinder badges), playback events (time traveler badges). Lightweight — early-exit if already unlocked.

### 4.3 Profile Panel
- **Trigger:** Avatar/profile icon in the header bar (next to theme/language buttons). Shows active player name.
- **Panel type:** Slide-out from right (same animation as species panel).
- **Layout — 3 sections:**

**Section 1: Player & Leaderboard**
- Active player name (editable) + "Switch Player" button
- Leaderboard table: all household players sorted by `totalPoints`
- Columns: Rank, Name, Points, Achievements count, Species explored
- Active player row highlighted

**Section 2: Achievements**
- Grid of badge icons (4 per row)
- Unlocked: full color + name below. Tap for description.
- Locked: greyed silhouette + "???" name. Tap shows unlock condition (except secret ones which show "???").
- Secret achievements: invisible until unlocked, then appear with a "SECRET" label.
- Progress: "17/25 Achievements Unlocked"

**Section 3: Kingdom Progress**
- One progress bar per domain: Bacteria, Archaea, Protists, Fungi, Plants, Animals
- Format: domain icon + name + "X/Y" + percentage bar
- Color-coded to domain color from tree data
- Total at bottom: "Overall: X/358 species explored (Y%)"

---

## 5. Nice-to-Have Features

### 5.1 Daily Challenge
- **One challenge per day**, deterministic from date seed.
- **Format rotation:** cycles through quiz question, "who appeared first?", and "family or foe?" — determined by `dayOfYear % 3`.
- **Streak tracking:** consecutive days with correct answer. Stored per player.
- **Bonus:** +25 points for daily challenge (on top of normal scoring).
- **UI:** Small "Daily" badge on Game panel button. Inside game panel, a "Daily Challenge" card at the top of the mode selector (highlighted, shows streak).

### 5.2 Explore by Superpower
- **Deferred** — requires data curation pass to tag species with superlative categories.
- **Future work:** Tag species with categories like "fastest", "longest-living", "smallest", "deepest-diver" from existing `facts[]` data.

### 5.3 Shareable Challenge Cards
- **Deferred** — canvas rendering + Web Share API.
- **Future work:** Generate shareable images for quiz scores and species facts.

---

## 6. Technical Constraints

- **No backend** — all data in localStorage, all logic client-side
- **No frameworks** — vanilla JS ES modules, CSS custom properties
- **Performance** — no feature adds > 50ms to page load. Achievement checks are O(1) lookups against Sets.
- **Mobile** — all new UI works at 375px. Profile panel goes full-width on mobile.
- **i18n** — all UI chrome gets translation keys in `TRANSLATIONS`. Game content (bridge facts, achievement names) can be English-only initially, with `he`/`ru` added later.
- **Accessibility** — all interactive elements keyboard-navigable. Achievement unlocks announced via `aria-live` region.
- **Isolation** — each feature independently disableable. Feature flags not needed — features are self-contained modules that can be excluded from `app.js` imports.

---

## 7. Files Created / Modified

### New files:
- `js/speciesCompare.js` — unified compare tool (replaces dnaCalc.js + evoPath.js)
- `js/whoFirst.js` — "Who Appeared First?" game mode
- `js/familyFoe.js` — "Family or Foe?" game mode
- `js/profile.js` — player profiles, leaderboard, achievement tracking
- `js/achievements.js` — achievement definitions, check logic, unlock notifications
- `css/profile.css` — profile panel styles

### Modified files:
- `js/app.js` — wire new modules, remove minimap/idle-toast imports
- `js/game.js` — add new mode cards, smart quiz enhancements, session dedup
- `js/engagement.js` — remove idle toast, keep toast infra, add species-of-the-day
- `js/utils.js` — add `getRandomSpecies()`, `getTimeContext()`
- `js/state.js` — add player profile state, achievement state
- `js/panel.js` — add Scale of Time display, profile button in header
- `js/renderer.js` — remove minimap rendering
- `index.html` — add profile panel markup, species-compare panel, remove minimap element
- `css/features.css` — dice button styles, achievement toast styles
- `js/uiData.js` — new translation keys

### Deleted files:
- `js/minimap.js`
- `js/dnaCalc.js` (replaced by speciesCompare.js)
- `js/evoPath.js` (replaced by speciesCompare.js)

---

## 8. Implementation Order

| Step | Feature | Type | Priority |
|---|---|---|---|
| 1 | Remove minimap + idle toasts | Cleanup | Must-have |
| 2 | Smart Quiz Mechanics | Enhancement | Must-have |
| 3 | Dice/Random on all tools | Enhancement | Must-have |
| 4 | Scale of Time contextualizer | New | Must-have |
| 5 | "Who Appeared First?" | New game mode | Must-have |
| 6 | "Family or Foe?" | New game mode | Must-have |
| 7 | Unified Species Compare | Merge + enhance | Must-have |
| 8 | Achievement System | New infrastructure | Must-have |
| 9 | Profile Panel + Household Leaderboard | New UI | Must-have |
| 10 | Species of the Day | New | Nice-to-have |
| 11 | Daily Challenge | New game mode | Nice-to-have |
| 12 | Explore by Superpower | New | Future |
| 13 | Shareable Cards | New | Future |
