#!/usr/bin/env node
/**
 * build-photo-snapshot.mjs — resolve every species' photograph from Wikipedia
 * and write js/photoSnapshot.js.
 *
 * Why this exists
 * ---------------
 * PHOTO_MAP pins ~400 `upload.wikimedia.org/.../thumb/...` URLs by hand. Those
 * are file-path URLs: they die when a file is renamed, re-uploaded under a new
 * name, or deleted from Commons, and nothing repairs them. photo-check.yml
 * could only *report* the rot once a week.
 *
 * The fix is to stop pinning by hand. The Wikipedia REST summary endpoint
 *
 *     https://en.wikipedia.org/api/rest_v1/page/summary/<title>
 *
 * always returns whatever image the article carries *today*, so resolving
 * through it and committing the result gives a snapshot that can be rebuilt
 * from scratch whenever it drifts. photo-refresh.yml does exactly that on a
 * weekly schedule and opens a PR when anything moved, so a dead photo repairs
 * itself instead of being reported.
 *
 * Nothing here runs in the browser. The site loads the committed snapshot and
 * makes no API call at all, which is why a Wikipedia outage cannot take the
 * pictures down.
 *
 * Two sizes are recorded per species. The tree draws 32–56px discs and the
 * panel draws a full-bleed hero; serving one 960px file to both — which is
 * what PHOTO_MAP did — meant every node icon downloaded roughly 30× the pixels
 * it could display.
 *
 *   node scripts/build-photo-snapshot.mjs            # full rebuild
 *   node scripts/build-photo-snapshot.mjs --limit 20 # smoke it quickly
 *   node scripts/build-photo-snapshot.mjs --check    # exit 1 if stale
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : d; };
const CHECK_ONLY = argv.includes('--check');
const LIMIT = Number(arg('limit', 0)) || 0;

const OUT = 'js/photoSnapshot.js';
const THUMB_W = 400;   // tree node discs, retina-comfortable at 56px
const HERO_W = 1280;   // panel hero, full-bleed on a desktop panel

const UA = 'TreeOfLife/1.0 (https://www.treeoflife.wiki; photo snapshot builder)';

/* Commons thumbnail URLs embed their width as `/<n>px-<name>`. Rewriting that
   number is the documented way to ask for another size, and it keeps us on the
   thumbnail host rather than serving a 4000px original to a 40px circle.
   Originals (no /thumb/ segment) have no such handle and are returned as-is.

   The query string is dropped first. The REST summary endpoint decorates every
   image URL with `?utm_source=…&utm_campaign=api`, and upload.wikimedia.org
   answers 400 to a thumbnail request carrying unexpected query parameters — so
   passing the API's URLs through verbatim yields a snapshot in which every
   single photograph is broken. The sample fetch in photo-refresh.yml caught
   this on the first run; keep both, because the tracking parameters are the
   API's to change and this is the only thing standing between a quiet upstream
   tweak and a site with no pictures. */
function atWidth(url, width) {
  if (!url) return null;
  const clean = url.split('?')[0];
  if (!clean.includes('/thumb/')) return clean;
  return clean.replace(/\/(\d+)px-([^/]+)$/, `/${width}px-$2`);
}

/* The REST API rate-limits by IP, and CI runners share addresses, so 429 is
   the common failure rather than the exceptional one — six workers with a
   sub-second backoff lost 23 of 185 lookups on the first real run. Retry-After
   is honoured when sent, the backoff starts at two seconds, and a 429 does not
   count against the attempt budget as harshly as a hard error would. */
async function fetchSummary(title, attempt = 0) {
  const url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' +
    encodeURIComponent(title) + '?redirect=true';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, accept: 'application/json' } });
    if (res.status === 404) return { missing: true };
    if (res.status === 429) {
      const after = Number(res.headers.get('retry-after'));
      const wait = Number.isFinite(after) && after > 0 ? after * 1000 : 2000 * Math.pow(2, attempt);
      if (attempt < 5) { await sleep(Math.min(wait, 30000)); return fetchSummary(title, attempt + 1); }
      return { error: 'HTTP 429 after ' + (attempt + 1) + ' attempts' };
    }
    if (res.status >= 500) throw new Error('HTTP ' + res.status);
    if (!res.ok) return { missing: true };
    return await res.json();
  } catch (err) {
    if (attempt < 5) { await sleep(2000 * Math.pow(2, attempt)); return fetchSummary(title, attempt + 1); }
    return { error: String(err && err.message || err) };
  }
}

/* Whatever is already committed, so a lookup that fails today keeps yesterday's
   photograph instead of deleting it. Without this a rate-limited run silently
   removes every species it could not reach — the failure mode this whole
   pipeline exists to prevent. */
async function loadPrevious() {
  if (!existsSync(OUT)) return {};
  try {
    const mod = await import(pathToFileURL(OUT).href + '?t=' + process.pid);
    return mod.PHOTO_SNAPSHOT || {};
  } catch { return {}; }
}

