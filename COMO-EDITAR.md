# 🌸 Como editar o site da Timorgiana Florist

Guia simples para manter o site sozinha. Não é preciso ser técnico — basta seguir os passos.

---

## 🔑 A regra de ouro

Qualquer alteração só fica online depois de **guardar → Commit → Push** no **GitHub Desktop**:

> Editar o ficheiro → abrir o **GitHub Desktop** → escrever um resumo curto → **Commit to main** → **Push origin** → ~1 minuto depois está online.

O endereço do site é: **https://simaon753-dot.github.io/timorgiana-florist/**

---

## 🌷 Adicionar fotos novas à galeria

São 2 passos, dentro da pasta `site/`.

### Passo 1 — Colocar a foto na pasta da categoria
As pastas estão em `assets/galeria/`. Escolha a categoria certa:

| Categoria | Pasta | Última foto atual |
|-----------|-------|-------------------|
| Casamentos | `assets/galeria/casamentos/` | `cas-07.jpg` |
| Bouquet | `assets/galeria/bouquet/` | `bouquet-24.jpg` |
| Arranjo em vaso | `assets/galeria/vaso/` | `vaso-65.jpg` |
| Fúnebre | `assets/galeria/funebre/` | `fun-01.jpg` |
| Outro | `assets/galeria/outro/` | `outro-03.jpg` |

Dê à foto o **nome seguinte** ao último. Exemplos:
- novo bouquet → **`bouquet-25.jpg`**
- novo casamento → **`cas-08.jpg`**
- novo fúnebre → **`fun-02.jpg`**

> Use sempre letras minúsculas, o hífen e `.jpg`. Sem espaços nem acentos no nome.

### Passo 2 — Registar a foto na lista
Abra o ficheiro **`js/galeria-dados.js`** e acrescente uma linha (copie uma existente e mude só o número):

```js
  { src: "assets/galeria/bouquet/bouquet-25.jpg", cat: "bouquet" },
```

⚠️ **Muito importante:** manter a **vírgula no fim** e as **aspas**. Se faltar uma, a galeria deixa de aparecer.

### Passo 3 — Publicar
No **GitHub Desktop** → Commit → **Push origin**. A foto aparece sozinha na galeria e no filtro certo.

---

## ⚠️ Antes de subir fotos: reduza o tamanho

As fotos do telemóvel são muito grandes (3–5 MB) e deixam o site lento.
Reduza para cerca de **1200px de largura** antes de as usar:

- **No Mac:** abra a foto no **Pré-visualização** → menu **Ferramentas → Ajustar tamanho** → ponha `1200` na largura → **OK** → **Ficheiro → Exportar** como JPEG.

*(Se preferir não fazer isto, veja a secção "A forma mais fácil" em baixo.)*

---

## ✍️ Mudar textos

Todos os textos do site estão em **`js/i18n.js`**, em **três línguas**: `pt` (português), `tet` (tétum), `en` (inglês).

Para mudar uma frase, procure-a e altere as três versões. Exemplo:

```js
hero_tagline: { pt:"momentos que ficam na memória", tet:"...", en:"..." },
```

⚠️ Mexa só no texto **dentro das aspas**. Não apague aspas, vírgulas nem os `pt:` / `tet:` / `en:`.

---

## 🗺️ Onde está cada coisa

| Quero mudar… | Ficheiro |
|--------------|----------|
| Fotos da galeria | `js/galeria-dados.js` + pasta `assets/galeria/` |
| Textos (3 línguas) | `js/i18n.js` |
| Telefone, emails, morada, redes sociais | `js/componentes.js` (no topo) |
| Cores e tipos de letra | `css/estilos.css` (secção 1, "VARIÁVEIS") |

---

## 💡 A forma mais fácil de todas

Não tem de fazer nada disto à mão. Sempre que quiser mudanças, **peça ao Claude Code**:

- *"Adiciona estas fotos aos bouquets"* (e indique a pasta com as fotos)
- *"Muda o texto X para Y"*
- *"Atualiza o número de telefone"*

O Claude trata da parte técnica — otimiza as fotos, dá os nomes certos, atualiza as listas — e deixa tudo pronto. No fim, só faz **Push origin** no GitHub Desktop. 🌷

---

*Guia criado para a Timorgiana, Lda. — floricultura em Díli, Timor-Leste.*
