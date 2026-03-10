# 🌿 Tree of Life

An interactive visualization of 3.8 billion years of evolution.

Live at: **[behemot46.github.io/tree-of-life](https://behemot46.github.io/tree-of-life/)**

## Features

- Zoomable, pannable evolutionary tree spanning all domains of life
- 200+ named species from LUCA to Homo sapiens
- Multilingual: English, Hebrew (full RTL), Russian
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

This project uses vanilla HTML/CSS/JS and deploys via GitHub Pages. No build step required.

### Local development

```bash
git clone https://github.com/behemot46/tree-of-life.git
cd tree-of-life
# Open index.html in a browser, or use a local server:
npx serve .
```

### Deployment

Every push to `main` automatically deploys to GitHub Pages via GitHub Actions.

## Data Sources

- Evolutionary dates: current scientific consensus (2020+ literature)
- Images: Wikimedia Commons (CC0 / CC BY-SA)
- Hebrew terminology: Hebrew University biological nomenclature standards

## Changelog

See [CHANGELOG.md](CHANGELOG.md)

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — Technical decisions and file structure
- [Data Schema](docs/DATA_SCHEMA.md) — Tree and hominin data format
- [I18N Guide](docs/I18N_GUIDE.md) — How to add/edit translations
- [Assets](docs/ASSETS.md) — Image sources and licenses
