#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   generate-images.js — Multi-provider AI species image pipeline

   Usage:
     cd scripts && npm install
     node generate-images.js --provider gemini          # Google Gemini Imagen
     node generate-images.js --provider openai          # OpenAI DALL-E 3
     node generate-images.js --provider stability       # Stability AI SDXL
     node generate-images.js --provider replicate       # Replicate Flux

   Options:
     --provider <name>   API provider (gemini|openai|stability|replicate)
     --ids <id1,id2>     Only generate specific node IDs
     --force             Regenerate even if image already exists
     --dry-run           Show what would be generated without calling APIs
     --batch-size <n>    Number of concurrent requests (default: 3)
     --delay <ms>        Delay between batches in ms (default: 2000)
     --size <WxH>        Image size (default: 1024x1024)
     --output <dir>      Output directory (default: ../assets/species)
     --format <ext>      Output format: webp or png (default: webp)
     --quality <n>       WebP quality 1-100 (default: 85)

   Environment variables:
     GOOGLE_API_KEY      For Gemini Imagen
     OPENAI_API_KEY      For DALL-E 3
     STABILITY_API_KEY   For Stability AI
     REPLICATE_API_TOKEN For Replicate

   ═══════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Parse IMAGE_PROMPTS from imagePrompts.js ──
function loadImagePrompts() {
  const filePath = join(__dirname, '..', 'js', 'imagePrompts.js');
  const src = readFileSync(filePath, 'utf-8');

  // Extract the object literal between `const IMAGE_PROMPTS = {` and `};`
  const match = src.match(/const\s+IMAGE_PROMPTS\s*=\s*(\{[\s\S]*?\n\});/);
  if (!match) throw new Error('Could not parse IMAGE_PROMPTS from imagePrompts.js');

  // Use Function constructor to safely evaluate the object literal
  const fn = new Function(`return ${match[1]}`);
  return fn();
}

// ── CLI argument parsing ──
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    provider: 'gemini',
    ids: null,
    force: false,
    dryRun: false,
    batchSize: 3,
    delay: 2000,
    size: '1024x1024',
    output: join(__dirname, '..', 'assets', 'species'),
    format: 'webp',
    quality: 85,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--provider': opts.provider = args[++i]; break;
      case '--ids': opts.ids = args[++i].split(',').map(s => s.trim()); break;
      case '--force': opts.force = true; break;
      case '--dry-run': opts.dryRun = true; break;
      case '--batch-size': opts.batchSize = parseInt(args[++i], 10); break;
      case '--delay': opts.delay = parseInt(args[++i], 10); break;
      case '--size': opts.size = args[++i]; break;
      case '--output': opts.output = args[++i]; break;
      case '--format': opts.format = args[++i]; break;
      case '--quality': opts.quality = parseInt(args[++i], 10); break;
      case '--help': case '-h': printHelp(); process.exit(0);
      default:
        console.error(`Unknown option: ${args[i]}`);
        process.exit(1);
    }
  }

  return opts;
}

function printHelp() {
  console.log(`
Tree of Life — AI Species Image Generator

Usage: node generate-images.js [options]

Providers:
  gemini      Google Gemini Imagen (GOOGLE_API_KEY)
  openai      OpenAI DALL-E 3 (OPENAI_API_KEY)
  stability   Stability AI SDXL (STABILITY_API_KEY)
  replicate   Replicate Flux (REPLICATE_API_TOKEN)

Options:
  --provider <name>   API provider (default: gemini)
  --ids <id1,id2>     Only generate specific node IDs
  --force             Regenerate existing images
  --dry-run           Preview without API calls
  --batch-size <n>    Concurrent requests (default: 3)
  --delay <ms>        Delay between batches (default: 2000)
  --size <WxH>        Image dimensions (default: 1024x1024)
  --output <dir>      Output directory (default: ../assets/species)
  --format <ext>      webp or png (default: webp)
  --quality <n>       WebP quality 1-100 (default: 85)
  `);
}

// ── Provider implementations ──

