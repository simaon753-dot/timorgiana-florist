/* =========================================================================
   COMPONENTES.JS — Cabeçalho, rodapé e elementos partilhados
   -------------------------------------------------------------------------
   Para não repetir o cabeçalho/rodapé em cada página, estes blocos são
   construídos por JavaScript (apenas criação de DOM, sem fetch) e inseridos
   automaticamente. Funciona mesmo ao abrir os ficheiros com duplo clique
   (protocolo file://).

   CADA PÁGINA deve ter no <body>:
       data-pagina="inicio|sobre|produtos|galeria|encomendar|contactos"
       data-base=""      (para index.html, na raiz)
       data-base="../"   (para páginas dentro de /paginas)
   ========================================================================= */
window.App = window.App || {};

/* Número de WhatsApp (formato internacional, só dígitos) e contactos */
App.WHATSAPP = "67073484565";
App.TELEFONE = "+670 73484565";
App.EMAIL    = "gilbertaamaral2018@gmail.com";
App.EMAIL2   = "revixana0698@gmail.com";
App.MORADA   = "Avenida Bidau Toko Baru, Cristo Rei, Díli, Timor-Leste";
App.INSTAGRAM= "https://www.instagram.com/timorgiana_flores";
App.FACEBOOK = "https://www.facebook.com/people/Timorgiana-Flores/";
App.TIKTOK   = "https://www.tiktok.com/@timorgiana_flores";

/* URL pública do site — usada para incluir o link da foto escolhida
   na mensagem de encomenda pelo WhatsApp (GitHub Pages) */
App.SITE     = "https://simaon753-dot.github.io/timorgiana-florist";

/* PAINEL DE GESTÃO — endereço que RECEBE cada encomenda (POST com JSON).
   Deixe "" para desativar. Cole aqui o URL do backend (ex.: Google Apps
   Script Web App) e cada encomenda passa a ser registada automaticamente,
   além da mensagem de WhatsApp. Ver COMO-EDITAR.md. */
App.PAINEL_URL = "";

/* Referência legível de uma foto da galeria:
   "assets/galeria/bouquet/bouquet-04.jpg" → "BOUQUET-04" */
App.refFoto = function (src) {
  return (src || "").split("/").pop().replace(/\.[a-z0-9]+$/i, "").toUpperCase();
};

/* Miniatura WebP leve (480px, ~30KB) de uma foto da galeria — para grelhas
   e cartões em redes fracas. O original (1200px) fica só para o lightbox.
   "assets/galeria/bouquet/bouquet-04.jpg" → "assets/galeria/thumbs/bouquet-04.webp" */
App.thumbFoto = function (src) {
  var nome = (src || "").split("/").pop().replace(/\.[a-z0-9]+$/i, "");
  return "assets/galeria/thumbs/" + nome + ".webp";
};

/* Mensagem-base para o WhatsApp */
App.linkWhatsApp = function (texto) {
  var t = texto || "Olá Timorgiana! Gostaria de saber mais sobre as vossas flores e serviços.";
  return "https://wa.me/" + App.WHATSAPP + "?text=" + encodeURIComponent(t);
};

/* -------------------------------------------------------------------------
   BIBLIOTECA DE ÍCONES (SVG inline, herdam a cor via currentColor)
   ------------------------------------------------------------------------- */
