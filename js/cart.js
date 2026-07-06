/* =========================================================================
   CART.JS — Cesto persistente (localStorage) + gaveta lateral + checkout WhatsApp
   -------------------------------------------------------------------------
   • Modelo: { slug: quantidade }  em localStorage ("tg_cesto_v1")
   • Só produtos com preço entram no cesto; os "quote" (sob consulta) usam
     "Pedir orçamento" (WhatsApp direto, ver loja.js).
   • Contador no cabeçalho, gaveta lateral e checkout por WhatsApp.
   ========================================================================= */
window.App = window.App || {};

App.Cesto = (function () {
  "use strict";
  var CHAVE = "tg_cesto_v1";

  function ler() {
    try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; }
    catch (e) { return {}; }
  }
  function gravar(o) {
    try { localStorage.setItem(CHAVE, JSON.stringify(o)); } catch (e) {}
    atualizar();
  }
  function porSlug(slug) {
    return (App.PRODUTOS || []).filter(function (p) { return p.slug === slug; })[0] || null;
  }
  function itens() {
    var o = ler(), lista = [];
    Object.keys(o).forEach(function (slug) {
      var p = porSlug(slug);
      if (p) lista.push({ produto: p, qty: o[slug] });
    });
    return lista;
  }
  function contagem() {
    var o = ler(), n = 0;
    Object.keys(o).forEach(function (s) { n += o[s]; });
    return n;
  }
  function subtotal() {
    return itens().reduce(function (t, l) {
      return t + (typeof l.produto.preco === "number" ? l.produto.preco * l.qty : 0);
    }, 0);
  }
  function adicionar(slug, qty) {
    qty = Math.max(1, qty || 1);
    var o = ler();
    o[slug] = (o[slug] || 0) + qty;
    gravar(o);
  }
  function definir(slug, qty) {
    var o = ler();
    if (qty <= 0) delete o[slug]; else o[slug] = qty;
    gravar(o);
  }
  function remover(slug) { var o = ler(); delete o[slug]; gravar(o); }
  function limpar() { gravar({}); }

  function precoFmt(n) { return (App.MOEDA || "$") + Number(n).toFixed(2); }

  /* ---- Contador do cabeçalho + re-render da gaveta ---- */
  function atualizar() {
    var n = contagem();
    document.querySelectorAll(".cabecalho__cesto-conta").forEach(function (el) {
      el.textContent = n;
      el.hidden = n === 0;
    });
    renderGaveta();
    /* re-render da página do cesto, se estiver aberta */
    if (typeof App.renderPaginaCesto === "function") App.renderPaginaCesto();
  }

  /* ---- Gaveta lateral ---- */
  function renderGaveta() {
    var corpo = document.getElementById("gaveta-corpo");
    if (!corpo) return;
    var lista = itens();
    if (!lista.length) {
      corpo.innerHTML = '<p class="gaveta-vazia" data-i18n="cesto_vazio">' + App.t("cesto_vazio") + '</p>';
    } else {
      corpo.innerHTML = lista.map(function (l) {
        var p = l.produto, b = App.base;
        return '' +
          '<div class="gaveta-item">' +
            '<img src="' + b + (p.thumb || p.img) + '" alt="' + App.t2(p.nome) + '" width="64" height="64" loading="lazy">' +
            '<div class="gaveta-item__info">' +
              '<span class="gaveta-item__nome">' + App.t2(p.nome) + '</span>' +
              '<span class="gaveta-item__preco">' + precoFmt(p.preco) +
                (p.tipo === "unidade" ? ' <span class="por-unid" data-i18n="por_unidade">' + App.t("por_unidade") + '</span>' : '') +
              '</span>' +
              '<div class="qty">' +
                '<button class="qty__b" data-acao="menos" data-slug="' + p.slug + '" aria-label="−">–</button>' +
                '<span class="qty__n">' + l.qty + '</span>' +
                '<button class="qty__b" data-acao="mais" data-slug="' + p.slug + '" aria-label="+">+</button>' +
              '</div>' +
            '</div>' +
            '<button class="gaveta-item__rem" data-acao="remover" data-slug="' + p.slug + '" aria-label="' + App.t("remover") + '">&times;</button>' +
          '</div>';
      }).join("");
    }
    var rodape = document.getElementById("gaveta-rodape");
    if (rodape) {
      if (lista.length) {
        rodape.hidden = false;
        var st = rodape.querySelector(".gaveta-subtotal__val");
        if (st) st.textContent = precoFmt(subtotal());
      } else {
        rodape.hidden = true;
      }
    }
  }

  function abrir() {
    var g = document.getElementById("gaveta-cesto");
    if (!g) return;
    renderGaveta();
    document.body.classList.add("gaveta-aberta");
    g.setAttribute("aria-hidden", "false");
  }
  function fechar() {
    var g = document.getElementById("gaveta-cesto");
    if (!g) return;
    document.body.classList.remove("gaveta-aberta");
    g.setAttribute("aria-hidden", "true");
  }

  /* ---- Checkout por WhatsApp ---- */
  function mensagemCheckout(dados) {
    dados = dados || {};
    var linhas = ["*Encomenda — Timorgiana Florist*", ""];
    itens().forEach(function (l) {
      var p = l.produto, sub = (typeof p.preco === "number") ? "  =  " + precoFmt(p.preco * l.qty) : "";
      linhas.push("• " + App.t2(p.nome) + "  ×" + l.qty +
        (typeof p.preco === "number" ? "  (" + precoFmt(p.preco) + (p.tipo === "unidade" ? "/un" : "") + ")" : "") + sub);
    });
    linhas.push("", "Subtotal: " + precoFmt(subtotal()));
    linhas.push("Entrega: a combinar");
    if (dados.nome)   linhas.push("", "Nome: " + dados.nome);
    if (dados.data)   linhas.push("Data de entrega: " + dados.data);
    if (dados.morada) linhas.push("Morada: " + dados.morada);
    if (dados.nota)   linhas.push("Nota: " + dados.nota);
    linhas.push("", "Obrigada! 🌷");
    return linhas.join("\n");
  }
  function checkout(dados) {
    if (!itens().length) return;
    window.open(App.linkWhatsApp(mensagemCheckout(dados)), "_blank", "noopener");
  }

  /* ---- Ligações de eventos (delegação) ---- */
  document.addEventListener("click", function (e) {
    var alvo = e.target.closest ? e.target.closest("[data-acao]") : null;
    if (alvo) {
      var slug = alvo.getAttribute("data-slug"), acao = alvo.getAttribute("data-acao");
      var o = ler();
      if (acao === "mais")      definir(slug, (o[slug] || 0) + 1);
      else if (acao === "menos")definir(slug, (o[slug] || 0) - 1);
      else if (acao === "remover") remover(slug);
      return;
    }
    if (e.target.closest && e.target.closest("[data-abrir-cesto]")) { e.preventDefault(); abrir(); }
    if (e.target.closest && e.target.closest("[data-fechar-cesto]")) { e.preventDefault(); fechar(); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("gaveta-aberta")) fechar();
  });

  return {
    itens: itens, contagem: contagem, subtotal: subtotal, adicionar: adicionar,
    definir: definir, remover: remover, limpar: limpar, porSlug: porSlug,
    precoFmt: precoFmt, atualizar: atualizar, abrir: abrir, fechar: fechar,
    checkout: checkout, mensagemCheckout: mensagemCheckout
  };
})();

/* helper: traduz um objeto {pt,tet,en} conforme o idioma atual */
App.t2 = function (obj) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[App.idioma] || obj.pt || "";
};

/* Notificação "toast" */
App.toast = function (msg) {
  var t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(function () { t.classList.add("visivel"); });
  setTimeout(function () {
    t.classList.remove("visivel");
    setTimeout(function () { t.remove(); }, 400);
  }, 2600);
};
