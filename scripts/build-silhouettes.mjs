#!/usr/bin/env node
/**
 * build-silhouettes.mjs — fetch a PhyloPic silhouette for every taxon and
 * write assets/silhouettes/ plus js/silhouettes.js.
 *
 * Why silhouettes
 * ---------------
 * A tree disc is 32-56px. Nothing photographic survives that: a lion is a
 * brown smudge and an electron micrograph of Proteobacteria is grey static.
 * The tree was showing 300-odd of them, each cancelling the colour-coded ring
 * that was doing the actual identifying.
 *
 * A silhouette is pure shape, which is the one thing that does read at 40px,
 * and PhyloPic publishes them for the whole tree of life — including clades
 * and extinct taxa, where no photograph exists at all. Tinted with the node's
 * colour they give the tree a single visual language instead of 300 unrelated
 * crops.
 *
 * The photographs are not discarded. They move to where they can be seen: the
 * detail panel, at 1280px.
 *
 * Almost everything is CC0 or CC BY; the licence for each is recorded in the
 * generated module so attribution stays possible.
 *
 *   node scripts/build-silhouettes.mjs             # full run
 *   node scripts/build-silhouettes.mjs --limit 20  # smoke it quickly
 */
import { mkdirSync, writeFileSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : d; };
const LIMIT = Number(arg('limit', 0)) || 0;

const API = 'https://api.phylopic.org';
const OUT_DIR = 'assets/silhouettes';
const OUT_MODULE = 'js/silhouettes.js';
const UA = 'TreeOfLife/1.0 (https://www.treeoflife.wiki; silhouette builder)';

async function api(path, attempt = 0) {
  const url = path.startsWith('http') ? path : API + path;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, accept: 'application/json' } });
    if (res.status === 404) return null;
    if (res.status === 429 || res.status >= 500) throw new Error('HTTP ' + res.status);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    if (attempt < 4) { await sleep(1500 * Math.pow(2, attempt)); return api(path, attempt + 1); }
    throw err;
  }
}

/* Diagnostic. The resolver has now guessed the response shape wrong twice —
   first `_embedded.items`, then `_links.items` — and each guess cost a full CI
   round trip to disprove because api.phylopic.org is unreachable from the
   development sandbox. This prints what the API actually returns so the next
   change is based on the response rather than on a recollection of it.

     node scripts/build-silhouettes.mjs --probe Bacteria
*/
if (argv.includes('--probe')) {
  const name = arg('probe', 'Bacteria');
  const root = await api('/');
  console.log('build:', root?.build);
  for (const path of [
    `/nodes?filter_name=${encodeURIComponent(name.toLowerCase())}&build=${root?.build}`,
    `/autocomplete?query=${encodeURIComponent(name.toLowerCase())}`,
    `/nodes?filter_name=${encodeURIComponent(name.toLowerCase())}&build=${root?.build}&page=0`,
  ]) {
    console.log('\n=== GET ' + path + ' ===');
    try {
      const res = await fetch(API + path, { headers: { 'User-Agent': UA, accept: 'application/json' } });
      console.log('status', res.status);
      console.log((await res.text()).slice(0, 2400));
    } catch (err) { console.log('threw:', err.message); }
  }
  process.exit(0);
}

/* The name to search PhyloPic with. `latin` carries a rank prefix on ranked
   groups ("Class Mammalia") and a binomial on species ("Panthera leo"); the
   prefix is ours, not part of the name, so it has to come off. Species fall
   back to their genus, because PhyloPic covers genera far more completely than
   it covers individual species and a congener's outline is the right shape. */
const RANK_PREFIX = /^(Domain|Kingdom|Subkingdom|Superphylum|Phylum|Subphylum|Superclass|Class|Subclass|Infraclass|Superorder|Order|Suborder|Infraorder|Family|Subfamily|Tribe|Genus|Clade|Division|Superfamily|Parvorder|Section)\s+/i;

function searchNames(node) {
  const latin = (node.latin || '').trim();
  if (!latin) return [];
  const bare = latin.replace(RANK_PREFIX, '').trim();
  const names = [bare];
  const words = bare.split(/\s+/);
  if (words.length >= 2) names.push(words[0]);          // genus
  return [...new Set(names.filter(Boolean))];
}

/* A PhyloPic collection puts its members in `_links.items` as link objects,
   each already carrying the build in its href. The first version of this read
   `_embedded.items`, which does not exist, so every lookup found nothing and
   the run resolved 0 of 165 taxa while reporting no error at all. */