App.ICON = {
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none"/></svg>',
  facebook:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.43-4.94 8.43-9.94Z"/></svg>',
  tiktok:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.3 2.1 1.5 3.6 3.5 3.9v2.5c-1.2.1-2.4-.2-3.5-.8v5.9c0 3.4-2.5 5.5-5.4 5.5-3 0-5.1-2.4-5.1-5.1 0-3 2.4-5.1 5.4-5.1.3 0 .6 0 .9.1v2.7c-.3-.1-.6-.2-.9-.2-1.4 0-2.5 1-2.5 2.4 0 1.5 1.1 2.5 2.4 2.5 1.4 0 2.5-1 2.5-2.7V3h2.7Z"/></svg>',
  whatsapp:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 1.76.46 3.45 1.34 4.95L2 22l5.3-1.39c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.9C21.95 6.45 17.5 2 12.04 2Zm0 18.13c-1.48 0-2.93-.4-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.39c0-4.54 3.7-8.23 8.24-8.23 4.54 0 8.23 3.69 8.23 8.23 0 4.54-3.69 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.48-.01s-.43.06-.66.31c-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z"/></svg>',
  phone:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
  mail:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 6 9 6 9-6"/></svg>',
  pin:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  arrow:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  chevron:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  cesto:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  check:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  heart:     '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.3C.4 8.4 2 5 5.3 5c2 0 3.3 1.1 4.2 2.3l.5.7.5-.7C11.4 6.1 12.7 5 14.7 5 18 5 19.6 8.4 22 11.7 19.5 16.4 12 21 12 21Z"/></svg>',
  /* ícones decorativos / valores */
  flor:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.4"/><path d="M12 9.6c0-2.6-.8-4.6 0-6.6.8 2 0 4 0 6.6Zm0 4.8c0 2.6-.8 4.6 0 6.6.8-2 0-4 0-6.6Zm-2.4-2.4c-2.6 0-4.6-.8-6.6 0 2 .8 4 0 6.6 0Zm4.8 0c2.6 0 4.6-.8 6.6 0-2 .8-4 0-6.6 0Z"/></svg>',
  folha:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 12-4 16-9 16Z"/><path d="M4 20c4-7 7-9 11-10"/></svg>',
  estrela: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6z"/></svg>',
  diamante:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9 3 6 9l6 12 6-12-3-6"/></svg>',
  recic:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 19H4.8a2 2 0 0 1-1.7-3l1.8-3M9.6 4.5l1.1-1.9a2 2 0 0 1 3.4 0l2 3.4M14 19h4.8a2 2 0 0 0 1.7-3l-1.1-1.9M9 19l2.5-3H6.5L9 19Zm9.4-9.5 1 3.9-3.9 1 2.9-4.9ZM6.6 9.5 3.5 11l-1-3.8 4.1.3-.0-0Z"/></svg>',
  relogio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  presente:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M4 12v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8M12 8v13"/><path d="M12 8S10 3 7.5 3 4 6 12 8Zm0 0s2-5 4.5-5S20 6 12 8Z"/></svg>'
};

/* -------------------------------------------------------------------------
   Caminhos da página atual (base = "" na raiz, "../" em /paginas)
   ------------------------------------------------------------------------- */
App.base = (document.body.getAttribute("data-base") || "");
App.pagina = (document.body.getAttribute("data-pagina") || "inicio");

/* -------------------------------------------------------------------------
   CABEÇALHO
   ------------------------------------------------------------------------- */
