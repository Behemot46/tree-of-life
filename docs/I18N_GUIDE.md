# Internationalization (I18N) Guide

The Tree of Life supports multiple languages using a custom lightweight translation system in `js/i18n.js`.

---

## Supported Languages

| Code | Language | RTL? | Status |
|------|----------|------|--------|
| `en` | English  | No   | Complete |
| `he` | Hebrew   | Yes  | Complete |
| `ru` | Russian  | No   | Complete |

---

## How It Works

### 1. HTML markup

Any element that needs translation gets a `data-i18n` attribute with a translation key:

```html
<button data-i18n="search.placeholder">Search...</button>
<h2 data-i18n="panel.about">About</h2>
```

### 2. Translation table (`js/i18n.js`)

All translations live in the `TRANSLATIONS` object:

```js
const TRANSLATIONS = {
  en: {
    "search.placeholder": "Search species...",
    "panel.about": "About",
    // ...
  },
  he: {
    "search.placeholder": "חיפוש מינים...",
    "panel.about": "אודות",
    // ...
  },
  ru: {
    "search.placeholder": "Поиск видов...",
    "panel.about": "О виде",
    // ...
  }
};
```

### 3. Applying a language

```js
I18n.setLang('he');  // Switches to Hebrew, applies RTL
```

`setLang()` does three things:
1. Finds all `[data-i18n]` elements and sets their `textContent`
2. Sets `document.documentElement.dir = 'rtl'` for Hebrew (and `'ltr'` for others)
3. Saves the choice to `localStorage` (`tol-lang`)

### 4. Language persistence

On page load, `main.js` calls:
```js
I18n.setLang(I18n.currentLang());
```
`currentLang()` reads from `localStorage`, defaulting to `'en'`.

---

## Adding a New Language

**Step 1:** Add a language code block to `TRANSLATIONS` in `js/i18n.js`:
```js
fr: {
  "search.placeholder": "Rechercher des espèces...",
  "panel.about": "À propos",
  // ... copy all keys from 'en' and translate
}
```

**Step 2:** Add a language button in `index.html`:
```html
<button class="lang-btn" data-lang="fr">FR</button>
```

**Step 3:** If the language is RTL (Arabic, Hebrew, etc.), no extra code is needed — the system checks if `lang === 'he'` currently. Update `i18n.js` to generalize RTL detection if adding another RTL language:
```js
const RTL_LANGS = ['he', 'ar', 'fa'];
document.documentElement.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';
```

---

## Translation Keys Reference

| Key | English value |
|-----|--------------|
| `search.placeholder` | Search species... |
| `btn.explore` | Discover Species |
| `btn.theme` | Toggle Theme |
| `panel.about` | About |
| `panel.evolution` | Evolution |
| `panel.photos` | Photos |
| `panel.map` | Range |
| `timeline.label` | Geological Timeline |
| `loading.text` | Loading Tree of Life... |

*(Full key list in `js/i18n.js`)*

---

## Hebrew-Specific Notes

- Full RTL layout applied via `dir="rtl"` on `<html>`
- Font stack includes system Hebrew fonts: `'Arial Hebrew', 'David', sans-serif`
- Panel slides in from the left (mirrored) in RTL mode
- Search input text-align flips to `right` automatically via CSS `[dir="rtl"]` selectors
