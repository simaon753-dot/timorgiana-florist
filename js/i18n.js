/* =========================================================================
   I18N.JS — Sistema trilingue (Português · Tétum · Inglês)
   -------------------------------------------------------------------------
   COMO FUNCIONA
   • Cada texto traduzível tem  data-i18n="chave"  no HTML.
     Para atributos use:  data-i18n-ph (placeholder), data-i18n-html (aceita
     marcação simples como <em>), data-i18n-aria (aria-label).
   • O seletor PT · TET · EN é inserido no cabeçalho (ver componentes.js).
   • A escolha é guardada em localStorage ("tg_idioma").

   IDIOMA PREDEFINIDO: Português (pt).

   ⚠️ As traduções em TÉTUM cobrem a navegação, botões e títulos. Textos
   longos recorrem ao Português até serem fornecidas versões oficiais —
   reveja-as com um falante nativo antes de publicar.
   ========================================================================= */
window.App = window.App || {};

App.IDIOMA_PADRAO = "pt";
App.IDIOMAS = ["pt", "tet", "en"];
App.NOMES_IDIOMA = { pt: "PT", tet: "TET", en: "EN" };

/* Dicionário — chave: { pt, tet, en }.  Se faltar tet/en, usa-se pt. */
App.T = {
  /* —— Navegação —— */
  nav_inicio:    { pt:"Início",            tet:"Inísiu",          en:"Home" },
  nav_sobre:     { pt:"Sobre",             tet:"Kona-ba ami",     en:"About" },
  nav_produtos:  { pt:"Produtos & Serviços", tet:"Produtu & Servisu", en:"Products & Services" },
  nav_galeria:   { pt:"Portefólio",        tet:"Portefóliu",      en:"Portfolio" },
  nav_loja:      { pt:"Loja",              tet:"Loja",            en:"Shop" },
  nav_encomendar:{ pt:"Encomendar",        tet:"Enkomenda",       en:"Order" },
  nav_contactos: { pt:"Contactos",         tet:"Kontaktu",        en:"Contact" },

  /* —— Botões globais —— */
  btn_encomendar:    { pt:"Encomendar",          tet:"Enkomenda",          en:"Order now" },
  btn_encomendar_ag: { pt:"Encomendar agora",    tet:"Enkomenda agora",    en:"Order now" },
  btn_whatsapp:      { pt:"Falar no WhatsApp",   tet:"Koalia iha WhatsApp",en:"Chat on WhatsApp" },
  btn_ver_produtos:  { pt:"Ver produtos",        tet:"Haree produtu",      en:"View products" },
  btn_ver_portefolio:{ pt:"Ver portefólio",      tet:"Haree portefóliu",   en:"View portfolio" },
  btn_saber_mais:    { pt:"Saber mais",          tet:"Hatene tan",         en:"Learn more" },
  btn_contactar:     { pt:"Contacte-nos",        tet:"Kontaktu ami",       en:"Contact us" },
  btn_explorar:      { pt:"Explorar",            tet:"Esplora",            en:"Explore" },
  wa_balao:          { pt:"Fale connosco",       tet:"Koalia ho ami",      en:"Message us" },

  /* —— LOJA: cesto / gaveta —— */
  cesto_abrir:   { pt:"Abrir o cesto", tet:"Loke karrinhu", en:"Open cart" },
  cesto_titulo:  { pt:"O seu cesto", tet:"Ita-nia karrinhu", en:"Your cart" },
  cesto_vazio:   { pt:"O seu cesto está vazio.", tet:"Ita-nia karrinhu mamuk.", en:"Your cart is empty." },
  cesto_subtotal:{ pt:"Subtotal", tet:"Subtotál", en:"Subtotal" },
  cesto_entrega: { pt:"Entrega", tet:"Entrega", en:"Delivery" },
  cesto_entrega_val: { pt:"A combinar", tet:"Atu kombina", en:"To arrange" },
  cesto_total:   { pt:"Total", tet:"Totál", en:"Total" },
  cesto_entrega_nota: { pt:"A entrega é combinada no WhatsApp.", tet:"Entrega kombina iha WhatsApp.", en:"Delivery is arranged on WhatsApp." },
  cesto_ver:     { pt:"Ver cesto & finalizar", tet:"Haree karrinhu & finaliza", en:"View cart & checkout" },
  cesto_finalizar: { pt:"Finalizar por WhatsApp", tet:"Finaliza liu WhatsApp", en:"Checkout on WhatsApp" },
  cesto_continuar: { pt:"Continuar a comprar", tet:"Kontinua sosa", en:"Continue shopping" },
  por_unidade:   { pt:"/ unidade", tet:"/ unidade", en:"/ each" },
  add_cesto:     { pt:"Adicionar ao cesto", tet:"Tau iha karrinhu", en:"Add to cart" },
  add_feito:     { pt:"Adicionado ao cesto", tet:"Tau ona iha karrinhu", en:"Added to cart" },
  remover:       { pt:"Remover", tet:"Hasai", en:"Remove" },
  fechar:        { pt:"Fechar", tet:"Taka", en:"Close" },
  pedir_orcamento:{ pt:"Pedir orçamento", tet:"Husu orsamentu", en:"Request a quote" },
  sob_consulta:  { pt:"Sob consulta", tet:"Tuir konsulta", en:"On request" },

  /* —— LOJA: coleção —— */
  lojap_titulo:  { pt:"Loja", tet:"Loja", en:"Shop" },
  lojap_sub:     { pt:"Flores frescas, ramos, hastes avulsas e serviços — tudo num só lugar.", tet:"Ai-funan fresku, ramu, haste no servisu — hotu iha fatin ida.", en:"Fresh flowers, bouquets, single stems and services — all in one place." },
  filtro_hastes: { pt:"Hastes avulsas", tet:"Haste", en:"Single stems" },
  loja_conta:    { pt:"produtos", tet:"produtu", en:"products" },
  loja_ordenar:  { pt:"Ordenar", tet:"Ordena", en:"Sort" },
  sort_destaque_l:{ pt:"Em destaque", tet:"Destake", en:"Featured" },
  sort_preco_asc:{ pt:"Preço ↑", tet:"Presu ↑", en:"Price ↑" },
  sort_preco_desc:{ pt:"Preço ↓", tet:"Presu ↓", en:"Price ↓" },
  sort_az_l:     { pt:"A–Z", tet:"A–Z", en:"A–Z" },
  ver_mais:      { pt:"Ver mais", tet:"Haree tan", en:"Load more" },
  loja_vazia:    { pt:"Sem produtos nesta categoria.", tet:"La iha produtu iha kategoria ne'e.", en:"No products in this category." },

  /* —— LOJA: produto —— */
  prodpg_qty:    { pt:"Quantidade", tet:"Kuantidade", en:"Quantity" },
  prodpg_unid_nota:{ pt:"Compre 1 haste ou a quantidade que quiser.", tet:"Sosa haste 1 ka kuantidade ne'ebé ita hakarak.", en:"Buy one stem or as many as you like." },
  prodpg_desc:   { pt:"Descrição", tet:"Deskrisaun", en:"Description" },
  prodpg_entrega:{ pt:"Entrega", tet:"Entrega", en:"Delivery" },
  prodpg_inclui: { pt:"O que inclui", tet:"Inklui saida", en:"What's included" },
  prodpg_cuidados:{ pt:"Cuidados", tet:"Kuidadu", en:"Care" },
  prodpg_rel:    { pt:"Também poderá gostar", tet:"Karik gosta mós", en:"You may also like" },
  prodpg_voltar: { pt:"Voltar à loja", tet:"Fila ba loja", en:"Back to shop" },
  /* descrições genéricas por categoria (usadas na página de produto) */
  desc_bouquet:  { pt:"Ramo de flores frescas, composto à mão pela nossa equipa. Cada peça é única — as flores podem variar conforme a disponibilidade da estação.", tet:"Ramu ai-funan fresku, halo ho liman husi ami-nia ekipa. Peça ida-idak úniku — ai-funan bele muda tuir estasaun.", en:"A hand-tied bouquet of fresh flowers. Each piece is unique — blooms may vary with seasonal availability." },
  desc_vaso:     { pt:"Arranjo floral em vaso, pronto a decorar qualquer espaço. Composição desenhada à mão com flores frescas.", tet:"Aranju floral iha vazu, prontu atu dekora fatin. Kompozisaun ho liman ho ai-funan fresku.", en:"A vase arrangement ready to grace any space, hand-designed with fresh flowers." },
  desc_hastes:   { pt:"Haste avulsa de flor fresca. Escolha a quantidade que precisa — perfeita para criar o seu próprio ramo.", tet:"Haste ai-funan fresku. Hili kuantidade — perfeitu atu kria ita-nia ramu rasik.", en:"A single fresh stem. Choose the quantity you need — perfect to build your own bouquet." },
  desc_quote:    { pt:"Serviço personalizado. Fale connosco para desenharmos a proposta à medida da sua ocasião e orçamento.", tet:"Servisu personalizadu. Koalia ho ami atu dezeña proposta tuir okaziaun.", en:"A bespoke service. Talk to us and we'll design a proposal for your occasion and budget." },
  inclui_txt:    { pt:"Flores frescas, embrulho e cartão de mensagem. Entrega em toda a Díli (combinada por WhatsApp).", tet:"Ai-funan fresku, embrulho no kartaun mensajen. Entrega iha Dili tomak (kombina liu WhatsApp).", en:"Fresh flowers, wrapping and a message card. Delivery across Dili (arranged on WhatsApp)." },
  cuidados_txt:  { pt:"Mantenha em água limpa, longe do sol direto. Corte as hastes a cada 2 dias para durarem mais.", tet:"Rai iha bee moos, dook husi loro-matan. Korta haste kada loron 2 atu tahan naruk.", en:"Keep in clean water, away from direct sun. Trim the stems every 2 days to last longer." },
  entrega_txt:   { pt:"Entregamos em toda a Díli. Combine a data e a morada connosco no WhatsApp ao finalizar.", tet:"Ami entrega iha Dili tomak. Kombina data no morada iha WhatsApp.", en:"We deliver across Dili. Confirm the date and address with us on WhatsApp at checkout." },

  /* —— CESTO (página) —— */
  cestop_titulo: { pt:"O seu cesto", tet:"Ita-nia karrinhu", en:"Your cart" },
  cestop_vazio_cta: { pt:"Explorar a loja", tet:"Esplora loja", en:"Explore the shop" },
  checkout_nome: { pt:"Nome", tet:"Naran", en:"Name" },
  checkout_data: { pt:"Data de entrega", tet:"Data entrega", en:"Delivery date" },
  checkout_morada:{ pt:"Morada de entrega", tet:"Morada entrega", en:"Delivery address" },
  checkout_nota: { pt:"Mensagem (opcional)", tet:"Mensajen (opsionál)", en:"Message (optional)" },

  /* —— RECIBO / fatura —— */
  cesto_rever:    { pt:"Rever e finalizar", tet:"Haree no finaliza", en:"Review & checkout" },
  recibo_titulo:  { pt:"Recibo de encomenda", tet:"Resibu enkomenda", en:"Order receipt" },
  recibo_produto: { pt:"Produto", tet:"Produtu", en:"Product" },
  recibo_qtd:     { pt:"Qt.", tet:"Kt.", en:"Qty" },
  recibo_unit:    { pt:"Preço", tet:"Presu", en:"Price" },
  recibo_total:   { pt:"Total", tet:"Totál", en:"Total" },
  recibo_guardar: { pt:"Guardar recibo (PDF)", tet:"Rai resibu (PDF)", en:"Save receipt (PDF)" },
  recibo_enviar:  { pt:"Enviar por WhatsApp", tet:"Haruka liu WhatsApp", en:"Send on WhatsApp" },
  recibo_dica:    { pt:"Dica: guarde o recibo em PDF e anexe-o no WhatsApp (📎).", tet:"Dika: rai resibu PDF no tau iha WhatsApp (📎).", en:"Tip: save the receipt as PDF and attach it on WhatsApp (📎)." },
  recibo_obrigada:{ pt:"Obrigada pela sua preferência 🌷", tet:"Obrigada ba ita-nia preferénsia 🌷", en:"Thank you for your order 🌷" },

  /* —— Hero (Home) —— */
  hero_eyebrow:  { pt:"Arte floral · Díli, Timor-Leste", tet:"Arte floral · Dili, Timor-Leste", en:"Floral artistry · Dili, Timor-Leste" },
  hero_titulo:   { pt:"Flores que <em>expressam</em> sentimentos", tet:"Ai-funan ne'ebé <em>hatudu</em> sentimentu", en:"Flowers that <em>express</em> feelings" },
  hero_tagline:  { pt:"momentos que ficam na memória", tet:"momentu ne'ebé hela iha memória", en:"moments that stay in memory" },
  hero_lead:     { pt:"Criamos arranjos e decorações com flores frescas para os momentos mais importantes da sua vida — com a delicadeza, o cuidado e a elegância que cada ocasião merece.",
                   tet:"Ami kria aranju no dekorasaun ho ai-funan fresku ba momentu importante sira iha ita-nia moris — ho kuidadu no elegánsia.",
                   en:"We craft arrangements and decorations with fresh flowers for life's most important moments — with the care and elegance every occasion deserves." },
  hero_nota:     { pt:"Flores frescas · Entrega em Díli", tet:"Ai-funan fresku · Entrega iha Dili", en:"Fresh flowers · Delivery in Dili" },

  /* —— Tiras de garantias —— */
  tira1_t: { pt:"Flores frescas",        tet:"Ai-funan fresku",       en:"Fresh flowers" },
  tira1_d: { pt:"Selecionadas todos os dias", tet:"Hili loron-loron", en:"Hand-picked daily" },
  tira2_t: { pt:"Feito à medida",        tet:"Halo tuir ita",       en:"Made to measure" },
  tira2_d: { pt:"Cada arranjo é único",  tet:"Aranju ida-idak úniku", en:"Every arrangement is unique" },
  tira3_t: { pt:"Entrega pontual",       tet:"Entrega iha tempu",   en:"On-time delivery" },
  tira3_d: { pt:"Em toda a Díli",        tet:"Iha Dili tomak",      en:"Across Dili" },
  tira4_t: { pt:"Atendimento próximo",   tet:"Atendimentu besik",   en:"Personal service" },
  tira4_d: { pt:"Pelo WhatsApp, sempre", tet:"Liu husi WhatsApp",   en:"Always on WhatsApp" },

  /* —— Secção: categorias na Home —— */
  cat_eyebrow: { pt:"O que fazemos",       tet:"Saida mak ami halo", en:"What we do" },
  cat_titulo:  { pt:"Flores para cada momento", tet:"Ai-funan ba momentu hotu", en:"Flowers for every moment" },
  cat_lead:    { pt:"Da celebração ao consolo, criamos a peça certa para o que sente.", tet:"Husi selebrasaun to'o konsolu, ami kria peça ne'ebé loos.", en:"From celebration to comfort, we create the right piece for what you feel." },

  cat1_t: { pt:"Ramos & Bouquets",   tet:"Ramu & Bouquet",   en:"Bouquets" },
  cat1_d: { pt:"Flores naturais para todas as ocasiões — aniversários, declarações, agradecimentos.", tet:"Ai-funan naturál ba okaziaun hotu.", en:"Fresh flowers for every occasion — birthdays, declarations, thanks." },
  cat2_t: { pt:"Casamentos",         tet:"Kazamentu",        en:"Weddings" },
  cat2_d: { pt:"Decoração floral completa para um dia inesquecível, do altar à mesa.", tet:"Dekorasaun floral kompletu ba loron espesiál.", en:"Complete floral decoration for an unforgettable day." },
  cat3_t: { pt:"Eventos & Instituições", tet:"Eventu & Instituisaun", en:"Events & Institutions" },
  cat3_d: { pt:"Conferências, cerimónias oficiais e eventos corporativos com presença marcante.", tet:"Konferénsia, serimónia ofisiál no eventu korporativu.", en:"Conferences, official ceremonies and corporate events." },
  cat4_t: { pt:"Cerimónias fúnebres", tet:"Serimónia fúnebre", en:"Funeral tributes" },
  cat4_d: { pt:"Coroas e ramos compostos com respeito e delicadeza, em qualquer momento.", tet:"Koroa no ramu ho respeitu no delikadeza.", en:"Wreaths and sprays composed with respect and care." },

  /* —— Bloco história (Home) —— */
  sobre_eyebrow: { pt:"A nossa essência",  tet:"Ami-nia esénsia",   en:"Our essence" },
  sobre_titulo:  { pt:"A arte de transformar flores em emoção", tet:"Arte atu transforma ai-funan ba emosaun", en:"The art of turning flowers into emotion" },
  sobre_p1:      { pt:"A Timorgiana nasceu em 2023, em Díli, do desejo de levar a beleza natural das flores a cada celebração e a cada gesto de afeto. Somos uma casa floral timorense que une criatividade, frescura e um atendimento verdadeiramente pessoal.",
                   tet:"Timorgiana moris iha 2023, iha Dili, husi hakarak atu lori beleza naturál husi ai-funan ba selebrasaun ida-idak no ba jestu domin nian ida-idak. Ami mak kaza floral timorense ida ne'ebé kombina kriatividade, freskura no atendimentu ne'ebé loloos pesoál.",
                   en:"Timorgiana was born in 2023 in Dili, from the desire to bring the natural beauty of flowers to every celebration and gesture of affection." },
  sobre_p2:      { pt:"Cada arranjo é pensado ao detalhe, com flores frescas e composições desenhadas em torno da sua história. Acreditamos que uma flor bem escolhida diz o que as palavras nem sempre conseguem.",
                   tet:"Aranju ida-idak ami hanoin ho detalle, ho ai-funan fresku no komposisaun ne'ebé dezeña tuir ita-boot nia istória. Ami fiar katak ai-funan ida ne'ebé hili di'ak bele hatete buat ne'ebé liafuan la sempre konsege hatete.",
                   en:"Every arrangement is designed in detail, with fresh flowers composed around your story." },

  /* —— Estatísticas (Home) —— */
  stat_fund: { pt:"Fundada em Díli", tet:"Estabelese iha Dili", en:"Founded in Dili" },
  stat_serv: { pt:"Serviços especializados", tet:"Servisu espesializadu", en:"Specialised services" },

  /* —— Citação (Home) —— */
  quote_txt: { pt:"Flores que expressam sentimentos, momentos que ficam na memória.",
               tet:"Ai-funan ne'ebé hatudu sentimentu, momentu ne'ebé hela iha memória.",
               en:"Flowers that express feelings, moments that stay in memory." },

  /* —— Valores —— */
  valores_eyebrow: { pt:"Porquê a Timorgiana", tet:"Tanba sá Timorgiana", en:"Why Timorgiana" },
  valores_titulo:  { pt:"Detalhe, frescura e cuidado em cada peça", tet:"Detalle, fresku no kuidadu", en:"Detail, freshness and care in every piece" },
  v1_t: { pt:"Qualidade e frescura", tet:"Kualidade no fresku", en:"Quality & freshness" },
  v1_d: { pt:"Selecionamos as melhores flores, garantindo durabilidade e beleza.", tet:"Ami hili ai-funan di'ak liu hotu.", en:"We select the finest flowers for lasting beauty." },
  v2_t: { pt:"Criatividade", tet:"Kriatividade", en:"Creativity" },
  v2_d: { pt:"Cada composição é desenhada com atenção ao detalhe e sentido estético.", tet:"Komposisaun ida-idak dezeñu ho atensaun.", en:"Each composition is designed with an eye for detail." },
  v3_t: { pt:"Atendimento personalizado", tet:"Atendimentu personalizadu", en:"Personal service" },
  v3_d: { pt:"Ouvimos a sua história para criar algo verdadeiramente seu.", tet:"Ami rona ita-nia istória.", en:"We listen to your story to create something truly yours." },
  v4_t: { pt:"Respeito pelo ambiente", tet:"Respeitu ba ambiente", en:"Respect for nature" },
  v4_d: { pt:"Trabalhamos com consciência ambiental em todas as etapas.", tet:"Ami servisu ho konsiénsia ambientál.", en:"We work with environmental awareness." },
  v5_t: { pt:"Pontualidade", tet:"Pontualidade", en:"Punctuality" },
  v5_d: { pt:"Cumprimos prazos com seriedade — o seu momento não espera.", tet:"Ami kumpre prazu ho seriedade.", en:"We meet deadlines — your moment won't wait." },
  v6_t: { pt:"Para todos os momentos", tet:"Ba momentu hotu", en:"For every moment" },
  v6_d: { pt:"Da alegria de uma festa ao conforto de uma despedida.", tet:"Husi festa to'o despedida.", en:"From the joy of a party to the comfort of a farewell." },

  /* —— Instagram —— */
  insta_eyebrow: { pt:"@timorgiana_flores", tet:"@timorgiana_flores", en:"@timorgiana_flores" },
  insta_titulo:  { pt:"Os nossos trabalhos recentes", tet:"Ami-nia servisu foun", en:"Our latest work" },
  insta_lead:    { pt:"Siga-nos nas redes sociais para inspiração diária e novidades.", tet:"Tuir ami iha rede sosiál ba inspirasaun loron-loron no notísia foun.", en:"Follow us on social media for daily inspiration and news." },
  insta_btn:     { pt:"Seguir no Instagram", tet:"Tuir iha Instagram", en:"Follow on Instagram" },

  /* —— CTA faixa —— */
  cta_titulo: { pt:"Vamos criar algo memorável?", tet:"Mai kria buat ne'ebé memorável?", en:"Shall we create something memorable?" },
  cta_lead:   { pt:"Conte-nos a sua ocasião. Respondemos rapidamente pelo WhatsApp e desenhamos a proposta perfeita para si.", tet:"Konta mai ami ita-boot nia okaziaun. Ami responde lalais liuhusi WhatsApp no dezeña proposta ne'ebé perfeitu ba ita-boot.", en:"Tell us about your occasion. We reply quickly on WhatsApp." },

  /* —— Página SOBRE —— */
  sobrep_titulo: { pt:"Sobre a Timorgiana", tet:"Kona-ba Timorgiana", en:"About Timorgiana" },
  sobrep_sub:    { pt:"Uma casa floral timorense dedicada à beleza, ao detalhe e à emoção.", tet:"Kaza floral timorense ida ne'ebé dedika ba beleza, detalle no emosaun.", en:"A Timorese floral house devoted to beauty, detail and emotion." },
  hist_eyebrow:  { pt:"A nossa história", tet:"Ami-nia istória", en:"Our story" },
  hist_titulo:   { pt:"Nascida do amor pelas flores", tet:"Moris husi domin ba ai-funan", en:"Born from a love of flowers" },
  hist_p1:       { pt:"Fundada a 30 de outubro de 2023, a Timorgiana é uma sociedade comercial timorense dedicada à arte floral, à venda de flores naturais e ao fornecimento de serviços especializados em arranjos e decorações com flores frescas.",
                   tet:"Estabelese iha loron 30 Outubru 2023, Timorgiana mak sosiedade komersiál timorense ida ne'ebé dedika ba arte floral, ba faan ai-funan naturál no ba fornese servisu espesializadu iha aranju no dekorasaun ho ai-funan fresku.",
                   en:"Founded on 30 October 2023, Timorgiana is a Timorese company devoted to floral artistry and fresh-flower decoration." },
  hist_p2:       { pt:"Desde então, temos vindo a afirmar-nos no mercado local pela excelência, pela criatividade e pelo compromisso com a satisfação dos nossos clientes — tanto no setor particular como institucional.",
                   tet:"Husi tempu ne'e, ami hahú sai referénsia iha merkadu lokál ho eseléensia, kriatividade no kompromisu atu satisfás ami-nia kliente sira — iha setór partikulár no mós institusionál.",
                   en:"Since then, we have established ourselves locally through excellence, creativity and commitment to our clients." },
  hist_p3:       { pt:"Com sede na Avenida Bidau Toko Baru, em Cristo Rei, Díli, levamos a delicadeza das flores naturais a celebrações, cerimónias e espaços por todo o território.",
                   tet:"Ho sede iha Avenida Bidau Toko Baru, Cristo Rei, Dili, ami lori delikadeza husi ai-funan naturál ba selebrasaun, serimónia no fatin sira iha teritóriu tomak.",
                   en:"Based on Avenida Bidau Toko Baru, Cristo Rei, Dili, we bring fresh flowers to celebrations across the territory." },

  missao_eyebrow: { pt:"O que nos move", tet:"Saida mak book ami", en:"What drives us" },
  missao_t: { pt:"Missão", tet:"Misaun", en:"Mission" },
  missao_d: { pt:"Prestar serviços florais de qualidade superior, promovendo a beleza natural das flores como forma de expressão de sentimentos, contribuindo para momentos memoráveis e ambientes harmoniosos.",
              tet:"Fornese servisu floral ho kualidade superiór, promove beleza naturál husi ai-funan nu'udar dalan atu hatudu sentimentu, no kontribui ba momentu memorável no ambiente harmoniozu.",
              en:"To provide superior floral services, promoting the natural beauty of flowers as a way to express feelings and create memorable moments." },
  visao_t: { pt:"Visão", tet:"Vizaun", en:"Vision" },
  visao_d: { pt:"Oferecer experiências únicas através da inovação, do respeito pelo ambiente e da excelência no serviço, promovendo beleza, cuidado e qualidade em cada detalhe do nosso trabalho.",
             tet:"Oferese esperiénsia úniku liuhusi inovasaun, respeitu ba meiu-ambiente no eseléensia iha servisu, promove beleza, kuidadu no kualidade iha detalle ida-idak husi ami-nia servisu.",
             en:"To offer unique experiences through innovation, respect for the environment and excellence in every detail of our work." },
  valoresp_t: { pt:"Valores", tet:"Valór", en:"Values" },

  /* —— Página PRODUTOS —— */
  prodp_titulo: { pt:"Produtos & Serviços", tet:"Produtu & Servisu", en:"Products & Services" },
  prodp_sub:    { pt:"Da flor solta ao grande evento — criamos a peça certa para cada ocasião.", tet:"Husi ai-funan ida mesak to'o eventu boot — ami kria peça ne'ebé loos ba okaziaun ida-idak.", en:"From a single stem to a grand event — the right piece for every occasion." },
  prod1_t: { pt:"Flores naturais & ramos", tet:"Ai-funan naturál & ramu", en:"Fresh flowers & bouquets" },
  prod1_d: { pt:"Bouquets e ramos de flores frescas para aniversários, declarações de amor, agradecimentos, boas-vindas e todas as ocasiões do dia a dia. Compostos à mão, com as flores da estação.",
             tet:"Bouquet no ramu ai-funan fresku ba loron-moris, deklarasaun domin, agradesimentu, simu-malu no okaziaun hotu iha loron-loron. Halo ho liman, ho ai-funan tuir estasaun.",
             en:"Hand-tied bouquets of fresh seasonal flowers for birthdays, declarations and everyday occasions." },
  prod2_t: { pt:"Casamentos", tet:"Kazamentu", en:"Weddings" },
  prod2_d: { pt:"Decoração floral completa: bouquet da noiva, arcos e altares, centros de mesa, decoração de cadeiras e espaços. Desenhamos um conceito coerente para o seu grande dia.",
             tet:"Dekorasaun floral kompletu: bouquet ba noiva, arku no altár, sentru-meza, dekorasaun kadeira no fatin. Ami dezeña konseitu ida koerente ba ita-boot nia loron boot.",
             en:"Complete wedding florals: bridal bouquet, arches, centrepieces and venue styling." },
  prod3_t: { pt:"Eventos & cerimónias oficiais", tet:"Eventu & serimónia ofisiál", en:"Events & official ceremonies" },
  prod3_d: { pt:"Decoração para conferências, cerimónias institucionais, inaugurações e festas corporativas. Criamos ambientes elegantes e temáticos, alinhados com a identidade de cada cliente.",
             tet:"Dekorasaun ba konferénsia, serimónia institusionál, inaugurasaun no festa korporativu. Ami kria ambiente elegante no temátiku, tuir identidade husi kliente ida-idak.",
             en:"Styling for conferences, institutional ceremonies and corporate events, aligned with each client's identity." },
  prod4_t: { pt:"Cerimónias fúnebres", tet:"Serimónia fúnebre", en:"Funeral tributes" },
  prod4_d: { pt:"Coroas, ramos e arranjos fúnebres compostos com respeito e delicadeza. Um tributo digno para prestar a última homenagem.",
             tet:"Koroa, ramu no aranju fúnebre ne'ebé halo ho respeitu no delikadeza. Tributu ida ho dignidade atu fó omenajen ikus.",
             en:"Wreaths and funeral arrangements composed with dignity and care." },
  prod5_t: { pt:"Decoração de espaços", tet:"Dekorasaun espasu", en:"Space styling" },
  prod5_d: { pt:"Decoração floral para festas, batizados, aniversários e celebrações privadas, pensada à medida do seu espaço e tema.",
             tet:"Dekorasaun floral ba festa, batizmu, loron-moris no selebrasaun privadu, hanoin tuir ita-boot nia fatin no tema.",
             en:"Floral styling for parties, baptisms and private celebrations, tailored to your space." },
  prod6_t: { pt:"Arranjos personalizados", tet:"Aranju personalizadu", en:"Bespoke arrangements" },
  prod6_d: { pt:"Tem uma ideia especial? Desenhamos arranjos exclusivos a partir das suas cores, flores e inspirações preferidas.",
             tet:"Iha ideia espesiál ida ka lae? Ami dezeña aranju esklusivu tuir ita-boot nia kór, ai-funan no inspirasaun ne'ebé gosta liu.",
             en:"Have a special idea? We design exclusive arrangements from your favourite colours and flowers." },
  prod_como: { pt:"Como funciona", tet:"Oinsá funsiona", en:"How it works" },
  etiqueta_popular: { pt:"Mais procurado", tet:"Gosta liu", en:"Most loved" },

  /* —— Coleção de produtos (modelo de loja) —— */
  prod_colecao_eb: { pt:"A coleção", tet:"Koleksaun", en:"The collection" },
  prod_conta:     { pt:"arranjos & serviços", tet:"aranju & servisu", en:"arrangements & services" },
  prod_ordenar:   { pt:"Ordenar", tet:"Ordena", en:"Sort" },
  sort_destaque:  { pt:"Em destaque", tet:"Destake", en:"Featured" },
  sort_nome:      { pt:"Nome (A–Z)", tet:"Naran (A–Z)", en:"Name (A–Z)" },
  preco_consulta: { pt:"Sob consulta", tet:"Tuir konsulta", en:"On request" },
  prod_ver_galeria: { pt:"Ver exemplos", tet:"Haree ezemplu", en:"See examples" },

  /* —— Página GALERIA —— */
  galp_titulo: { pt:"Portefólio", tet:"Portefóliu", en:"Portfolio" },
  galp_sub:    { pt:"Uma seleção de trabalhos realizados — casamentos, eventos e arranjos que ficaram na memória.", tet:"Seleksaun servisu sira ne'ebé halo ona — kazamentu, eventu no aranju ne'ebé hela iha memória.", en:"A selection of our work — weddings, events and arrangements to remember." },
  filtro_todos:     { pt:"Todos", tet:"Hotu", en:"All" },
  filtro_casamentos:{ pt:"Casamentos", tet:"Kazamentu", en:"Weddings" },
  filtro_vaso:      { pt:"Arranjo em vaso", tet:"Aranju iha vazu", en:"Vase arrangements" },
  filtro_bouquet:   { pt:"Bouquet", tet:"Bouquet", en:"Bouquets" },
  filtro_funebre:   { pt:"Fúnebre", tet:"Fúnebre", en:"Funeral" },
  filtro_outro:     { pt:"Outro", tet:"Seluk", en:"Other" },
  /* legendas dos itens da galeria */
  leg_vaso:    { pt:"Arranjo floral em vaso", tet:"Aranju floral iha vazu", en:"Vase arrangement" },
  leg_bouquet: { pt:"Bouquet", tet:"Bouquet", en:"Bouquet" },
  leg_funebre: { pt:"Cerimónia fúnebre", tet:"Serimónia fúnebre", en:"Funeral tribute" },
  leg_outro:   { pt:"Trabalho floral", tet:"Servisu floral", en:"Floral work" },
  galeria_vazia: { pt:"Em breve, novos trabalhos nesta categoria.", tet:"Iha tempu badak, servisu foun iha kategoria ne'e.", en:"New work in this category, coming soon." },
  lb_fechar:  { pt:"Fechar", tet:"Taka", en:"Close" },
  lb_anterior:{ pt:"Anterior", tet:"Molok", en:"Previous" },
  lb_seguinte:{ pt:"Seguinte", tet:"Tuir mai", en:"Next" },
  lb_encomendar:{ pt:"Encomendar este modelo", tet:"Enkomenda modelu ne'e", en:"Order this design" },

  /* modelo escolhido no portefólio (painel na página Encomendar) */
  sel_titulo:  { pt:"Modelo escolhido no portefólio", tet:"Modelu ne'ebé hili iha portefóliu", en:"Design chosen from the portfolio" },
  sel_remover: { pt:"Remover seleção", tet:"Hasai seleksaun", en:"Remove selection" },

  /* —— Página ENCOMENDAR —— */
  encp_titulo: { pt:"Como encomendar", tet:"Oinsá enkomenda", en:"How to order" },
  encp_sub:    { pt:"Sem carrinho nem pagamentos online — um processo simples, próximo e pessoal.", tet:"La iha karrinhu — prosesu simples no pesoál.", en:"No cart, no online payment — a simple, personal process." },
  passo1_t: { pt:"Escolha a ocasião", tet:"Hili okaziaun", en:"Choose the occasion" },
  passo1_d: { pt:"Veja os nossos produtos e serviços e identifique o tipo de arranjo que procura.", tet:"Haree produtu no servisu.", en:"Browse our products and pick the type of arrangement you need." },
  passo2_t: { pt:"Preencha o formulário", tet:"Prenche formuláriu", en:"Fill in the form" },
  passo2_d: { pt:"Diga-nos a ocasião, a data de entrega e como falar consigo. Leva menos de um minuto.", tet:"Hatete ami okaziaun no data.", en:"Tell us the occasion, delivery date and how to reach you." },
  passo3_t: { pt:"Confirmamos no WhatsApp", tet:"Konfirma iha WhatsApp", en:"We confirm on WhatsApp" },
  passo3_d: { pt:"Ao enviar, é levado para o WhatsApp com a mensagem pronta. Combinamos detalhes, orçamento e entrega.", tet:"Bainhira haruka, bá WhatsApp.", en:"On submit you're taken to WhatsApp with a ready message to finalise details." },
  passo4_t: { pt:"Recebe as suas flores", tet:"Simu ita-nia ai-funan", en:"Receive your flowers" },
  passo4_d: { pt:"Preparamos tudo com cuidado e entregamos pontualmente, em toda a Díli.", tet:"Ami prepara ho kuidadu no entrega.", en:"We prepare everything with care and deliver on time across Dili." },

  form_titulo: { pt:"Pedido de encomenda", tet:"Pedidu enkomenda", en:"Order request" },
  form_lead:   { pt:"Preencha os campos abaixo. Ao enviar, abrimos o WhatsApp com a sua mensagem pronta.", tet:"Prenche kampu sira. Bainhira haruka, abre WhatsApp.", en:"Fill in the fields below. On submit we open WhatsApp with your message ready." },
  f_nome:     { pt:"Nome", tet:"Naran", en:"Name" },
  f_nome_ph:  { pt:"O seu nome", tet:"Ita-nia naran", en:"Your name" },
  f_contacto: { pt:"Telefone / contacto", tet:"Telefone / kontaktu", en:"Phone / contact" },
  f_contacto_ph:{ pt:"+670 …", tet:"+670 …", en:"+670 …" },
  f_morada:   { pt:"Morada de entrega", tet:"Morada entrega nian", en:"Delivery address" },
  f_morada_ph:{ pt:"Ex.: Bidau, Cristo Rei, Díli", tet:"Ez.: Bidau, Cristo Rei, Díli", en:"e.g. Bidau, Cristo Rei, Dili" },
  f_servico:  { pt:"Tipo de arranjo / serviço", tet:"Tipu aranju / servisu", en:"Type of arrangement / service" },
  f_ocasiao:  { pt:"Ocasião", tet:"Okaziaun", en:"Occasion" },
  f_ocasiao_ph:{ pt:"Ex.: casamento, aniversário…", tet:"Ezemplu: kazamentu…", en:"e.g. wedding, birthday…" },
  f_data:     { pt:"Data de entrega", tet:"Data entrega", en:"Delivery date" },
  f_mensagem: { pt:"Mensagem (opcional)", tet:"Mensajen (opsionál)", en:"Message (optional)" },
  f_mensagem_ph:{ pt:"Cores preferidas, orçamento, morada de entrega…", tet:"Kór, orsamentu, morada…", en:"Preferred colours, budget, delivery address…" },
  f_selecione: { pt:"Selecione…", tet:"Hili…", en:"Select…" },
  f_enviar:    { pt:"Enviar pelo WhatsApp", tet:"Haruka liu WhatsApp", en:"Send via WhatsApp" },
  f_nota:      { pt:"Será redirecionado para o WhatsApp para confirmar a sua encomenda.", tet:"Sei redireksiona ba WhatsApp.", en:"You'll be redirected to WhatsApp to confirm your order." },
  f_erro:      { pt:"Por favor preencha o nome e o tipo de serviço.", tet:"Favór prenche naran no servisu.", en:"Please fill in your name and the service type." },

  /* opções de serviço (select) */
  opt_ramo:   { pt:"Ramo / bouquet", tet:"Ramu / bouquet", en:"Bouquet" },
  opt_vaso:   { pt:"Arranjo floral em vaso", tet:"Aranju floral iha vazu", en:"Vase arrangement" },
  opt_cas:    { pt:"Casamento", tet:"Kazamentu", en:"Wedding" },
  opt_evento: { pt:"Evento / cerimónia oficial", tet:"Eventu / serimónia", en:"Event / ceremony" },
  opt_fun:    { pt:"Coroa / arranjo fúnebre", tet:"Koroa fúnebre", en:"Funeral tribute" },
  opt_espaco: { pt:"Decoração de espaço / festa", tet:"Dekorasaun espasu", en:"Space / party styling" },
  opt_outro:  { pt:"Outro / personalizado", tet:"Seluk / personalizadu", en:"Other / bespoke" },

  /* —— Página CONTACTOS —— */
  contp_titulo: { pt:"Contactos", tet:"Kontaktu", en:"Contact" },
  contp_sub:    { pt:"Estamos a um WhatsApp de distância. Diga-nos como podemos ajudar.", tet:"Ami iha WhatsApp deit. Hatete ami.", en:"We're just a WhatsApp away. Tell us how we can help." },
  cont_intro_eb:{ pt:"Fale connosco", tet:"Koalia ho ami", en:"Get in touch" },
  cont_intro_t: { pt:"Estamos aqui para si", tet:"Ami iha ne'e ba ita", en:"We're here for you" },
  c_morada:   { pt:"Morada", tet:"Morada", en:"Address" },
  c_telefone: { pt:"Telefone", tet:"Telefone", en:"Phone" },
  c_email:    { pt:"Email", tet:"Email", en:"Email" },
  c_redes:    { pt:"Redes sociais", tet:"Rede sosiál", en:"Social media" },
  c_horario:  { pt:"Atendimento", tet:"Atendimentu", en:"Hours" },
  c_horario_v:{ pt:"Segunda a Sábado · resposta rápida pelo WhatsApp", tet:"Segunda–Sábadu · resposta lalais", en:"Mon–Sat · quick reply on WhatsApp" },
  c_mapa:     { pt:"Onde estamos", tet:"Iha ne'ebé ami", en:"Find us" },

  /* —— Rodapé —— */
  rod_sobre:   { pt:"Casa floral timorense dedicada à arte das flores naturais. Flores que expressam sentimentos, momentos que ficam na memória.", tet:"Kaza floral timorense.", en:"A Timorese floral house devoted to the art of fresh flowers." },
  rod_navegar: { pt:"Navegar", tet:"Navega", en:"Explore" },
  rod_servicos:{ pt:"Serviços", tet:"Servisu", en:"Services" },
  rod_contacto:{ pt:"Contacto", tet:"Kontaktu", en:"Contact" },
  rod_direitos:{ pt:"Todos os direitos reservados.", tet:"Direitu hotu rezervadu.", en:"All rights reserved." },
  rod_feito:   { pt:"Feito com", tet:"Halo ho", en:"Made with" },
  rod_em:      { pt:"em Díli", tet:"iha Dili", en:"in Dili" }
};