App.construirCabecalho = function () {
  var b = App.base, atual = App.pagina;
  var links = [
    ["inicio",     b + "index.html",            "nav_inicio"],
    ["loja",       b + "paginas/loja.html",      "nav_loja"],
    ["sobre",      b + "paginas/sobre.html",     "nav_sobre"],
    ["contactos",  b + "paginas/contactos.html", "nav_contactos"]
  ];
  /* a "Loja" fica ativa também nas páginas de produto e cesto */
  var grupoLoja = { loja: 1, produto: 1, cesto: 1 };
  var itens = links.map(function (l) {
    var ativo = (l[0] === atual || (l[0] === "loja" && grupoLoja[atual])) ? " ativo" : "";
    var aria  = ativo ? ' aria-current="page"' : "";
    return '<li><a class="nav__link' + ativo + '"' + aria + ' href="' + l[1] + '" data-i18n="' + l[2] + '">' + App.t(l[2]) + '</a></li>';
  }).join("");

  var idiomas = App.IDIOMAS.map(function (lng) {
    return '<button class="idiomas__btn" data-idioma="' + lng + '" type="button">' + App.NOMES_IDIOMA[lng] + '</button>';
  }).join("");

  var html =
  '<a class="salta-conteudo" href="#conteudo">Saltar para o conteúdo</a>' +
  '<header class="cabecalho cabecalho--topo" id="cabecalho">' +
    '<div class="container cabecalho__interior">' +
      '<a class="logo" href="' + b + 'index.html" aria-label="Timorgiana Florist — Início">' +
        '<img class="logo__marca logo__marca--creme" src="' + b + 'assets/logo-creme.png" alt="Timorgiana Florist">' +
        '<img class="logo__marca logo__marca--coral" src="' + b + 'assets/logo-coral.png" alt="Timorgiana Florist">' +
      '</a>' +
      '<div class="cabecalho__acoes">' +
        '<button class="cabecalho__cesto" type="button" data-abrir-cesto aria-label="' + App.t("cesto_abrir") + '">' +
          App.ICON.cesto +
          '<span class="cabecalho__cesto-conta" hidden>0</span>' +
        '</button>' +
        '<button class="menu-toggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav-principal" type="button">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</div>' +
      '<nav class="nav" id="nav-principal" aria-label="Navegação principal">' +
        '<ul class="nav__lista">' + itens + '</ul>' +
        '<div class="nav__cta">' +
          '<div class="idiomas" role="group" aria-label="Idioma">' + idiomas + '</div>' +
          '<a class="btn btn--primario btn--pequeno" href="' + b + 'paginas/loja.html" data-i18n="nav_loja">' + App.t("nav_loja") + '</a>' +
        '</div>' +
      '</nav>' +
    '</div>' +
  '</header>';

  var wrap = document.createElement("div");
  wrap.innerHTML = html;
  while (wrap.firstChild) document.body.insertBefore(wrap.firstChild, document.body.firstChild);
};

/* -------------------------------------------------------------------------
   RODAPÉ
   ------------------------------------------------------------------------- */
App.construirRodape = function () {
  var b = App.base;
  var ano = new Date().getFullYear();
  var html =
  '<footer class="rodape">' +
    '<div class="container">' +
      '<div class="rodape__grelha">' +
        '<div class="rodape__marca">' +
          '<img src="' + b + 'assets/logo-creme.png" alt="Timorgiana Florist">' +
          '<p data-i18n="rod_sobre">' + App.t("rod_sobre") + '</p>' +
          '<div class="rodape__sociais">' +
            '<a href="' + App.INSTAGRAM + '" target="_blank" rel="noopener" aria-label="Instagram">' + App.ICON.instagram + '</a>' +
            '<a href="' + App.FACEBOOK + '" target="_blank" rel="noopener" aria-label="Facebook">' + App.ICON.facebook + '</a>' +
            '<a href="' + App.TIKTOK + '" target="_blank" rel="noopener" aria-label="TikTok">' + App.ICON.tiktok + '</a>' +
            '<a href="' + App.linkWhatsApp() + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + App.ICON.whatsapp + '</a>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<h4 data-i18n="rod_navegar">' + App.t("rod_navegar") + '</h4>' +
          '<ul class="rodape__lista">' +
            '<li><a href="' + b + 'index.html" data-i18n="nav_inicio">' + App.t("nav_inicio") + '</a></li>' +
            '<li><a href="' + b + 'paginas/sobre.html" data-i18n="nav_sobre">' + App.t("nav_sobre") + '</a></li>' +
            '<li><a href="' + b + 'paginas/loja.html" data-i18n="nav_loja">' + App.t("nav_loja") + '</a></li>' +
            '<li><a href="' + b + 'paginas/contactos.html" data-i18n="nav_contactos">' + App.t("nav_contactos") + '</a></li>' +
          '</ul>' +
        '</div>' +
        '<div>' +
          '<h4 data-i18n="rod_servicos">' + App.t("rod_servicos") + '</h4>' +
          '<ul class="rodape__lista">' +
            '<li><a href="' + b + 'paginas/produtos.html" data-i18n="cat1_t">' + App.t("cat1_t") + '</a></li>' +
            '<li><a href="' + b + 'paginas/produtos.html" data-i18n="cat2_t">' + App.t("cat2_t") + '</a></li>' +
            '<li><a href="' + b + 'paginas/produtos.html" data-i18n="cat3_t">' + App.t("cat3_t") + '</a></li>' +
            '<li><a href="' + b + 'paginas/produtos.html" data-i18n="cat4_t">' + App.t("cat4_t") + '</a></li>' +
          '</ul>' +
        '</div>' +
        '<div>' +
          '<h4 data-i18n="rod_contacto">' + App.t("rod_contacto") + '</h4>' +
          '<ul class="rodape__contacto">' +
            '<li>' + App.ICON.pin + '<span>' + App.MORADA + '</span></li>' +
            '<li>' + App.ICON.phone + '<a href="tel:+' + App.WHATSAPP + '">' + App.TELEFONE + '</a></li>' +
            '<li>' + App.ICON.mail + '<a href="mailto:' + App.EMAIL + '">' + App.EMAIL + '</a></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="rodape__base">' +
        '<span>© ' + ano + ' Timorgiana, Lda. · <span data-i18n="rod_direitos">' + App.t("rod_direitos") + '</span></span>' +
        '<span><span data-i18n="rod_feito">' + App.t("rod_feito") + '</span> ' +
          '<span style="color:var(--coral)">' + App.ICON.heart + '</span> ' +
          '<span data-i18n="rod_em">' + App.t("rod_em") + '</span></span>' +
      '</div>' +
    '</div>' +
  '</footer>';

  var wrap = document.createElement("div");
  wrap.innerHTML = html;
  while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
};

