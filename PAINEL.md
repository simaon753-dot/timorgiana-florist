# 📊 Painel de gestão — Timorgiana Florist

Cada encomenda feita na loja é registada **automaticamente** numa Folha Google (além da
mensagem de WhatsApp). Depois, um **dashboard elegante** ([painel.html](painel.html)) lê esses
dados e mostra **receitas, vendas por categoria e stock** com a imagem da marca.

```
Cliente finaliza no site ─▶ 1) WhatsApp   2) grava na Folha Google (Apps Script)
                                              │
Folha Google  ◀──────── lê ──────────────────┘
   Encomendas · Itens · Stock
        │
        └─▶ painel.html  (dashboard privado, protegido por código)
```

Tudo **grátis** e sem servidor.

---

## Parte A — Registo das encomendas (já feito ✅)

Já está a funcionar: a folha tem os separadores **Encomendas**, **Itens** e **Stock**, e as
encomendas aparecem lá. (Pode apagar as linhas de *TESTE*.) O separador **Folha1** é um modelo
que a Google criou sozinha — pode apagá-lo.

---

## Parte B — Ligar o dashboard elegante

O dashboard precisa de **ler** os dados. Para isso, é preciso **atualizar o código** do Apps
Script (a versão nova inclui a leitura) e **republicar**.

### Passo 1 — Atualizar o código
1. Na folha: **Extensões → Apps Script**.
2. Apague tudo e **cole o código novo** (secção "Código completo" mais abaixo).
3. **Importante:** na linha `var CHAVE_PAINEL = "flores";` troque `flores` por um **código só seu**
   (ex.: `timor2026`). É a senha para abrir o dashboard.
4. Guarde (💾).

### Passo 2 — Republicar (manter o mesmo URL)
1. **Implementar → Gerir implementações**
2. Na sua implementação, **lápis ✏️ (Editar)**
3. Em **Versão**, escolha **Nova versão** → **Implementar**
   *(assim o URL mantém-se — não precisa de me enviar nada de novo)*

### Passo 3 — Abrir o dashboard
Abra no browser (guarde nos favoritos):
```
https://simaon753-dot.github.io/timorgiana-florist/painel.html
```
Escreva o **código** que definiu no Passo 1 → e vê o painel. ✨
*(O código fica guardado nesse aparelho; use "Sair" para o esquecer.)*

> ⏳ Só funciona depois de **publicar o site** (Push origin) e **republicar o script** (Passo 2).

---

## Código completo (colar no Apps Script)