/* ----- Motor de tradução ----------------------------------------------- */
App.idioma = (function () {
  try { var g = localStorage.getItem("tg_idioma"); if (App.IDIOMAS.indexOf(g) >= 0) return g; } catch (e) {}
  return App.IDIOMA_PADRAO;
})();

App.t = function (chave) {
  var e = App.T[chave];
  if (!e) return "";
  return (e[App.idioma] != null ? e[App.idioma] : e[App.IDIOMA_PADRAO]) || "";
};

App.aplicarIdioma = function () {
  document.documentElement.setAttribute("lang", App.idioma);

  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    el.textContent = App.t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
    el.innerHTML = App.t(el.getAttribute("data-i18n-html"));
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
    el.setAttribute("placeholder", App.t(el.getAttribute("data-i18n-ph")));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
    el.setAttribute("aria-label", App.t(el.getAttribute("data-i18n-aria")));
  });

  document.querySelectorAll(".idiomas__btn").forEach(function (b) {
    b.classList.toggle("ativo", b.getAttribute("data-idioma") === App.idioma);
  });
};

App.mudarIdioma = function (lang) {
  if (App.IDIOMAS.indexOf(lang) < 0) return;
  App.idioma = lang;
  try { localStorage.setItem("tg_idioma", lang); } catch (e) {}
  App.aplicarIdioma();
};
