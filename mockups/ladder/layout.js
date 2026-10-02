// The Ladder's geometry, as a pure function of (what is open, how much room).
//
// Everything here is in LOGICAL coordinates: `s` is the distance from the
// inline-START edge, so it means the same thing in English and Hebrew, and
// render() mirrors it once, at the very end. That is the only place a left or a
// right is decided — constraint 8 in CLAUDE.md, applied to a drawing.
//
//   width   is time. s grows with the age of the node, on the power scale.
//   depth   is rows. Every visible tip gets one row; a fork sits at the mean of
//           its children, which is what makes a fork look like a fork.
//
// Three decisions carry the look, and each exists because the first version
// got it wrong:
//
//   1. Every living lineage is carried on to "today" by a dotted trail, and the
//      names of the tips stand in ONE column at the far edge. Names that stood
//      wherever their lineage happened to end collided with each other, with
//      forks, and with the edge of the screen. A column cannot collide.
//   2. A fork's name rides above its own limb, found by trying positions and
//      testing the boxes — not by hoping. Anything that still collides is
//      reported (`forced`), so a check can fail on it.
//   3. Row height is chosen from the room: a few rows are spread out to fill
//      the window, and many rows are kept at a readable minimum and scrolled.
import { ROOT, ORIGIN, kids, age, size, isExtinct, name, ui, timePos, ERAS, TODAY, ageLabel } from './model.js';

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const AXIS_H = 48;