function renderModule(snapshot, total, sourceLabel) {
  const covered = Object.keys(snapshot).length;
  return [
    '/* AUTO-GENERATED by scripts/build-photo-snapshot.mjs \u2014 do not edit by hand.',
    ' *',
    ' * Every species photograph, resolved from ' + sourceLabel + ' and pinned here',
    ' * so the browser needs no API call to draw the tree. Refreshed weekly by',
    ' * .github/workflows/photo-refresh.yml, which opens a pull request when an',
    ' * article changes its lead image \u2014 that is what repairs dead photos.',
    ' *',
    ' * ' + covered + ' of ' + total + ' entries carry an image.',
    ' *',
    ' * thumb \u2014 ' + THUMB_W + 'px, for the discs in the tree.',
    ' * hero  \u2014 ' + HERO_W + 'px, for the panel.',
    ' *',
    ' * Images are Wikimedia Commons content, overwhelmingly CC BY-SA, so the',
    ' * credit line in the panel has to stay wherever one of these is shown.',
    ' */',
    'export const PHOTO_SNAPSHOT = {',
    ...Object.keys(snapshot).sort().map((id) => {
      const e = snapshot[id];
      return '  ' + JSON.stringify(id) + ': {thumb:' + JSON.stringify(e.thumb) + ',hero:' + JSON.stringify(e.hero) + '},';
    }),
    '};',
    '',
  ].join('\n');
}

/* Offline seed. Derives the snapshot from the URLs already pinned in
   PHOTO_MAP by rewriting their width, with no network at all. It exists so the
   two-size pipeline can land and be reviewed before the first scheduled
   refresh runs, and so a contributor without network access can still
   regenerate a working file. The scheduled job overwrites it with
   API-resolved data, which is the version that actually self-heals. */
function bootstrapFromPhotoMap(PHOTO_MAP) {
  const snapshot = {};
  for (const [id, entry] of Object.entries(PHOTO_MAP)) {
    if (!entry || !entry.url) continue;
    snapshot[id] = { thumb: atWidth(entry.url, THUMB_W), hero: atWidth(entry.url, HERO_W) };
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

  let ids = Object.keys(WIKI_TITLES);
  if (LIMIT) ids = ids.slice(0, LIMIT);

  /* Start from what is already committed and overwrite what we can resolve.
     WIKI_TITLES covers 185 species; the snapshot carries 386, the rest seeded
     from PHOTO_MAP. Building into an empty object would drop those 201 on
     every refresh — a "refresh" that deletes more than half the photographs.
     Merging also means a missing or unreachable article keeps whatever was
     working before, which is the behaviour this pipeline exists to guarantee. */
  const snapshot = { ...previous };
  const missing = [];
  const failed = [];

  // Three at a time. Six drew 429s from the REST API on a CI runner, and the
  // whole set is under 200 titles — this still finishes in about a minute.
  const CONCURRENCY = 3;
  let cursor = 0;
  let done = 0;

  async function worker() {
    for (;;) {
      const i = cursor++;
      if (i >= ids.length) return;
      const id = ids[i];
      const data = await fetchSummary(WIKI_TITLES[id]);
      done++;
      if (done % 50 === 0) process.stderr.write(`  ${done}/${ids.length}\n`);

      if (data.error) { failed.push({ id, error: data.error }); continue; }
      const src = data.originalimage?.source || data.thumbnail?.source;
      if (!src) { missing.push(id); continue; }

      snapshot[id] = {
        thumb: atWidth(data.thumbnail?.source || src, THUMB_W),
        hero: atWidth(data.originalimage?.source && data.thumbnail?.source
          ? data.thumbnail.source : src, HERO_W),
        page: data.content_urls?.desktop?.page || null,
      };
    }
  }

  process.stderr.write(`Resolving ${ids.length} articles…\n`);
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  /* Failures already keep their previous value by virtue of the merge above.
     What matters is how many failed with nothing to fall back on. */
  const lost = failed.filter((f) => !previous[f.id]).length;
  const recovered = failed.length - lost;

  /* Abort only if the run would leave real gaps — writing those would shrink
     the snapshot rather than refresh it. */
  if (lost > ids.length * 0.05) {
    console.error(`\nAborting: ${lost}/${ids.length} lookups failed with no previous entry to keep.`);
    console.error(failed.filter((f) => !previous[f.id]).slice(0, 5)
      .map((f) => `  ${f.id}: ${f.error}`).join('\n'));
    process.exit(2);
  }

  const covered = Object.keys(snapshot).length;
  const curated = Object.keys(PHOTO_MAP).filter((id) => !snapshot[id]);
  const resolved = ids.length - missing.length - failed.length;

  /* Belt and braces for the query-string problem in atWidth(): assert on the
     shape of what we are about to commit, so a URL that would 400 never
     reaches the file even if a future edit routes around the stripping. */
  const dirty = Object.entries(snapshot)
    .filter(([, e]) => (e.thumb && e.thumb.includes('?')) || (e.hero && e.hero.includes('?')));
  if (dirty.length) {
    console.error(`\nAborting: ${dirty.length} resolved URLs still carry a query string, which`);
    console.error('upload.wikimedia.org answers 400 to. First few:');
    console.error(dirty.slice(0, 3).map(([id, e]) => `  ${id}: ${e.thumb}`).join('\n'));
    process.exit(2);
  }

  const body = renderModule(snapshot, ids.length, 'the Wikipedia REST summary API');

  if (CHECK_ONLY) {
    const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
    if (current === body) { console.log(`Snapshot is current (${covered} photos).`); return; }
    console.error('Snapshot is stale — run: node scripts/build-photo-snapshot.mjs');
    process.exit(1);
  }

  writeFileSync(OUT, body);
  console.log(`\nWrote ${OUT}`);
  console.log(`  ${resolved}/${ids.length} articles resolved; ${covered} entries in the snapshot`);
  if (missing.length) console.log(`  ${missing.length} articles have no image: ${missing.slice(0, 12).join(', ')}${missing.length > 12 ? '…' : ''}`);
  if (failed.length) console.log(`  ${failed.length} lookups failed; ${recovered} kept their previous entry, ${lost} had none`);
  if (curated.length) console.log(`  ${curated.length} ids fall back to the curated PHOTO_MAP`);
}

main().catch((err) => { console.error(err); process.exit(1); });
