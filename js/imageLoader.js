/* ═══════════════════════════════════════════════════════════════
   imageLoader.js — Species image loading with fallback chain

   Provides a unified image source for tree nodes, panel heroes,
   and search thumbnails.

   Resolution order, best first:
     1. assets/species/{id}.webp — the ten commissioned illustrations
     2. PHOTO_SNAPSHOT           — Wikipedia's current lead image
     3. PHOTO_MAP                — hand-pinned Commons URLs
     4. node.img                 — whatever the node carries
     5. the node's emoji

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
  /* Set of node IDs whose generated image failed to load this session */
  const failedIds = new Set();

  /* Track which IDs have confirmed working format (avoids double probing) */
  const confirmedFormats = {};

  /* Registered PHOTO_MAP reference (set via registerPhotoMap) */
  let photoMap = null;

  /* Base path for AI-generated species images */
  const SPECIES_IMAGE_BASE = 'assets/species/';
  const IMAGE_FORMATS = ['.webp', '.png'];

  /* Manifest of node IDs with available generated images.
     Only these IDs will attempt the local .webp URL — prevents
     unnecessary 404s for nodes without generated art. */
  const GENERATED_IDS = new Set([
    'luca', 'bacteria', 'archaea', 'eukaryota', 'fungi',
    'plantae', 'animalia', 'vertebrates', 'mammals', 'primates'
  ]);

  /**
   * Register a PHOTO_MAP object for curated Wikimedia URLs.
   * Called once after PHOTO_MAP is defined in inline script.
   */
  function registerPhotoMap(map) {
    photoMap = map;
  }

  /**
   * Get the generated image URL for a node ID.
   * Returns null if the image already failed this session.
   * Tries confirmed format first, defaults to .webp.
   */
  function getGeneratedUrl(nodeId) {
    if (!GENERATED_IDS.has(nodeId)) return null;
    if (failedIds.has(nodeId)) return null;
    const ext = confirmedFormats[nodeId] || IMAGE_FORMATS[0];
    return SPECIES_IMAGE_BASE + nodeId + ext;
  }

  /**
   * Get the alternate format URL (for fallback within generated images).
   * If .webp failed, try .png and vice versa.
   */
  function getAlternateGeneratedUrl(nodeId, failedUrl) {
    const failedExt = failedUrl.endsWith('.webp') ? '.webp' : '.png';
    const altExt = failedExt === '.webp' ? '.png' : '.webp';
    return SPECIES_IMAGE_BASE + nodeId + altExt;
  }

  /**
   * Get the best available image URL for a node, synchronously.
   * `size` is 'thumb' (tree discs, ~400px) or 'hero' (panel, ~1280px).
   * Returns { url, source, credit }.
   */
  function getBestUrl(nodeData, size = 'thumb') {
    const id = nodeData.id;

    // 1. Local commissioned illustration (no CORS, no rot, already sized)
    const genUrl = getGeneratedUrl(id);
    if (genUrl) return { url: genUrl, source: 'generated', credit: 'AI-generated illustration' };

    /* 2. The snapshot: whatever image the Wikipedia article carried when
          photo-refresh.yml last ran, at the width this caller needs. It sits
          above PHOTO_MAP because it is the layer that repairs itself — a
          renamed or deleted Commons file is picked up by the weekly rebuild,
          whereas a hand-pinned URL stays broken until someone notices. */
    const snap = PHOTO_SNAPSHOT[id];
    if (snap) {
      const url = (size === 'hero' ? snap.hero : snap.thumb) || snap.thumb || snap.hero;
      if (url) return { url, source: 'snapshot', credit: 'Wikipedia / Wikimedia Commons' };
    }

    // 3. Hand-pinned PHOTO_MAP — covers ids with no Wikipedia article image
    if (photoMap && photoMap[id]) {
      return { url: photoMap[id].url, source: 'photomap', credit: photoMap[id].credit };
    }

    // 4. Node's existing img field
    if (nodeData.img) return { url: nodeData.img, source: 'node', credit: nodeData.imgCredit || null };

    // 5. No image available
    return { url: null, source: null, credit: null };
  }

  /**
   * Get the emoji icon for a node (final fallback).
   */
  function getEmoji(nodeData) {
    return nodeData.icon || null;
  }

  /**
   * Mark a generated image as failed for this session.
   */
  function markFailed(nodeId) {
    failedIds.add(nodeId);
  }

  /**
   * Check if a node has a potentially loadable image.
   */
  function hasImage(nodeData) {
    return (photoMap && !!photoMap[nodeData.id]) || !failedIds.has(nodeData.id) || !!nodeData.img;
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

    const gen = getGeneratedUrl(id);
    if (gen) {
      push(gen, 'generated', 'AI-generated illustration');
      // .webp is what ships; .png is kept as an escape hatch for any browser
      // that cannot decode it.
      push(getAlternateGeneratedUrl(id, gen), 'generated', 'AI-generated illustration');
    }

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
      const failed = chain[i];
      // Only the local illustration is worth remembering as failed: a missing
      // file stays missing all session, whereas a Commons hiccup may not.
      if (failed.source === 'generated' && i + 1 < chain.length && chain[i + 1].source !== 'generated') {
        markFailed(nodeData.id);
      }
      i++;
      if (i >= chain.length) {
        if (opts.onFallback) opts.onFallback(getEmoji(nodeData));
        return;
      }
      attach();
    };
    const onSuccess = () => {
      imgEl.removeEventListener('error', onError);
      const ok = chain[i];
      if (ok.source === 'generated') {
        confirmedFormats[nodeData.id] = ok.url.endsWith('.webp') ? '.webp' : '.png';
      }
      if (opts.onLoad) opts.onLoad(ok);
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
      img.onload = () => {
        if (best.source === 'generated') {
          const ext = best.url.endsWith('.webp') ? '.webp' : '.png';
          confirmedFormats[nodeData.id] = ext;
        }
        resolve(true);
      };
      img.onerror = () => {
        // Try alternate format before marking as failed
        if (best.source === 'generated') {
          const altUrl = getAlternateGeneratedUrl(nodeData.id, best.url);
          const img2 = new Image();
          img2.onload = () => {
            const ext = altUrl.endsWith('.webp') ? '.webp' : '.png';
            confirmedFormats[nodeData.id] = ext;
            resolve(true);
          };
          img2.onerror = () => {
            markFailed(nodeData.id);
            resolve(false);
          };
          img2.src = altUrl;
        } else {
          resolve(false);
        }
      };
      img.src = best.url;
    });
  }

  return {
    registerPhotoMap,
    getBestUrl,
    getEmoji,
    getGeneratedUrl,
    getAlternateGeneratedUrl,
    markFailed,
    hasImage,
    loadInto,
    createImage,
    preload
  };
})();
