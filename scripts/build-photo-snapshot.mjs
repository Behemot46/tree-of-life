#!/usr/bin/env node
/**
 * build-photo-snapshot.mjs — resolve every species' photograph from Wikipedia
 * and write js/photoSnapshot.js.
 *
 * Why this exists
 * ---------------
 * PHOTO_MAP pins ~390 `upload.wikimedia.org/.../thumb/...` URLs by hand. Those
 * are file-path URLs: they die when a file is renamed, re-uploaded under a new
 * name, or deleted from Commons, and nothing repairs them. The old
 * photo-check.yml could only *report* the rot once a week — someone then had to
 * find a replacement, and nobody did.
 *
 * The fix is to stop pinning by hand. MediaWiki always knows which image an
 * article carries today, so resolving through it and committing the result
 * gives a snapshot that can be rebuilt whenever it drifts.
 * .github/workflows/photo-refresh.yml does that weekly and opens a pull request
 * when anything moved, so a dead photograph repairs itself.
 *
 * Nothing here runs in the browser. The site loads the committed snapshot and
 * makes no API call at all, which is why a Wikipedia outage cannot take the
 * pictures down.
 *
 * Two sizes are recorded per species. The tree draws 32–56px discs and the
 * panel draws a full-bleed hero; serving one 960px file to both — which is what
 * PHOTO_MAP did — meant every node icon downloaded roughly 30× the pixels it
 * could display.
 *
 *   node scripts/build-photo-snapshot.mjs             # rebuild from Wikipedia
 *   node scripts/build-photo-snapshot.mjs --bootstrap # offline: re-cut PHOTO_MAP
 *   node scripts/build-photo-snapshot.mjs --limit 20  # smoke it quickly
 *   node scripts/build-photo-snapshot.mjs --check     # exit 1 if stale
 *   node scripts/build-photo-snapshot.mjs --credits-only  # keep every photo,
 *                                                     # re-read authors and licences
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : d; };
const CHECK_ONLY = argv.includes('--check');
const CREDITS_ONLY = argv.includes('--credits-only');
const LIMIT = Number(arg('limit', 0)) || 0;

const OUT = 'js/photoSnapshot.js';
const THUMB_W = 400;   // tree node discs, retina-comfortable at 56px
const HERO_W = 1280;   // panel hero, full-bleed on a desktop panel

const UA = 'TreeOfLife/1.0 (https://www.treeoflife.wiki; photo snapshot builder)';
const API = 'https://en.wikipedia.org/w/api.php';
const BATCH = 50;

/* Ask MediaWiki for the thumbnail at the width we want, rather than rewriting
   the width inside a URL some other endpoint handed back.

   upload.wikimedia.org serves a thumbnail only if that exact size has already
   been rendered. An external request for a size that has not been generated is
   answered 400 — it is not rendered on demand. So rewriting `/320px-` to
   `/400px-` produced URLs that were syntactically perfect and uniformly dead:
   the first two runs of photo-refresh reported 26 of 27 and then 21 of 25
   sampled thumbnails broken, and both times the only success was the one URL
   with no /thumb/ segment. Originals always exist; generated sizes do not.

   `prop=pageimages&pithumbsize=N` renders the thumbnail as part of answering,
   so the URL it returns is guaranteed to resolve. It also accepts up to 50
   titles per request, which turns 185 lookups into four — and the rate limit
   that cost 23 lookups on an earlier run stops being reachable at all. */

/* The API decorates image URLs with `?utm_source=…&utm_campaign=api`, and
   upload.wikimedia.org answers 400 to a request carrying unexpected query
   parameters. Strip them everywhere a URL enters the snapshot.

   It also now answers on thumb.wikimedia.org, which serves the same files at
   the same paths — and which the Content-Security-Policy does not allow, so a
   refresh that wrote those URLs would blank every photograph on the site.
   Rewriting the host keeps the policy to one image origin. */
function stripQuery(url) {
  return url ? String(url).split('?')[0].replace(/^https:\/\/thumb\.wikimedia\.org\//, 'https://upload.wikimedia.org/') : null;
}

// ── Credits ─────────────────────────────────────────────────────────────────
/* Commons photographs are mostly CC BY-SA, which asks for the author, the
   licence and a link wherever the photo is shown. The panel used to say
   "Wikipedia / Wikimedia Commons" for all 386, which names neither. Each
   file's author and licence are read from Commons here and committed with the
   URLs, so the panel and credits.html can show them without an API call. */
const COMMONS = 'https://commons.wikimedia.org/w/api.php';

/* ".../commons/thumb/a/ab/Name.jpg/500px-Name.jpg" and ".../commons/a/ab/Name.jpg"
   both name the file "Name.jpg". */
export function commonsFile(url) {
  const m = String(url || '').match(/\/wikipedia\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/]+)/);
  return m ? decodeURIComponent(m[1]).replace(/_/g, ' ') : null;
}