const providers = {
  /** Google Gemini Imagen */
  async gemini(prompt, size, apiKey) {
    const [w, h] = size.split('x').map(Number);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: w === h ? '1:1' : `${w}:${h}`,
          outputOptions: { mimeType: 'image/png' }
        }
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Gemini API ${res.status}: ${errBody}`);
    }

    const data = await res.json();
    const b64 = data.predictions?.[0]?.bytesBase64Encoded;
    if (!b64) throw new Error('No image data in Gemini response');
    return Buffer.from(b64, 'base64');
  },

  /** OpenAI DALL-E 3 */
  async openai(prompt, size, apiKey) {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: size === '1024x1024' ? '1024x1024' : '1024x1024',
        response_format: 'b64_json',
        quality: 'standard'
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`OpenAI API ${res.status}: ${errBody}`);
    }

    const data = await res.json();
    const b64 = data.data?.[0]?.b64_json;
    if (!b64) throw new Error('No image data in OpenAI response');
    return Buffer.from(b64, 'base64');
  },

  /** Stability AI (Stable Diffusion 3 / SDXL) */
  async stability(prompt, size, apiKey) {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('output_format', 'png');
    formData.append('aspect_ratio', '1:1');

    const res = await fetch('https://api.stability.ai/v2beta/stable-image/generate/sd3', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'image/*'
      },
      body: formData
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Stability API ${res.status}: ${errBody}`);
    }

    return Buffer.from(await res.arrayBuffer());
  },

  /** Replicate (Flux model) */
  async replicate(prompt, size, apiKey) {
    const [w, h] = size.split('x').map(Number);

    // Create prediction
    const createRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        version: 'black-forest-labs/flux-1.1-pro',
        input: {
          prompt,
          width: Math.min(w, 1440),
          height: Math.min(h, 1440),
          num_outputs: 1
        }
      })
    });

    if (!createRes.ok) {
      const errBody = await createRes.text();
      throw new Error(`Replicate API ${createRes.status}: ${errBody}`);
    }

    let prediction = await createRes.json();

    // Poll for completion
    const pollUrl = prediction.urls?.get || `https://api.replicate.com/v1/predictions/${prediction.id}`;
    for (let attempt = 0; attempt < 120; attempt++) {
      await sleep(2000);
      const pollRes = await fetch(pollUrl, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      prediction = await pollRes.json();

      if (prediction.status === 'succeeded') {
        const imageUrl = prediction.output?.[0] || prediction.output;
        if (!imageUrl) throw new Error('No output URL from Replicate');
        const imgRes = await fetch(imageUrl);
        return Buffer.from(await imgRes.arrayBuffer());
      }
      if (prediction.status === 'failed' || prediction.status === 'canceled') {
        throw new Error(`Replicate prediction ${prediction.status}: ${prediction.error || 'unknown'}`);
      }
    }
    throw new Error('Replicate prediction timed out after 4 minutes');
  }
};

// ── Image conversion ──

let sharp = null;

async function loadSharp() {
  try {
    const mod = await import('sharp');
    sharp = mod.default;
    return true;
  } catch {
    return false;
  }
}

async function convertToWebp(pngBuffer, quality) {
  if (!sharp) return null;
  return sharp(pngBuffer)
    .resize(1024, 1024, { fit: 'cover' })
    .webp({ quality })
    .toBuffer();
}

// ── Utilities ──

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getApiKey(provider) {
  const envMap = {
    gemini: 'GOOGLE_API_KEY',
    openai: 'OPENAI_API_KEY',
    stability: 'STABILITY_API_KEY',
    replicate: 'REPLICATE_API_TOKEN'
  };
  const envVar = envMap[provider];
  const key = process.env[envVar];
  if (!key) {
    console.error(`\n  Missing ${envVar} environment variable for provider "${provider}".`);
    console.error(`  Set it with: export ${envVar}=your-key-here\n`);
    process.exit(1);
  }
  return key;
}

// ── Progress display ──

function progressBar(current, total, width = 30) {
  const pct = Math.round((current / total) * 100);
  const filled = Math.round((current / total) * width);
  const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
  return `[${bar}] ${pct}% (${current}/${total})`;
}

// ── Manifest tracking ──

function loadManifest(outputDir) {
  const manifestPath = join(outputDir, 'manifest.json');
  if (existsSync(manifestPath)) {
    return JSON.parse(readFileSync(manifestPath, 'utf-8'));
  }
  return { generated: {}, errors: {}, lastRun: null };
}

