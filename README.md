# Kantsuo — Universo de arte e design

Site de portfólio estático feito com HTML, CSS e JavaScript nativo (ES Modules), sem framework, build step ou backend. O conteúdo e os projetos são carregados dos arquivos em `assets/js/data/`.

## Páginas e URLs

- `index.html` — página inicial.
- `works.html` — catálogo completo, com filtros por setor. A seleção é mantida na URL: `works.html?c=menus`, `?c=sites`, `?c=apps` ou `?c=social`.
- `project.html?id=<id>` — página de detalhes gerada a partir do ID em `works.js`, por exemplo `project.html?id=mesa-de-rua`. Cada card do catálogo e cada item em destaque usa esse formato; IDs inexistentes levam à página `404.html`.
- `about.html` — perfil, trajetória, ferramentas e serviços.
- `contact.html` — canais de contato e formulário de mensagem.
- `404.html` — página de retorno para rotas ou projetos inválidos. Configure-a como página 404 no provedor de hospedagem estática.

Os caminhos são relativos à raiz do site, então também funcionam em domínio próprio quando os arquivos são publicados juntos.

## Rodar localmente

Módulos JavaScript não funcionam abrindo os HTMLs por duplo clique com `file://`. No terminal, dentro desta pasta, inicie um servidor estático:

```bash
python3 -m http.server 3000
```

Depois abra `http://localhost:3000/` no navegador. Também é possível usar a extensão Live Server do VS Code ou outro servidor estático.

## Personalizar identidade e contato

Edite `assets/js/data/site.js`:

- `name`, `tagline`, `role` e `city` — identidade e localização exibidas no site.
- `about` — texto da página Sobre.
- `avatar` — caminho da imagem ilustrada do designer.
- `whatsapp` — número internacional somente com dígitos, incluindo código do país e DDD; exemplo de formato: `55` + DDD + número. O valor atual está vazio, então o site não inventa um destino. Depois de preenchido, os CTAs e o formulário passam a abrir o WhatsApp com a mensagem preparada.
- `email`, `instagram` e `behance` — endereço de e-mail e URLs completas dos perfis. Os canais ficam ocultos enquanto o respectivo campo estiver vazio.
- `tools` e `services` — listas exibidas na página Sobre.

O formulário é estático: não salva nem envia dados a um servidor. Ao configurar `whatsapp`, ele prepara a mensagem no dispositivo e abre o link `https://wa.me/<numero>?text=...`.

## Atualizar trabalhos e imagens

Edite `assets/js/data/works.js`. Cada objeto tem `id`, `category`, `title`, `year`, `client`, `summary`, `services`, `tools`, `cover`, `coverAlt`, `imageWidth`, `imageHeight`, `gallery`, `links`, `featured` e `placeholder`.

1. Coloque a nova imagem em `assets/images/works/` (PNG, WebP, JPG ou SVG local).
2. Atualize `cover` com o caminho relativo e descreva a imagem em `coverAlt`.
3. Atualize `gallery` com os caminhos das imagens adicionais, a proporção em `imageWidth`/`imageHeight` e os links reais em `links` quando houver.
4. Troque `placeholder: true` para `false` somente quando o case tiver conteúdo real. Os exemplos atuais são identificados com o selo `EXEMPLO`.
5. Mantenha cada `id` único e seguro para URL: ele é usado em `project.html?id=<id>`.

Os cards, filtros, fichas e links de projeto são gerados desses dados: adicionar um trabalho não exige criar outra página HTML. Os setores e seus rótulos são configurados em `assets/js/data/categories.js`.

Para adicionar um setor, inclua um objeto em `categories.js` com `id`, `code`, `title`, `kana`, `description` e `frame`; use uma moldura existente (`page`, `browser`, `phone`, `square` ou `free`). Depois, associe os novos trabalhos ao mesmo `id` em `works.js`. A página inicial, o filtro, o catálogo e a navegação do setor serão gerados dos dados, sem criar arquivos HTML nem alterar a lógica.

## Publicação

Publique a pasta do projeto em qualquer hospedagem de site estático que sirva HTML, CSS, JavaScript e imagens pelo mesmo domínio. Configure `404.html` como a página de erro do provedor. Antes da publicação, substitua as imagens vetoriais marcadas como exemplo, personalize os textos e preencha somente os canais de contato que realmente possui. Consulte `assets/images/CREDITS.md` para a origem das imagens incluídas.