/* Artist is HTML ("<a href=…>Name</a>"), sometimes a paragraph of it. Keep the
   words, drop the markup, and cap it at a line. */
function plain(html) {
  const text = String(html || '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ').trim();
  return text.length > 90 ? text.slice(0, 87).trimEnd() + '…' : text;
}

async function creditsBatch(files, attempt = 0) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', formatversion: '2', prop: 'imageinfo', iiprop: 'extmetadata',
    iiextmetadatafilter: 'Artist|LicenseShortName|LicenseUrl', titles: files.map((f) => 'File:' + f).join('|'),
  });
  try {
    const res = await fetch(COMMONS + '?' + params, { headers: { 'User-Agent': UA, accept: 'application/json' } });
    if (res.status === 429 || res.status >= 500) {
      const after = Number(res.headers.get('retry-after'));
      const wait = Number.isFinite(after) && after > 0 ? after * 1000 : 3000 * Math.pow(2, attempt);
      if (attempt < 6) { await sleep(Math.min(wait, 60000)); return creditsBatch(files, attempt + 1); }
      throw new Error('HTTP ' + res.status);
    }
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    const alias = new Map();
    for (const n of json.query?.normalized || []) alias.set(n.to, n.from);
    const out = new Map();
    for (const page of json.query?.pages || []) {
      const md = page.imageinfo?.[0]?.extmetadata;
      if (!md) continue;
      const asked = (alias.get(page.title) || page.title).replace(/^File:/, '').replace(/_/g, ' ');
      out.set(asked, {
        by: plain(md.Artist?.value),
        lic: plain(md.LicenseShortName?.value),
        page: 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(page.title.replace(/ /g, '_')).replace(/%3A/, ':'),
      });
    }
    return out;
  } catch (err) {
    if (attempt < 6) { await sleep(3000 * Math.pow(2, attempt)); return creditsBatch(files, attempt + 1); }
    throw err;
  }
}

/* Credits for every entry in the snapshot, keyed by id. Batches of 50 with a
   pause between them: Commons answers bursts with 429. */
async function creditsFor(snapshot) {
  const fileOf = new Map(Object.entries(snapshot).map(([id, e]) => [id, commonsFile(e.hero || e.thumb)]));
  const files = [...new Set([...fileOf.values()].filter(Boolean))];
  const byFile = new Map();
  for (let i = 0; i < files.length; i += BATCH) {
    const got = await creditsBatch(files.slice(i, i + BATCH));
    for (const [k, v] of got) byFile.set(k, v);
    process.stderr.write(`  credits ${Math.min(i + BATCH, files.length)}/${files.length}\n`);
    await sleep(1500);
  }
  const out = {};
  for (const [id, f] of fileOf) if (f && byFile.has(f)) out[id] = byFile.get(f);
  return out;
}

async function apiBatch(titles, width, attempt = 0) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', formatversion: '2',
    prop: 'pageimages', piprop: 'thumbnail', pithumbsize: String(width),
    redirects: '1', titles: titles.join('|'),
  });
  try {
    const res = await fetch(API + '?' + params, {
      headers: { 'User-Agent': UA, accept: 'application/json' },
    });
    if (res.status === 429 || res.status >= 500) {
      const after = Number(res.headers.get('retry-after'));
      const wait = Number.isFinite(after) && after > 0 ? after * 1000 : 2000 * Math.pow(2, attempt);
      if (attempt < 5) { await sleep(Math.min(wait, 30000)); return apiBatch(titles, width, attempt + 1); }
      throw new Error('HTTP ' + res.status);
    }
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();

    /* Map each requested title to whatever MediaWiki resolved it to, so a
       redirect or a capitalisation fix still lands on the id that asked. */
    const alias = new Map();
    for (const n of json.query?.normalized || []) alias.set(n.from, n.to);
    for (const r of json.query?.redirects || []) alias.set(r.from, r.to);

    const byTitle = new Map();
    for (const page of json.query?.pages || []) {
      if (page.thumbnail?.source) byTitle.set(page.title, stripQuery(page.thumbnail.source));
    }

    const out = new Map();
    for (const t of titles) {
      let resolved = t;
      for (let hop = 0; hop < 4 && alias.has(resolved); hop++) resolved = alias.get(resolved);
      const url = byTitle.get(resolved);
      if (url) out.set(t, url);
    }
    return out;
  } catch (err) {
    if (attempt < 5) { await sleep(2000 * Math.pow(2, attempt)); return apiBatch(titles, width, attempt + 1); }
    throw err;
  }
}

