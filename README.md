# 🌿 Tree of Life

**Kin** — a one-minute daily game about how every living thing is related — and
the **Atlas**, an interactive visualization of 3.8 billion years of evolution
that it opens onto.

Live at: **[treeoflife.wiki](https://www.treeoflife.wiki/)** (the game) ·
**[/atlas.html](https://www.treeoflife.wiki/atlas.html)** (the tree)

## Features

**Kin** (the front page)
- Ten questions a day: *who is the closer cousin?* — the answer is derived from
  a curated tree of life with every branching point dated from an open source
- Streaks that forgive (a missed day is covered by a freeze), an endless Arcade,
  friends' links and challenges, stats that stay on the device
- Installable, plays offline, no account, no cookies

**The Atlas**
- Zoomable, pannable evolutionary tree spanning all domains of life
- 300+ named groups and species from LUCA to Homo sapiens, with photographs
  credited to their authors
- Deep Hominin section with species comparison
- Interactive timeline with mass extinction markers
- Dark and light themes

## Languages

| Language | Status |
|----------|--------|
| English  | Complete |
| Hebrew   | Complete (RTL) |
| Russian  | Complete |

## Development

This project uses vanilla HTML/CSS/JS and deploys on Vercel. No build step required.

### Local development

```bash
git clone https://github.com/behemot46/tree-of-life.git
cd tree-of-life
node serve.js
# The game: http://localhost:5555   The Atlas: http://localhost:5555/atlas.html
```

### Deployment

Vercel deploys every push and pull request; `main` is production. CI runs the
unit tests, the game's browser checks and the Atlas's smoke suite, and runs both
browser suites again against production after each deploy.

## Data Sources

- Evolutionary dates: current scientific consensus (2020+ literature)
- Images: Wikimedia Commons (CC0 / CC BY-SA)
- Hebrew terminology: Hebrew University biological nomenclature standards

## Changelog

See [CHANGELOG.md](CHANGELOG.md)

## Documentation

- [CLAUDE.md](CLAUDE.md) — how the project works: architecture, data shape,
  styling, i18n, smoke tests, deployment
- [ROADMAP.md](ROADMAP.md) — why it works that way: decision record, what
  shipped, what is still open
