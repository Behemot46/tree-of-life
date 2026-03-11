/* ═══════════════════════════════════════════════════════════════
   tree.js — D3 radial / cladogram tree renderer
   ═══════════════════════════════════════════════════════════════ */

const Tree = (() => {
  let svg, g, linksG, nodesG;
  let width, height;
  let currentLayout = 'radial'; // 'radial' | 'cladogram'
  let treeData = null;
  let zoomBehavior;
  let currentTransform = d3.zoomIdentity;
  let onNodeSelectCb = null;
  let expandingNodes = new Set();

  /* Domain icons for major groups */
  const ICONS = {
    'Life':          '🌍',
    'Bacteria':      '🦠',
    'Archaea':       '🔬',
    'Eukaryota':     '◎',
    'Viridiplantae': '🌿',
    'Fungi':         '🍄',
    'Metazoa':       '🐾',
    'Chordata':      '🐟',
    'Mammalia':      '🐾',
    'Aves':          '🐦',
    'Arthropoda':    '🦗',
    'Insecta':       '🦋',
    'Mollusca':      '🐚',
    'Cnidaria':      '🪸',
    'Porifera':      '🧽',
  };

  function nodeIcon(d) {
    return ICONS[d.data.name] || null;
  }

  function nodeLabel(d) {
    const name = d.data.common || d.data.name;
    const icon = nodeIcon(d);
    return icon ? `${icon} ${name}` : name;
  }

  /* Color helper — inherit from ancestors */
  function getColor(d) {
    let node = d;
    while (node) {
      if (node.data.color) return node.data.color;
      node = node.parent;
    }
    return '#4a9eff';
  }

  /* Node radius — log scale of species count */
  function nodeRadius(d) {
    const n = d.data.num_tips || 1;
    if (!d.children && !d.data._children) return 4.5;
    const r = Math.max(3.5, Math.min(10, 2.5 + Math.log10(n) * 1.4));
    return r;
  }

  /* ── Init ──────────────────────────────────────────────────── */
  function init(containerSelector) {
    const container = document.querySelector(containerSelector);
    svg = d3.select('#tree-svg');
    g   = d3.select('#tree-root-g');
    linksG = d3.select('#links-g');
    nodesG = d3.select('#nodes-g');

    updateDimensions();

    zoomBehavior = d3.zoom()
      .scaleExtent([0.05, 8])
      .on('zoom', e => {
        currentTransform = e.transform;
        g.attr('transform', e.transform);
        updateMinimap();
      });

    svg.call(zoomBehavior)
      .on('dblclick.zoom', null); // disable double-click zoom (we use it for focus)

    window.addEventListener('resize', () => { updateDimensions(); render(false); });

    // Zoom control buttons
    document.getElementById('zoom-in').addEventListener('click', () => {
      svg.transition().duration(300).call(zoomBehavior.scaleBy, 1.4);
    });
    document.getElementById('zoom-out').addEventListener('click', () => {
      svg.transition().duration(300).call(zoomBehavior.scaleBy, 0.72);
    });
    document.getElementById('zoom-reset').addEventListener('click', resetView);

    // Layout toggle
    document.getElementById('btn-layout').addEventListener('click', toggleLayout);

    // Legend click — highlight domain
    let activeDomain = null;
    document.querySelectorAll('.legend-item').forEach(item => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        const domainName = item.dataset.domain;
        if (!domainName) return;
        activeDomain = activeDomain === domainName ? null : domainName;
        document.querySelectorAll('.legend-item').forEach(li => {
          li.classList.toggle('legend-active', li.dataset.domain === activeDomain);
          li.style.opacity = activeDomain && li.dataset.domain !== activeDomain ? '0.4' : '1';
        });
        highlightDomain(activeDomain);
      });
    });
  }

  /* Highlight all nodes belonging to a domain name */
  function highlightDomain(domainName) {
    nodesG.selectAll('.node').each(function(d) {
      let inDomain = false;
      if (domainName) {
        let node = d;
        while (node) {
          if (node.data.name === domainName) { inDomain = true; break; }
          node = node.parent;
        }
      }
      d3.select(this)
        .transition().duration(300)
        .style('opacity', !domainName || inDomain ? 1 : 0.15);
    });
    linksG.selectAll('.link').each(function(d) {
      let inDomain = false;
      if (domainName) {
        let node = d.target;
        while (node) {
          if (node.data.name === domainName) { inDomain = true; break; }
          node = node.parent;
        }
      }
      d3.select(this)
        .transition().duration(300)
        .style('opacity', !domainName || inDomain ? null : 0.05);
    });
  }

  function updateDimensions() {
    const container = document.getElementById('tree-container');
    width  = container.clientWidth;
    height = container.clientHeight;
    svg.attr('viewBox', [0, 0, width, height]);
  }

  /* ── Data Loading ───────────────────────────────────────────── */
  function load(data) {
    treeData = deepClone(data);
    render(true);
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /* ── Layout ─────────────────────────────────────────────────── */
  function buildHierarchy(data) {
    return d3.hierarchy(data, d => d.children && d.children.length ? d.children : null);
  }

  function computeLayout(root) {
    if (currentLayout === 'radial') {
      const r = Math.min(width, height) / 2 - 60;
      d3.cluster().size([2 * Math.PI, r])
        .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth)(root);
    } else {
      const treeH = height - 80;
      const treeW = width  - 120;
      d3.tree().size([treeH, treeW])(root);
    }
    return root;
  }

  function toXY(node) {
    if (currentLayout === 'radial') {
      const x = node.y * Math.cos(node.x - Math.PI / 2);
      const y = node.y * Math.sin(node.x - Math.PI / 2);
      return [x, y];
    }
    return [node.y, node.x]; // cladogram: y→x, x→y
  }

  function centerOffset() {
    if (currentLayout === 'radial') return [width / 2, height / 2];
    return [40, 40];
  }

  /* ── Render ─────────────────────────────────────────────────── */
  function render(animate = true) {
    if (!treeData) return;
    const root = computeLayout(buildHierarchy(treeData));
    const [cx, cy] = centerOffset();
    const dur = animate ? 500 : 0;

    /* Links */
    const linkData = root.links();

    const linkFn = currentLayout === 'radial'
      ? d3.linkRadial().angle(d => d.x).radius(d => d.y)
      : d3.linkHorizontal().x(d => d.y).y(d => d.x);

    const links = linksG.selectAll('.link')
      .data(linkData, d => `${d.source.data.id}-${d.target.data.id}`);

    const linksEnter = links.enter().append('path')
      .attr('class', d => `link ${d.target.data.is_extinct ? 'extinct' : ''}`)
      .attr('stroke', d => getColor(d.target))
      .attr('transform', `translate(${cx},${cy})`)
      .attr('d', linkFn)
      .style('opacity', 0);

    links.merge(linksEnter)
      .transition().duration(dur)
      .attr('transform', `translate(${cx},${cy})`)
      .attr('d', linkFn)
      .attr('stroke', d => getColor(d.target))
      .attr('class', d => `link ${d.target.data.is_extinct ? 'extinct' : ''}`)
      .style('opacity', 1);

    links.exit().transition().duration(dur).style('opacity', 0).remove();

    /* Nodes */
    const nodeData = root.descendants();

    const nodes = nodesG.selectAll('.node')
      .data(nodeData, d => d.data.id);

    const nodesEnter = nodes.enter().append('g')
      .attr('class', d => `node ${d.data._children !== undefined && !d.children ? 'collapsed' : ''}`)
      .attr('transform', d => {
        const [x, y] = toXY(d);
        return `translate(${cx + x},${cy + y})`;
      })
      .style('opacity', 0)
      .on('click', (event, d) => { event.stopPropagation(); handleNodeClick(d); })
      .on('mouseover', (event, d) => showTooltip(event, d))
      .on('mousemove', (event) => moveTooltip(event))
      .on('mouseout', hideTooltip);

    /* Node circle */
    nodesEnter.append('circle')
      .attr('r', nodeRadius)
      .attr('fill', d => getColor(d) || '#888888')
      .attr('fill-opacity', d => d.data.is_extinct ? 0 : (d.children ? 0.85 : 1))
      .attr('stroke', d => getColor(d) || '#888888')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', d => d.data.is_extinct ? 0.4 : 1)
      .attr('stroke-dasharray', d => d.data.is_extinct ? '3,2' : 'none');

    /* Expand ring for nodes with unloaded children */
    nodesEnter.filter(d => d.data._children !== undefined && !d.children)
      .append('circle')
      .attr('class', 'expand-ring')
      .attr('r', d => nodeRadius(d) + 5)
      .attr('stroke', d => getColor(d))
      .attr('stroke-opacity', 0.4);

    /* Labels — only for nodes with depth ≤ 3 or if leaf.
       Key: nodes are already translated to cartesian position.
       Left-side = d.x > Math.PI (sin(d.x) < 0 → x coord < cx).
       Never rotate text — only shift dx and flip text-anchor.        */
    nodesEnter.filter(d => d.depth <= 3 || !d.children)
      .append('text')
      .attr('class', 'node-label sci')
      .attr('dy', '0.35em')
      .attr('dx', d => {
        if (currentLayout !== 'radial') return d.children ? -10 : 8;
        const r = nodeRadius(d) + 5;
        return d.x > Math.PI ? -r : r;   // left side: negative, right side: positive
      })
      .attr('text-anchor', d => {
        if (currentLayout !== 'radial') return d.children ? 'end' : 'start';
        return d.x > Math.PI ? 'end' : 'start';
      })
      .text(d => nodeLabel(d));

    /* Merge enter + update */
    const allNodes = nodes.merge(nodesEnter);

    allNodes.transition().duration(dur)
      .attr('transform', d => {
        const [x, y] = toXY(d);
        return `translate(${cx + x},${cy + y})`;
      })
      .attr('class', d => `node ${d.data._children !== undefined && !d.children ? 'collapsed' : ''}`)
      .style('opacity', 1);

    allNodes.select('circle:first-child')
      .transition().duration(dur)
      .attr('r', nodeRadius)
      .attr('fill', d => getColor(d) || '#888888')
      .attr('fill-opacity', d => d.data.is_extinct ? 0 : (d.children ? 0.85 : 1))
      .attr('stroke', d => getColor(d) || '#888888')
      .attr('stroke-width', 1.5);

    /* Update label positions when layout changes */
    allNodes.select('text.node-label')
      .attr('dy', '0.35em')
      .attr('dx', d => {
        if (currentLayout !== 'radial') return d.children ? -10 : 8;
        const r = nodeRadius(d) + 5;
        return d.x > Math.PI ? -r : r;
      })
      .attr('text-anchor', d => {
        if (currentLayout !== 'radial') return d.children ? 'end' : 'start';
        return d.x > Math.PI ? 'end' : 'start';
      })
      .text(d => nodeLabel(d));

    nodes.exit().transition().duration(dur).style('opacity', 0).remove();

    updateMinimap();
  }

  /* ── Node interaction ───────────────────────────────────────── */
  async function handleNodeClick(d) {
    const nodeId = d.data.id;

    // If loading, skip
    if (expandingNodes.has(nodeId)) return;

    // Fire selection callback
    if (onNodeSelectCb) onNodeSelectCb(d.data);

    // If collapsed (has _children array), expand
    if (d.data._children !== undefined && !d.children) {
      await expandNode(d, nodeId);
    }
    // If expanded and has children, collapse
    else if (d.children && d.depth > 0) {
      collapseNode(d);
    }
  }

  async function expandNode(d, nodeId) {
    expandingNodes.add(nodeId);
    setNodeLoading(nodeId, true);

    try {
      let children;
      if (d.data._children && d.data._children.length > 0) {
        children = d.data._children; // pre-loaded
      } else {
        // Fetch from API
        const raw = await API.getChildren(d.data.ott_id);
        children = raw.slice(0, 40).map(c => ({ // cap at 40 to keep tree manageable
          id:         `ott${c.ott_id}`,
          name:       c.name,
          common:     c.name,
          ott_id:     c.ott_id,
          rank:       c.rank,
          color:      d.data.color, // inherit parent color
          num_tips:   c.num_tips,
          is_extinct: c.is_extinct,
          _children:  c.num_tips > 1 ? [] : undefined // leaf vs expandable
        }));
      }

      // Graft children onto data
      const nodeInData = findNodeById(treeData, nodeId);
      if (nodeInData) {
        nodeInData.children = children.length > 0 ? children : undefined;
        nodeInData._children = undefined;
      }
    } catch (e) {
      console.warn('expandNode failed', e);
    } finally {
      expandingNodes.delete(nodeId);
      setNodeLoading(nodeId, false);
    }

    render(true);
  }

  function collapseNode(d) {
    const nodeInData = findNodeById(treeData, d.data.id);
    if (nodeInData) {
      nodeInData._children = nodeInData.children || [];
      nodeInData.children = undefined;
    }
    render(true);
  }

  function findNodeById(node, id) {
    if (node.id === id) return node;
    for (const child of (node.children || node._children || [])) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
    return null;
  }

  function setNodeLoading(nodeId, loading) {
    nodesG.selectAll('.node')
      .filter(d => d.data.id === nodeId)
      .classed('node-loading', loading);
  }

  /* ── Focus on node ──────────────────────────────────────────── */
  function focusNode(ottId) {
    // Find visible node with this ott_id
    const all = nodesG.selectAll('.node').data();
    const target = all.find(d => d.data.ott_id === ottId);
    if (!target) return;

    const [cx, cy] = centerOffset();
    const [x, y] = toXY(target);
    const tx = cx + x;
    const ty = cy + y;

    const scale = Math.min(3, Math.max(1.2, currentTransform.k));
    svg.transition().duration(800)
      .call(zoomBehavior.transform, d3.zoomIdentity
        .translate(width / 2 - scale * tx, height / 2 - scale * ty)
        .scale(scale)
      );

    // Highlight selected node
    nodesG.selectAll('.node').classed('selected', d => d.data.ott_id === ottId);
  }

  function resetView() {
    svg.transition().duration(500).call(zoomBehavior.transform, d3.zoomIdentity);
  }

  /* ── Layout toggle ──────────────────────────────────────────── */
  function toggleLayout() {
    currentLayout = currentLayout === 'radial' ? 'cladogram' : 'radial';
    const btn = document.getElementById('btn-layout');
    btn.title = currentLayout === 'radial'
      ? 'Switch to Cladogram layout'
      : 'Switch to Radial layout';
    resetView();
    render(true);
  }

  /* ── Tooltip ─────────────────────────────────────────────────── */
  const tooltip = document.getElementById('tooltip');

  function showTooltip(event, d) {
    const tips = d.data.num_tips ? `${(d.data.num_tips).toLocaleString()} species` : '';
    tooltip.innerHTML = `
      <div class="tooltip-name">${d.data.name}</div>
      ${d.data.common && d.data.common !== d.data.name ? `<div class="tooltip-common">${d.data.common}</div>` : ''}
      <div class="tooltip-rank">${d.data.rank || ''}</div>
      ${tips ? `<div class="tooltip-tips">${tips}</div>` : ''}
    `;
    tooltip.hidden = false;
    moveTooltip(event);
  }

  function moveTooltip(event) {
    const tw = tooltip.offsetWidth, th = tooltip.offsetHeight;
    let tx = event.clientX + 14, ty = event.clientY - th / 2;
    if (tx + tw > window.innerWidth - 10) tx = event.clientX - tw - 14;
    if (ty < 10) ty = 10;
    tooltip.style.left = tx + 'px';
    tooltip.style.top  = ty + 'px';
  }

  function hideTooltip() { tooltip.hidden = true; }

  /* ── Minimap ─────────────────────────────────────────────────── */
  function updateMinimap() {
    const canvas = document.getElementById('minimap');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const mw = canvas.width, mh = canvas.height;
    ctx.clearRect(0, 0, mw, mh);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    ctx.fillStyle = isDark ? '#0f1623' : '#ffffff';
    ctx.fillRect(0, 0, mw, mh);

    // Draw nodes as dots scaled to minimap
    const scale = currentTransform.k;
    const [offX, offY] = [currentTransform.x, currentTransform.y];
    const scaleX = mw / width;
    const scaleY = mh / height;

    nodesG.selectAll('.node').each(function(d) {
      const [cx, cy] = centerOffset();
      const [x, y] = toXY(d);
      const sx = (offX + (cx + x) * scale) * scaleX;
      const sy = (offY + (cy + y) * scale) * scaleY;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.5, 0, 2 * Math.PI);
      ctx.fillStyle = getColor(d);
      ctx.globalAlpha = 0.7;
      ctx.fill();
    });

    // Viewport rect
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#4a9eff';
    ctx.lineWidth = 1;
    const vx = (-currentTransform.x / scale) * scaleX * scale * (mw / width);
    const vy = (-currentTransform.y / scale) * scaleY * scale * (mh / height);
    const vw = (width  / scale) * scaleX * scale * (mw / width);
    const vh = (height / scale) * scaleY * scale * (mh / height);
    ctx.strokeRect(
      (-currentTransform.x / width) * mw,
      (-currentTransform.y / height) * mh,
      (width / scale / width) * mw,
      (height / scale / height) * mh
    );
  }

  /* ── Public ──────────────────────────────────────────────────── */
  function onNodeSelect(cb) { onNodeSelectCb = cb; }

  return { init, load, focusNode, resetView, toggleLayout, onNodeSelect, render };
})();
