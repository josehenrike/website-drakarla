import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages, articles, sources } from '../content/pages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const config = JSON.parse(fs.readFileSync('site.config.json', 'utf8').replace(/^\uFEFF/, ''));
const production = process.argv.includes('--production');
const origin = config.origin.replace(/\/$/, '');
if (origin && (!/^https:\/\/[^/]+$/.test(origin) || new URL(origin).hostname === 'localhost')) throw new Error('Informe a origem HTTPS oficial, sem caminho.');
if (production && !origin) throw new Error('Defina origin em site.config.json antes de gerar a versão de produção.');
if (config.googleReviewsUrl && new URL(config.googleReviewsUrl).protocol !== 'https:') throw new Error('Use HTTPS no link de avaliações.');
const esc = value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const wa = 'https://wa.me/5564992507888?text=' + encodeURIComponent('Olá, encontrei o site da Dra. Karla Fonseca e gostaria de informações para agendar uma avaliação capilar.');
const original = fs.readFileSync('content/home.html', 'utf8');
const extract = id => original.match(new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?</section>`))[0];
const navLinks = [['/', 'Início'], ['/consulta-tricologia-rio-verde/', 'Consulta'], ['/queda-de-cabelo/', 'Queda de cabelo'], ['/tratamentos-capilares/', 'Tratamentos'], ['/sobre/', 'Sobre'], ['/conteudos/', 'Conteúdos'], ['/contato/', 'Contato']];
const link = ([url, text], current) => `<a href="${url}"${url === current ? ' aria-current="page"' : ''}>${text}</a>`;
function navigation(current, mobile = false) {
  const alopecias = [['/alopecia-androgenetica/', 'Alopecia androgenética'], ['/alopecias-cicatriciais/', 'Alopecias cicatriciais']];
  return navLinks.map((item, index) => link(item, current) + (index === 2 ? mobile ? alopecias.map(item => link(item, current)).join('') : `<details class="nav-dropdown"><summary>Alopecias</summary><div>${alopecias.map(item => link(item, current)).join('')}</div></details>` : '')).join('');
}
function header(current) {
  return `<a class="skip-link" href="#conteudo">Ir para o conteúdo</a><header class="site-header"><div class="container header-inner"><a class="brand" href="/" aria-label="Dra. Karla Fonseca — início"><span class="brand-logo"><img src="/assets/logo-karla-fonseca.png" alt="Clínica Dra. Karla Fonseca" width="1155" height="1155"></span></a><nav class="desktop-nav" aria-label="Navegação principal">${navigation(current)}</nav><a class="button button-small header-cta" href="${wa}" target="_blank" rel="noopener noreferrer">Agendar avaliação</a><button class="menu-button" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button></div><nav id="mobile-menu" class="mobile-menu" aria-label="Navegação no celular" hidden>${navigation(current, true)}</nav></header>`;
}
let footer = original.slice(original.indexOf('<footer class="site-footer">'), original.indexOf('</body>'));
footer = footer.replace('<div class="footer-bottom">', '<nav class="footer-links" aria-label="Links do rodapé">' + navLinks.map(item => link(item)).join('') + '</nav><p class="footer-address">Clínica Vidas — 4º andar · Rua Rosulino Ferreira Guimarães, 730, Centro · Rio Verde – GO · CEP 75901-260<br><a href="tel:+5564992507888">(64) 99250-7888</a> · Atendimento sob agendamento</p><div class="footer-bottom">');
const contact = extract('contato');
const registry = [...pages, ...articles];
const cards = items => `<div class="topic-grid">${items.map(item => `<a class="topic-card" href="/${item.slug}/"><span class="eyebrow">${item.slug.startsWith('conteudos/') ? 'LEITURA' : 'SAÚDE CAPILAR'}</span><h3>${item.label}</h3><p>${item.lead || item.description}</p><span class="text-link">Saiba mais <span aria-hidden="true">↗</span></span></a>`).join('')}</div>`;
function related(slugs) {
  return `<section class="related-section container" aria-labelledby="related-title"><h2 id="related-title">Continue seu <em>cuidado.</em></h2>${cards(slugs.map(slug => registry.find(item => item.slug === slug)).filter(Boolean))}</section>`;
}
function articleBody(page) {
  return `<section class="page-hero container"><nav class="breadcrumbs" aria-label="Caminho da página"><a href="/">Início</a><span aria-hidden="true">/</span>${page.slug.startsWith('conteudos/') ? '<a href="/conteudos/">Conteúdos</a><span aria-hidden="true">/</span>' : ''}<span aria-current="page">${page.label}</span></nav><p class="eyebrow">DRA. KARLA FONSECA · RIO VERDE, GO</p><h1>${page.h1}</h1><p class="page-lead">${page.lead}</p><a class="button" href="${wa}" target="_blank" rel="noopener noreferrer">Agendar avaliação pelo WhatsApp</a></section><div class="container article-layout"><article class="clinical-copy">${page.sections.map(([heading, text]) => `<section><h2>${heading}</h2><p>${text}</p></section>`).join('')}${page.faq ? `<section><h2>Dúvidas frequentes</h2><div class="faq-list">${page.faq.map(([q, a]) => `<details><summary>${q}<span aria-hidden="true"></span></summary><div class="faq-answer"><p>${a}</p></div></details>`).join('')}</div></section>` : ''}<aside class="editorial-note"><p>Conteúdo informativo. A avaliação médica é individual.</p><p>Atualização editorial: <time datetime="2026-10-21">21 de outubro de 2026</time>.</p><h3>Fontes para esta leitura</h3><ul>${page.sources.map(key => `<li><a href="${sources[key][1]}" target="_blank" rel="noopener noreferrer">${sources[key][0]}</a></li>`).join('')}</ul></aside></article><aside class="care-sidebar"><p class="eyebrow">SEU PRÓXIMO PASSO</p><h2>Espaço para ouvir <em>sua história.</em></h2><p>Converse com a equipe sobre horários, valores e preparo para a consulta.</p><a class="text-link" href="${wa}" target="_blank" rel="noopener noreferrer">Falar pelo WhatsApp ↗</a><a class="contact-phone" href="tel:+5564992507888">(64) 99250-7888</a><a class="text-link" href="/contato/">Como chegar</a></aside></div>${related(page.related)}${contact}`;
}
const schema = {
  '@context': 'https://schema.org', '@type': 'MedicalClinic', name: 'Clínica Dra. Karla Fonseca',
  telephone: '+55-64-99250-7888',
  address: { '@type': 'PostalAddress', streetAddress: 'Rua Rosulino Ferreira Guimarães, 730, Clínica Vidas, 4º andar, Centro', addressLocality: 'Rio Verde', addressRegion: 'GO', postalCode: '75901-260', addressCountry: 'BR' },
  ...(production ? { url: origin + '/' } : {}),
};
const manifest = [];
function emit(page, body) {
  const url = page.slug ? '/' + page.slug + '/' : '/';
  let html = `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#161412"><title>${esc(page.title)}</title><meta name="description" content="${esc(page.description)}">${production ? `<link rel="canonical" href="${esc(origin + url)}">` : '<meta name="robots" content="noindex, nofollow">'}<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}">${production ? `<meta property="og:url" content="${esc(origin + url)}"><meta property="og:image" content="${esc(origin)}/assets/dra-karla.webp">` : ''}<link rel="icon" href="/assets/logo-karla-fonseca.png"><link rel="stylesheet" href="/fonts.css"><link rel="stylesheet" href="/styles.css"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script><script src="/app.js" defer></script></head><body>${header(url)}<main id="conteudo">${body}</main>${footer}</body></html>`;
  html = html.replaceAll('href="https://wa.me/5564992507888"', `href="${wa}"`).replaceAll('src="assets/', 'src="/assets/').replaceAll('href="#inicio"', 'href="/#inicio"');
  if (config.googleReviewsUrl) html = html.replaceAll('https://www.google.com/maps/search/?api=1&amp;query=Dra.+Karla+Fonseca+Rio+Verde+GO', esc(config.googleReviewsUrl));
  const dir = page.slug || '.';
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html + '\n');
  manifest.push({ url, title: page.title, description: page.description, h1: page.h1 });
}