async function resolveOne(build, name) {
  const found = await api(`/nodes?filter_name=${encodeURIComponent(name.toLowerCase())}&build=${build}`);
  if (!found || !found.totalItems) return null;

  /* The collection response is a paged *envelope*: its _links carry only
     firstPage, lastPage and self, and the members live on the page resource.
     Reading items straight off the collection — under either `_embedded.items`
     or `_links.items` — finds nothing, which is why two earlier versions
     resolved 0 of 305 taxa while the API was answering 200 with
     `totalItems: 1`. */
  const page = await api(found._links?.firstPage?.href ||
    `/nodes?filter_name=${encodeURIComponent(name.toLowerCase())}&build=${build}&page=0`);
  const items = page?._links?.items || [];
  if (!items.length || !items[0].href) return null;

  const node = await api(items[0].href);
  const imgHref = node?._links?.primaryImage?.href;
  if (!imgHref) return null;

  const img = await api(imgHref);
  const vector = img?._links?.vectorFile?.href;
  if (!vector) return null;

  const lic = img?._links?.license;
  return {
    url: vector.startsWith('http') ? vector : API + vector,
    license: (lic && (lic.href || lic.title)) || '',
    attribution: img?.attribution || '',
  };
}

async function download(url, attempt = 0) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status === 429 || res.status >= 500) throw new Error('HTTP ' + res.status);
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    if (attempt < 4) { await sleep(1500 * Math.pow(2, attempt)); return download(url, attempt + 1); }
    return null;
  }
}

/* PhyloPic vectors carry their own black fill. The tree tints each disc with
   the node's colour, so the fill has to become `currentColor` for CSS to reach
   it — otherwise every silhouette is a black hole on a dark background. */
function recolour(svg) {
  return svg
    .replace(/fill="(?!none)[^"]*"/gi, 'fill="currentColor"')
    .replace(/fill:\s*(?!none)[^;"']+/gi, 'fill:currentColor')
    .replace(/<svg\b(?![^>]*\bfill=)/i, '<svg fill="currentColor"');
}

const { TREE } = await import(pathToFileURL('js/treeData.js').href);
const { expandTree } = await import(pathToFileURL('js/treeExpansion.js').href);
const { lightenColor } = await import(pathToFileURL('js/utils.js').href).catch(() => ({}));
try {
  expandTree(TREE, lightenColor || ((c) => c));
} catch (err) {
  // Loud, not silent: without the expansion only the base tree's 165 taxa are
  // considered and the 300-odd species are quietly skipped.
  console.error('expandTree failed, continuing with the base tree only:', err.message);
}

const nodes = [];
(function walk(n) { nodes.push(n); (n.children || []).forEach(walk); })(TREE);

let targets = nodes.filter((n) => n.latin);
if (LIMIT) targets = targets.slice(0, LIMIT);

mkdirSync(OUT_DIR, { recursive: true });

const build = (await api('/'))?.build;
if (!build) { console.error('Could not read the PhyloPic build number — aborting.'); process.exit(2); }
process.stderr.write(`PhyloPic build ${build}; resolving ${targets.length} taxa…\n`);

const manifest = {};
let hit = 0, miss = 0;

for (let i = 0; i < targets.length; i++) {
  const node = targets[i];
  let got = null;
  for (const name of searchNames(node)) {
    try { got = await resolveOne(build, name); } catch { got = null; }
    if (got) break;
    await sleep(120);
  }
  if (!got) {
    miss++;
    if (miss <= 5) process.stderr.write(`  no silhouette for ${node.id} (${searchNames(node).join(' / ')})\n`);
    continue;
  }

  const svg = await download(got.url);
  if (!svg || !/<svg/i.test(svg)) { miss++; continue; }

  writeFileSync(`${OUT_DIR}/${node.id}.svg`, recolour(svg));
  manifest[node.id] = { license: got.license, attribution: got.attribution };
  hit++;
  if ((hit + miss) % 25 === 0) process.stderr.write(`  ${hit + miss}/${targets.length} (${hit} found)\n`);
  await sleep(120);
}

/* Drop files for taxa that no longer resolve, so the directory never
   accumulates silhouettes nothing references. */
for (const f of readdirSync(OUT_DIR)) {
  const id = f.replace(/\.svg$/, '');
  if (f.endsWith('.svg') && !manifest[id]) unlinkSync(`${OUT_DIR}/${f}`);
}

const body = [
  '/* AUTO-GENERATED by scripts/build-silhouettes.mjs — do not edit by hand.',
  ' *',
  ' * Which taxa have a PhyloPic silhouette in assets/silhouettes/, and the',
  ' * licence each one carries. The tree draws these at the disc instead of a',
  ' * photograph: nothing photographic survives 40px, and a silhouette is pure',
  ' * shape, which is the one thing that does.',
  ' *',
  ` * ${hit} of ${targets.length} taxa resolved.`,
  ' *',
  ' * PhyloPic content is overwhelmingly CC0 or CC BY. Anything not public',
  ' * domain needs its attribution shown wherever the silhouette is.',
  ' */',
  'export const SILHOUETTES = {',
  ...Object.keys(manifest).sort().map((id) =>
    `  ${JSON.stringify(id)}: ${JSON.stringify(manifest[id])},`),
  '};',
  '',
].join('\n');
writeFileSync(OUT_MODULE, body);

console.log(`\n${hit} silhouettes written to ${OUT_DIR}, ${miss} taxa had none.`);
if (hit < 40) { console.error('Suspiciously few resolved — not trusting this run.'); process.exit(2); }
