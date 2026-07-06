/* =========================================================================
   MAIN.JS — Inicialização e interações
   -------------------------------------------------------------------------
   • Constrói cabeçalho, rodapé e botão de WhatsApp (componentes.js)
   • Aplica o idioma e liga o seletor PT · TET · EN
   • Menu móvel, estado do cabeçalho ao deslizar, revelações ao scroll
   • Filtros da galeria e envio do formulário de encomenda para o WhatsApp
   ========================================================================= */
(function () {
  "use strict";

  function pronto(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  pronto(function () {
    /* 1 — Componentes partilhados ------------------------------------- */
    App.construirCabecalho();
    App.construirRodape();
    App.construirWhatsApp();
    App.aplicarIdioma();

    var cabecalho = document.getElementById("cabecalho");

    /* 2 — Seletor de idioma ------------------------------------------- */
    document.querySelectorAll(".idiomas__btn").forEach(function (b) {
      b.addEventListener("click", function () {
        App.mudarIdioma(b.getAttribute("data-idioma"));
        atualizarFormulario(); /* re-traduz opções do select, se existir */
      });
    });

    /* 3 — Menu móvel --------------------------------------------------- */
    var toggle = document.querySelector(".menu-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var aberto = document.body.classList.toggle("menu-aberto");
        toggle.setAttribute("aria-expanded", aberto ? "true" : "false");
      });
      document.querySelectorAll(".nav__link").forEach(function (l) {
        l.addEventListener("click", function () {
          document.body.classList.remove("menu-aberto");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    /* 4 — Estado do cabeçalho ao deslizar ----------------------------- */
    var temHero = !!document.querySelector(".hero");
    function estadoCabecalho() {
      var deslizou = window.scrollY > 40;
      if (temHero) {
        cabecalho.classList.toggle("cabecalho--solido", deslizou);
        cabecalho.classList.toggle("cabecalho--topo", !deslizou);
      } else {
        cabecalho.classList.add("cabecalho--solido");
        cabecalho.classList.remove("cabecalho--topo");
      }
    }
    estadoCabecalho();
    window.addEventListener("scroll", estadoCabecalho, { passive: true });

    /* 5 — Revelações ao scroll (IntersectionObserver) -----------------
       IMPORTANTE: threshold: 0 (qualquer pixel visível dispara). Um
       threshold maior falharia em contentores mais altos que o ecrã
       (típico da galeria em telemóvel) e as imagens ficariam invisíveis. */
    var alvos = document.querySelectorAll(".revelar");
    if ("IntersectionObserver" in window && alvos.length) {
      var io = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("visivel"); io.unobserve(e.target); }
        });
      }, { threshold: 0, rootMargin: "0px 0px -60px 0px" });
      alvos.forEach(function (el) { io.observe(el); });
      /* rede de segurança: se algo escapar (ex.: já visível no carregamento),
         revela ao fim de 2s para garantir que nunca fica invisível */
      setTimeout(function () {
        alvos.forEach(function (el) { el.classList.add("visivel"); });
      }, 2000);
    } else {
      alvos.forEach(function (el) { el.classList.add("visivel"); });
    }

    /* 6 — Foto opcional do hero (carrega só se o ficheiro existir) ---- */
    var heroFoto = document.querySelector(".hero__foto[data-foto]");
    if (heroFoto) {
      var url = heroFoto.getAttribute("data-foto");
      var img = new Image();
      img.onload = function () {
        heroFoto.style.backgroundImage = "url('" + url + "')";
        heroFoto.classList.add("carregada");
      };
      img.src = url;
    }

    /* 7 — Galeria: render + filtros + lightbox ------------------------ */
    var galeria = document.getElementById("galeria");
    if (galeria && Array.isArray(App.GALERIA)) {
      var LEGENDA = { casamentos:"cat2_t", vaso:"leg_vaso", bouquet:"leg_bouquet", funebre:"leg_funebre", outro:"leg_outro" };

      /* construir os itens a partir dos dados */
      App.GALERIA.forEach(function (item, i) {
        var legKey = LEGENDA[item.cat] || "leg_outro";
        var fig = document.createElement("button");
        fig.className = "galeria__item";
        fig.type = "button";
        fig.setAttribute("data-cat", item.cat);
        fig.setAttribute("data-idx", i);
        fig.setAttribute("data-src", item.src);
        var loading = i < 6 ? "eager" : "lazy"; /* primeiros 6 imediatos */
        /* a grelha usa a miniatura WebP (~30KB); se faltar, recua para o
           original JPEG (o lightbox usa sempre o original em data-src) */
        fig.innerHTML =
          '<img src="' + App.base + App.thumbFoto(item.src) + '" alt="' + App.t(legKey) + '"' +
          ' width="480" height="480" loading="' + loading + '" decoding="async"' +
          ' onload="this.dataset.carregada=1"' +
          ' onerror="this.onerror=null;this.src=\'' + App.base + item.src + '\'">' +
          '<span class="galeria__legenda" data-i18n="' + legKey + '">' + App.t(legKey) + '</span>';
        galeria.appendChild(fig);
      });

      var itens = [].slice.call(galeria.querySelectorAll(".galeria__item"));

      /* Rede de segurança para lazy loading: alguns motores (mobile antigos,
         previews headless) não iniciam o download quando a imagem começa com
         altura 0. Um IntersectionObserver próprio força o carregamento assim
         que a imagem chega perto da viewport. */
      if ("IntersectionObserver" in window) {
        var ioImg = new IntersectionObserver(function (ents) {
          ents.forEach(function (e) {
            if (e.isIntersecting) {
              var img = e.target.querySelector("img");
              if (img && !img.complete) {
                /* re-atribuir o src força o browser a começar */
                img.src = img.src;
              }
              ioImg.unobserve(e.target);
            }
          });
        }, { rootMargin: "200px 0px 400px 0px" });
        itens.forEach(function (it) { ioImg.observe(it); });
      }
      var vazio = document.getElementById("galeria-vazia");
      var filtros = document.querySelectorAll(".filtro");
      var filtroAtual = "todos";

      function aplicarFiltro(cat) {
        filtroAtual = cat;
        var visiveis = 0;
        itens.forEach(function (it) {
          var mostra = (cat === "todos" || it.getAttribute("data-cat") === cat);
          it.style.display = mostra ? "" : "none";
          if (mostra) visiveis++;
        });
        if (vazio) vazio.hidden = (visiveis > 0);
      }

      filtros.forEach(function (f) {
        f.addEventListener("click", function () {
          filtros.forEach(function (x) { x.classList.remove("ativo"); });
          f.classList.add("ativo");
          aplicarFiltro(f.getAttribute("data-filtro"));
        });
      });

      /* ---- Lightbox ---- */
      var lb = document.createElement("div");
      lb.className = "lightbox";
      lb.setAttribute("aria-hidden", "true");
      lb.setAttribute("role", "dialog");
      lb.setAttribute("aria-modal", "true");
      lb.setAttribute("aria-label", "Fotografia ampliada");
      lb.innerHTML =
        '<button class="lightbox__fechar" data-i18n-aria="lb_fechar" aria-label="Fechar">&times;</button>' +
        '<button class="lightbox__nav lightbox__nav--ant" data-i18n-aria="lb_anterior" aria-label="Anterior">&#8249;</button>' +
        '<img class="lightbox__img" alt="">' +
        '<div class="lightbox__rodape">' +
          '<span class="lightbox__ref"></span>' +
          '<a class="btn btn--primario lightbox__encomendar" href="#">&#10048; <span data-i18n="lb_encomendar">Encomendar este modelo</span></a>' +
        '</div>' +
        '<button class="lightbox__nav lightbox__nav--seg" data-i18n-aria="lb_seguinte" aria-label="Seguinte">&#8250;</button>';
      document.body.appendChild(lb);
      var lbImg = lb.querySelector(".lightbox__img");
      var lbRef = lb.querySelector(".lightbox__ref");
      var lbEnc = lb.querySelector(".lightbox__encomendar");
      var lbAberto = -1;
      var lbFocoAnterior = null; /* devolve o foco ao fechar (acessibilidade) */

      /* crossfade: a imagem entra suavemente quando termina de carregar */
      lbImg.addEventListener("load", function () { lbImg.style.opacity = "1"; });

      function visiveisAtuais() {
        return itens.filter(function (it) { return it.style.display !== "none"; });
      }
      function abrir(it) {
        var lista = visiveisAtuais();
        lbAberto = lista.indexOf(it);
        mostrarLb();
        lb.classList.add("aberto");
        lb.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        lbFocoAnterior = (document.activeElement && document.activeElement !== document.body)
          ? document.activeElement : it; /* devolve ao item clicado */
        lb.querySelector(".lightbox__fechar").focus();
      }
      function mostrarLb() {
        var lista = visiveisAtuais();
        if (lbAberto < 0 || lbAberto >= lista.length) return;
        var it = lista[lbAberto];
        var src = it.getAttribute("data-src") || "";
        /* o lightbox mostra sempre o ORIGINAL (1200px), não a miniatura */
        var novoSrc = App.base + src;
        if (!lbImg.src || lbImg.src.indexOf(src) === -1) { lbImg.style.opacity = "0"; lbImg.src = novoSrc; }
        /* referência do modelo (ex.: "Bouquet · Ref. BOUQUET-04") e ligação
           para o formulário de encomenda já com a foto escolhida */
        var legKey = LEGENDA[it.getAttribute("data-cat")] || "leg_outro";
        lbRef.textContent = App.t(legKey) + " · Ref. " + App.refFoto(src);
        lbEnc.href = App.base + "paginas/encomendar.html?foto=" + encodeURIComponent(src);
      }
      function navegar(d) {
        var lista = visiveisAtuais();
        lbAberto = (lbAberto + d + lista.length) % lista.length;
        mostrarLb();
      }
      function fechar() {
        lb.classList.remove("aberto");
        lb.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (lbFocoAnterior && lbFocoAnterior.focus) lbFocoAnterior.focus();
      }

      /* gestos tácteis: deslizar para navegar, deslizar para baixo fecha */
      var toqueX = 0, toqueY = 0;
      lb.addEventListener("touchstart", function (e) {
        if (e.touches.length !== 1) return;
        toqueX = e.touches[0].clientX; toqueY = e.touches[0].clientY;
      }, { passive: true });
      lb.addEventListener("touchend", function (e) {
        var dx = e.changedTouches[0].clientX - toqueX;
        var dy = e.changedTouches[0].clientY - toqueY;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) navegar(dx < 0 ? 1 : -1);
        else if (dy > 80 && Math.abs(dy) > Math.abs(dx)) fechar();
      }, { passive: true });

      itens.forEach(function (it) {
        it.addEventListener("click", function () { abrir(it); });
      });
      lb.querySelector(".lightbox__fechar").addEventListener("click", fechar);
      lb.querySelector(".lightbox__nav--ant").addEventListener("click", function (e) { e.stopPropagation(); navegar(-1); });
      lb.querySelector(".lightbox__nav--seg").addEventListener("click", function (e) { e.stopPropagation(); navegar(1); });
      lb.addEventListener("click", function (e) { if (e.target === lb) fechar(); });
      document.addEventListener("keydown", function (e) {
        if (!lb.classList.contains("aberto")) return;
        if (e.key === "Escape") fechar();
        else if (e.key === "ArrowLeft") navegar(-1);
        else if (e.key === "ArrowRight") navegar(1);
      });

      App.aplicarIdioma(); /* traduzir legendas e aria recém-criados */
    }

    /* 8 — Formulário de encomenda → WhatsApp -------------------------- */
    var form = document.getElementById("form-encomenda");
    var fotoEscolhida = "";
    var SEL_LEG = { casamentos:"cat2_t", vaso:"leg_vaso", bouquet:"leg_bouquet", funebre:"leg_funebre", outro:"leg_outro" };

    /* legenda do painel "modelo escolhido" (re-traduzível ao mudar idioma) */
    function legendaSelecao() {
      if (!fotoEscolhida) return;
      var el = document.getElementById("selecao-ref");
      if (!el) return;
      var cat = fotoEscolhida.split("/")[2] || "outro";
      el.textContent = App.t(SEL_LEG[cat] || "leg_outro") + " · Ref. " + App.refFoto(fotoEscolhida);
    }

    if (form) {
      /* 8a — Modelo escolhido no portefólio (chega por ?foto=…) -------- */
      var painelSel = document.getElementById("selecao");
      var paramFoto = new URLSearchParams(window.location.search).get("foto") || "";
      if (painelSel && /^assets\/galeria\/[a-z0-9_-]+\/[a-z0-9_-]+\.(jpe?g|png|webp)$/i.test(paramFoto)) {
        fotoEscolhida = paramFoto;
        painelSel.hidden = false;
        /* miniatura leve no painel (88px); recua para o original se faltar */
        var selImg = document.getElementById("selecao-img");
        selImg.onerror = function () { selImg.onerror = null; selImg.src = App.base + fotoEscolhida; };
        selImg.src = App.base + App.thumbFoto(fotoEscolhida);
        legendaSelecao();

        /* pré-seleciona o tipo de serviço conforme a categoria da foto */
        var SEL_OPT = { casamentos:"opt_cas", vaso:"opt_vaso", bouquet:"opt_ramo", funebre:"opt_fun", outro:"opt_outro" };
        var catSel = fotoEscolhida.split("/")[2] || "outro";
        var op = form.querySelector('option[data-i18n="' + (SEL_OPT[catSel] || "opt_outro") + '"]');
        if (op) op.selected = true;

        var btnRemover = document.getElementById("selecao-remover");
        if (btnRemover) {
          btnRemover.addEventListener("click", function () {
            fotoEscolhida = "";
            painelSel.hidden = true;
            history.replaceState(null, "", window.location.pathname);
          });
        }
      }

      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var d = new FormData(form);
        var nome = (d.get("nome") || "").toString().trim();
        var servico = (d.get("servico") || "").toString().trim();
        var aviso = document.getElementById("form-aviso");

        if (!nome || !servico) {
          if (aviso) {
            aviso.classList.add("visivel");
            aviso.querySelector(".aviso__texto").textContent = App.t("f_erro");
          }
          return;
        }

        var linhas = [
          "*Pedido de encomenda — Timorgiana Florist*",
          "",
          "Nome: " + nome,
          "Serviço: " + servico
        ];
        /* modelo escolhido no portefólio: referência + link direto da foto,
           para identificar sem confusões o arranjo que o cliente quer */
        if (fotoEscolhida) {
          linhas.push("Modelo escolhido: Ref. " + App.refFoto(fotoEscolhida));
          linhas.push("Foto do modelo: " + App.SITE + "/" + fotoEscolhida);
        }
        var ocasiao = (d.get("ocasiao") || "").toString().trim();
        var data = (d.get("data") || "").toString().trim();
        var contacto = (d.get("contacto") || "").toString().trim();
        var morada = (d.get("morada") || "").toString().trim();
        var msg = (d.get("mensagem") || "").toString().trim();
        if (ocasiao)  linhas.push("Ocasião: " + ocasiao);
        if (data)     linhas.push("Data de entrega: " + data);
        if (contacto) linhas.push("Contacto: " + contacto);
        if (morada)   linhas.push("Morada de entrega: " + morada);
        if (msg)      linhas.push("Mensagem: " + msg);
        linhas.push("", "Obrigada! 🌷");

        window.open(App.linkWhatsApp(linhas.join("\n")), "_blank", "noopener");

        if (aviso) {
          aviso.classList.add("visivel");
          aviso.querySelector(".aviso__texto").textContent =
            (App.idioma === "en" ? "Opening WhatsApp to confirm your order…"
             : App.idioma === "tet" ? "Loke WhatsApp atu konfirma…"
             : "A abrir o WhatsApp para confirmar a sua encomenda…");
        }
      });
    }

    /* 9 — Experiência premium: movimento e micro-interações ------------
       Tudo com transform/opacity (60 fps) e desligado quando o utilizador
       prefere movimento reduzido. */
    var reduzMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* 9a — Cabeçalho recolhe ao descer e reaparece ao subir */
    var ultimoY = window.scrollY;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (!document.body.classList.contains("menu-aberto")) {
        if (y > 340 && y > ultimoY + 8) cabecalho.classList.add("cabecalho--oculto");
        else if (y < ultimoY - 4 || y <= 340) cabecalho.classList.remove("cabecalho--oculto");
      }
      ultimoY = y;
    }, { passive: true });

    /* 9b — Paralaxe subtil na fotografia do hero (só desktop) */
    var arcoImg = document.querySelector(".hero__arco img");
    var mqDesk = window.matchMedia("(min-width: 881px)");
    if (arcoImg && !reduzMotion) {
      var alvoPar = 0, atualPar = 0, parAtivo = false;
      var quadroPar = function () {
        atualPar += (alvoPar - atualPar) * .09;
        arcoImg.style.transform = "translate3d(0," + atualPar.toFixed(2) + "px,0) scale(1.12)";
        if (Math.abs(alvoPar - atualPar) > .15) requestAnimationFrame(quadroPar);
        else parAtivo = false;
      };
      window.addEventListener("scroll", function () {
        if (!mqDesk.matches) return;
        alvoPar = Math.min(30, window.scrollY * .07);
        if (!parAtivo) { parAtivo = true; requestAnimationFrame(quadroPar); }
      }, { passive: true });
      window.addEventListener("resize", function () {
        if (!mqDesk.matches) arcoImg.style.transform = "";
      });
    }

    /* 9c — Números da casa contam ao entrar no ecrã */
    var nums = document.querySelectorAll(".stat__num");
    if (nums.length && !reduzMotion && "IntersectionObserver" in window) {
      var ioNum = new IntersectionObserver(function (ents) {
        ents.forEach(function (ent) {
          if (!ent.isIntersecting) return;
          ioNum.unobserve(ent.target);
          var el = ent.target;
          var m = (el.textContent || "").trim().match(/^(\d+)(.*)$/);
          if (!m) return;
          var fim = parseInt(m[1], 10), suf = m[2] || "", t0 = null, dur = 1300;
          var passo = function (t) {
            if (!t0) t0 = t;
            var p = Math.min(1, (t - t0) / dur);
            var eOut = 1 - Math.pow(1 - p, 4); /* easeOutQuart */
            el.textContent = Math.round(fim * eOut) + suf;
            if (p < 1) requestAnimationFrame(passo);
          };
          requestAnimationFrame(passo);
        });
      }, { threshold: .6 });
      nums.forEach(function (n) { ioNum.observe(n); });
    }

    /* 9d — Transição suave entre páginas (fade de saída) */
    if (!reduzMotion) {
      document.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
        if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
        var href = a.getAttribute("href");
        if (!href || !/\.html(\?|#|$)/.test(href)) return; /* só navegação interna */
        e.preventDefault();
        document.body.classList.add("pagina-sai");
        setTimeout(function () { window.location.href = href; }, 190);
      });
      /* bfcache (botão voltar): garante que a página reaparece */
      window.addEventListener("pageshow", function () {
        document.body.classList.remove("pagina-sai");
      });
    }

    /* 9e — Formulário: a data de entrega nunca pode ser no passado */
    var campoData = document.getElementById("data");
    if (campoData) campoData.min = new Date().toISOString().split("T")[0];

    /* 9f — Coleção de produtos: ordenar (Em destaque / Nome A–Z) */
    var selOrdenar = document.getElementById("ordenar");
    var grelhaProd = document.getElementById("produtos-grelha");
    if (selOrdenar && grelhaProd) {
      selOrdenar.addEventListener("change", function () {
        var tiles = [].slice.call(grelhaProd.querySelectorAll(".produto"));
        if (selOrdenar.value === "nome") {
          tiles.sort(function (a, b) {
            var na = (a.querySelector(".produto__nome").textContent || "").trim();
            var nb = (b.querySelector(".produto__nome").textContent || "").trim();
            return na.localeCompare(nb, App.idioma === "en" ? "en" : "pt");
          });
        } else { /* em destaque = ordem original (data-ordem) */
          tiles.sort(function (a, b) {
            return (+a.getAttribute("data-ordem") || 0) - (+b.getAttribute("data-ordem") || 0);
          });
        }
        tiles.forEach(function (t) { grelhaProd.appendChild(t); });
      });
    }

    function atualizarFormulario() {
      /* re-traduz as <option> que tenham data-i18n */
      document.querySelectorAll("option[data-i18n]").forEach(function (op) {
        op.textContent = App.t(op.getAttribute("data-i18n"));
      });
      legendaSelecao(); /* re-traduz a categoria do modelo escolhido */
    }
    atualizarFormulario();
  });
})();