let home = original.match(/<main id="conteudo">([\s\S]*?)<\/main>/)[1];
home = home.replace(/<p class="hero-description">[\s\S]*?<\/p>/, '<p class="hero-description">Avaliação médica individualizada para queda de cabelo, afinamento dos fios e condições do couro cabeludo em Rio Verde (GO).</p>');
home = home.replace('Agendar minha consulta', 'Agendar avaliação pelo WhatsApp').replace('href="#consulta">Conheça o atendimento', 'href="/consulta-tricologia-rio-verde/">Conheça o atendimento');
home = home.replace('<section class="care-section', `<section class="clinical-entry section"><div class="container"><p class="eyebrow">ENCONTRE SEU CAMINHO DE CUIDADO</p><h2>Informação para o <em>primeiro passo.</em></h2>${cards(pages)}</div></section><section class="care-section`);
home = home.replace('Leia as avaliações dos nossos pacientes', 'Ver avaliações no Google');
home = home.replace('<div class="journey-bottom">', '<div class="journey-bottom"><a class="text-link" href="/consulta-tricologia-rio-verde/">Saiba como funciona a consulta ↗</a>');
home = home.replace('<div class="treatments-closing-rule">', '<a class="text-link" href="/tratamentos-capilares/">Conheça os tratamentos capilares ↗</a><div class="treatments-closing-rule">');
home = home.replace('<section class="contact-section"', `<section class="section"><div class="container"><p class="eyebrow">CONTEÚDOS</p><h2>Conhecimento que <em>aproxima.</em></h2>${cards(articles)}</div></section><section class="contact-section"`);
emit({ slug: '', title: 'Queda de cabelo em Rio Verde (GO) | Dra. Karla Fonseca', description: 'Avaliação médica da queda de cabelo, calvície e condições do couro cabeludo em Rio Verde, Goiás. Conheça o atendimento da Dra. Karla Fonseca.', h1: 'Seu cabelo merece um cuidado que começa pelo diagnóstico.' }, home);

