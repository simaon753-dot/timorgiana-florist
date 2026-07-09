# 📊 Painel de gestão (Google Sheets) — Timorgiana Florist

Cada encomenda feita na loja passa a ser registada **automaticamente** numa Folha
Google, além da mensagem de WhatsApp. A folha calcula sozinha as **receitas**, as
**flores/produtos vendidos** e o **stock disponível**.

É **grátis** e não precisa de servidor. São ~10 minutos de configuração, uma única vez.

---

## Como funciona (visão geral)

```
Cliente finaliza no site  ─▶  1) abre o WhatsApp (como já era)
                          └▶  2) envia os dados da encomenda ──▶  Google Apps Script ──▶  Folha Google
                                                                                          (Encomendas · Itens · Stock · Painel)
```

---

## Passo 1 — Criar a folha
1. Vá a **sheets.new** (abre uma folha Google nova) e dê-lhe o nome **"Painel Timorgiana"**.

## Passo 2 — Colar o código
1. Na folha: menu **Extensões → Apps Script**.
2. Apague o que estiver em `Code.gs` e **cole o código** da secção "Código" (mais abaixo).
3. Clique no ícone **Guardar** (💾).

## Passo 3 — Publicar como aplicação web
1. Em cima, clique em **Implementar → Nova implementação** (*Deploy → New deployment*).
2. No engrenagem ⚙️, escolha **Aplicação Web** (*Web app*).
3. Defina:
   - **Executar como:** *Eu* (a sua conta)
   - **Quem tem acesso:** **Qualquer pessoa** (*Anyone*) ← importante
4. **Implementar** → autorize (permita o acesso à sua conta quando pedir).
5. **Copie o URL da aplicação web** (termina em `/exec`).

## Passo 4 — Ligar ao site
Envie-me esse URL e eu colo-o no site (no `App.PAINEL_URL`) e faço o resto — ou faça você:
abra `js/componentes.js` e ponha o URL entre as aspas:
```js
App.PAINEL_URL = "https://script.google.com/macros/s/AKfy..../exec";
```
Depois **Commit → Push**. A partir daí, cada encomenda aparece na folha. ✅

> **Atualizar o código mais tarde:** *Implementar → Gerir implementações → editar (lápis) →
> Versão: Nova versão → Implementar*. Assim o URL **mantém-se**.

---

## Código (colar no Apps Script)

```javascript
/**
 * Painel de gestão — Timorgiana Florist
 * Recebe cada encomenda do site e regista na Folha Google.
 * Cria/usa 3 separadores: Encomendas, Itens, Stock.
 */

// (Opcional) Segredo partilhado. Se puser um valor, o site tem de enviar ?k=ESSE_VALOR
// no fim do URL do painel. Deixe "" para não usar.
var SEGREDO = "";

function doPost(e) {
  try {
    if (SEGREDO && (!e.parameter || e.parameter.k !== SEGREDO)) {
      return resposta({ ok: false, erro: "segredo invalido" });
    }
    var pedido = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    var enc = folha(ss, "Encomendas",
      ["Data/Hora","ID","Cliente","Data entrega","Morada","Nota","Nº itens","Subtotal","Moeda","Idioma","Resumo"]);
    var itn = folha(ss, "Itens",
      ["Data/Hora","ID encomenda","Produto","Slug","Categoria","Tipo","Preço","Quantidade","Subtotal"]);
    var stk = folha(ss, "Stock",
      ["Slug","Produto","Stock inicial","Vendido","Disponível"]);

    var quando = new Date(pedido.data_hora || Date.now());
    var c = pedido.cliente || {};
    var itens = pedido.itens || [];
    var resumo = itens.map(function (i) { return i.quantidade + "× " + i.nome; }).join("; ");

    enc.appendRow([quando, pedido.id || "", c.nome || "", c.data_entrega || "", c.morada || "",
      c.nota || "", pedido.total_itens || 0, pedido.subtotal || 0, pedido.moeda || "$",
      pedido.idioma || "", resumo]);

    itens.forEach(function (i) {
      itn.appendRow([quando, pedido.id || "", i.nome, i.slug, i.categoria, i.tipo,
        i.preco, i.quantidade, i.subtotal]);
      abaterStock(stk, i);
    });

    return resposta({ ok: true, id: pedido.id });
  } catch (err) {
    return resposta({ ok: false, erro: String(err) });
  }
}

// Soma a quantidade vendida à linha do produto (por slug). Cria a linha se não existir.
function abaterStock(stk, item) {
  var dados = stk.getDataRange().getValues();
  for (var r = 1; r < dados.length; r++) {
    if (String(dados[r][0]) === String(item.slug)) {
      var atual = Number(dados[r][3]) || 0;
      stk.getRange(r + 1, 4).setValue(atual + (Number(item.quantidade) || 0)); // coluna D "Vendido"
      return;
    }
  }
  stk.appendRow([item.slug, item.nome, "", Number(item.quantidade) || 0, ""]);
  var last = stk.getLastRow();
  stk.getRange(last, 5).setFormula("=C" + last + "-D" + last); // Disponível = inicial − vendido
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

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

## O painel (separador "Painel")

Crie um separador chamado **Painel** e cole estas fórmulas nas células indicadas.
Elas atualizam-se sozinhas a cada nova encomenda:

| Célula | Fórmula | Mostra |
|--------|---------|--------|
| A1 | `Receita total` | rótulo |
| B1 | `=SUM(Encomendas!H2:H)` | **receita total** ($) |
| A2 | `Nº de encomendas` | rótulo |
| B2 | `=COUNTA(Encomendas!B2:B)` | nº de encomendas |
| A3 | `Produtos/flores vendidos` | rótulo |
| B3 | `=SUM(Itens!H2:H)` | total de unidades vendidas |
| A4 | `Receita este mês` | rótulo |
| B4 | `=SUMIFS(Encomendas!H2:H;Encomendas!A2:A;">="&EOMONTH(TODAY();-1)+1)` | receita do mês |

**Vendas por categoria** (cole em A6):
```
=QUERY(Itens!A:I; "select E, sum(H), sum(I) where E is not null group by E label sum(H) 'Unidades', sum(I) 'Receita'"; 1)
```

**Stock disponível:** no separador **Stock**, preencha a coluna **C ("Stock inicial")** com as
quantidades que tem de cada flor (as linhas dos produtos aparecem sozinhas à medida que vendem, ou
pode adicioná-las já pelo `slug`). A coluna **E ("Disponível")** = inicial − vendido, calcula-se sozinha.

> 💡 **"Flores em curso"**: se quiser separar encomendas *entregues* das *pendentes*, adicione uma
> coluna **"Estado"** na folha Encomendas e escreva "entregue" quando entregar. Depois é fácil filtrar.

---

## (Opcional) Um painel visual bonito
Quer gráficos num "website" em vez de tabelas? Ligue a folha ao **Looker Studio**
(gratuito, da Google): lookerstudio.google.com → *Criar → Relatório → Google Sheets* →
escolha esta folha. Arrasta os campos e tem um painel visual de receitas/vendas, partilhável por link.

---

## Testar
Depois de ligar o URL: faça uma encomenda de teste no site (adicione ao cesto → Finalizar).
Deve aparecer **uma linha nova** no separador *Encomendas* e as linhas dos produtos em *Itens*.
Se não aparecer, confirme que em *Quem tem acesso* escolheu **"Qualquer pessoa"**.

*Guia criado para a Timorgiana, Lda. — floricultura em Díli, Timor-Leste.*
