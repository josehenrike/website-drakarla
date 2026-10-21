import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
const pages = JSON.parse(fs.readFileSync('docs/seo-pages.json', 'utf8'));
const titles = new Set(), descriptions = new Set();
let links = 0;
for (const page of pages) {
  const file = '.' + page.url + 'index.html';
  const html = fs.readFileSync(file, 'utf8');
  assert.equal((html.match(/<h1(?:\s[^>]*)?>/g) || []).length, 1, file + ': H1');
  assert(!titles.has(page.title), 'Título duplicado'); titles.add(page.title);
  assert(!descriptions.has(page.description), 'Descrição duplicada'); descriptions.add(page.description);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, file + ': IDs duplicados');
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  assert.equal(JSON.parse(json).telephone, '+55-64-99250-7888');
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (url.startsWith('https://wa.me/')) assert(new URL(url).searchParams.get('text')?.includes('avaliação capilar'), 'Mensagem WhatsApp ausente');
    if (url.startsWith('http') || url.startsWith('tel:') || url.startsWith('data:')) continue;
    const [pathname, hash] = url.split('#');
    const target = pathname ? path.join('.', pathname, pathname.endsWith('/') ? 'index.html' : '') : file;
    assert(fs.existsSync(target), file + ': recurso ausente ' + url);
    if (hash) assert(fs.readFileSync(target, 'utf8').includes(`id="${hash}"`), file + ': âncora ausente ' + url);
    links++;
  }
  for (const img of html.matchAll(/<img\b[^>]*>/g)) assert(/alt="[^"]+"/.test(img[0]), file + ': alt ausente');
}
console.log(`${pages.length} páginas: H1, metadados exclusivos, JSON-LD, imagens e ${links} links/recursos locais válidos.`);