```javascript
/**
 * Painel de gestão — Timorgiana Florist
 * • doPost: recebe cada encomenda do site e regista (Encomendas/Itens/Stock).
 * • doGet : serve os dados agregados ao dashboard (painel.html), protegido por CHAVE_PAINEL.
 */

var SEGREDO = "";              // (opcional) senha para o registo de encomendas (POST)
var CHAVE_PAINEL = "flores";   // ⬅ MUDE para um código só seu (senha do dashboard)

/* ---------- DASHBOARD (leitura) ---------- */
function doGet(e) {
  var cb = e && e.parameter ? e.parameter.callback : null;
  if (!cb) {
    return ContentService.createTextOutput("Painel Timorgiana ativo ✓")
      .setMimeType(ContentService.MimeType.TEXT);
  }
  var out = (!e.parameter || e.parameter.k !== CHAVE_PAINEL)
    ? { ok: false, erro: "chave" }
    : { ok: true, dados: painelDados() };
  return ContentService.createTextOutput(cb + "(" + JSON.stringify(out) + ")")
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function painelDados() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var enc = valores(ss, "Encomendas"), itn = valores(ss, "Itens"), stk = valores(ss, "Stock");
  var tz = Session.getScriptTimeZone(), agora = new Date();
  var receitaTotal = 0, receitaMes = 0, porDia = {};

  enc.forEach(function (r) {
    var sub = Number(r[7]) || 0; receitaTotal += sub;
    var d = r[0] instanceof Date ? r[0] : new Date(r[0]);
    if (d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear()) receitaMes += sub;
    var k = Utilities.formatDate(d, tz, "yyyy-MM-dd");
    porDia[k] = (porDia[k] || 0) + sub;
  });

  var unidades = 0, porCat = {};
  itn.forEach(function (r) {
    var q = Number(r[7]) || 0, sub = Number(r[8]) || 0, cat = r[4] || "outro";
    unidades += q;
    if (!porCat[cat]) porCat[cat] = { categoria: cat, unidades: 0, receita: 0 };
    porCat[cat].unidades += q; porCat[cat].receita += sub;
  });

  var dias = [];
  for (var i = 13; i >= 0; i--) {
    var d = new Date(agora); d.setDate(agora.getDate() - i);
    var k = Utilities.formatDate(d, tz, "yyyy-MM-dd");
    dias.push({ dia: k, receita: +((porDia[k] || 0)).toFixed(2) });
  }

  return {
    moeda: "$",
    receita_total: +receitaTotal.toFixed(2),
    receita_mes: +receitaMes.toFixed(2),
    n_encomendas: enc.length,
    unidades: unidades,
    por_categoria: Object.keys(porCat).map(function (k) { return porCat[k]; }),
    por_dia: dias,
    recentes: enc.slice(-8).reverse().map(function (r) {
      return { data: fmt(r[0], tz), id: r[1], cliente: r[2], subtotal: Number(r[7]) || 0, resumo: r[10] };
    }),
    stock: stk.map(function (r) {
      return { produto: r[1], vendido: Number(r[3]) || 0, disponivel: r[4] };
    })
  };
}

function valores(ss, nome) {
  var sh = ss.getSheetByName(nome);
  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
}
function fmt(d, tz) {
  try { return Utilities.formatDate(d instanceof Date ? d : new Date(d), tz, "dd/MM HH:mm"); }
  catch (e) { return String(d); }
}

/* ---------- REGISTO (escrita) ---------- */
function doPost(e) {
  try {
    if (SEGREDO && (!e.parameter || e.parameter.k !== SEGREDO)) return resposta({ ok: false, erro: "segredo" });
    var pedido = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var enc = folha(ss, "Encomendas", ["Data/Hora","ID","Cliente","Data entrega","Morada","Nota","Nº itens","Subtotal","Moeda","Idioma","Resumo","WhatsApp"]);
    var itn = folha(ss, "Itens", ["Data/Hora","ID encomenda","Produto","Slug","Categoria","Tipo","Preço","Quantidade","Subtotal"]);
    var stk = folha(ss, "Stock", ["Slug","Produto","Stock inicial","Vendido","Disponível"]);
    var quando = new Date(pedido.data_hora || Date.now());
    var c = pedido.cliente || {}, itens = pedido.itens || [];
    var resumo = itens.map(function (i) { return i.quantidade + "× " + i.nome; }).join("; ");

    enc.appendRow([quando, limpo(pedido.id), limpo(c.nome), limpo(c.data_entrega), limpo(c.morada),
      limpo(c.nota), Number(pedido.total_itens) || 0, Number(pedido.subtotal) || 0,
      limpo(pedido.moeda || "$"), limpo(pedido.idioma), limpo(resumo), limpo(c.whatsapp)]);

    itens.forEach(function (i) {
      itn.appendRow([quando, limpo(pedido.id), limpo(i.nome), limpo(i.slug), limpo(i.categoria),
        limpo(i.tipo), Number(i.preco) || 0, Number(i.quantidade) || 0, Number(i.subtotal) || 0]);
      abaterStock(stk, i);
    });
    return resposta({ ok: true, id: pedido.id });
  } catch (err) {
    return resposta({ ok: false, erro: String(err) });
  }
}

function abaterStock(stk, item) {
  var dados = stk.getDataRange().getValues();
  for (var r = 1; r < dados.length; r++) {
    if (String(dados[r][0]) === String(item.slug)) {
      stk.getRange(r + 1, 4).setValue((Number(dados[r][3]) || 0) + (Number(item.quantidade) || 0));
      return;
    }
  }
  stk.appendRow([limpo(item.slug), limpo(item.nome), "", Number(item.quantidade) || 0, ""]);
  var last = stk.getLastRow();
  stk.getRange(last, 5).setFormula("=C" + last + "-D" + last);
}

function folha(ss, nome, cabecalho) {
  var sh = ss.getSheetByName(nome);
  if (!sh) {
    sh = ss.insertSheet(nome);
    sh.appendRow(cabecalho);
    sh.getRange(1, 1, 1, cabecalho.length).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}
function limpo(v) { if (v == null) return ""; var s = String(v); if (/^[=+\-@]/.test(s)) s = "'" + s; return s; }
function resposta(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
```

---

## O dashboard mostra
- **Receita total** e **receita do mês**, **nº de encomendas**, **unidades vendidas**
- **Gráfico** da receita dos últimos 14 dias
- **Vendas por categoria** (barras)
- **Encomendas recentes** e **Stock** (com aviso quando ≤ 5)

Para o **Stock disponível** aparecer, preencha na folha (separador *Stock*) a coluna
**"Stock inicial"** de cada flor. O "Disponível" abate-se sozinho a cada venda.

---

## É seguro para a minha conta Google?
Sim. Permissões limitadas (só *Folhas de cálculo*), o registo só **escreve**, e o dashboard só
**lê com o código certo** (`CHAVE_PAINEL`). O risco real é apenas spam de encomendas falsas na
folha (o código já neutraliza texto malicioso). Para paz de espírito, use a conta **do negócio**.

## Testar
1. Publique o site (Push origin) e republique o script (Parte B, Passo 2).
2. Abra `…/painel.html`, escreva o código → deve ver as vendas.
3. Faça uma encomenda de teste na loja → volte ao painel → **↻ Atualizar** → aparece.

*Guia criado para a Timorgiana, Lda. — floricultura em Díli, Timor-Leste.*