/* Resolve every title at one width. Returns Map<title, url>. */
async function resolveAll(titles, width) {
  const out = new Map();
  for (let i = 0; i < titles.length; i += BATCH) {
    const got = await apiBatch(titles.slice(i, i + BATCH), width);
    for (const [k, v] of got) out.set(k, v);
    process.stderr.write(`  ${Math.min(i + BATCH, titles.length)}/${titles.length} at ${width}px\n`);
  }
  return out;
}

function renderModule(snapshot, total, sourceLabel) {
  const covered = Object.keys(snapshot).length;
  return [
    '/* AUTO-GENERATED by scripts/build-photo-snapshot.mjs — do not edit by hand.',
    ' *',
    ' * Every species photograph, resolved from ' + sourceLabel + ' and pinned here',
    ' * so the browser needs no API call to draw the tree. Refreshed weekly by',
    ' * .github/workflows/photo-refresh.yml, which opens a pull request when an',
    ' * article changes its lead image — that is what repairs dead photos.',
    ' *',
    ' * ' + covered + ' of ' + total + ' entries carry an image.',
    ' *',
    ' * thumb — ' + THUMB_W + 'px, for the discs in the tree.',
    ' * hero  — ' + HERO_W + 'px, for the panel.',
    ' *',
    ' * by, lic, page — the author and licence recorded on Commons, and the',
    ' * file page. Images are Wikimedia Commons content, overwhelmingly CC BY-SA,',
    ' * so the credit line in the panel has to stay wherever one of these is',
    ' * shown; credits.html lists them all.',
    ' */',
    'export const PHOTO_SNAPSHOT = {',
    ...Object.keys(snapshot).sort().map((id) => {
      const e = snapshot[id];
      const credit = e.page ? ',by:' + JSON.stringify(e.by || '') + ',lic:' + JSON.stringify(e.lic || '') + ',page:' + JSON.stringify(e.page) : '';
      return '  ' + JSON.stringify(id) + ': {thumb:' + JSON.stringify(e.thumb) + ',hero:' + JSON.stringify(e.hero) + credit + '},';
    }),
    '};',
    '',
  ].join('\n');
}

/* Whatever is already committed. The rebuild starts from this rather than from
   an empty object: WIKI_TITLES covers 185 species but the snapshot carries 386,
   the rest seeded from PHOTO_MAP, so building fresh would drop 201 entries on
   every refresh — a "refresh" that deletes more than half the photographs. It
   also means an article that loses its lead image keeps whatever was working
   before, which is the behaviour this pipeline exists to guarantee. */
async function loadPrevious() {
  if (!existsSync(OUT)) return {};
  try {
    const mod = await import(pathToFileURL(OUT).href);
    return mod.PHOTO_SNAPSHOT || {};
  } catch { return {}; }
}

/* Offline seed. PHOTO_MAP's URLs are already-materialised thumbnails, so they
   are kept at their own width — re-cutting them would hit exactly the wall
   described above. It exists so the pipeline can land and be reviewed before
   the first scheduled refresh runs, and so a contributor without network access
   can still regenerate a working file. */
function bootstrapFromPhotoMap(PHOTO_MAP) {
  const snapshot = {};
  for (const [id, entry] of Object.entries(PHOTO_MAP)) {
    if (!entry || !entry.url) continue;
    const url = stripQuery(entry.url);
    snapshot[id] = { thumb: url, hero: url };
  }
  return snapshot;
}

