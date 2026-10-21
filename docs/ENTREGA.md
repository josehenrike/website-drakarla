# Implementação do plano de SEO e conversão

Entrega local em 21/10/2026. O usuário informou que domínio oficial, GA4, perfil Google e Kommo serão tratados posteriormente. Não houve publicação, alteração de contas externas ou envio de mensagens.

## Implementado

- Home preservada, incluindo frase principal, identidade visual, fotos e tratamentos existentes. Texto complementar com Rio Verde e chamada principal ajustados.
- Quatro páginas clínicas distintas, mais Sobre, Tratamentos, Conteúdos, Contato e três leituras educativas (12 páginas contando a home).
- Menu desktop com grupo de alopecias, menu mobile com links diretos, cartões na home e links relacionados.
- WhatsApp com mensagem preenchida em todos os pontos de contato, telefone clicável, endereço completo e mapa. O atalho flutuante se oculta quando contato/rodapé estão visíveis.
- Títulos, descrições, H1, textos e links em HTML estático; JSON-LD MedicalClinic com os dados administrativos já presentes no projeto, sem estrelas ou avaliações inventadas.
- Geração de canonical e sitemap absoluto quando o domínio for informado e o modo produção for solicitado.
- Metadados completos de cada página em `docs/seo-pages.json`.
- Eventos locais de intenção de contato preparados; nenhum script de Analytics ou CRM foi instalado.

## Verificação realizada

`node scripts/check.mjs`: 12 páginas, 488 links/recursos locais, H1 único, títulos e descrições exclusivos, IDs sem duplicação, JSON-LD válido, alt das imagens e mensagem de WhatsApp.

`node --test scripts/interactions.test.mjs`: abertura/fechamento do menu, emissão única dos dois eventos de contato e ocultação do atalho junto ao contato/rodapé. Teste em ambiente simulado; não substitui teste no navegador.

Servidor local: home, quatro páginas clínicas, Sobre, Tratamentos, Conteúdos, Contato e robots.txt responderam 200; rota inexistente respondeu 404.

Limitações: nenhum navegador disponível no conector de automação. Capturas mobile/desktop, inspeção visual, acessibilidade completa e Core Web Vitals não foram validados. A tentativa de otimização adicional da foto não foi executada por restrição local de scripts; as imagens originais foram preservadas. O conteúdo do PDF foi extraído para análise textual; não houve inspeção visual das páginas do documento.

## Revisão editorial antes da publicação

Os novos textos são minutas editoriais com fontes identificadas. Não atribuímos autoria ou revisão à médica sem confirmação. A Dra. Karla deve revisar os quatro textos clínicos, as três leituras e as descrições de tratamentos; após aprovação, acrescentar nome, CRM e data real de revisão. A data atualmente exibida é de atualização editorial, não de revisão médica.

Conferir formação, especialidade/RQE quando aplicável, filiações, CRM, endereço, telefone, procedimentos efetivamente oferecidos e autorização das imagens de resultados. Esses dados vieram do site existente e não foram verificados externamente. Não foram acrescentadas credenciais ou depoimentos.

O botão de avaliações mantém a busca Google Maps existente até a clínica fornecer o link direto do perfil. Trocar `googleReviewsUrl` em `site.config.json` quando disponível.

## Publicação e SEO técnico — etapa posterior

1. Informar `origin` em `site.config.json`, com HTTPS, sem caminho ou barra final. Não usar domínio fictício.
2. Executar `node scripts/package.mjs`. A ausência de domínio impede o pacote de produção. O comando gera páginas indexáveis, canonicals e sitemap.xml, valida os links e copia apenas os arquivos públicos para `dist/`.
3. Publicar somente `dist/`. Não enviar `content/`, `scripts/`, `docs/`, `tmp/` ou `.git/`. Servir diretórios com index.html e responder 404 para URLs inexistentes; não reescrever qualquer rota para a home.
4. Configurar HTTPS, redirecionamento 301 do host alternativo para o oficial e políticas do ambiente de teste na hospedagem. O modo prévia (`node scripts/build.mjs`) inclui `noindex, nofollow`; não publicar essa versão como site oficial. Robots permite rastreamento para que o noindex seja lido.
5. Verificar Search Console, enviar sitemap e inspecionar home e quatro páginas clínicas. Confirmar status 200, canonical, ausência de noindex e inexistência de bloqueios no domínio definitivo.
6. Testar em celular e desktop menu, dropdown, teclado, carrossel, WhatsApp, telefone, mapa e sobreposição do atalho; registrar capturas e PageSpeed Insights mobile. Não há pontuação de performance comprovada nesta entrega.
7. Atualizar o Perfil da Empresa no Google com o domínio e confirmar consistência dos dados locais.

## Mensuração — contrato preparado

`app.js` dispara `window` CustomEvent `site:contact`, com `detail` contendo apenas:

```json
{"event":"clique_whatsapp","placement":"cabecalho"}
```

Também existe `clique_telefone`. Posições possíveis: `cabecalho`, `conteudo`, `flutuante`, `rodape`. Não há formulário, portanto não há `envio_formulario`. Os eventos não são enviados nem armazenados e não incluem sintomas, texto da mensagem, URL, título clínico ou parâmetros de origem.

Na próxima etapa, conectar um único listener à ferramenta escolhida, após definir a política de privacidade/consentimento. Evitar listeners duplicados de GTM e GA4 para o mesmo clique. Revisar coleta automática de page_location/page_title/referrer para não transmitir temas clínicos ou dados sensíveis. Validar em DebugView e na rede antes de declarar a integração pronta.

No Kommo, planejar atribuição de origem sem diagnósticos ou sintomas e validar o percurso real até contato qualificado, agendamento e comparecimento. Clique no WhatsApp representa intenção, não consulta agendada. Não há integração Kommo nem teste de ponta a ponta nesta entrega.
