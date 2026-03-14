/* ═══════════════════════════════════════════════════════════════
   imageLoader.js — Species image loading with fallback chain

   Provides a unified image source for tree nodes, panel heroes,
   and search thumbnails. Implements:
   - Stable URL pattern: assets/species/{id}.webp
   - Graceful fallback: generated → node img → emoji
   - Fail-once tracking (no retry loops per session)
   - Lazy, non-blocking loading
   ═══════════════════════════════════════════════════════════════ */

const ImageLoader = (() => {
  /* Set of node IDs whose generated image failed to load this session */
  const failedIds = new Set();

  /* Base path for AI-generated species images */
  const SPECIES_IMAGE_BASE = 'assets/species/';
  const IMAGE_EXT = '.webp';

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
   * Returns { url, source } where source is 'generated'|'node'|null.
   * Does not attempt loading — just returns the URL to try.
   */
  function getBestUrl(nodeData) {
    const id = nodeData.id;

    // 1. Generated image (if not already failed)
    const genUrl = getGeneratedUrl(id);
    if (genUrl) return { url: genUrl, source: 'generated' };

    // 2. Node's existing img field (Wikipedia/Wikimedia URLs)
    if (nodeData.img) return { url: nodeData.img, source: 'node' };

    // 3. No image available
    return { url: null, source: null };
  }

  /**
   * Get the emoji icon for a node (final fallback).
   * Returns the emoji string or null.
   */
  function getEmoji(nodeData) {
    return nodeData.icon || null;
  }

  /**
   * Mark a generated image as failed for this session.
   * Future calls to getBestUrl will skip to the next fallback.
   */
  function markFailed(nodeId) {
    failedIds.add(nodeId);
  }

  /**
   * Check if a node has a potentially loadable image.
   */
  function hasImage(nodeData) {
    return !failedIds.has(nodeData.id) || !!nodeData.img;
  }

  /**
   * Load an image into an <img> or SVG <image> element with
   * the full fallback chain. Non-blocking.
   *
   * @param {Object} nodeData - The node data object
   * @param {Element} imgEl - An <img> or SVG <image> element
   * @param {Object} opts - Options
   * @param {string} opts.size - 'thumb' (32px) | 'medium' (120px) | 'hero' (400px)
   * @param {Function} opts.onLoad - Called when image loads successfully
   * @param {Function} opts.onFallback - Called when falling back to emoji (receives emoji string)
   * @param {Function} opts.onError - Called when all sources fail
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
      // No image URL available at all — use emoji fallback
      if (opts.onFallback) opts.onFallback(getEmoji(nodeData));
      return;
    }

    // Try loading the best URL
    const onError = () => {
      if (best.source === 'generated') {
        // Mark as failed, try node img fallback
        markFailed(nodeData.id);
        if (nodeData.img) {
          setUrl(nodeData.img);
          imgEl.removeEventListener('error', onError);
          imgEl.addEventListener('error', onFinalError, { once: true });
        } else {
          // No more image fallbacks — use emoji
          if (opts.onFallback) opts.onFallback(getEmoji(nodeData));
        }
      } else {
        // Node img also failed
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
   * Returns an object with the img element and load promise.
   *
   * @param {Object} nodeData - The node data object
   * @param {string} size - 'thumb' | 'medium' | 'hero'
   * @returns {{ element: HTMLImageElement, promise: Promise }}
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
   * Returns a promise that resolves to true/false.
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
