# Site da Dra. Karla Fonseca

Código completo em HTML, CSS e JavaScript, sem instalação de dependências.

## Como editar
Extraia o ZIP e abra a pasta no VS Code ou outro editor. Abra index.html no navegador para visualizar.

- index.html: textos, seções, links e imagens.
- styles.css: cores, tamanhos, espaçamentos e layout responsivo.
- app.js: menu mobile e carrossel.
- fonts.css: configuração das fontes locais.
- assets/: logo, fotografias, resultados e fontes.

As páginas agora são geradas a partir de `content/home.html` e `content/pages.mjs`. Edite essas fontes e execute `node scripts/build.mjs`; não edite diretamente os HTML gerados. Cabeçalho, rodapé e SEO são compartilhados em `scripts/build.mjs`.

Para visualizar, execute `node scripts/serve.mjs` e abra http://127.0.0.1:4173. Use um servidor local, pois os links partem da raiz do site. A prévia inclui `noindex` até o domínio oficial ser definido.

Validação: `node scripts/check.mjs` e `node --test scripts/interactions.test.mjs`.

Para publicar, preencha o domínio em `site.config.json`, execute `node scripts/package.mjs` e envie somente `dist/` para a hospedagem. Alterações locais não atualizam automaticamente a versão publicada. Veja `docs/ENTREGA.md` para revisão editorial, integrações futuras e verificações de publicação.

Fontes: Manrope e Playfair Display, sob SIL Open Font License. Ícone WhatsApp: Font Awesome Free, atribuição no HTML. Fotos e logo fornecidos para este projeto.
