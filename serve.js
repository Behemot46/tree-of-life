const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 5555;
const dir = __dirname;

// Serve the same security headers production does. vercel.json is the single
// source of truth, so a Content-Security-Policy that would break the deployed
// site breaks it locally and in the smoke suite first.
const siteHeaders = (() => {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(dir, 'vercel.json'), 'utf8'));
    const global = (cfg.headers || []).find((h) => h.source === '/(.*)');
    const out = {};
    for (const { key, value } of (global ? global.headers : [])) {
      // Cache-Control is set per-response below; the dev server never caches.
      if (key.toLowerCase() !== 'cache-control') out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
})();

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(dir, urlPath === '/' ? 'index.html' : urlPath);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, Object.assign({}, siteHeaders, {
      'Content-Type': mime[ext] || 'text/plain',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }));
    res.end(data);
  });
}).listen(port, () => {
  console.log('Serving on http://localhost:' + port);
});
