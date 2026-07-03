# Timorgiana — Florist · Website

Website institucional e comercial da **Timorgiana, Lda.** — arte floral, venda de
flores naturais e serviços de decoração com flores frescas, em Díli, Timor-Leste.

Site estático (HTML, CSS e JavaScript), sem dependências de instalação, **trilingue
(Português · Tétum · Inglês)**, responsivo (mobile-first) e com encomendas geridas
por formulário + WhatsApp (sem carrinho nem pagamentos online).

---

## Como abrir

- **Localmente:** basta abrir `index.html` no navegador (duplo clique). Tudo funciona
  via `file://`, incluindo cabeçalho, rodapé, idiomas e formulário.
- **Com servidor local** (recomendado para testar o mapa e os tipos de letra):
  ```
  npx serve .            # ou
  python3 -m http.server 8200
  ```

## Estrutura

```
site/
├── index.html                  Página inicial (Home)
├── paginas/
│   ├── sobre.html              História, missão, visão, valores
│   ├── produtos.html           Produtos & Serviços + "Como funciona"
│   ├── galeria.html            Portefólio com filtros
│   ├── encomendar.html         Passos + formulário → WhatsApp
│   └── contactos.html          Contactos + mapa (OpenStreetMap)
├── css/estilos.css             Design system (cores da marca, tipografia, componentes)
├── js/
│   ├── i18n.js                 Dicionário e motor de tradução (PT · TET · EN)
│   ├── componentes.js          Cabeçalho, rodapé e botão de WhatsApp (partilhados)
│   ├── galeria-dados.js        Lista das fotografias do portefólio (src + categoria)
│   └── main.js                 Interações (menu, scroll, filtros, galeria, lightbox, formulário)
└── assets/
    ├── logo-creme.png          Logótipo (lettering creme) — fundos coral/escuros
    ├── logo-coral.png          Logótipo (terracota) — fundos claros (cabeçalho)
    ├── logo-original.jpg       Logótipo original (fundo pêssego) — partilha/OG
    ├── favicon.png             Ícone do site
    └── galeria/                Fotografias reais do portefólio (87)
        ├── casamentos/         (7 fotos)
        ├── bouquet/            (24 fotos)
        ├── vaso/               (52 fotos — arranjo floral em vaso)
        ├── funebre/            (1 foto)
        └── outro/              (3 fotos)
```

> O cabeçalho e o rodapé **não estão repetidos** em cada página: são gerados por
> `js/componentes.js`. Para editar o menu ou o rodapé, altere apenas esse ficheiro.

## Identidade visual (derivada do logótipo)

| Cor | Código | Uso |
|-----|--------|-----|
| Coral / pêssego | `#F9AC80` | Cor principal da marca |
| Creme / marfim | `#FFF4D1` | Lettering, fundos claros |
| Terracota | `#C4633A` | Texto de destaque, botões, logótipo em fundos claros |
| Dourado | `#C9A86A` | Detalhes de luxo (hairlines, ornamentos) |
| Verde-folha (sage) | `#8A9A7B` | Acento botânico |

- Títulos: **Cormorant Garamond** (serifa elegante)
- Texto: **Mulish** (sans limpa)
- Caligrafia (tagline/flourish): **Pinyon Script**

Todas as cores estão centralizadas em variáveis CSS no topo de `css/estilos.css`.

---

## Tarefas comuns

### 1. Adicionar fotografias reais
O site usa substitutos elegantes (`<div class="foto">`) onde irão as fotos. Para
colocar uma fotografia, troque o `<div class="foto ...">` por uma imagem:

```html
<!-- antes -->
<div class="foto foto--retrato"></div>
<!-- depois -->
<img src="../assets/galeria/casamento-01.jpg" alt="Decoração de casamento">
```

- **Hero da Home:** coloque a imagem em `assets/hero.jpg` — é carregada
  automaticamente sobre o gradiente (se não existir, fica só o gradiente coral).

### 1b. Portefólio / galeria (já com fotos reais)
A galeria é **orientada a dados**: a lista de fotografias está em
`js/galeria-dados.js`, e o site constrói a grelha (com filtros e lightbox)
automaticamente. Categorias: `casamentos`, `vaso`, `bouquet`, `funebre`, `outro`.

- **Adicionar uma foto:** coloque o ficheiro em `assets/galeria/<categoria>/` e
  acrescente uma linha em `js/galeria-dados.js`:
  ```js
  { src: "assets/galeria/bouquet/bouquet-25.jpg", cat: "bouquet" },
  ```
- **Mudar a categoria de uma foto:** altere o `cat` dessa linha.
- Se uma categoria ficar sem fotos, o filtro mostra "Em breve, novos trabalhos…".
- **Remover uma foto da galeria:** apague a linha (o ficheiro pode ficar na pasta).
- As imagens grandes devem ser otimizadas (lado maior ~1200px) para carregarem
  depressa. As fotos atuais já foram redimensionadas e comprimidas.

### 2. Mudar o número de WhatsApp / contactos
Edite as constantes no topo de `js/componentes.js`:
```js
App.WHATSAPP = "67073484565";   // formato internacional, só dígitos
App.TELEFONE = "+670 73484565";
App.EMAIL    = "gilbertaamaral2018@gmail.com";
```

### 3. Integrar o feed real do Instagram
Na Home, a secção `@timorgiana_flores` usa substitutos. Para mostrar o feed real,
substitua a `.insta-grelha` por um widget gratuito (ex.: **LightWidget** ou
**Behold.so**): geram um `<script>`/`<iframe>` que se cola no lugar da grelha.

### 4. Rever as traduções em Tétum
Toda a interface e os textos longos (história, missão, visão, produtos, etc.) já
estão traduzidos para Tétum em `js/i18n.js` (campo `tet:` de cada chave). Foram
redigidos em Tétum Prasa — **recomenda-se uma revisão final por um falante nativo**
antes da divulgação oficial.

### 5. Publicar (hospedagem gratuita)
Por ser estático, pode ser publicado tal como está em **Netlify**, **Vercel**,
**Cloudflare Pages** ou **GitHub Pages** — basta arrastar a pasta `site/`.

- **Netlify Drop (mais rápido):** abra <https://app.netlify.com/drop> e arraste a
  pasta `site/` (ou o `timorgiana-florist-site.zip`). Fica logo online; depois
  clique em *Claim this site* para o guardar na conta.
- O ficheiro `netlify.toml` já configura cabeçalhos de segurança e cache.

### 6. Associar um domínio próprio (ex.: timorgianaflorist.com)
1. Compre o domínio (Namecheap, GoDaddy, Google Domains, um registador `.tl`, etc.).
2. No Netlify: *Site settings → Domain management → Add a domain* e escreva o domínio.
3. O Netlify indica os registos DNS a configurar. Duas opções:
   - **Netlify DNS** (mais simples): mude os *nameservers* do domínio, no registador,
     para os que o Netlify indicar.
   - **DNS do registador:** crie um registo `CNAME` de `www` → `<o-seu-site>.netlify.app`
     e o registo do domínio raiz conforme as instruções do Netlify.
4. O **HTTPS (certificado SSL)** é ativado automaticamente pelo Netlify e é gratuito.
5. A propagação de DNS pode demorar de minutos a 24–48 h.

---

© Timorgiana, Lda. · Avenida Bidau Toko Baru, Cristo Rei, Díli, Timor-Leste
