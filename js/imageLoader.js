/* ═══════════════════════════════════════════════════════════════
   imageLoader.js — Species image loading with fallback chain

   Provides a unified image source for tree nodes, panel heroes,
   and search thumbnails.

   Resolution order, best first:
     1. PHOTO_SNAPSHOT — Wikipedia's current lead image
     2. PHOTO_MAP      — hand-pinned Commons URLs
     3. node.img       — whatever the node carries
     4. the node's emoji

   The tree draws a silhouette over the disc where one exists (see
   js/silhouettes.js); this chain is what shows through when it does not, and
   what the panel uses for its hero.

   There was a layer above this one: ten "commissioned illustrations" in
   assets/species/. They were AI-generated marketing-page mockups — LUCA's was
   a web page for "ancientoceans.org", vertebrates' had a LEARN MORE button —
   sitting at the top of the chain and so beating both the silhouettes and the
   real photographs for the ten most prominent nodes on the screen.

   Size matters here. The tree draws 32–56px discs and the panel draws a
   full-bleed hero, so every caller says which it wants and gets a file cut
   for it. PHOTO_MAP served one 960px image to both, which meant a node icon
   downloaded roughly thirty times the pixels it could show — across ~330
   visible nodes that dominated the page's transfer weight.

   Also implements fail-once tracking (no retry loops per session) and lazy,
   non-blocking loading.
   ═══════════════════════════════════════════════════════════════ */
import { PHOTO_SNAPSHOT } from './photoSnapshot.js';

export const ImageLoader = (() => {
  /* Registered PHOTO_MAP reference (set via registerPhotoMap) */
  let photoMap = null;

  /**
   * Register a PHOTO_MAP object for curated Wikimedia URLs.
   * Called once after PHOTO_MAP is defined in inline script.
   */
  function registerPhotoMap(map) {
    photoMap = map;
  }

  /**
   * Get the best available image URL for a node, synchronously.
   * `size` is 'thumb' (tree discs, ~400px) or 'hero' (panel, ~1280px).
   * Returns { url, source, credit }.
   */
  function getBestUrl(nodeData, size = 'thumb') {
    const id = nodeData.id;

    /* 1. The snapshot: whatever image the Wikipedia article carried when
          photo-refresh.yml last ran, at the width this caller needs. It sits
          above PHOTO_MAP because it is the layer that repairs itself — a
          renamed or deleted Commons file is picked up by the weekly rebuild,
          whereas a hand-pinned URL stays broken until someone notices. */
    const snap = PHOTO_SNAPSHOT[id];
    if (snap) {
      const url = (size === 'hero' ? snap.hero : snap.thumb) || snap.thumb || snap.hero;
      if (url) return { url, source: 'snapshot', credit: 'Wikipedia / Wikimedia Commons' };
    }

    // 2. Hand-pinned PHOTO_MAP — covers ids with no Wikipedia article image
    if (photoMap && photoMap[id]) {
      return { url: photoMap[id].url, source: 'photomap', credit: photoMap[id].credit };
    }

    // 3. Node's existing img field
    if (nodeData.img) return { url: nodeData.img, source: 'node', credit: nodeData.imgCredit || null };

    // 4. No image available
    return { url: null, source: null, credit: null };
  }

  /**
   * Get the emoji icon for a node (final fallback).
   */
  function getEmoji(nodeData) {
    return nodeData.icon || null;
  }

  /**
   * Check if a node has a potentially loadable image.
   */
  function hasImage(nodeData) {
    return !!PHOTO_SNAPSHOT[nodeData.id] || (photoMap && !!photoMap[nodeData.id]) || !!nodeData.img;
  }

  /**
   * Every URL worth trying for this node, best first. Making the chain a list
   * rather than a nest of error handlers is what lets a new source be slotted
   * in without rewriting the failure paths — the previous version branched on
   * `best.source` in four places and adding one would have meant a fifth.
   */
  function urlChain(nodeData, size) {
    const id = nodeData.id;
    const out = [];
    const push = (url, source, credit) => {
      if (url && !out.some((c) => c.url === url)) out.push({ url, source, credit });
    };

    const snap = PHOTO_SNAPSHOT[id];
    if (snap) {
      push(size === 'hero' ? snap.hero : snap.thumb, 'snapshot', 'Wikipedia / Wikimedia Commons');
      push(size === 'hero' ? snap.thumb : snap.hero, 'snapshot', 'Wikipedia / Wikimedia Commons');
    }

    if (photoMap && photoMap[id]) push(photoMap[id].url, 'photomap', photoMap[id].credit);
    if (nodeData.img) push(nodeData.img, 'node', nodeData.imgCredit || null);
    return out;
  }

  /**
   * Load an image into an <img> or SVG <image> element, walking the chain
   * until one loads. Non-blocking. Calls opts.onFallback(emoji) if none do.
   */
  function loadInto(nodeData, imgEl, opts = {}) {
    const isSvgImage = imgEl.tagName === 'image';
    const setUrl = (url) => {
      if (isSvgImage) imgEl.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
      else imgEl.src = url;
    };

    const chain = urlChain(nodeData, opts.size === 'hero' ? 'hero' : 'thumb');
    if (!chain.length) {
      if (opts.onFallback) opts.onFallback(getEmoji(nodeData));
      return;
    }

    let i = 0;
    const onError = () => {
      i++;
      if (i >= chain.length) {
        if (opts.onFallback) opts.onFallback(getEmoji(nodeData));
        return;
      }
      attach();
    };
    const onSuccess = () => {
      imgEl.removeEventListener('error', onError);
      if (opts.onLoad) opts.onLoad(chain[i]);
    };
    function attach() {
      imgEl.addEventListener('error', onError, { once: true });
      imgEl.addEventListener('load', onSuccess, { once: true });
      setUrl(chain[i].url);
    }
    attach();
  }

  /**
   * Create a complete image element (for use in panels, search, etc.)
   */
  function createImage(nodeData, size = 'medium') {
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = nodeData.common || nodeData.name || '';

    const sizes = { thumb: 32, medium: 120, hero: 400 };
    const px = sizes[size] || sizes.medium;
    img.width = px;
    img.height = px;
    img.style.objectFit = 'cover';

    const promise = new Promise((resolve) => {
      loadInto(nodeData, img, {
        size,
        onLoad: () => resolve({ loaded: true, source: 'image' }),
        onFallback: () => resolve({ loaded: false, source: 'emoji' }),
        onError: () => resolve({ loaded: false, source: 'none' })
      });
    });

    return { element: img, promise };
  }

  /**
   * Preload an image URL without attaching to DOM.
   */
  function preload(nodeData) {
    const best = getBestUrl(nodeData);
    if (!best.url) return Promise.resolve(false);
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = best.url;
    });
  }

  return {
    registerPhotoMap,
    getBestUrl,
    getEmoji,
    hasImage,
    loadInto,
    createImage,
    preload
  };
})();
