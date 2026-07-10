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
  var atual = null; /* snapshot do recibo mostrado (para gerar o PDF) */

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
    document.getElementById("recibo-pdf").addEventListener("click", function () { gerarPDF(); });
  }

  /* ---- Geração de PDF (download direto, sem diálogo de impressão) ---- */
  var jspdfCarregando = false;
  function carregarJsPDF(cb) {
    if (window.jspdf && window.jspdf.jsPDF) { cb(); return; }
    if (jspdfCarregando) { setTimeout(function () { carregarJsPDF(cb); }, 200); return; }
    jspdfCarregando = true;
    var s = document.createElement("script");
    s.src = App.base + "js/vendor/jspdf.umd.min.js";
    s.onload = function () { jspdfCarregando = false; cb(); };
    s.onerror = function () { jspdfCarregando = false; App.toast("Não foi possível carregar o gerador de PDF."); };
    document.head.appendChild(s);
  }

  /* carrega imagens (mesma origem) e converte para dataURL JPEG p/ o PDF */
  function carregarImagens(lista, cb) {
    var mapa = {}, pend = lista.length;
    if (!pend) return cb(mapa);
    lista.forEach(function (it) {
      var img = new Image();
      img.onload = function () {
        try {
          var isLogo = it.key === "logo";
          var c = document.createElement("canvas");
          c.width = img.naturalWidth; c.height = img.naturalHeight;
          var ctx = c.getContext("2d");
          /* logótipo: manter transparente (PNG) e nítido; fotos: fundo branco + JPEG (leve) */
          if (!isLogo) { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, c.width, c.height); }
          ctx.drawImage(img, 0, 0);
          mapa[it.key] = isLogo
            ? { data: c.toDataURL("image/png"), w: img.naturalWidth, h: img.naturalHeight, fmt: "PNG" }
            : { data: c.toDataURL("image/jpeg", 0.82), w: img.naturalWidth, h: img.naturalHeight, fmt: "JPEG" };
        } catch (e) { mapa[it.key] = null; }
        if (--pend === 0) cb(mapa);
      };
      img.onerror = function () { mapa[it.key] = null; if (--pend === 0) cb(mapa); };
      img.src = it.src;
    });
  }

  function gerarPDF() {
    if (!atual) return;
    var btn = document.getElementById("recibo-pdf");
    var txt = btn.querySelector("span"), orig = txt ? txt.textContent : "";
    if (txt) txt.textContent = "A gerar…";
    carregarJsPDF(function () {
      var b = App.base;
      var lista = [{ key: "logo", src: b + "assets/logo-coral.png" }].concat(
        atual.itens.map(function (l) { return { key: l.produto.slug, src: b + (l.produto.thumb || l.produto.img) }; }));
      carregarImagens(lista, function (mapa) {
        try { construirPDF(mapa); } catch (e) { App.toast("Erro ao gerar o PDF."); }
        if (txt) txt.textContent = orig;
      });
    });
  }

  function cliLinha(doc, lbl, val, tenue, tinta, M, W, y) {
    if (!val) return y;
    doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor.apply(doc, tenue);
    doc.text(lbl.toUpperCase(), M, y);
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor.apply(doc, tinta);
    var linhas = doc.splitTextToSize(String(val), W - M - M - 42);
    doc.text(linhas, M + 42, y);
    return y + Math.max(6, linhas.length * 5);
  }

  function construirPDF(mapa) {
    var jsPDF = window.jspdf.jsPDF, doc = new jsPDF({ unit: "mm", format: "a4" });
    var M = 16, W = 210;
    var terr = [196, 99, 58], tinta = [58, 48, 42], tenue = [154, 140, 130], linha = [230, 220, 210];
    var d = atual.dados, y = 16;

    if (mapa.logo && mapa.logo.data) {
      var lw = 38, lh = lw * (mapa.logo.h / mapa.logo.w);
      doc.addImage(mapa.logo.data, mapa.logo.fmt || "PNG", M, y, lw, lh);
    }
    doc.setFont("times", "normal"); doc.setFontSize(18); doc.setTextColor.apply(doc, tinta);
    doc.text("Recibo de encomenda", W - M, y + 5, { align: "right" });
    doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor.apply(doc, terr);
    doc.text(String(atual.numero), W - M, y + 12, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor.apply(doc, tenue);
    doc.text(atual.dataStr, W - M, y + 17, { align: "right" });
    y += 27;
    doc.setDrawColor.apply(doc, [201, 168, 106]); doc.line(M, y, W - M, y); y += 8;

    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor.apply(doc, tenue);
    doc.text("PRODUTO", M + 14, y); doc.text("QT.", 132, y, { align: "right" });
    doc.text("PREÇO", 162, y, { align: "right" }); doc.text("TOTAL", W - M, y, { align: "right" });
    y += 3; doc.setDrawColor.apply(doc, linha); doc.line(M, y, W - M, y); y += 7;

    atual.itens.forEach(function (l) {
      var p = l.produto, th = mapa[p.slug];
      if (th && th.data) doc.addImage(th.data, th.fmt || "JPEG", M, y - 4.5, 11, 11);
      doc.setFont("times", "normal"); doc.setFontSize(12); doc.setTextColor.apply(doc, tinta);
      doc.text(App.t2(p.nome), M + 14, y + 2);
      doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor.apply(doc, tenue);
      doc.text(String(l.qty), 132, y + 2, { align: "right" });
      doc.text(App.Cesto.precoFmt(p.preco) + (p.tipo === "unidade" ? "/un" : ""), 162, y + 2, { align: "right" });
      doc.setTextColor.apply(doc, tinta);
      doc.text(App.Cesto.precoFmt(p.preco * l.qty), W - M, y + 2, { align: "right" });
      y += 13; doc.setDrawColor(240, 235, 228); doc.line(M, y - 4, W - M, y - 4);
    });
    y += 4;

    function tot(lbl, val, big) {
      doc.setFont(big ? "times" : "helvetica", "normal"); doc.setFontSize(big ? 15 : 10);
      doc.setTextColor.apply(doc, big ? tinta : tenue); doc.text(lbl, 130, y);
      doc.setTextColor.apply(doc, big ? terr : tinta); doc.text(val, W - M, y, { align: "right" });
      y += big ? 10 : 6;
    }
    tot("Subtotal", App.Cesto.precoFmt(atual.subtotal));
    tot("Entrega", "A combinar");
    doc.setDrawColor.apply(doc, linha); doc.line(120, y - 2, W - M, y - 2); y += 3;
    tot("Total", App.Cesto.precoFmt(atual.subtotal), true);
    y += 4;

    if (d.nome || d.whatsapp || d.data || d.morada || d.nota) {
      doc.setDrawColor.apply(doc, linha); doc.line(M, y, W - M, y); y += 7;
      y = cliLinha(doc, "Nome", d.nome, tenue, tinta, M, W, y);
      y = cliLinha(doc, "WhatsApp", d.whatsapp, tenue, tinta, M, W, y);
      y = cliLinha(doc, "Data de entrega", d.data, tenue, tinta, M, W, y);
      y = cliLinha(doc, "Morada", d.morada, tenue, tinta, M, W, y);
      y = cliLinha(doc, "Mensagem", d.nota, tenue, tinta, M, W, y);
    }
    y += 8;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor.apply(doc, tenue);
    doc.text(App.MORADA, W / 2, y, { align: "center" }); y += 4;
    doc.text("WhatsApp " + App.TELEFONE + "  ·  " + App.EMAIL, W / 2, y, { align: "center" }); y += 8;
    doc.setFont("times", "italic"); doc.setFontSize(12); doc.setTextColor.apply(doc, terr);
    doc.text("Obrigada pela sua preferência", W / 2, y, { align: "center" });

    doc.save("Recibo-" + atual.numero + ".pdf");
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
    atual = { dados: dados, itens: itens, numero: dados.numero, subtotal: App.Cesto.subtotal(), dataStr: dataStr };

    var cliente = linhaCliente("checkout_nome", dados.nome) + linhaCliente("checkout_whatsapp", dados.whatsapp) +
      linhaCliente("checkout_data", dados.data) + linhaCliente("checkout_morada", dados.morada) +
      linhaCliente("checkout_nota", dados.nota);

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
