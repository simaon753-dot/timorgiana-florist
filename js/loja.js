/* =========================================================================
   LOJA.JS — Renderiza Coleção (filtros/ordenar/ver mais), Produto e Cesto
   -------------------------------------------------------------------------
   Usa App.PRODUTOS (products.js) e App.Cesto (cart.js). Só corre nas páginas
   com data-pagina = loja | produto | cesto.
   ========================================================================= */
window.App = window.App || {};

App.Loja = (function () {
  "use strict";

  var ORDEM_CAT = { bouquet: 0, vaso: 1, hastes: 2, casamentos: 3, funebre: 4, outro: 5 };
  var FILTRO_KEY = {
    todos: "filtro_todos", bouquet: "filtro_bouquet", vaso: "filtro_vaso",
    hastes: "filtro_hastes", casamentos: "filtro_casamentos", funebre: "filtro_funebre", outro: "filtro_outro"
  };

  function b() { return App.base; }
  function temPreco(p) { return typeof p.preco === "number"; }

  /* ---------- Tile de produto (coleção + relacionados) ---------- */
  function tile(p) {
    var precoHtml = (p.tipo === "quote")
      ? '<span class="produto__meta" data-i18n="sob_consulta">' + App.t("sob_consulta") + '</span>'
      : '<span class="produto__preco">' + App.Cesto.precoFmt(p.preco) +
          (p.tipo === "unidade" ? ' <span class="por-unid" data-i18n="por_unidade">' + App.t("por_unidade") + '</span>' : '') +
        '</span>';
    var badge = (p.tipo === "quote")
      ? '<span class="produto__badge" data-i18n="sob_consulta">' + App.t("sob_consulta") + '</span>' : '';
    return '' +
      '<a class="produto produto--anima" href="' + b() + 'paginas/produto.html?slug=' + encodeURIComponent(p.slug) + '">' +
        '<div class="produto__media">' + badge +
          '<img src="' + b() + (p.thumb || p.img) + '" alt="' + App.t2(p.nome) + '" width="480" height="480" loading="lazy" decoding="async">' +
        '</div>' +
        '<div class="produto__info">' +
          '<h3 class="produto__nome">' + App.t2(p.nome) + '</h3>' + precoHtml +
        '</div>' +
      '</a>';
  }

  /* ============================ COLEÇÃO ============================ */
  function renderColecao() {
    var grelha = document.getElementById("loja-grelha");
    if (!grelha) return;
    var params = new URLSearchParams(location.search);
    var filtro = params.get("c"); if (!filtro || !FILTRO_KEY[filtro]) filtro = "todos";
    var ordem = "destaque";
    var LIMITE = 12, mostrados = LIMITE;

    /* chips de filtro (só categorias que existem) */
    var cats = ["todos"].concat(Object.keys(ORDEM_CAT).filter(function (c) {
      return App.PRODUTOS.some(function (p) { return p.cat === c; });
    }));
    var barra = document.getElementById("loja-filtros");
    if (barra) {
      barra.innerHTML = cats.map(function (c) {
        var k = FILTRO_KEY[c];
        return '<button class="filtro' + (c === filtro ? " ativo" : "") + '" data-cat="' + c + '" data-i18n="' + k + '">' + App.t(k) + '</button>';
      }).join("");
    }

    function lista() {
      var arr = App.PRODUTOS.filter(function (p) { return filtro === "todos" || p.cat === filtro; });
      if (ordem === "az") {
        arr = arr.slice().sort(function (a, c) { return App.t2(a.nome).localeCompare(App.t2(c.nome), App.idioma === "en" ? "en" : "pt"); });
      } else if (ordem === "preco-asc" || ordem === "preco-desc") {
        var dir = ordem === "preco-asc" ? 1 : -1;
        var comP = arr.filter(temPreco).slice().sort(function (a, c) { return (a.preco - c.preco) * dir; });
        arr = comP.concat(arr.filter(function (p) { return !temPreco(p); }));
      }
      return arr;
    }

    function pinta() {
      var arr = lista();
      grelha.innerHTML = arr.length
        ? arr.slice(0, mostrados).map(tile).join("")
        : '<p class="loja-vazia" data-i18n="loja_vazia">' + App.t("loja_vazia") + '</p>';
      var num = document.getElementById("loja-conta-num");
      if (num) num.textContent = arr.length;
      var vm = document.getElementById("loja-vermais");
      if (vm) vm.hidden = mostrados >= arr.length;
      App.aplicarIdioma();
    }

    if (barra) {
      barra.addEventListener("click", function (e) {
        var btn = e.target.closest(".filtro"); if (!btn) return;
        filtro = btn.getAttribute("data-cat"); mostrados = LIMITE;
        barra.querySelectorAll(".filtro").forEach(function (x) { x.classList.remove("ativo"); });
        btn.classList.add("ativo");
        history.replaceState(null, "", filtro === "todos" ? location.pathname : location.pathname + "?c=" + filtro);
        pinta();
      });
    }
    var sel = document.getElementById("loja-ordenar");
    if (sel) sel.addEventListener("change", function () { ordem = sel.value; mostrados = LIMITE; pinta(); });
    var vm = document.getElementById("loja-vermais");
    if (vm) vm.addEventListener("click", function () { mostrados += LIMITE; pinta(); });

    pinta();
  }

  /* ============================ PRODUTO ============================ */
  function renderProduto() {
    var wrap = document.getElementById("produto-detalhe");
    if (!wrap) return;
    var slug = new URLSearchParams(location.search).get("slug");
    var p = App.Cesto.porSlug(slug);
    if (!p) {
      wrap.innerHTML = '<div class="container" style="text-align:center;padding:4rem 0">' +
        '<p>—</p><a class="btn btn--contorno" href="' + b() + 'paginas/loja.html" data-i18n="prodpg_voltar">Voltar à loja</a></div>';
      App.aplicarIdioma(); return;
    }
    document.title = App.t2(p.nome) + " · Timorgiana Florist";
    var descKey = p.tipo === "quote" ? "desc_quote" : (p.cat === "hastes" ? "desc_hastes" : (p.cat === "vaso" ? "desc_vaso" : "desc_bouquet"));
    var catNome = App.t(FILTRO_KEY[p.cat] || "filtro_outro");

    var acao;
    if (p.tipo === "quote") {
      acao = '<div class="produto-pg__preco"><span class="badge-quote" data-i18n="sob_consulta">' + App.t("sob_consulta") + '</span></div>' +
        '<button class="btn btn--primario btn--grande" id="btn-orcamento" style="width:100%">' + App.ICON.whatsapp +
        ' <span data-i18n="pedir_orcamento">' + App.t("pedir_orcamento") + '</span></button>';
    } else {
      acao = '<div class="produto-pg__preco">' + App.Cesto.precoFmt(p.preco) +
          (p.tipo === "unidade" ? ' <span class="por-unid" data-i18n="por_unidade">' + App.t("por_unidade") + '</span>' : '') + '</div>' +
        '<div class="produto-pg__compra">' +
          '<div class="qty qty--grande" aria-label="' + App.t("prodpg_qty") + '">' +
            '<button class="qty__b" type="button" data-qty="menos" aria-label="−">–</button>' +
            '<input class="qty__i" id="prod-qty" type="number" min="1" value="1" inputmode="numeric" aria-label="' + App.t("prodpg_qty") + '">' +
            '<button class="qty__b" type="button" data-qty="mais" aria-label="+">+</button>' +
          '</div>' +
          '<button class="btn btn--primario btn--grande" id="btn-add">' + App.ICON.cesto +
          ' <span data-i18n="add_cesto">' + App.t("add_cesto") + '</span></button>' +
        '</div>' +
        (p.tipo === "unidade" ? '<p class="produto-pg__nota" data-i18n="prodpg_unid_nota">' + App.t("prodpg_unid_nota") + '</p>' : '');
    }

    wrap.innerHTML = '' +
      '<div class="container produto-pg">' +
        '<p class="migalhas"><a href="' + b() + 'paginas/loja.html" data-i18n="nav_loja">Loja</a> · <span>' + catNome + '</span></p>' +
        '<div class="produto-pg__grelha">' +
          '<div class="produto-pg__media"><img src="' + b() + p.img + '" alt="' + App.t2(p.nome) + '"></div>' +
          '<div class="produto-pg__info">' +
            '<span class="produto-pg__cat">' + catNome + '</span>' +
            '<h1 class="produto-pg__nome">' + App.t2(p.nome) + '</h1>' +
            acao +
            '<div class="acordeoes">' +
              '<details open><summary data-i18n="prodpg_desc">Descrição</summary><p data-i18n="' + descKey + '">' + App.t(descKey) + '</p></details>' +
              '<details><summary data-i18n="prodpg_inclui">O que inclui</summary><p data-i18n="inclui_txt">' + App.t("inclui_txt") + '</p></details>' +
              '<details><summary data-i18n="prodpg_entrega">Entrega</summary><p data-i18n="entrega_txt">' + App.t("entrega_txt") + '</p></details>' +
              '<details><summary data-i18n="prodpg_cuidados">Cuidados</summary><p data-i18n="cuidados_txt">' + App.t("cuidados_txt") + '</p></details>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      relacionados(p);

    /* interações */
    var qi = document.getElementById("prod-qty");
    wrap.addEventListener("click", function (e) {
      var q = e.target.closest("[data-qty]"); if (q && qi) {
        var v = parseInt(qi.value, 10) || 1;
        qi.value = Math.max(1, v + (q.getAttribute("data-qty") === "mais" ? 1 : -1));
      }
    });
    var add = document.getElementById("btn-add");
    if (add) add.addEventListener("click", function () {
      var v = Math.max(1, parseInt((qi && qi.value) || "1", 10) || 1);
      App.Cesto.adicionar(p.slug, v);
      App.toast(App.t("add_feito"));
      App.Cesto.abrir();
    });
    var orc = document.getElementById("btn-orcamento");
    if (orc) orc.addEventListener("click", function () {
      var msg = "*" + App.t("pedir_orcamento") + " — Timorgiana Florist*\n\n" + App.t2(p.nome) +
        "\n" + location.href + "\n\n" + (App.idioma === "en" ? "Hello! I'd like a quote for this."
        : App.idioma === "tet" ? "Botarde! Hakarak orsamentu ba ne'e." : "Olá! Gostaria de um orçamento para isto.");
      window.open(App.linkWhatsApp(msg), "_blank", "noopener");
    });
    App.aplicarIdioma();
  }

  function relacionados(p) {
    var rel = App.PRODUTOS.filter(function (x) { return x.cat === p.cat && x.slug !== p.slug; }).slice(0, 4);
    if (!rel.length) return "";
    return '<div class="container" style="margin-top:clamp(3rem,6vw,5rem)">' +
      '<div class="cabecalho-seccao"><h2 data-i18n="prodpg_rel">Também poderá gostar</h2></div>' +
      '<div class="produtos-grelha produtos-grelha--4">' + rel.map(tile).join("") + '</div></div>';
  }

  /* ============================ CESTO (página) ============================ */
  App.renderPaginaCesto = function () {
    var wrap = document.getElementById("cesto-conteudo");
    if (!wrap) return;
    var lista = App.Cesto.itens();
    if (!lista.length) {
      wrap.innerHTML = '<div class="cesto-vazio">' +
        '<p data-i18n="cesto_vazio">O seu cesto está vazio.</p>' +
        '<a class="btn btn--primario" href="' + b() + 'paginas/loja.html" data-i18n="cestop_vazio_cta">Explorar a loja</a></div>';
      App.aplicarIdioma(); return;
    }
    var linhas = lista.map(function (l) {
      var p = l.produto;
      var precoLinha = App.Cesto.precoFmt(p.preco) + (p.tipo === "unidade" ? App.t("por_unidade") : "");
      var sub = App.Cesto.precoFmt(p.preco * l.qty);
      return '<div class="cesto-linha">' +
        '<img class="cesto-linha__img" src="' + b() + (p.thumb || p.img) + '" alt="' + App.t2(p.nome) + '" width="88" height="88">' +
        '<div class="cesto-linha__info"><a class="cesto-linha__nome" href="' + b() + 'paginas/produto.html?slug=' + p.slug + '">' + App.t2(p.nome) + '</a>' +
          '<span class="cesto-linha__preco">' + precoLinha + '</span></div>' +
        '<div class="qty"><button class="qty__b" data-acao="menos" data-slug="' + p.slug + '">–</button>' +
          '<span class="qty__n">' + l.qty + '</span>' +
          '<button class="qty__b" data-acao="mais" data-slug="' + p.slug + '">+</button></div>' +
        '<span class="cesto-linha__sub">' + sub + '</span>' +
        '<button class="cesto-linha__rem" data-acao="remover" data-slug="' + p.slug + '" aria-label="' + App.t("remover") + '">&times;</button>' +
        '</div>';
    }).join("");

    wrap.innerHTML = '' +
      '<div class="cesto-grelha">' +
        '<div class="cesto-linhas">' + linhas + '</div>' +
        '<aside class="cesto-resumo">' +
          '<h2 data-i18n="cesto_subtotal">Subtotal</h2>' +
          '<div class="cesto-resumo__linha"><span data-i18n="cesto_subtotal">Subtotal</span><b>' + App.Cesto.precoFmt(App.Cesto.subtotal()) + '</b></div>' +
          '<div class="cesto-resumo__linha"><span data-i18n="cesto_entrega">Entrega</span><span data-i18n="cesto_entrega_val">A combinar</span></div>' +
          '<form class="cesto-form" id="cesto-form" novalidate>' +
            '<label data-i18n="checkout_nome">Nome</label><input name="nome" type="text" autocomplete="name">' +
            '<label data-i18n="checkout_data">Data de entrega</label><input name="data" type="date" id="cesto-data">' +
            '<label data-i18n="checkout_morada">Morada de entrega</label><input name="morada" type="text" autocomplete="street-address">' +
            '<label data-i18n="checkout_nota">Mensagem (opcional)</label><textarea name="nota" rows="2"></textarea>' +
            '<button class="btn btn--whatsapp btn--grande" type="submit" style="width:100%;margin-top:.6rem">' + App.ICON.whatsapp +
              ' <span data-i18n="cesto_finalizar">Finalizar por WhatsApp</span></button>' +
          '</form>' +
          '<a class="cesto-continuar" href="' + b() + 'paginas/loja.html" data-i18n="cesto_continuar">Continuar a comprar</a>' +
        '</aside>' +
      '</div>';

    var dt = document.getElementById("cesto-data");
    if (dt) dt.min = new Date().toISOString().split("T")[0];
    var form = document.getElementById("cesto-form");
    if (form) form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var d = new FormData(form);
      App.Cesto.checkout({
        nome: (d.get("nome") || "").toString().trim(),
        data: (d.get("data") || "").toString().trim(),
        morada: (d.get("morada") || "").toString().trim(),
        nota: (d.get("nota") || "").toString().trim()
      });
    });
    App.aplicarIdioma();
  };

  function iniciar() {
    var pg = App.pagina;
    if (pg === "loja") renderColecao();
    else if (pg === "produto") renderProduto();
    else if (pg === "cesto") App.renderPaginaCesto();
  }

  return { iniciar: iniciar, tile: tile };
})();
