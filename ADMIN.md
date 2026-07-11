# 🌸 Painel de administração — Timorgiana Florist

O painel permite **publicar fotografias e produtos no site** a partir de qualquer aparelho
(telemóvel ou computador), **sem programas** e sem mexer em ficheiros. Cada «Publicar» grava
as alterações diretamente no repositório do GitHub e o site atualiza sozinho **~1 minuto** depois.

**Endereço do painel:**

```
https://simaon753-dot.github.io/timorgiana-florist/admin.html
```

💡 No telemóvel, abra esse endereço e use **Adicionar ao ecrã principal** — fica como uma app.

---

## 1. Criar a chave de acesso (só uma vez)

O painel entra no GitHub com uma **chave própria** (token), limitada a este site.
Não é a senha da conta — é uma chave que pode revogar a qualquer momento.

1. Entre em **github.com** com a conta `simaon753-dot`.
2. Carregue na sua fotografia (canto superior direito) → **Settings**.
3. No fundo do menu esquerdo: **Developer settings**.
4. **Personal access tokens → Fine-grained tokens → Generate new token**.
5. Preencha assim:
   - **Token name:** `Painel Timorgiana`
   - **Expiration:** `Custom…` → escolha uma data daqui a **1 ano**
   - **Repository access:** `Only select repositories` → escolha **`timorgiana-florist`**
   - **Permissions → Repository permissions → Contents:** `Read and write`
     *(o resto fica como está; «Metadata: Read» ativa-se sozinho)*
6. **Generate token** e **copie** o código que começa por `github_pat_…`
   ⚠️ O GitHub só o mostra **uma vez** — guarde-o já num sítio seguro (gestor de senhas, nota protegida).
7. Abra o painel, **cole a chave** e carregue em **Entrar**. Pronto — fica guardada nesse aparelho.

### Segurança

- A chave fica **apenas no aparelho** onde a colou (e só serve para este site).
- **Não a partilhe** nem a envie por mensagem.
- Perdeu o telemóvel? Vá a **Settings → Developer settings → Fine-grained tokens** e faça **Revoke**
  — o painel deixa de funcionar nesse aparelho no instante seguinte.
- Quando a chave expirar (1 ano), o painel avisa; basta criar uma nova pelos mesmos passos.
- No painel, o botão **Sair** esquece a chave desse aparelho.

---

## 2. Usar o painel

### 🌸 Loja (produtos)

- **＋ Novo produto** → escolha a categoria, carregue a fotografia (pode tirar na hora, no telemóvel),
  confirme os nomes (vêm preenchidos nas 3 línguas) e o preço → **Publicar no site**.
  - A foto é **otimizada automaticamente** (≈1200 px + miniatura leve) — pode enviar fotos do telemóvel tal como estão.
  - A referência (`bouquet-22`, `cas-04`, …) e a numeração são calculadas sozinhas.
  - **Usar foto já no site** aproveita uma foto da galeria sem a carregar de novo.
- **Editar** → mudar preço, nomes, tipo de venda, ou substituir a fotografia.
- **Apagar** → remove o produto da loja (se a foto estiver na galeria, a foto fica).

Tipos de venda: **Preço fixo** · **Preço por haste** (flores à unidade) · **Sob consulta**
(sem preço; o cliente pede orçamento por WhatsApp).

### 🖼️ Galeria (portefólio)

- **＋ Adicionar fotografias** → escolha a categoria e várias fotos de uma vez → **Publicar no site**.
- Apagar: o ✕ em cada foto. Fotos que pertencem a um produto ficam **protegidas**
  (aparece o emblema 🛍 — para as apagar, apague primeiro o produto).

### 📜 Publicações

Lista das últimas alterações publicadas (o histórico do repositório), com ligação para ver
cada uma no GitHub.

### 🧪 Modo de demonstração

No ecrã de entrada, **Experimentar em modo de demonstração** abre o painel de treino:
tudo funciona, mas **nada é publicado**. Ideal para praticar sem medo.
(Também pode abrir diretamente `admin.html?demo=1`.)

---

## 3. Perguntas frequentes

**Publiquei mas o site ainda está igual.**
Espere ~1 minuto e recarregue a página (no telemóvel: puxar para baixo). O GitHub Pages
demora um pouco a reconstruir o site.

**«A chave guardada já não funciona».**
A chave expirou ou foi revogada. Crie uma nova (secção 1) e cole-a de novo.

**«Alguém publicou entretanto…»**
Outra pessoa (ou o GitHub Desktop) enviou alterações ao mesmo tempo. O painel recarrega
os dados sozinho — basta repetir a operação.

**Posso continuar a editar os ficheiros à mão / com o GitHub Desktop?**
Sim. O painel escreve `js/products.js` e `js/galeria-dados.js` **no mesmo formato de sempre**
(uma linha por produto). As duas formas convivem sem problema — ver [COMO-EDITAR.md](COMO-EDITAR.md).

**O painel é público?**
A página `admin.html` está acessível, mas **não faz nada sem uma chave válida** — é como uma
porta sem fechadura por dentro: só quem tem a chave do GitHub consegue publicar. A página está
marcada para não aparecer nos motores de busca.
