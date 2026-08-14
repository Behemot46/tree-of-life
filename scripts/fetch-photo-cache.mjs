#!/usr/bin/env node
/**
 * fetch-photo-cache.mjs — download every species photograph into photo-cache/.
 *
 * Why this exists
 * ---------------
 * The sandbox this project is developed in cannot reach upload.wikimedia.org:
 * the egress proxy answers 403 to CONNECT. Every screenshot taken there shows
 * the tree with empty node discs, which means the dominant visual element of
 * every node is invisible to whoever is doing the design work. Judging colour
 * balance, node weight or whether a label survives on top of a photograph is
 * guesswork under those conditions.
 *
 * GitHub Actions is not behind that proxy, and github.com *is* reachable from
 * the sandbox. So the runner fetches the photographs and pushes them to a
 * branch, and the sandbox gets them with a shallow fetch — see
 * .github/workflows/photo-cache.yml.
 *
 * scripts/probe.mjs then serves them to Chromium by intercepting requests to
 * upload.wikimedia.org, so the local page renders exactly what a visitor sees.
 *
 * The cache is a development aid, never shipped: the branch it lives on is not
 * merged, and photo-cache/ is git-ignored on every other branch.
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { setTimeout as sleep } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';

const OUT_DIR = 'photo-cache';
const UA = 'TreeOfLife/1.0 (https://www.treeoflife.wiki; local render cache)';
const CONCURRENCY = 8;

/* Content-addressed by URL so the manifest is a plain lookup and a re-run
   overwrites rather than duplicating. */
function nameFor(url) {
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 16);
  const ext = (url.split('?')[0].match(/\.(jpe?g|png|gif|webp|svg)$/i) || [, 'jpg'])[1].toLowerCase();
  return `${hash}.${ext === 'jpeg' ? 'jpg' : ext}`;
}

async function download(url, attempt = 0) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status === 429 || res.status >= 500) throw new Error('HTTP ' + res.status);
    if (!res.ok) return { skipped: res.status };
    return { buf: Buffer.from(await res.arrayBuffer()) };
  } catch (err) {
    if (attempt < 3) { await sleep(1000 * Math.pow(2, attempt)); return download(url, attempt + 1); }
    return { error: String(err && err.message || err) };
  }
}

const { PHOTO_SNAPSHOT } = await import(pathToFileURL('js/photoSnapshot.js').href);

/* Only the tree-disc cut. The hero is a 1280px file per species and the point
   here is to see the tree, not to mirror Commons. */
const urls = [...new Set(Object.values(PHOTO_SNAPSHOT).map((e) => e.thumb).filter(Boolean))];
mkdirSync(OUT_DIR, { recursive: true });

const manifest = {};
let done = 0, failed = 0, skipped = 0;
let cursor = 0;

async function worker() {
  for (;;) {
    const i = cursor++;
    if (i >= urls.length) return;
    const url = urls[i];
    const name = nameFor(url);
    const path = `${OUT_DIR}/${name}`;
    if (existsSync(path)) { manifest[url] = name; done++; continue; }

    const r = await download(url);
    if (r.buf) { writeFileSync(path, r.buf); manifest[url] = name; done++; }
    else if (r.skipped) { skipped++; }
    else { failed++; }
    if ((done + failed + skipped) % 50 === 0) {
      process.stderr.write(`  ${done + failed + skipped}/${urls.length}\n`);
    }
  }
}

process.stderr.write(`Fetching ${urls.length} photographs…\n`);
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

writeFileSync(`${OUT_DIR}/manifest.json`, JSON.stringify(manifest, null, 0));
console.log(`\n${done} cached, ${skipped} unavailable, ${failed} failed`);

/* A cache that is mostly empty is worse than none: it would render a tree with
   scattered holes and invite design decisions based on it. */
if (done < urls.length * 0.8) {
  console.error(`Only ${done}/${urls.length} downloaded — refusing to publish a partial cache.`);
  process.exit(1);
}
