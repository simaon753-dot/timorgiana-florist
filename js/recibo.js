/* =========================================================================
   RECIBO.JS — Recibo/fatura no ecrã antes de enviar por WhatsApp
   -------------------------------------------------------------------------
   Mostra a encomenda (com fotos das flores, quantidades, preços e total)
   para o cliente rever. Depois:
     • "Enviar por WhatsApp" → App.Cesto.checkout (texto + painel de gestão)
     • "Guardar recibo (PDF)" → window.print (o cliente escolhe "Guardar como PDF"
       e pode anexá-lo no WhatsApp com 📎 — o WhatsApp não anexa ficheiros por link)
   ========================================================================= */
window.App = window.App || {};

App.Recibo = (function () {
  "use strict";
  var criado = false;

  function numero() {
    var d = new Date(), p = function (n) { return (n < 10 ? "0" : "") + n; };
    return "TG-" + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "-" + p(d.getHours()) + p(d.getMinutes());
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function construir() {
    if (criado) return;
    var el = document.createElement("div");
    el.innerHTML =
      '<div class="recibo-overlay" id="recibo-overlay" data-recibo-fechar></div>' +
      '<div class="recibo" id="recibo" role="dialog" aria-modal="true" aria-label="Recibo de encomenda" hidden>' +
        '<button class="recibo__x" type="button" data-recibo-fechar aria-label="' + App.t("fechar") + '">&times;</button>' +
        '<div class="recibo__doc" id="recibo-doc"></div>' +
        '<div class="recibo__acoes">' +
          '<p class="recibo__dica" data-i18n="recibo_dica">Dica: guarde o recibo em PDF e anexe-o no WhatsApp (📎).</p>' +
          '<div class="recibo__botoes">' +
            '<button class="btn btn--contorno" type="button" id="recibo-pdf">' + App.ICON.mail +
              ' <span data-i18n="recibo_guardar">Guardar recibo (PDF)</span></button>' +
            '<button class="btn btn--whatsapp btn--grande" type="button" id="recibo-enviar">' + App.ICON.whatsapp +
              ' <span data-i18n="recibo_enviar">Enviar por WhatsApp</span></button>' +
          '</div>' +
        '</div>' +
      '</div>';
    while (el.firstChild) document.body.appendChild(el.firstChild);
    criado = true;

    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("[data-recibo-fechar]")) fechar();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !document.getElementById("recibo").hidden) fechar();
    });
    document.getElementById("recibo-pdf").addEventListener("click", function () { window.print(); });
  }

  function linhaItem(l) {
    var p = l.produto, b = App.base;
    var unit = App.Cesto.precoFmt(p.preco) + (p.tipo === "unidade" ? App.t("por_unidade") : "");
    return '<tr>' +
      '<td class="recibo-item"><img src="' + b + (p.thumb || p.img) + '" alt="" width="44" height="44">' +
        '<span>' + esc(App.t2(p.nome)) + '</span></td>' +
      '<td class="num">' + l.qty + '</td>' +
      '<td class="num">' + unit + '</td>' +
      '<td class="num">' + App.Cesto.precoFmt(p.preco * l.qty) + '</td>' +
    '</tr>';
  }

  function linhaCliente(rotuloKey, valor) {
    if (!valor) return "";
    return '<div class="recibo-cli__l"><span data-i18n="' + rotuloKey + '">' + App.t(rotuloKey) + '</span><b>' + esc(valor) + '</b></div>';
  }

  function mostrar(dados) {
    construir();
    var itens = App.Cesto.itens();
    if (!itens.length) return;
    dados = dados || {};
    dados.numero = numero();
    var b = App.base;
    var dataStr = new Date().toLocaleDateString(App.idioma === "en" ? "en-GB" : "pt-PT");

    var cliente = linhaCliente("checkout_nome", dados.nome) + linhaCliente("checkout_data", dados.data) +
      linhaCliente("checkout_morada", dados.morada) + linhaCliente("checkout_nota", dados.nota);

    document.getElementById("recibo-doc").innerHTML = '' +
      '<div class="recibo-topo">' +
        '<img class="recibo-logo" src="' + b + 'assets/logo-coral.png" alt="Timorgiana Florist">' +
        '<div class="recibo-meta">' +
          '<div class="recibo-meta__t" data-i18n="recibo_titulo">Recibo de encomenda</div>' +
          '<div class="recibo-meta__n">' + esc(dados.numero) + '</div>' +
          '<div class="recibo-meta__d">' + dataStr + '</div>' +
        '</div>' +
      '</div>' +
      '<table class="recibo-tab">' +
        '<thead><tr><th data-i18n="recibo_produto">Produto</th><th class="num" data-i18n="recibo_qtd">Qt.</th>' +
          '<th class="num" data-i18n="recibo_unit">Preço</th><th class="num" data-i18n="recibo_total">Total</th></tr></thead>' +
        '<tbody>' + itens.map(linhaItem).join("") + '</tbody>' +
      '</table>' +
      '<div class="recibo-totais">' +
        '<div class="recibo-totais__l"><span data-i18n="cesto_subtotal">Subtotal</span><span>' + App.Cesto.precoFmt(App.Cesto.subtotal()) + '</span></div>' +
        '<div class="recibo-totais__l"><span data-i18n="cesto_entrega">Entrega</span><span data-i18n="cesto_entrega_val">A combinar</span></div>' +
        '<div class="recibo-totais__l recibo-totais__tot"><span data-i18n="cesto_total">Total</span><span>' + App.Cesto.precoFmt(App.Cesto.subtotal()) + '</span></div>' +
      '</div>' +
      (cliente ? '<div class="recibo-cli">' + cliente + '</div>' : '') +
      '<div class="recibo-rodape">' +
        '<span>' + esc(App.MORADA) + '</span>' +
        '<span>WhatsApp ' + esc(App.TELEFONE) + ' · ' + esc(App.EMAIL) + '</span>' +
        '<span class="recibo-rodape__obr" data-i18n="recibo_obrigada">Obrigada pela sua preferência 🌷</span>' +
      '</div>';

    var enviar = document.getElementById("recibo-enviar");
    enviar.onclick = function () { App.Cesto.checkout(dados); };

    document.getElementById("recibo").hidden = false;
    document.body.classList.add("recibo-aberto");
    App.aplicarIdioma();
  }

  function fechar() {
    var r = document.getElementById("recibo");
    if (r) r.hidden = true;
    document.body.classList.remove("recibo-aberto");
  }

  return { mostrar: mostrar, fechar: fechar };
})();
