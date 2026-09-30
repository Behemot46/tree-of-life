// ══════════════════════════════════════════════════════
// Shared helpers for the opening-screen concepts.
//
// Every concept is a pure function of time: draw(ctx, t) paints the frame at
// second t and keeps nothing between calls. That is what lets the gallery
// scrub, lets a screenshot land on exactly 2.4 s, and lets the reduced-motion
// path paint the finished picture once instead of an empty box.
// ══════════════════════════════════════════════════════

export const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const lerp = (a, b, t) => a + (b - a) * t;
export const map01 = (t, a, b) => clamp01((t - a) / (b - a));
export const smooth = (a, b, x) => { const t = map01(x, a, b); return t * t * (3 - 2 * t); };
export const easeOut3 = (t) => 1 - Math.pow(1 - clamp01(t), 3);
export const easeOut5 = (t) => 1 - Math.pow(1 - clamp01(t), 5);
export const easeInOut3 = (t) => { t = clamp01(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const easeInOut2 = (t) => { t = clamp01(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
export const easeOutBack = (t, s = 1.70158) => { t = clamp01(t) - 1; return 1 + t * t * ((s + 1) * t + s); };
export const easeOutElastic = (t) => {
  t = clamp01(t);
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -9 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1;
};

/** Deterministic PRNG: the same seed paints the same picture every time. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// ── Colour ───────────────────────────────────────────
export function parseColor(c) {
  if (!c) return [200, 136, 58];
  c = String(c).trim();
  let m;
  if ((m = c.match(/^#([0-9a-f]{3})$/i))) return m[1].split('').map((h) => parseInt(h + h, 16));
  if ((m = c.match(/^#([0-9a-f]{6})/i))) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  if ((m = c.match(/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/i))) return [+m[1], +m[2], +m[3]];
  return [200, 136, 58];
}
export const rgba = (c, a = 1) => { const [r, g, b] = Array.isArray(c) ? c : parseColor(c); return `rgba(${r | 0},${g | 0},${b | 0},${a})`; };
export const mixRGB = (a, b, t) => { const A = Array.isArray(a) ? a : parseColor(a), B = Array.isArray(b) ? b : parseColor(b); return [lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)]; };
export const lighten = (c, t) => mixRGB(c, [255, 255, 255], t);
export const darken = (c, t) => mixRGB(c, [0, 0, 0], t);
export function hsl(h, s, l, a = 1) { return `hsla(${h},${s}%,${l}%,${a})`; }
export function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) {
    const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60;
  }
  return [h, s * 100, l * 100];
}

// ── Text ─────────────────────────────────────────────
export const FONT = "Inter, Heebo, 'Helvetica Neue', Arial, sans-serif";

/** Largest size at or below `size` that keeps `str` within `limit` px. */
export function fitSize(ctx, str, size, weight, limit, family = FONT, spacing = 0) {
  ctx.save();
  let s = size;
  for (let i = 0; i < 12; i++) {
    ctx.font = `${weight} ${s}px ${family}`;
    ctx.letterSpacing = `${spacing}px`;
    if (ctx.measureText(str).width <= limit || s <= 10) break;
    s -= Math.max(1, s * 0.07);
  }
  ctx.restore();
  return Math.round(s * 10) / 10;
}

/** Text is laid out in the page's direction unless the caller says otherwise:
    "720 Ma" is a Latin run and comes back as "Ma 720" if laid out RTL. */
export function drawText(ctx, str, x, y, o = {}) {
  const { size = 16, weight = 500, color = '#fff', alpha = 1, spacing = 0, dir, align = 'center', family = FONT, baseline = 'middle', rtl = false, shadow } = o;
  if (alpha <= 0.002 || !str) return;
  ctx.save();
  ctx.globalAlpha = clamp01(alpha);
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${family}`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.letterSpacing = `${spacing}px`;
  ctx.direction = dir || (rtl ? 'rtl' : 'ltr');
  if (shadow) { ctx.shadowColor = shadow.color; ctx.shadowBlur = shadow.blur; ctx.shadowOffsetX = shadow.x || 0; ctx.shadowOffsetY = shadow.y || 0; }
  ctx.fillText(str, x, y);
  ctx.restore();
}

/** Text set along an arc, centred on angle `mid` (radians, canvas convention).
    `outward` keeps the letters upright toward the outside of the circle. */
export function arcText(ctx, str, cx, cy, r, mid, o = {}) {
  const { size = 10, weight = 500, color = '#fff', alpha = 1, spacing = 2, family = FONT, flip = false } = o;
  if (alpha <= 0.002 || !str) return;
  ctx.save();
  ctx.globalAlpha = clamp01(alpha);
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${family}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const chars = [...str];
  const widths = chars.map((c) => ctx.measureText(c).width + spacing);
  const total = widths.reduce((a, b) => a + b, 0);
  let a = mid - (flip ? -1 : 1) * (total / r) / 2;
  chars.forEach((ch, i) => {
    const w = widths[i];
    const ang = a + (flip ? -1 : 1) * (w / r) / 2;
    ctx.save();
    ctx.translate(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r);
    ctx.rotate(ang + (flip ? -Math.PI / 2 : Math.PI / 2));
    ctx.fillText(ch, 0, 0);
    ctx.restore();
    a += (flip ? -1 : 1) * (w / r);
  });
  ctx.restore();
}

// ── Sprites ──────────────────────────────────────────
/** A soft round glow, drawn once and stamped many times. */
export function glowSprite(rgb, size = 96, hard = 0.0) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  const [r, gg, b] = rgb.map((v) => v | 0);
  gr.addColorStop(0, `rgba(${r},${gg},${b},1)`);
  gr.addColorStop(Math.max(0.001, hard), `rgba(${r},${gg},${b},${0.85 - hard * 0.2})`);
  gr.addColorStop(0.45, `rgba(${r},${gg},${b},0.28)`);
  gr.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, size, size);
  return c;
}

/** Fine paper/film grain: one tile, tiled by the caller. */
export function grainTile(size = 192, seed = 7, strength = 26, mono = true) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const img = g.createImageData(size, size);
  const rnd = mulberry32(seed);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (rnd() - 0.5) * strength * 2;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    if (!mono) { img.data[i] += (rnd() - 0.5) * 8; img.data[i + 2] += (rnd() - 0.5) * 8; }
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return c;
}

/** Pull a colour toward something that reads well on the ground: saturated,
    and neither white-hot nor muddy. The map's pale leaf colours would otherwise
    glare as white dots in a glowing scene. */
export function vivid(c, light = false) {
  const [h, s0, l0] = rgbToHsl(Array.isArray(c) ? c : parseColor(c));
  const s1 = Math.max(s0, 62);
  const l1 = light ? Math.min(Math.max(l0, 34), 46) : Math.min(Math.max(l0, 50), 62);
  return hslToRgb(h, s1, l1);
}
export function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}
