// ══════════════════════════════════════════════════════
// SPLASH.JS — DNA helix → Tree of Life Canvas animation
// 4-phase state machine: HELIX → UNRAVEL → FILL → READY
// ══════════════════════════════════════════════════════

const BG = '#141618';
const GOLD = '#c8883a';
const PARCHMENT = '#f2e8d0';
const DOMAIN_COLORS = ['#ef4444','#f59e0b','#40b8b0','#8b5cf6'];
const NUM_PAIRS = 16;

export function initSplash(canvas, opts) {
  const { tree, photoMap, t: t_fn, facts, eraNames, onDone } = opts;
  console.log('[splash] initSplash called, canvas:', canvas?.tagName, 'tree children:', tree?.children?.length);

  // ── Compute dynamic data from tree ──
  let speciesCount = 0;
  function countNodes(node) { speciesCount++; if (node.children) node.children.forEach(countNodes); }
  countNodes(tree);
  const domainCount = tree.children ? tree.children.length : 0;

  // ── Select ~30 representative nodes for splash tree ──
  const splashData = selectSplashNodes(tree);
  const splashNodes = splashData.nodes;

  // ── Preload photos ──
  const images = preloadPhotos(splashNodes, photoMap, 6);

  // ── Set up fallback elements with translated text ──
  const fallback = document.getElementById('splash-fallback');
  if (fallback) {
    const h1 = fallback.querySelector('h1');
    const ps = fallback.querySelectorAll('p');
    if (h1) h1.textContent = t_fn('title');
    if (ps[0]) ps[0].textContent = t_fn('splash_subtitle');
    if (ps[1]) ps[1].textContent = t_fn('splash_click');
    fallback.addEventListener('click', () => dismiss());
  }

  // ── Canvas setup ──
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let W, H;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Rebuild tree layout on resize
    if (treeLayout.nodes.length > 0) {
      const rebuilt = buildUpwardTree(splashData, W, H);
      treeLayout.nodes = rebuilt.nodes;
      treeLayout.edges = rebuilt.edges;
    }
  }
  resize();
  window.addEventListener('resize', resize);

  // Signal canvas is ready
  canvas.dataset.ready = '1';
  console.log('[splash] canvas ready, W:', W, 'H:', H, 'nodes:', splashNodes.length, 'isReturn:', isReturn);

  // ── State ──
  const isReturn = localStorage.getItem('tol-splash-seen') === '1';
  const lang = document.documentElement.lang || 'en';
  const timing = isReturn
    ? { helix: 0, unravel: 0, fill: 1.5, ready: 2.5, auto: 7.5 }
    : { helix: 1.5, unravel: 3.5, fill: 5.5, ready: 7.0, auto: 12.0 };

  let elapsed = 0;
  let lastTs = null;
  let animId = null;
  let ff = false;
  let done = false;

  // ── Build tree layout ──
  let treeLayout = buildUpwardTree(splashData, W, H);

  // ── Text sequence for Phase 1 ──
  const splashFact = facts.getSplashFact ? facts.getSplashFact(lang) : facts.getLoadingFact(lang);
  const countText = tpl(t_fn('splash_species_count'), { count: speciesCount });
  const domainText = tpl(t_fn('splash_domains_count'), { count: domainCount });
  const textSeq = [splashFact, countText, domainText];

  // ── Era milestones for Phase 2 caption ──
  const eraMilestones = [
    { mya: 3500, name: 'Bacteria' },
    { mya: 2100, name: 'Eukaryota' },
    { mya: 200, name: 'Mammals' },
    { mya: 0.3, name: 'Homo sapiens' },
  ];

  // ── Ready-phase text ──
  const readyFact = facts.getSplashFact ? facts.getSplashFact(lang) : '';

  // ── Template interpolation helper ──
  function tpl(str, vars) {
    return str.replace(/\{(\w+)\}/g, (_, k) => vars[k] !== undefined ? vars[k] : _);
  }

  // ── Canvas text helper with RTL ──
  function drawText(text, x, y, size, weight, color, alpha) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha != null ? alpha : 1));
    ctx.fillStyle = color || PARCHMENT;
    ctx.font = `${weight || 400} ${size}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (lang === 'he') {
      ctx.direction = 'rtl';
    }
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  // ── Math helpers ──
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeQuad(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  // ══════════════════════════════════════════════════════
  // HELIX GEOMETRY
  // ══════════════════════════════════════════════════════
  function getHelixPositions(cx, cy, amplitude, verticalSpan, time, rotSpeed) {
    const pairs = [];
    for (let i = 0; i < NUM_PAIRS; i++) {
      const t = i / (NUM_PAIRS - 1);
      const y = cy - verticalSpan / 2 + t * verticalSpan;
      const phase = t * Math.PI * 3 + time * rotSpeed;
      const lx = cx + Math.sin(phase) * amplitude;
      const rx = cx - Math.sin(phase) * amplitude;
      const z = Math.cos(phase);
      pairs.push({ i, t, y, lx, rx, z, phase });
    }
    return pairs;
  }

  function drawHelixFull(pairs, strandAlpha, rungAlpha) {
    const backPairs = pairs.filter(p => p.z < 0);
    const frontPairs = pairs.filter(p => p.z >= 0);
    drawRungs(backPairs, rungAlpha * 0.4);
    drawStrand(pairs, 'l', strandAlpha);
    drawStrand(pairs, 'r', strandAlpha);
    drawRungs(frontPairs, rungAlpha * 0.8);
  }

  function drawStrand(pairs, side, alpha) {
    if (pairs.length < 2) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    const key = side === 'l' ? 'lx' : 'rx';
    ctx.moveTo(pairs[0][key], pairs[0].y);
    for (let i = 1; i < pairs.length; i++) {
      const prev = pairs[i - 1];
      const curr = pairs[i];
      const cpx = (prev[key] + curr[key]) / 2;
      const cpy = (prev.y + curr.y) / 2;
      ctx.quadraticCurveTo(prev[key], prev.y, cpx, cpy);
    }
    const last = pairs[pairs.length - 1];
    ctx.lineTo(last[key], last.y);
    ctx.stroke();
    ctx.restore();
  }

  function drawRungs(pairs, alpha) {
    pairs.forEach(p => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = DOMAIN_COLORS[p.i % 4];
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(p.lx, p.y);
      ctx.lineTo(p.rx, p.y);
      ctx.stroke();
      const mx1 = lerp(p.lx, p.rx, 0.35);
      const mx2 = lerp(p.lx, p.rx, 0.65);
      ctx.fillStyle = DOMAIN_COLORS[p.i % 4];
      ctx.globalAlpha = alpha * 1.3;
      ctx.beginPath();
      ctx.arc(mx1, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(mx2, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // ══════════════════════════════════════════════════════
  // DRAW TREE HELPERS
  // ══════════════════════════════════════════════════════
  function drawEdges(alpha) {
    ctx.save();
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = alpha;
    treeLayout.edges.forEach(([parent, child]) => {
      ctx.beginPath();
      ctx.moveTo(parent.x, parent.y);
      const cpx = (parent.x + child.x) / 2;
      const cpy = parent.y;
      ctx.quadraticCurveTo(cpx, cpy, child.x, child.y);
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawNode(n, r, filled, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    if (filled) {
      const img = images.get(n.id);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, n.x - r, n.y - r, r * 2, r * 2);
      } else {
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
    // Border
    ctx.save();
    ctx.globalAlpha = filled ? alpha : alpha * 0.4;
    ctx.strokeStyle = n.color;
    ctx.lineWidth = filled ? 1.2 : 1;
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // ══════════════════════════════════════════════════════
  // PHASE 0: HELIX
  // ══════════════════════════════════════════════════════
  function drawPhaseHelix(el) {
    const dur = timing.helix;
    if (dur === 0) return;
    const t = Math.min(1, el / dur);
    const cx = W / 2;
    const cy = H / 2;
    const amp = Math.min(W, H) * 0.08;
    const vSpan = H * 0.55;

    const fadeIn = easeQuad(Math.min(1, t * 3));
    ctx.save();
    ctx.globalAlpha = fadeIn;
    const pairs = getHelixPositions(cx, cy, amp, vSpan, el, 2.5);
    drawHelixFull(pairs, 1.0, 1.0);
    ctx.restore();

    // Big number text
    const numFadeIn = smoothstep(0.3, 0.6, el);
    const numFadeOut = 1 - smoothstep(1.1, 1.4, el);
    const numAlpha = numFadeIn * numFadeOut;
    if (numAlpha > 0.01) {
      const fontSize = Math.min(W * 0.09, 72);
      drawText(t_fn('splash_big_number'), cx, cy - fontSize * 0.3, fontSize, 200, PARCHMENT, numAlpha);
      drawText(t_fn('splash_years_label'), cx, cy + fontSize * 0.7, fontSize * 0.32, 300, PARCHMENT, numAlpha);
    }
  }

  // ══════════════════════════════════════════════════════
  // PHASE 1: UNRAVEL
  // ══════════════════════════════════════════════════════
  function drawPhaseUnravel(el) {
    const dur = timing.unravel - timing.helix;
    if (dur === 0) return;
    const t = el / dur;
    const cx = W / 2;
    const cy = H / 2;
    const amp = Math.min(W, H) * 0.08;
    const vSpan = H * 0.55;

    const rotSpeed = 2.5 * (1 - easeQuad(Math.min(1, t * 1.5)));
    const rotTime = timing.helix + el;
    const rungOpacity = 1 - easeQuad(Math.min(1, t / 0.4));
    const driftT = easeQuad(Math.min(1, Math.max(0, (t - 0.15) / 0.85)));

    const pairs = getHelixPositions(cx, cy, amp, vSpan, rotTime, rotSpeed);
    const nodes = treeLayout.nodes;
    const nodeCount = nodes.length;

    // Draw edges morphing in
    if (driftT > 0.3) {
      const edgeAlpha = easeQuad(Math.min(1, (driftT - 0.3) / 0.7));
      drawEdges(edgeAlpha * 0.6);
    }

    // Draw morphing helix/strand points
    ctx.save();
    for (let i = 0; i < NUM_PAIRS; i++) {
      const pair = pairs[i];
      const ni1 = Math.floor((i / NUM_PAIRS) * nodeCount) % nodeCount;
      const ni2 = Math.floor(((i + NUM_PAIRS / 2) / NUM_PAIRS) * nodeCount) % nodeCount;
      const tn1 = nodes[ni1];
      const tn2 = nodes[ni2];

      const lx = lerp(pair.lx, tn1.x, driftT);
      const ly = lerp(pair.y, tn1.y, driftT);
      const rx = lerp(pair.rx, tn2.x, driftT);
      const ry = lerp(pair.y, tn2.y, driftT);

      // Rungs fading
      if (rungOpacity > 0.01) {
        ctx.save();
        ctx.globalAlpha = rungOpacity * 0.5;
        ctx.strokeStyle = DOMAIN_COLORS[i % 4];
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(rx, ry);
        ctx.stroke();

        ctx.globalAlpha = rungOpacity;
        ctx.fillStyle = DOMAIN_COLORS[i % 4];
        ctx.beginPath();
        ctx.arc(lerp(lx, rx, 0.35), lerp(ly, ry, 0.35), 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(lerp(lx, rx, 0.65), lerp(ly, ry, 0.65), 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Strand dots morphing into node positions
      const dotR = lerp(2, tn1.r, driftT);
      ctx.save();
      ctx.globalAlpha = lerp(0.7, 1, driftT);
      ctx.fillStyle = driftT < 0.5 ? GOLD : tn1.color;
      ctx.beginPath();
      ctx.arc(lx, ly, dotR, 0, Math.PI * 2);
      ctx.fill();
      if (driftT < 0.7) {
        ctx.fillStyle = driftT < 0.5 ? GOLD : tn2.color;
        ctx.beginPath();
        ctx.arc(rx, ry, lerp(2, tn2.r, driftT), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Tree nodes fading in
    if (driftT > 0.5) {
      const nodeAlpha = easeQuad((driftT - 0.5) / 0.5);
      nodes.forEach(n => {
        drawNode(n, n.r, false, nodeAlpha);
      });
    }
    ctx.restore();

    // Sequential text overlays
    const textStart = timing.helix + dur * 0.05;
    const textUnit = 0.6;
    for (let i = 0; i < textSeq.length; i++) {
      const ts = textStart + i * textUnit;
      const localT = (timing.helix + el) - ts;
      if (localT < 0 || localT > textUnit) continue;
      const fi = smoothstep(0, 0.15, localT);
      const fo = 1 - smoothstep(0.35, 0.5, localT);
      const alpha = fi * fo;
      if (alpha > 0.01) {
        const fs = Math.min(W * 0.04, 28);
        drawText(textSeq[i], W / 2, H / 2, fs, 300, PARCHMENT, alpha);
      }
    }
  }

  // ══════════════════════════════════════════════════════
  // PHASE 2: FILL
  // ══════════════════════════════════════════════════════
  function drawPhaseFill(el) {
    const dur = timing.fill - timing.unravel;
    if (dur === 0) return;
    const t = el / dur;
    const nodes = treeLayout.nodes;

    drawEdges(0.6);

    const sorted = [...nodes].sort((a, b) => b.appeared - a.appeared);
    const fillDurEach = dur / sorted.length;
    let currentEra = '';

    sorted.forEach((n, idx) => {
      const fillStart = idx * fillDurEach;
      const localT = t * dur - fillStart;
      const filled = localT > 0;
      const fillProgress = Math.min(1, localT / (fillDurEach * 2));

      if (filled) {
        for (const ec of eraMilestones) {
          if (n.appeared <= ec.mya) {
            currentEra = tpl(t_fn('splash_era_caption'), { mya: ec.mya, name: ec.name });
          }
        }
      }

      // Ring pulse
      if (filled) {
        const pulseT = Math.min(1, localT / 0.4);
        if (pulseT < 1) {
          ctx.save();
          ctx.globalAlpha = (1 - pulseT) * 0.5;
          ctx.strokeStyle = n.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + pulseT * 12, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      drawNode(n, n.r, filled, filled ? Math.min(1, fillProgress * 2) : 1);
    });

    // Era caption
    if (currentEra) {
      const fs = Math.min(W * 0.035, 22);
      drawText(currentEra, W / 2, H - 40, fs, 300, GOLD, 0.7);
    }
  }

  // ══════════════════════════════════════════════════════
  // PHASE 3: READY
  // ══════════════════════════════════════════════════════
  function drawPhaseReady(el) {
    const dur = timing.ready - timing.fill;
    const t = dur > 0 ? Math.min(1, el / dur) : 1;
    const nodes = treeLayout.nodes;

    const breathe = 1 + 0.03 * Math.sin((timing.fill + el) * 2.5);

    drawEdges(0.6);

    nodes.forEach(n => {
      drawNode(n, n.r * breathe, true, 1);
    });

    // Title
    const titleAlpha = easeQuad(Math.min(1, t * 2));
    if (titleAlpha > 0.01) {
      const titleSize = Math.min(W * 0.08, 56);
      drawText(t_fn('title'), W / 2, H * 0.12, titleSize, 300, GOLD, titleAlpha);

      const subAlpha = easeQuad(Math.min(1, Math.max(0, (t - 0.3) / 0.5)));
      drawText(t_fn('splash_subtitle'), W / 2, H * 0.12 + titleSize * 1.1, titleSize * 0.32, 300, PARCHMENT, subAlpha);

      // Fact
      const factAlpha = easeQuad(Math.min(1, Math.max(0, (t - 0.6) / 0.4)));
      drawText(readyFact, W / 2, H - 60, Math.min(W * 0.03, 16), 300, PARCHMENT, factAlpha * 0.5);

      // Click hint
      const hintAlpha = easeQuad(Math.min(1, Math.max(0, (t - 0.8) / 0.2)));
      drawText(t_fn('splash_click'), W / 2, H - 30, Math.min(W * 0.025, 14), 300, PARCHMENT, hintAlpha * 0.35);
    }
  }

  // ══════════════════════════════════════════════════════
  // MAIN RENDER LOOP
  // ══════════════════════════════════════════════════════
  let frameCount = 0;
  function render(ts) {
    try {
    if (lastTs === null) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    elapsed += dt * (ff ? 10 : 1);
    frameCount++;
    if (frameCount === 1) console.log('[splash] first frame, elapsed:', elapsed);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    if (elapsed < timing.helix) {
      drawPhaseHelix(elapsed);
    } else if (elapsed < timing.unravel) {
      drawPhaseUnravel(elapsed - timing.helix);
    } else if (elapsed < timing.fill) {
      drawPhaseFill(elapsed - timing.unravel);
    } else if (elapsed < timing.auto) {
      drawPhaseReady(elapsed - timing.fill);
    } else {
      dismiss();
      return;
    }

    animId = requestAnimationFrame(render);
    } catch(err) {
      console.error('[splash] render error:', err);
    }
  }

  // ── Start ──
  console.log('[splash] starting animation, timing:', JSON.stringify(timing), 'nodes:', treeLayout.nodes.length, 'edges:', treeLayout.edges.length, 'sample pos:', treeLayout.nodes[0]?.x?.toFixed(0), treeLayout.nodes[0]?.y?.toFixed(0));
  animId = requestAnimationFrame(render);

  // ── Skip button ──
  const skipBtn = document.getElementById('splash-skip');
  if (skipBtn) {
    skipBtn.textContent = t_fn('splash_skip');
    setTimeout(() => { if (!done) skipBtn.style.opacity = '1'; }, 1000);
    skipBtn.addEventListener('click', (e) => { e.stopPropagation(); dismiss(); });
  }

  // ── Click to fast-forward ──
  const splashEl = document.getElementById('splash');
  if (splashEl) {
    splashEl.addEventListener('click', (e) => {
      if (e.target === skipBtn) return;
      if (elapsed > timing.fill) {
        dismiss();
      } else {
        ff = true;
      }
    });
  }

  // ── Dismiss ──
  function dismiss() {
    if (done) return;
    done = true;
    if (animId) cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
    localStorage.setItem('tol-splash-seen', '1');
    if (splashEl) {
      splashEl.style.opacity = '0';
      setTimeout(() => {
        splashEl.style.display = 'none';
        onDone();
      }, 500);
    } else {
      onDone();
    }
  }
}

// ══════════════════════════════════════════════════════
// HELPER: Select ~30 representative nodes + edges from tree
// Walks the actual tree structure to preserve real parent-child topology.
// ══════════════════════════════════════════════════════
function selectSplashNodes(tree) {
  const nodes = [];
  const edges = []; // [parentId, childId]

  function walk(node, parentId, depth) {
    if (depth > 4) return;       // cap depth
    if (nodes.length >= 35) return; // cap total

    nodes.push({
      id: node.id,
      name: node.name,
      appeared: node.appeared || 0,
      color: node.color || '#888',
      depth
    });

    if (parentId !== null) {
      edges.push([parentId, node.id]);
    }

    if (node.children) {
      // At depth 3+, only take first 2 children to keep count manageable
      const limit = depth >= 3 ? 2 : node.children.length;
      for (let i = 0; i < Math.min(limit, node.children.length); i++) {
        if (nodes.length >= 35) break;
        walk(node.children[i], node.id, depth + 1);
      }
    }
  }

  walk(tree, null, 0);
  return { nodes, edges };
}

// ══════════════════════════════════════════════════════
// HELPER: Build upward tree layout from nodes + edges
// Root at bottom, leaves at top. Uses the real tree edges.
// ══════════════════════════════════════════════════════
function buildUpwardTree(splashData, W, H) {
  const { nodes: species, edges } = splashData;

  const maxDepth = Math.max(1, ...species.map(s => s.depth));
  const marginTop = H * 0.08;
  const marginBot = H * 0.12;
  const marginX = W * 0.08;
  const usableH = H - marginTop - marginBot;

  // Build node map
  const nodeMap = {};
  species.forEach(s => {
    nodeMap[s.id] = {
      ...s,
      x: 0,
      y: H - marginBot - (s.depth / maxDepth) * usableH,
      r: Math.max(3, 7 - s.depth * 0.8)
    };
  });

  // Build childrenOf from real edges
  const childrenOf = {};
  edges.forEach(([pid, cid]) => {
    if (!childrenOf[pid]) childrenOf[pid] = [];
    childrenOf[pid].push(cid);
  });

  // Recursive x-spread (same algorithm as mockup)
  function getLeafCount(id) {
    const ch = childrenOf[id];
    if (!ch || ch.length === 0) return 1;
    return ch.reduce((s, c) => s + getLeafCount(c), 0);
  }

  function layoutX(id, xMin, xMax) {
    const node = nodeMap[id];
    if (!node) return;
    const ch = childrenOf[id];
    if (!ch || ch.length === 0) {
      node.x = (xMin + xMax) / 2;
      return;
    }
    const totalLeaves = ch.reduce((s, c) => s + getLeafCount(c), 0);
    let cursor = xMin;
    ch.forEach(cid => {
      const share = getLeafCount(cid) / totalLeaves;
      layoutX(cid, cursor, cursor + share * (xMax - xMin));
      cursor += share * (xMax - xMin);
    });
    const cxs = ch.filter(c => nodeMap[c]).map(c => nodeMap[c].x);
    if (cxs.length > 0) {
      node.x = cxs.reduce((a, b) => a + b, 0) / cxs.length;
    } else {
      node.x = (xMin + xMax) / 2;
    }
  }

  // Root is the first node (depth 0)
  const root = species.find(s => s.depth === 0);
  if (root) {
    layoutX(root.id, marginX, W - marginX);
  }

  const nodeList = Object.values(nodeMap);
  const edgeList = edges
    .filter(([pid, cid]) => nodeMap[pid] && nodeMap[cid])
    .map(([pid, cid]) => [nodeMap[pid], nodeMap[cid]]);

  return { nodes: nodeList, edges: edgeList };
}

// ══════════════════════════════════════════════════════
// HELPER: Preload photos with concurrency limit
// ══════════════════════════════════════════════════════
function preloadPhotos(species, photoMap, maxConcurrent) {
  const images = new Map();
  const queue = species
    .filter(s => photoMap[s.id])
    .map(s => ({ id: s.id, url: typeof photoMap[s.id] === 'string' ? photoMap[s.id] : photoMap[s.id].url || photoMap[s.id] }));
  let active = 0;

  function loadNext() {
    while (active < maxConcurrent && queue.length > 0) {
      const item = queue.shift();
      active++;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => { images.set(item.id, img); active--; loadNext(); };
      img.onerror = () => { images.set(item.id, null); active--; loadNext(); };
      img.src = item.url;
    }
  }
  loadNext();
  return images;
}