const generalPages = [
  { slug: 'tratamentos-capilares', label: 'Tratamentos capilares', title: 'Tratamentos capilares em Rio Verde | Dra. Karla Fonseca', description: 'Conheça os recursos apresentados pela clínica para o cuidado capilar, suas limitações e a importância do diagnóstico e do acompanhamento.', h1: 'Tratamentos capilares: o diagnóstico orienta a escolha', lead: 'Uma técnica faz parte de um plano. A indicação começa pela avaliação individual.' },
  { slug: 'sobre', label: 'Sobre a médica', title: 'Sobre a Dra. Karla Fonseca | Saúde capilar em Rio Verde', description: 'Conheça a atuação da Dra. Karla Fonseca no cuidado dos cabelos e do couro cabeludo e seu atendimento individualizado em Rio Verde.', h1: 'Conheça a Dra. Karla Fonseca', lead: 'Ciência, escuta e cuidado em cada etapa.' },
  { slug: 'conteudos', label: 'Conteúdos', title: 'Conteúdos sobre saúde capilar | Dra. Karla Fonseca', description: 'Leituras sobre queda de cabelo, afinamento feminino e tricoscopia para preparar suas dúvidas e compreender a avaliação capilar.', h1: 'Informação para cuidar melhor dos seus cabelos', lead: 'Leituras para orientar suas perguntas e aproximar você do cuidado.' },
  { slug: 'contato', label: 'Contato', title: 'Contato e localização em Rio Verde | Dra. Karla Fonseca', description: 'Agende pelo WhatsApp ou telefone. Atendimento na Clínica Vidas, Rua Rosulino Ferreira Guimarães, 730, 4º andar, Centro, Rio Verde – GO.', h1: 'Agendamento e localização', lead: 'Converse com a equipe e planeje sua visita à Clínica Vidas, em Rio Verde.' },
];
registry.push(...generalPages);
for (const page of [...pages, ...articles]) emit(page, articleBody(page));
for (const page of generalPages) {
  const hero = `<section class="page-hero container"><nav class="breadcrumbs" aria-label="Caminho da página"><a href="/">Início</a><span aria-hidden="true">/</span><span aria-current="page">${page.label}</span></nav><p class="eyebrow">DRA. KARLA FONSECA · RIO VERDE, GO</p><h1>${page.h1}</h1><p class="page-lead">${page.lead}</p></section>`;
  let body;
  if (page.slug === 'tratamentos-capilares') body = extract('tratamentos').replace(/<span class="card-label">/g, '<p class="treatment-context">A indicação depende do diagnóstico. Discuta benefícios, riscos e limitações na consulta; a resposta varia e precisa de acompanhamento.</p><span class="card-label">') + related(['queda-de-cabelo', 'alopecia-androgenetica', 'consulta-tricologia-rio-verde']);
  if (page.slug === 'sobre') body = extract('sobre') + '<div class="container editorial-note"><p>Dra. Karla Fonseca · CRM-GO 14832</p><a class="text-link" href="/consulta-tricologia-rio-verde/">Conheça as etapas do atendimento ↗</a></div>';
  if (page.slug === 'conteudos') body = `<section class="container related-section" aria-label="Leituras sobre saúde capilar">${cards(articles)}</section>`;
  if (page.slug === 'contato') body = '';
  emit(page, hero + body + contact);
}
fs.mkdirSync('docs', { recursive: true });
fs.writeFileSync('docs/seo-pages.json', JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync('robots.txt', production ? `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n` : 'User-agent: *\nAllow: /\n# Prévia: páginas com meta robots noindex. Gere com --production após definir o domínio.\n');
if (production) fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${manifest.map(p => `<url><loc>${esc(origin + p.url)}</loc></url>`).join('')}</urlset>\n`);
else if (fs.existsSync('sitemap.xml')) fs.unlinkSync('sitemap.xml');
console.log(`${manifest.length} páginas geradas em modo ${production ? 'produção' : 'prévia (noindex)'}.`);