/* -------------------------------------------------------------------------
   GAVETA LATERAL DO CESTO (em todas as páginas)
   ------------------------------------------------------------------------- */
App.construirGaveta = function () {
  var b = App.base;
  var html =
  '<div class="gaveta-overlay" data-fechar-cesto></div>' +
  '<aside class="gaveta" id="gaveta-cesto" aria-hidden="true" aria-label="' + App.t("cesto_titulo") + '">' +
    '<div class="gaveta__topo">' +
      '<span class="gaveta__titulo" data-i18n="cesto_titulo">' + App.t("cesto_titulo") + '</span>' +
      '<button class="gaveta__fechar" type="button" data-fechar-cesto aria-label="' + App.t("fechar") + '">&times;</button>' +
    '</div>' +
    '<div class="gaveta__corpo" id="gaveta-corpo"></div>' +
    '<div class="gaveta__rodape" id="gaveta-rodape" hidden>' +
      '<div class="gaveta-subtotal"><span data-i18n="cesto_subtotal">Subtotal</span><span class="gaveta-subtotal__val">$0.00</span></div>' +
      '<p class="gaveta-nota" data-i18n="cesto_entrega_nota">Entrega combinada no WhatsApp.</p>' +
      '<a class="btn btn--primario" style="width:100%" href="' + b + 'paginas/cesto.html" data-i18n="cesto_ver">Ver cesto &amp; finalizar</a>' +
    '</div>' +
  '</aside>';
  var wrap = document.createElement("div");
  wrap.innerHTML = html;
  while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
};

/* -------------------------------------------------------------------------
   BOTÃO FLUTUANTE DE WHATSAPP (em todas as páginas)
   ------------------------------------------------------------------------- */
App.construirWhatsApp = function () {
  var a = document.createElement("a");
  a.className = "whatsapp-flutua";
  a.href = App.linkWhatsApp();
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", "Falar no WhatsApp");
  a.innerHTML = App.ICON.whatsapp + '<span class="whatsapp-flutua__balao" data-i18n="wa_balao">' + App.t("wa_balao") + '</span>';
  document.body.appendChild(a);
};