export function computeLayout({ open, W, H, lang, measure, showSil = true }) {
  const phone = W < 560;
  const F = phone
    ? { tip: 11.5, group: 12, chip: 10, root: 12, tick: 10 }
    : { tip: 13, group: 13, chip: 10.5, root: 13, tick: 10.5 };
  const minRow = phone ? 34 : 29, maxRow = phone ? 46 : 46;
  const sizeRoot = size(ROOT);
  const wOf = (n) => (phone ? 0.85 : 1) * (1.5 + 4.5 * Math.log1p(size(n) - 1) / Math.log1p(sizeRoot - 1));

  // ── What is on screen ────────────────────────────────────────────────────
  const vis = [], tips = [];
  (function walk(n, parent) {
    const isOpen = open.has(n.id) && kids(n).length > 0;
    const rec = { n, id: n.id, depth: n._depth, open: isOpen, parent, kids: [], isGroup: kids(n).length > 0 };
    vis.push(rec);
    if (parent) parent.kids.push(rec);
    if (isOpen) kids(n).forEach((c) => walk(c, rec));
    else { rec.row = tips.length; tips.push(rec); }
  })(ROOT, null);
  (function fill(r) {
    if (!r.open) return;
    r.kids.forEach(fill);
    r.row = (r.kids[0].row + r.kids[r.kids.length - 1].row) / 2;
  })(vis[0]);

  // ── Rows ─────────────────────────────────────────────────────────────────
  const padTop = 10, padBottom = 30;
  const room = H - AXIS_H - padTop - padBottom;
  const rowH = clamp(room / tips.length, minRow, maxRow);
  const contentH = padTop + tips.length * rowH + padBottom;

  // ── Columns ──────────────────────────────────────────────────────────────
  const rootText = 'LUCA';
  const rootW = measure(rootText, F.root, 700);
  const margin = 12;
  const plotL = margin + rootW + 26;                 // room for the root's name and its stem
  const colW = Math.round(phone ? clamp(W * 0.355, 120, 140) : clamp(W * 0.21, 196, 268));
  const colStart = W - margin - colW;                // where the tip names begin
  const plotR = colStart - 18;                       // "today"
  const sT = (mya) => plotL + (plotR - plotL) * timePos(mya);
  const silSize = showSil ? Math.round(phone ? clamp(rowH * 0.5, 17, 20) : clamp(rowH * 0.72, 18, 28)) : 0;
  const textStart = colStart + (showSil ? silSize + (phone ? 5 : 7) : 0);

  const boxes = [];                                  // every placed text box, to test against
  const hit = (a, b, pad = 2) => a.l < b.r + pad && a.r > b.l - pad && a.t < b.b + pad && a.b > b.t - pad;
  const place = (b) => boxes.push(b);
  const asc = 0.78, desc = 0.24;                     // text box above/below a baseline, in em

  // ── Nodes ────────────────────────────────────────────────────────────────
  for (const r of vis) {
    r.y = padTop + (r.row + 0.5) * rowH;
    r.sOwn = r.parent ? sT(age(r.n)) : plotL;
    r.w = wOf(r.n);
    r.extinct = isExtinct(r.n) && !r.isGroup;
    r.color = r.n.color;
  }
  /* Two dots are 6.6 and 4.4 pixels in radius, so a limb shorter than their sum
     is two circles on top of each other. Chordata and Vertebrates are dated
     within a few million years of each other — under ten pixels on this axis.
     So every limb has a floor.

     The floor used to be applied from the parent downward and nothing else, and
     near "today" it pushed a child past the line it is drawn up to: Birds sits
     at the edge, the floor added seventeen pixels, and Archaeopteryx's dot
     landed in the column of names, on top of its own silhouette. So every node
     also gets a ceiling — the right edge, less a floor for each generation that
     has to fit beneath it — and the floor is then applied inside the ceiling. */
  const height = new Map();
  for (let i = vis.length - 1; i >= 0; i--) {
    const r = vis[i];
    height.set(r, r.kids.length ? 1 + Math.max(...r.kids.map((k) => height.get(k))) : 0);
  }
  const reach = plotR - 4;
  const MIN_LIMB = Math.max(12, Math.min(17, (reach - plotL) / (height.get(vis[0]) + 1)));
  for (const r of vis) {
    const ceiling = reach - MIN_LIMB * height.get(r);
    r.sCap = Math.min(r.sOwn, ceiling);
    r.s = r.parent ? Math.max(r.sCap, r.parent.s + MIN_LIMB) : plotL;
    r.stub = r.parent ? r.sOwn < r.parent.s + MIN_LIMB : false;
    r.limbFrom = r.parent ? r.parent.s : plotL - 18;
  }

  // Tips: one name, in the column.
  for (const r of tips) {
    const n = r.n;
    const label = name(n, lang);
    const chipText = r.isGroup ? `+${size(n) - 1}` : '';
    /* On a phone the count goes UNDER the name. Beside it, a pill and a
       silhouette left the name 60px, and "Bacteria" read "Bacte…" — the one
       thing on the row that is content, cut to make room for decoration. */
    const chipBelow = phone && r.isGroup;
    const chipW = r.isGroup ? measure(chipText, F.chip, 650) + (chipBelow ? 0 : 12) : 0;
    const start = textStart;
    const avail = W - margin - start - (chipW && !chipBelow ? chipW + 6 : 0);
    let text = label, w = measure(text, F.tip, 600);
    let lines = [text];
    const fit = (t, room) => {            // shorten by measuring, never by guessing
      if (measure(t, F.tip, 600) <= room) return t;
      let lo = 1, hi = t.length;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (measure(t.slice(0, mid) + '\u2026', F.tip, 600) <= room) lo = mid; else hi = mid - 1;
      }
      return t.slice(0, lo).trimEnd() + '\u2026';
    };
    if (w > avail) {
      /* A name that does not fit breaks at a space and takes a second line —
         there is room for one, a row is 34 to 46 pixels tall — and is cut only
         if a single word is still too wide. On a phone "Australian lungfish"
         and "Great white shark" were arriving as "Australian lu…" and "Great
         white s…": the one thing on the row that is content, cut to a stub. */
      const words = text.split(' ');
      let done = false;
      if (words.length > 1 && rowH >= 30) {
        for (let k = 1; k < words.length && !done; k++) {
          const a = words.slice(0, k).join(' '), b = words.slice(k).join(' ');
          if (measure(a, F.tip, 600) <= avail && measure(b, F.tip, 600) <= avail) { lines = [a, b]; done = true; }
        }
        if (!done) {                       // best split, second line shortened
          let k = words.length - 1;
          while (k > 1 && measure(words.slice(0, k).join(' '), F.tip, 600) > avail) k--;
          lines = [fit(words.slice(0, k).join(' '), avail), fit(words.slice(k).join(' '), avail)];
          done = true;
        }
      }
      if (!done) lines = [fit(text, avail)];
      text = lines.join(' ');
      w = Math.max(...lines.map((l) => measure(l, F.tip, 600)));
    }
    const lineH = F.tip * 1.24;
    const nameY = lines.length === 2 ? r.y - lineH / 2 + F.tip * 0.35 : (chipBelow ? r.y - 0.5 : r.y + F.tip * 0.35);
    r.label = { kind: 'tip', text, lines, full: label, s: start, dir: 1, w, size: F.tip, weight: 600, y: nameY, lineH };
    if (r.isGroup) {
      if (chipBelow && lines.length === 1) {
        r.chip = { text: chipText, s: start, w: chipW, y: r.y + 12.5, size: F.chip, below: true };
      } else if (chipBelow) {
        /* The name took both lines, so the count follows the second one rather
           than sitting under a name with no room beneath it. */
        const room = avail - chipW - 6;
        if (measure(lines[1], F.tip, 600) > room) lines[1] = fit(lines[1], room);
        text = lines.join(' ');
        w = Math.max(...lines.map((l) => measure(l, F.tip, 600)));
        r.label.text = text; r.label.w = w;
        r.chip = { text: chipText, s: start + measure(lines[1], F.tip, 600) + 6, w: chipW, y: nameY + lineH, size: F.chip, below: true };
      } else {
        r.chip = { text: chipText, s: start + w + 6, w: chipW, y: r.y, size: F.chip };
      }
    }
    /* An extinct lineage ends: no trail to "today", and a small dagger at the
       dot says so. Its name still stands in the column. The first version put
       the name after the dot, which on a phone ran it over its own silhouette —
       the one tip that did not follow the rule that keeps names clear. */
    r.trailTo = r.extinct ? null : plotR;
    r.dagger = r.extinct ? { s: r.s + 9 } : null;
    r.sil = showSil ? { s: colStart, size: silSize } : null;
    r.hit = {
      from: Math.min(r.s - 12, start - 4), to: W - margin,
      top: r.y - rowH / 2, bottom: r.y + rowH / 2,
    };
  }

  // Root: its name stands to the left of the stem that starts the tree.
  {
    const r = vis[0];
    r.label = { kind: 'root', text: rootText, full: rootText, s: r.limbFrom - 7, dir: -1, w: rootW, size: F.root, weight: 700, y: r.y + F.root * 0.35 };
    place({ l: r.label.s - rootW, r: r.label.s, t: r.y - F.root * asc, b: r.y + F.root * desc, id: r.id });
  }

  // Forks: the name rides above the limb that leads to the fork.
  //
  // Every dot is an obstacle, not just every other label. The first version
  // only tested names against names, and "Vertebrates" was laid straight over
  // the dot of "Chordata", which is dated within a few million years of it and
  // so sits a handful of pixels away on this axis.
  const dotR = (r) => (r.isGroup ? 6.6 : 4.4);
  for (const r of vis) place({ l: r.s - dotR(r) - 1, r: r.s + dotR(r) + 1, t: r.y - dotR(r) - 1, b: r.y + dotR(r) + 1, id: r.id, dot: true });

  // Parents before children, then top to bottom, so the earlier claim wins.
  const forks = vis.filter((r) => r.open && r.parent).sort((a, b) => a.depth - b.depth || a.row - b.row);
  let forced = 0;
  for (const r of forks) {
    const label = name(r.n, lang);
    const limbLen = r.s - r.limbFrom;
    const w = measure(label, F.group, 700);
    const right = r.s - 11;
    const line = F.group + 3;
    const up = -(r.w / 2 + 4), down = F.group * asc + r.w / 2 + 3;
    /* Tried in order of how natural they are: over its own limb, under it, then
       a second tier above and below. A tight cluster (a fork a few pixels from
       its parent) has no honest single-line answer, and two lines of text is
       better than one sitting on a dot. */
    /* To the left of the dot, over its own limb, is where a name belongs. A
       limb that starts a few pixels from the screen's edge has no room there —
       "Cyanobacteria" ran off the left of a phone — so the right of the dot is
       the next resort, and running off the screen counts as a clash. */
    const tiers = [['above', up], ['below', down], ['above2', up - line], ['below2', down + line]];
    /* The header: over the first child's limb, starting at the fork's own rail,
       or under the last child's. A fork's children are a cluster of dots on one
       side of it; the band above its first limb is almost always empty. */
    const k0 = r.kids[0], k1 = r.kids[r.kids.length - 1];
    const headerEdge = Math.max(6, r.s - 3);
    const candidates = [
      ...tiers.map(([tag, dy]) => ({ tag, dy, dir: -1 })),
      /* Cleared by the child's DOT, not by its limb: the dot is the wider of the
         two, and a header measured from the line's thickness sat one pixel into
         it — which is why every candidate for these forks had exactly one clash. */
      { tag: 'header', dy: k0.y - r.y - (dotR(k0) + 3 + F.group * desc), dir: 1, edge: headerEdge },
      { tag: 'header2', dy: k0.y - r.y - (dotR(k0) + 3 + F.group * desc) - line, dir: 1, edge: headerEdge },
      { tag: 'footer', dy: k1.y - r.y + dotR(k1) + 3 + F.group * asc, dir: 1, edge: headerEdge },
      ...tiers.map(([tag, dy]) => ({ tag: 'right-' + tag, dy, dir: 1 })),
    ];
    let best = null;
    const tried = [];
    for (const c of candidates) {
      const base = r.y + c.dy;
      const edge = c.edge !== undefined ? c.edge : (c.dir < 0 ? r.s - 11 : r.s + 11);
      const b = { l: c.dir < 0 ? edge - w : edge, r: c.dir < 0 ? edge : edge + w, t: base - F.group * asc, b: base + F.group * desc, id: r.id };
      const hits = boxes.filter((o) => !(o.dot && o.id === r.id) && hit(b, o, o.dot ? 1 : 2));
      let clashes = hits.length;
      if (b.l < 4 || b.r > W - 4) clashes += 1;
      tried.push(`${c.tag}:${clashes}${b.l < 4 ? '(L)' : ''}${b.r > W - 4 ? '(R)' : ''}[${hits.map((o) => (o.dot ? 'dot:' : 'txt:') + o.id).join(',')}]`);
      if (!best || clashes < best.clashes) best = { ...c, base, b, edge, clashes };
      if (!clashes) break;
    }
    if (best.clashes) forced++;
    place(best.b);
    r.label = { kind: 'group', text: label, full: label, s: best.edge, dir: best.dir, w, size: F.group, weight: 700, y: best.base, side: best.tag, clashes: best.clashes, limbLen, tried };
    /* Two targets, not one long bar. A bar from the name to the dot, a whole
       row tall, lay over the neighbour's dot and swallowed its taps. */
    r.hits = [
      { from: r.s - 13, to: r.s + 13, top: r.y - rowH / 2, bottom: r.y + rowH / 2 },
      { from: best.b.l - 5, to: best.b.r + 5, top: best.b.t - 3, bottom: best.b.b + 3 },
    ];
  }
  for (const r of tips) r.hits = [r.hit];

  // ── Axis: eras, and the dates worth printing ─────────────────────────────
  const eras = ERAS.map((e, i) => {
    const s1 = sT(e.from), s2 = sT(e.to);
    const text = e[lang] || e.en;
    const w = measure(text, F.tick, 700);
    return { id: e.id, i, s1, s2, text, show: s2 - s1 >= w + 12, mid: (s1 + s2) / 2 };
  });
  // Ticks are chosen, not all drawn: on a phone seven of them ran together as
  // "1 Ga500 M200 M66 Matoday". Most important first; later ones are kept only
  // if they clear everything already placed.
  const order = [0, 1000, 541, 66, 3500, 2000, 252];
  const chosen = [];
  for (const mya of order) {
    const text = mya === 0 ? (TODAY[lang] || TODAY.en) : ageLabel(mya, lang);
    const w = measure(text, F.tick, 600);
    const s = sT(mya);
    const box = { l: s - w / 2, r: s + w / 2 };
    if (box.l < 2 || box.r > W - 2) continue;
    if (chosen.some((c) => box.l < c.box.r + 10 && box.r > c.box.l - 10)) continue;
    chosen.push({ mya, text, s, box });
  }
  const grid = [3500, 2000, 1000, 541, 252, 66, 0].map((m) => ({ mya: m, s: sT(m) }));

  return {
    W, H, phone, F, rowH, contentH, plotL, plotR, colStart, colW, textStart, silSize, margin,
    vis, tips, eras, ticks: chosen, grid, forced,
    rows: tips.length, scrolls: contentH + AXIS_H > H,
  };
}