function saveManifest(outputDir, manifest) {
  const manifestPath = join(outputDir, 'manifest.json');
  manifest.lastRun = new Date().toISOString();
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

// ── Main pipeline ──

async function main() {
  const opts = parseArgs();

  console.log('\n🌳 Tree of Life — AI Species Image Generator\n');
  console.log(`  Provider:    ${opts.provider}`);
  console.log(`  Format:      ${opts.format}`);
  console.log(`  Size:        ${opts.size}`);
  console.log(`  Quality:     ${opts.quality}`);
  console.log(`  Batch size:  ${opts.batchSize}`);
  console.log(`  Delay:       ${opts.delay}ms`);
  console.log(`  Output:      ${opts.output}`);
  console.log(`  Force:       ${opts.force}`);
  console.log(`  Dry run:     ${opts.dryRun}\n`);

  // Load prompts
  const prompts = loadImagePrompts();
  const allIds = Object.keys(prompts);
  const targetIds = opts.ids
    ? opts.ids.filter(id => {
        if (!prompts[id]) { console.warn(`  Warning: no prompt for ID "${id}", skipping`); return false; }
        return true;
      })
    : allIds;

  console.log(`  Total prompts: ${allIds.length}`);
  console.log(`  Target IDs:    ${targetIds.length}\n`);

  // Ensure output directory
  if (!existsSync(opts.output)) {
    mkdirSync(opts.output, { recursive: true });
    console.log(`  Created output directory: ${opts.output}\n`);
  }

  // Load manifest for tracking
  const manifest = loadManifest(opts.output);

  // Determine which IDs need generation
  const ext = opts.format === 'webp' ? '.webp' : '.png';
  const pending = targetIds.filter(id => {
    const outPath = join(opts.output, id + ext);
    if (!opts.force && existsSync(outPath)) {
      return false; // Already exists
    }
    return true;
  });

  const skipped = targetIds.length - pending.length;
  if (skipped > 0) {
    console.log(`  Skipping ${skipped} already-generated images (use --force to regenerate)\n`);
  }

  if (pending.length === 0) {
    console.log('  All images already generated. Nothing to do.\n');
    return;
  }

  console.log(`  Will generate ${pending.length} images\n`);

  if (opts.dryRun) {
    console.log('  Dry run — listing IDs that would be generated:\n');
    pending.forEach((id, i) => {
      console.log(`    ${i + 1}. ${id} — ${prompts[id].style} — "${prompts[id].prompt.substring(0, 80)}..."`);
    });
    console.log('\n  Done (dry run).\n');
    return;
  }

  // Load sharp for webp conversion
  const hasSharp = await loadSharp();
  if (opts.format === 'webp' && !hasSharp) {
    console.warn('  Warning: sharp not available. Install with: cd scripts && npm install');
    console.warn('  Falling back to PNG output.\n');
    opts.format = 'png';
  }

  // Get API key
  const apiKey = getApiKey(opts.provider);
  const generateFn = providers[opts.provider];
  if (!generateFn) {
    console.error(`  Unknown provider: ${opts.provider}`);
    console.error(`  Available: ${Object.keys(providers).join(', ')}`);
    process.exit(1);
  }

  // Process in batches
  let completed = 0;
  let failed = 0;
  const errors = [];
  const startTime = Date.now();

  for (let i = 0; i < pending.length; i += opts.batchSize) {
    const batch = pending.slice(i, i + opts.batchSize);

    const results = await Promise.allSettled(
      batch.map(async (id) => {
        const { prompt, style } = prompts[id];

        // Enhance prompt with style-specific suffixes
        const enhancedPrompt = enhancePrompt(prompt, style);

        try {
          // Call API
          const imageBuffer = await generateFn(enhancedPrompt, opts.size, apiKey);

          // Convert to webp if requested and sharp is available
          let outputBuffer;
          let outputExt;
          if (opts.format === 'webp' && hasSharp) {
            outputBuffer = await convertToWebp(imageBuffer, opts.quality);
            outputExt = '.webp';
          } else {
            outputBuffer = imageBuffer;
            outputExt = '.png';
          }

          // Save
          const outPath = join(opts.output, id + outputExt);
          writeFileSync(outPath, outputBuffer);

          // Update manifest
          manifest.generated[id] = {
            provider: opts.provider,
            style,
            format: outputExt.slice(1),
            size: outputBuffer.length,
            generatedAt: new Date().toISOString()
          };
          delete manifest.errors[id];

          return { id, success: true, size: outputBuffer.length };
        } catch (err) {
          manifest.errors[id] = {
            provider: opts.provider,
            error: err.message,
            failedAt: new Date().toISOString()
          };
          throw err;
        }
      })
    );

    // Report batch results
    for (const result of results) {
      if (result.status === 'fulfilled') {
        completed++;
        const { id, size } = result.value;
        const sizeKb = (size / 1024).toFixed(1);
        process.stdout.write(`\r  ${progressBar(completed + failed, pending.length)}  ✓ ${id} (${sizeKb} KB)`);
        process.stdout.write('\n');
      } else {
        failed++;
        const err = result.reason;
        const id = batch[results.indexOf(result)] || '?';
        errors.push({ id, error: err.message });
        process.stdout.write(`\r  ${progressBar(completed + failed, pending.length)}  ✗ ${id}: ${err.message.substring(0, 60)}`);
        process.stdout.write('\n');
      }
    }

    // Save manifest after each batch
    saveManifest(opts.output, manifest);

    // Rate limiting delay between batches
    if (i + opts.batchSize < pending.length) {
      await sleep(opts.delay);
    }
  }

  // Summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n  ── Summary ──`);
  console.log(`  Completed: ${completed}/${pending.length} in ${elapsed}s`);
  if (failed > 0) {
    console.log(`  Failed:    ${failed}`);
    errors.forEach(e => console.log(`    - ${e.id}: ${e.error.substring(0, 80)}`));
  }
  console.log(`  Manifest:  ${join(opts.output, 'manifest.json')}`);
  console.log('');
}

/**
 * Enhance prompt with style-specific quality suffixes.
 */
function enhancePrompt(prompt, style) {
  const suffixes = {
    photo: ', professional wildlife/nature photography, 8K resolution, National Geographic quality',
    micro: ', scientific microscopy, high magnification, sharp focus, professional laboratory imaging',
    fossil: ', museum-quality specimen photography, dramatic lighting, paleontology documentation',
    illustration: ', scientific illustration, anatomically accurate, museum-quality paleoart, detailed rendering'
  };
  return prompt + (suffixes[style] || ', high quality, detailed, professional');
}

main().catch(err => {
  console.error('\n  Fatal error:', err.message);
  process.exit(1);
});
