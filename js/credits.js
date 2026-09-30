// ══════════════════════════════════════════════════════
// CREDITS — who made what this site shows, and on what terms
//
// credits.html is built from the same data the site draws from, so it cannot
// drift from what is on screen: every photograph in the snapshot with the
// author and licence Commons records for it, every PhyloPic silhouette with
// its artist and licence, and every source Kin cites for a date. Adding a
// photo, a silhouette or a date adds its credit here with no further step.
// ══════════════════════════════════════════════════════

import { TREE, lightenColor } from './treeData.js';
import { expandTree } from './treeExpansion.js';
import { PHOTO_SNAPSHOT } from './photoSnapshot.js';
import { PHOTO_MAP } from './speciesData.js';
import { SILHOUETTES } from './silhouettes.js';
import { SOURCES } from './kin/dates.js';

try {
  const theme = localStorage.getItem('theme');
  if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
} catch { /* private mode: stay dark */ }

expandTree(TREE, lightenColor);
const nameOf = new Map();
(function walk(n) { nameOf.set(n.id, n.name); (n.children || []).forEach(walk); })(TREE);
const label = (id) => nameOf.get(id) || id.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const link = (href, text) => (href ? `<a href="${esc(href)}" rel="noopener">${esc(text)}</a>` : esc(text));
const byName = (a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });

/* "https://creativecommons.org/licenses/by-sa/3.0/" → "CC BY-SA 3.0". */
function licenceName(url) {
  if (/publicdomain\/zero/.test(url)) return 'CC0 1.0';
  if (/publicdomain\/mark/.test(url)) return 'Public domain';
  const m = String(url).match(/licenses\/([a-z-]+)\/(\d\.\d)/);
  return m ? `CC ${m[1].toUpperCase()} ${m[2]}` : url || 'Unknown';
}

function fill(tableId, rows) {
  document.querySelector(`#${tableId} tbody`).innerHTML = rows.join('');
}

// ── Photographs ──
const photos = Object.entries(PHOTO_SNAPSHOT).map(([id, p]) => ({
  name: label(id), by: p.by || '', lic: p.lic || '', page: p.page || '',
}));
for (const [id, p] of Object.entries(PHOTO_MAP)) {
  if (!PHOTO_SNAPSHOT[id] && p && p.url) photos.push({ name: label(id), by: p.credit || '', lic: '', page: '' });
}
photos.sort(byName);
fill('photo-table', photos.map((p) =>
  `<tr><td>${link(p.page, p.name)}</td><td>${esc(p.by || '—')}</td><td>${esc(p.lic || '—')}</td></tr>`));
document.getElementById('photo-count').textContent = `${photos.length} photographs.`;

// ── Silhouettes ──
const sils = Object.entries(SILHOUETTES).map(([id, s]) => ({
  name: label(id), by: s.attribution || '', lic: licenceName(s.license), licUrl: s.license, page: s.page || '',
}));
sils.sort(byName);
fill('sil-table', sils.map((s) =>
  `<tr><td>${link(s.page, s.name)}</td><td>${esc(s.by || '—')}</td><td>${link(s.licUrl, s.lic)}</td></tr>`));
const needCredit = sils.filter((s) => !/^(CC0|Public domain)/.test(s.lic)).length;
document.getElementById('sil-count').textContent = `${sils.length} silhouettes, ${needCredit} of them under licences that ask for credit.`;

// ── Dates in Kin ──
const sources = Object.values(SOURCES).sort((a, b) => a.title.localeCompare(b.title, 'en'));
document.getElementById('date-list').innerHTML = sources.map((s) => `<li>${link(s.url, s.title)}</li>`).join('');