async function main() {
  const { WIKI_TITLES, PHOTO_MAP } = await import(pathToFileURL('js/speciesData.js').href);

  if (argv.includes('--bootstrap')) {
    const snapshot = bootstrapFromPhotoMap(PHOTO_MAP);
    writeFileSync(OUT, renderModule(snapshot, Object.keys(PHOTO_MAP).length, 'PHOTO_MAP (offline seed)'));
    console.log(`Wrote ${OUT} from PHOTO_MAP — ${Object.keys(snapshot).length} entries, no network used.`);
    return;
  }

  const previous = await loadPrevious();

  if (CREDITS_ONLY) {
    const snapshot = { ...previous };
    for (const e of Object.values(snapshot)) { e.thumb = stripQuery(e.thumb); e.hero = stripQuery(e.hero); }
    const credits = await creditsFor(snapshot);
    for (const [id, e] of Object.entries(snapshot)) if (credits[id]) Object.assign(e, credits[id]);
    writeFileSync(OUT, renderModule(snapshot, Object.keys(snapshot).length, 'the MediaWiki pageimages API'));
    const credited = Object.values(snapshot).filter((e) => e.page).length;
    console.log(`Wrote ${OUT}: ${credited}/${Object.keys(snapshot).length} photos carry an author and licence; no photo changed.`);
    return;
  }

  let ids = Object.keys(WIKI_TITLES);
  if (LIMIT) ids = ids.slice(0, LIMIT);
  const titles = ids.map((id) => WIKI_TITLES[id]);

  const snapshot = { ...previous };

  process.stderr.write(`Resolving ${ids.length} articles at two widths…\n`);
  let thumbs, heroes;
  try {
    thumbs = await resolveAll(titles, THUMB_W);
    heroes = await resolveAll(titles, HERO_W);
  } catch (err) {
    console.error(`\nAborting: the API is not answering (${err.message}).`);
    console.error('The committed snapshot is left untouched.');
    process.exit(2);
  }

  const missing = [];
  ids.forEach((id, i) => {
    const thumb = thumbs.get(titles[i]);
    if (!thumb) { missing.push(id); return; }
    snapshot[id] = { thumb, hero: heroes.get(titles[i]) || thumb };
  });

  /* Entries carried over from the previous snapshot go through the same host
     rewrite, and every entry gets its credit re-read: a file can change its
     licence, or its author can ask for a different credit. When Commons
     cannot be reached the previous credit stays. */
  for (const e of Object.values(snapshot)) { e.thumb = stripQuery(e.thumb); e.hero = stripQuery(e.hero); }
  let credits = {};
  try { credits = await creditsFor(snapshot); }
  catch (err) { console.error(`  credits: Commons is not answering (${err.message}); keeping the previous ones.`); }
  for (const [id, e] of Object.entries(snapshot)) {
    const c = credits[id];
    if (c) Object.assign(e, c);
  }

  /* Belt and braces for stripQuery(): assert on the shape of what we are about
     to commit, so a URL that would 400 — or one the CSP would block — cannot
     reach the file even if a later edit routes around the rewriting. */
  const allowed = (u) => !u || (u.startsWith('https://upload.wikimedia.org/') && !u.includes('?'));
  const dirty = Object.entries(snapshot).filter(([, e]) => !allowed(e.thumb) || !allowed(e.hero));
  if (dirty.length) {
    console.error(`\nAborting: ${dirty.length} URLs carry a query string, which upload.wikimedia.org`);
    console.error('answers 400 to, or a host other than upload.wikimedia.org, which the CSP blocks. First few:');
    console.error(dirty.slice(0, 3).map(([id, e]) => `  ${id}: ${e.thumb}`).join('\n'));
    process.exit(2);
  }

  const covered = Object.keys(snapshot).length;
  const resolved = ids.length - missing.length;
  const body = renderModule(snapshot, covered, 'the MediaWiki pageimages API');

  if (CHECK_ONLY) {
    const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
    if (current === body) { console.log(`Snapshot is current (${covered} photos).`); return; }
    console.error('Snapshot is stale — run: node scripts/build-photo-snapshot.mjs');
    process.exit(1);
  }

  writeFileSync(OUT, body);
  console.log(`\nWrote ${OUT}`);
  console.log(`  ${resolved}/${ids.length} articles resolved; ${covered} entries in the snapshot`);
  if (missing.length) {
    console.log(`  ${missing.length} articles have no image and kept their previous entry: ` +
      `${missing.slice(0, 12).join(', ')}${missing.length > 12 ? '…' : ''}`);
  }
  const curated = Object.keys(PHOTO_MAP).filter((id) => !snapshot[id]);
  if (curated.length) console.log(`  ${curated.length} ids fall back to the curated PHOTO_MAP`);
  const credited = Object.values(snapshot).filter((e) => e.page).length;
  console.log(`  ${credited}/${covered} photos carry an author and licence from Commons`);
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch((err) => { console.error(err); process.exit(1); });
}
