import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ttf': 'font/ttf', '.xml': 'application/xml', '.txt': 'text/plain' };
http.createServer((req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = pathname.replace(/^\/+/, '');
    if (relative.split(/[\\/]/).some(p => p.startsWith('.') || ['content', 'scripts', 'docs', 'tmp'].includes(p)) || relative === 'site.config.json') { res.writeHead(404).end(); return; }
    let file = path.resolve(root, relative);
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    if (fs.statSync(file).isDirectory()) {
      if (!pathname.endsWith('/')) { res.writeHead(301, { Location: pathname + '/' }).end(); return; }
      file = path.join(file, 'index.html');
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  } catch { res.writeHead(404).end('Página não encontrada'); }
}).listen(4173, '127.0.0.1', () => console.log('Prévia: http://127.0.0.1:4173'));
