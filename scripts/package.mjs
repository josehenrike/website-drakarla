import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
execFileSync(process.execPath, ['scripts/build.mjs', '--production'], { stdio: 'inherit' });
execFileSync(process.execPath, ['scripts/check.mjs'], { stdio: 'inherit' });
// Copy only public files. Editorial sources and internal handoff notes stay local.
fs.mkdirSync('dist', { recursive: true });
const pages = JSON.parse(fs.readFileSync('docs/seo-pages.json', 'utf8'));
for (const { url } of pages) {
  const source = '.' + url + 'index.html';
  const destination = 'dist' + url + 'index.html';
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}
for (const file of ['styles.css', 'fonts.css', 'app.js', 'robots.txt', 'sitemap.xml']) fs.copyFileSync(file, 'dist/' + file);
for (const dir of ['assets', 'licencas']) fs.cpSync(dir, 'dist/' + dir, { recursive: true });
console.log('Arquivos públicos em dist/. Configure HTTPS e redirecionamentos na hospedagem.');
