/* =========================================================================
   PERSONALIZAR.JS — Configurador de encomenda personalizada
   -------------------------------------------------------------------------
   Formulário guiado: o cliente escolhe tipo/flores/cores/tamanho/embrulho/
   extras, descreve e vê um resumo ao vivo. Envia como "Pedir orçamento"
   por WhatsApp (sob consulta). As fotos de referência anexam-se no WhatsApp.

   ✏️ EDITAR OPÇÕES: mude as listas em GRUPOS abaixo (as flores vêm do
   catálogo real — hastes de products.js).
   ========================================================================= */
window.App = window.App || {};

App.Personalizar = (function () {
  "use strict";

  function floresDoCatalogo() {
    var h = (App.PRODUTOS || []).filter(function (p) { return p.cat === "hastes"; });
    if (h.length) return h.map(function (p) { return { pt: p.nome.pt, tet: p.nome.tet, en: p.nome.en }; });
    return [{ pt: "Rosa", tet: "Roza", en: "Rose" }, { pt: "Lírio", tet: "Líriu", en: "Lily" }, { pt: "Gérbera", tet: "Jérbera", en: "Gerbera" }];
  }

  var GRUPOS = [
    { id: "tipo", rotulo: "pers_tipo", modo: "radio", opcoes: [
      { pt: "Ramo / Bouquet", tet: "Ramu", en: "Bouquet" },
      { pt: "Arranjo em vaso", tet: "Aranju iha vazu", en: "Vase arrangement" },
      { pt: "Cesto", tet: "Kaisan", en: "Basket" },
      { pt: "Caixa", tet: "Kaixa", en: "Box" },
      { pt: "Coroa", tet: "Koroa", en: "Wreath" } ] },
    { id: "flores", rotulo: "pers_flores", modo: "multi", nota: "pers_multi", opcoes: floresDoCatalogo() },
    { id: "cores", rotulo: "pers_cores", modo: "multi", nota: "pers_multi", opcoes: [
      { pt: "Vermelho", tet: "Mean", en: "Red" }, { pt: "Cor-de-rosa", tet: "Rosa", en: "Pink" },
      { pt: "Branco", tet: "Mutin", en: "White" }, { pt: "Amarelo", tet: "Kinur", en: "Yellow" },
      { pt: "Laranja", tet: "Laranja", en: "Orange" }, { pt: "Roxo", tet: "Roxu", en: "Purple" },
      { pt: "Azul", tet: "Azúl", en: "Blue" }, { pt: "Misto", tet: "Kombinadu", en: "Mixed" } ] },
    { id: "tamanho", rotulo: "pers_tamanho", modo: "radio", opcoes: [
      { pt: "Pequeno", tet: "Kiik", en: "Small" }, { pt: "Médio", tet: "Médiu", en: "Medium" }, { pt: "Grande", tet: "Boot", en: "Large" } ] },
    { id: "embrulho", rotulo: "pers_embrulho", modo: "radio", opcoes: [
      { pt: "Creme", tet: "Kreme", en: "Cream" }, { pt: "Cor-de-rosa", tet: "Rosa", en: "Pink" },
      { pt: "Preto", tet: "Metan", en: "Black" }, { pt: "Kraft", tet: "Kraft", en: "Kraft" },
      { pt: "Branco", tet: "Mutin", en: "White" }, { pt: "Coral", tet: "Coral", en: "Coral" } ] },
    { id: "fita", rotulo: "pers_fita", modo: "radio", opcoes: [
      { pt: "Com fita/laço", tet: "Ho fita", en: "With ribbon" }, { pt: "Sem fita", tet: "La iha fita", en: "No ribbon" } ] },
    { id: "extras", rotulo: "pers_extras", modo: "multi", nota: "pers_multi", opcoes: [
      { pt: "Cartão com mensagem", tet: "Kartaun ho mensajen", en: "Message card" },
      { pt: "Plástico decorativo", tet: "Plástiku dekorativu", en: "Decorative plastic" },
      { pt: "Vaso", tet: "Vazu", en: "Vase" }, { pt: "Cesto", tet: "Kaisan", en: "Basket" },
      { pt: "Caixa", tet: "Kaixa", en: "Box" }, { pt: "Balões", tet: "Balaun", en: "Balloons" },
      { pt: "Peluche", tet: "Peluche", en: "Plush toy" }, { pt: "Chocolates", tet: "Xokolate", en: "Chocolates" } ] },
    { id: "ocasiao", rotulo: "pers_ocasiao", modo: "radio", opcoes: [
      { pt: "Aniversário", tet: "Loron-moris", en: "Birthday" }, { pt: "Amor / Namoro", tet: "Domin", en: "Love" },
      { pt: "Casamento", tet: "Kazamentu", en: "Wedding" }, { pt: "Condolências", tet: "Kondolénsia", en: "Condolences" },
      { pt: "Agradecimento", tet: "Agradesimentu", en: "Thanks" }, { pt: "Parabéns", tet: "Parabéns", en: "Congratulations" },
      { pt: "Outro", tet: "Seluk", en: "Other" } ] }
  ];

  var estado = {}; /* { grupoId: indice | [indices] } */
  var nFotos = 0;

  function iniciar() {
    var raiz = document.getElementById("pers-config");
    if (!raiz) return;

    raiz.innerHTML = GRUPOS.map(function (g) {
      var chips = g.opcoes.map(function (op, i) {
        return '<button type="button" class="pers-chip" data-g="' + g.id + '" data-i="' + i + '">' + App.t2(op) + '</button>';
      }).join("");
      var nota = g.nota ? ' <span class="pers-grupo__nota" data-i18n="' + g.nota + '">' + App.t(g.nota) + '</span>' : "";
      return '<div class="pers-grupo">' +
        '<h3 class="pers-grupo__t"><span data-i18n="' + g.rotulo + '">' + App.t(g.rotulo) + '</span>' + nota + '</h3>' +
        '<div class="pers-chips">' + chips + '</div></div>';
    }).join("");

    raiz.addEventListener("click", function (e) {
      var b = e.target.closest(".pers-chip"); if (!b) return;
      var gid = b.getAttribute("data-g"), i = parseInt(b.getAttribute("data-i"), 10);
      var g = grupo(gid);
      if (g.modo === "radio") {
        estado[gid] = (estado[gid] === i) ? undefined : i;
      } else {
        var arr = estado[gid] || (estado[gid] = []);
        var pos = arr.indexOf(i);
        if (pos >= 0) arr.splice(pos, 1); else arr.push(i);
      }
      pintarSelecao(); resumo();
    });

    /* fotos de referência */
    var inputFotos = document.getElementById("pers-fotos-input");
    if (inputFotos) inputFotos.addEventListener("change", function () {
      nFotos = inputFotos.files ? inputFotos.files.length : 0;
      var c = document.getElementById("pers-fotos-conta");
      if (c) c.textContent = nFotos ? (nFotos + " " + App.t("pers_nfotos")) : "";
    });

    ["pers-descricao", "pers-cartao", "pers-orcamento"].forEach(function (id) {
      var el = document.getElementById(id); if (el) el.addEventListener("input", resumo);
    });

    var enviar = document.getElementById("pers-enviar");
    if (enviar) enviar.addEventListener("click", enviarWhatsApp);

    pintarSelecao(); resumo();
  }

  function grupo(id) { for (var i = 0; i < GRUPOS.length; i++) if (GRUPOS[i].id === id) return GRUPOS[i]; }
  function selecionado(gid, i) {
    var v = estado[gid];
    return (Array.isArray(v)) ? v.indexOf(i) >= 0 : v === i;
  }
  function pintarSelecao() {
    document.querySelectorAll("#pers-config .pers-chip").forEach(function (b) {
      b.classList.toggle("ativo", selecionado(b.getAttribute("data-g"), parseInt(b.getAttribute("data-i"), 10)));
    });
  }
  function texto(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }

  /* linhas escolhidas → [{rotulo, valor}] */
  function escolhas() {
    var linhas = [];
    GRUPOS.forEach(function (g) {
      var v = estado[g.id];
      if (v === undefined || v === null || (Array.isArray(v) && !v.length)) return;
      var val = Array.isArray(v)
        ? v.map(function (i) { return App.t2(g.opcoes[i]); }).join(", ")
        : App.t2(g.opcoes[v]);
      linhas.push({ rotulo: App.t(g.rotulo), valor: val });
    });
    var orc = texto("pers-orcamento"); if (orc) linhas.push({ rotulo: App.t("pers_orcamento"), valor: orc });
    var desc = texto("pers-descricao"); if (desc) linhas.push({ rotulo: App.t("pers_descricao"), valor: desc });
    var cart = texto("pers-cartao"); if (cart) linhas.push({ rotulo: App.t("pers_cartao"), valor: cart });
    return linhas;
  }

  function resumo() {
    var box = document.getElementById("pers-resumo-corpo");
    if (!box) return;
    var linhas = escolhas();
    box.innerHTML = linhas.length
      ? linhas.map(function (l) { return '<div class="pers-resumo__l"><span>' + l.rotulo + '</span><b>' + escapar(l.valor) + '</b></div>'; }).join("")
      : '<p class="pers-resumo__vazio" data-i18n="pers_vazio">' + App.t("pers_vazio") + '</p>';
  }

  function enviarWhatsApp() {
    var linhas = ["*Encomenda Personalizada — Timorgiana Florist*", ""];
    escolhas().forEach(function (l) { linhas.push(l.rotulo + ": " + l.valor); });
    if (nFotos) linhas.push("", "(" + App.t2({ pt: "Vou anexar", tet: "Sei tau", en: "I'll attach" }) + " " + nFotos + " " + App.t("pers_nfotos") + ")");
    linhas.push("", App.t("pers_preco_nota"), "Obrigada! 🌷");
    App.toast(App.t2({ pt: "A abrir o WhatsApp…", tet: "Loke WhatsApp…", en: "Opening WhatsApp…" }));
    window.open(App.linkWhatsApp(linhas.join("\n")), "_blank", "noopener");
  }

  function escapar(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  return { iniciar: iniciar };
})();
