/* ═══════════════════════════════════════════════════════════════
   imageLoader.js — Species image loading with fallback chain

   Provides a unified image source for tree nodes, panel heroes,
   and search thumbnails. Implements:
   - Local-first: assets/species/{id}.webp (AI-generated) as primary
   - PHOTO_MAP (Wikimedia Commons) as secondary fallback
   - Graceful fallback: generated → PHOTO_MAP → node.img → emoji
   - Fail-once tracking (no retry loops per session)
   - Lazy, non-blocking loading
   ═══════════════════════════════════════════════════════════════ */

const ImageLoader = (() => {
  /* Set of node IDs whose generated image failed to load this session */
  const failedIds = new Set();

  /* Registered PHOTO_MAP reference (set via registerPhotoMap) */
  let photoMap = null;

  /* Base path for AI-generated species images */
  const SPECIES_IMAGE_BASE = 'assets/species/';
  const IMAGE_EXT = '.webp';

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
   */
  function getGeneratedUrl(nodeId) {
    if (failedIds.has(nodeId)) return null;
    return SPECIES_IMAGE_BASE + nodeId + IMAGE_EXT;
  }

  /**
   * Get the best available image URL for a node, synchronously.
   * Returns { url, source, credit }.
   * Priority: generated .webp → PHOTO_MAP → node.img → null.
   */
  function getBestUrl(nodeData) {
    const id = nodeData.id;

    // 1. Local generated image (highest priority — sustainable, no CORS)
    const genUrl = getGeneratedUrl(id);
    if (genUrl) return { url: genUrl, source: 'generated', credit: 'AI-generated illustration' };

    // 2. Curated PHOTO_MAP (Wikimedia Commons URLs) — fallback
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
   * Load an image into an <img> or SVG <image> element with
   * the full fallback chain. Non-blocking.
   */
  function loadInto(nodeData, imgEl, opts = {}) {
    const isSvgImage = imgEl.tagName === 'image';
    const setUrl = (url) => {
      if (isSvgImage) {
        imgEl.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
      } else {
        imgEl.src = url;
      }
    };

    const best = getBestUrl(nodeData);

    if (!best.url) {
      if (opts.onFallback) opts.onFallback(getEmoji(nodeData));
      return;
    }

    const onError = () => {
      if (best.source === 'generated') {
        // Generated failed, try PHOTO_MAP
        markFailed(nodeData.id);
        if (photoMap && photoMap[nodeData.id]) {
          setUrl(photoMap[nodeData.id].url);
          imgEl.removeEventListener('error', onError);
          imgEl.addEventListener('error', onPhotoMapError, { once: true });
        } else if (nodeData.img) {
          setUrl(nodeData.img);
          imgEl.removeEventListener('error', onError);
          imgEl.addEventListener('error', onFinalError, { once: true });
        } else {
          if (opts.onFallback) opts.onFallback(getEmoji(nodeData));
        }
      } else if (best.source === 'photomap') {
        // Photomap failed, try node.img
        if (nodeData.img) {
          setUrl(nodeData.img);
          imgEl.removeEventListener('error', onError);
          imgEl.addEventListener('error', onFinalError, { once: true });
        } else {
          if (opts.onFallback) opts.onFallback(getEmoji(nodeData));
        }
      } else {
        if (opts.onFallback) opts.onFallback(getEmoji(nodeData));
      }
    };

    const onPhotoMapError = () => {
      if (nodeData.img) {
        setUrl(nodeData.img);
        imgEl.addEventListener('error', onFinalError, { once: true });
      } else {
        if (opts.onFallback) opts.onFallback(getEmoji(nodeData));
      }
    };

    const onFinalError = () => {
      if (opts.onFallback) opts.onFallback(getEmoji(nodeData));
    };

    const onSuccess = () => {
      imgEl.removeEventListener('error', onError);
      if (opts.onLoad) opts.onLoad();
    };

    imgEl.addEventListener('error', onError, { once: true });
    imgEl.addEventListener('load', onSuccess, { once: true });
    setUrl(best.url);
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
      img.onerror = () => {
        if (best.source === 'generated') markFailed(nodeData.id);
        resolve(false);
      };
      img.src = best.url;
    });
  }

  return {
    registerPhotoMap,
    getBestUrl,
    getEmoji,
    getGeneratedUrl,
    markFailed,
    hasImage,
    loadInto,
    createImage,
    preload
  };
})();
