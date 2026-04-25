/* ═══════════════════════════════════════════════════════════
   SANCOSTA ENGENHARIA — main.js
   ═══════════════════════════════════════════════════════════ */

/* ── 1. LUCIDE ICONS ─────────────────────────────────────── */
lucide.createIcons();

/* ── 2. THEME TOGGLE ─────────────────────────────────────── */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const iconSun     = document.getElementById('iconSun');
const iconMoon    = document.getElementById('iconMoon');

function setTheme(t) {
  html.setAttribute('data-theme', t);
  localStorage.setItem('sc-theme', t);
  iconSun.style.display  = t === 'dark' ? 'none'  : 'block';
  iconMoon.style.display = t === 'dark' ? 'block' : 'none';
}

// Detecta preferência salva ou do sistema
const savedTheme    = localStorage.getItem('sc-theme');
const systemTheme   = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
setTheme(savedTheme || systemTheme);

themeToggle.addEventListener('click', () => {
  setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ── 3. AIRFLOW BACKGROUND ───────────────────────────────── */
(function buildStreams() {
  const airBox = document.getElementById('airBox');
  const count  = window.innerWidth < 640 ? 8 : 16;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'stream';
    el.style.setProperty('--y', (Math.random() * 100) + 'vh');
    el.style.top             = (Math.random() * 100) + 'vh';
    el.style.width           = (140 + Math.random() * 220) + 'px';
    el.style.animationDelay    = (Math.random() * 12) + 's';
    el.style.animationDuration = (10 + Math.random() * 8) + 's';
    airBox.appendChild(el);
  }
})();

/* ── 4. SCROLL REVEAL ────────────────────────────────────── */
(function initReveal() {
  const reveals  = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.12 }
  );
  reveals.forEach(el => observer.observe(el));
})();

/* ── 5. SCROLL SPY (mobile nav) ──────────────────────────── */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = 'home';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    navItems.forEach(n => {
      n.classList.toggle('active', n.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
})();

/* ── 6. CALCULADORA BTU ──────────────────────────────────── */
function calcBTU() {
  const sqm  = parseFloat(document.getElementById('sqm').value)  || 0;
  const ppl  = parseFloat(document.getElementById('ppl').value)  || 0;
  const type = parseFloat(document.getElementById('type').value) || 600;
  const sun  = parseFloat(document.getElementById('sun').value)  || 1.2;

  if (!sqm) { resetCalc(); return; }

  const btu = Math.round(((sqm * type) + (ppl * 600)) * sun);
  const tr  = btu / 12000;

  document.getElementById('btu-result').textContent =
    btu.toLocaleString('pt-BR') + ' BTU/h';
  document.getElementById('tr-result').textContent =
    tr.toFixed(2) + ' TR (Toneladas de Refrigeração)';
}

function resetCalc() {
  document.getElementById('btu-result').textContent = '— BTU/h';
  document.getElementById('tr-result').textContent  = 'Preencha os dados acima';
}

// Expõe ao HTML (chamados via oninput/onchange inline)
window.calcBTU = calcBTU;

/* ── 7. ENVIO WHATSAPP (calculadora) ─────────────────────── */
function sendWA(e) {
  e.preventDefault();

  const btu  = document.getElementById('btu-result').textContent;
  const sqm  = document.getElementById('sqm').value  || 'não informado';
  const ppl  = document.getElementById('ppl').value  || 'não informado';
  const sel  = document.getElementById('type');
  const type = sel.options[sel.selectedIndex].text;

  const msg = encodeURIComponent(
    `*RELATÓRIO TÉCNICO — SANCOSTA*\n\n` +
    `Olá Guilherme! Realizei uma simulação no site:\n\n` +
    `• Área: ${sqm} m²\n` +
    `• Pessoas: ${ppl}\n` +
    `• Ambiente: ${type}\n` +
    `• Estimativa: ${btu}\n\n` +
    `Gostaria de agendar o diagnóstico gratuito para minha operação.`
  );

  window.open(`https://wa.me/5511940629488?text=${msg}`, '_blank');
  if (navigator.vibrate) navigator.vibrate(15);
}

window.sendWA = sendWA;

/* ═══════════════════════════════════════════════════════════
   CARROSSEL DE SISTEMAS — Dados + Lógica v2
   ═══════════════════════════════════════════════════════════ */

/* Imagens dos cards — sincronizadas com o HTML */
const CARD_IMAGES = [
  'src/arcondition_Edit_1_11zon.jpg',
  'src/Cassete-K7_2_11zon.jpeg',
  'src/Piso-teto_watermark_removed_5_11zon.jpg',
  'src/VRF_watermark_removed_6_11zon.jpg',
  'src/Chiller_watermark_removed_4_11zon.jpg',
];

const PRODUTOS = [
  {
    nome:     'Ar-condicionado Split',
    badge:    'Residencial / Comercial',
    sub:      'O mais popular do mercado',
    icon:     'wind',
    desc:     'O ar-condicionado Split é uma das opções mais utilizadas em residências, escritórios e pequenos comércios. Ele oferece climatização eficiente, baixo nível de ruído e ótimo custo-benefício. Seu sistema é composto por uma unidade interna e outra externa, garantindo conforto térmico com instalação prática e visual discreto.',
    features: [
      { icon: 'volume-x',  label: 'Baixo ruído' },
      { icon: 'zap',       label: 'Alta eficiência' },
      { icon: 'wrench',    label: 'Inst. simples' },
      { icon: 'home',      label: 'Ideal p/ residências' },
    ],
    waMsg: 'Olá Guilherme! Tenho interesse em Ar-condicionado Split. Pode me passar mais informações e um orçamento?'
  },
  {
    nome:     'Ar-condicionado Cassete / K7',
    badge:    'Corporativo',
    sub:      'Climatização uniforme 360°',
    icon:     'layout-grid',
    desc:     'O ar-condicionado Cassete, também conhecido como K7, é ideal para ambientes comerciais e corporativos que precisam de climatização uniforme e discreta. Instalado no teto, ele distribui o ar em até quatro direções, proporcionando conforto em todo o ambiente. Seu design embutido mantém a estética do espaço limpa e moderna.',
    features: [
      { icon: 'move-up-right', label: '4 direções de ar' },
      { icon: 'eye-off',       label: 'Design discreto' },
      { icon: 'building',      label: 'Corporativo' },
      { icon: 'check-circle',  label: 'Alta uniformidade' },
    ],
    waMsg: 'Olá Guilherme! Tenho interesse em Ar-condicionado Cassete/K7. Pode me passar mais informações e um orçamento?'
  },
  {
    nome:     'Ar-condicionado Piso Teto',
    badge:    'Amplos / Lojas',
    sub:      'Versatilidade de instalação',
    icon:     'arrow-up-down',
    desc:     'O ar-condicionado Piso Teto é indicado para ambientes amplos que exigem alta capacidade de climatização. Versátil, pode ser instalado tanto no piso quanto no teto, adaptando-se facilmente ao projeto do local. É uma excelente escolha para lojas, salões, restaurantes e espaços comerciais que precisam de desempenho e eficiência.',
    features: [
      { icon: 'arrow-up-down', label: 'Piso ou teto' },
      { icon: 'maximize',      label: 'Alta capacidade' },
      { icon: 'utensils',      label: 'Restaurantes' },
      { icon: 'shopping-bag',  label: 'Lojas / Salões' },
    ],
    waMsg: 'Olá Guilherme! Tenho interesse em Ar-condicionado Piso Teto. Pode me passar mais informações e um orçamento?'
  },
  {
    nome:     'Ar-condicionado VRF',
    badge:    'Médio / Grande Porte',
    sub:      'Fluxo de Refrigerante Variável',
    icon:     'git-branch',
    desc:     'O sistema VRF (Fluxo de Refrigerante Variável) é uma solução moderna e inteligente para climatização de médio e grande porte. Ele permite controlar diferentes ambientes de forma individual, com alta eficiência energética e excelente desempenho. É ideal para edifícios comerciais, hotéis, clínicas e projetos que exigem conforto, economia e automação.',
    features: [
      { icon: 'sliders',      label: 'Controle por zona' },
      { icon: 'zap',          label: 'Alta eficiência' },
      { icon: 'cpu',          label: 'Automação' },
      { icon: 'building-2',   label: 'Hotéis / Clínicas' },
    ],
    waMsg: 'Olá Guilherme! Tenho interesse no sistema VRF. Pode me passar mais informações e um orçamento?'
  },
  {
    nome:     'Chiller',
    badge:    'Industrial / Hospitalar',
    sub:      'Climatização central de grande escala',
    icon:     'cpu',
    desc:     'O sistema Chiller é indicado para grandes projetos que demandam climatização central de alta performance. Muito utilizado em indústrias, hospitais, shopping centers e edifícios corporativos, ele resfria a água para distribuir climatização de forma eficiente em grandes áreas. É uma solução robusta, econômica e ideal para operações de grande escala.',
    features: [
      { icon: 'droplets',     label: 'Resfriamento a água' },
      { icon: 'factory',      label: 'Industrial' },
      { icon: 'heart-pulse',  label: 'Hospitalar' },
      { icon: 'shield-check', label: 'Alta robustez' },
    ],
    waMsg: 'Olá Guilherme! Tenho interesse no sistema Chiller. Pode me passar mais informações e um orçamento?'
  }
];

(function initCarousel() {
  const track    = document.getElementById('carouselTrack');
  const viewport = document.getElementById('carouselViewport');
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const progBar  = document.getElementById('progressBar');

  if (!track) return;

  const cards  = Array.from(track.querySelectorAll('.prod-card'));
  const total  = cards.length;

  /* ── Estado ──────────────────────────────────────────────── */
  let current     = 0;
  let offsetX     = 0;        // translateX aplicado ao track
  let autoId      = null;
  let progId      = null;
  let progVal     = 0;
  let pointerDown = false;
  let startX      = 0;
  let startOffset = 0;
  let moved       = false;    // distingue clique de drag
  let paused      = false;

  const INTERVAL  = 4500;
  const THRESHOLD = 48;       // px mínimo para considerar swipe

  /* ── Helpers ─────────────────────────────────────────────── */
  function cardWidth() { return cards[0].offsetWidth + 20; /* gap: 20px */ }

  function clampedOffset(raw) {
    const min = -(total - 1) * cardWidth();
    const max = 0;
    return Math.max(min, Math.min(max, raw));
  }

  function snapIndex(raw) {
    // Index mais próximo dado o offset
    const idx = Math.round(-raw / cardWidth());
    return Math.max(0, Math.min(total - 1, idx));
  }

  function applyOffset(x, animated) {
    track.style.transition = animated
      ? 'transform 0.52s cubic-bezier(0.25, 1, 0.35, 1)'
      : 'none';
    track.style.transform  = `translateX(${x}px)`;
    offsetX = x;
  }

  /* ── Dots ────────────────────────────────────────────────── */
  cards.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Produto ${i + 1}`);
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });

  function updateDots(idx) {
    dotsWrap.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === idx));
    cards.forEach((c, i) => c.classList.toggle('active-card', i === idx));
  }

  /* ── goTo ────────────────────────────────────────────────── */
  function goTo(idx, animate = true) {
    current = Math.max(0, Math.min(total - 1, idx));
    applyOffset(-current * cardWidth(), animate);
    updateDots(current);
    startProgress();
    scheduleNext();
  }

  /* ── Autoplay ────────────────────────────────────────────── */
  function scheduleNext() {
    clearTimeout(autoId);
    if (!paused) autoId = setTimeout(() => goTo((current + 1) % total), INTERVAL);
  }

  function pauseAuto()  { paused = true;  clearTimeout(autoId); clearInterval(progId); }
  function resumeAuto() { paused = false; scheduleNext(); startProgress(); }

  /* ── Progress bar ────────────────────────────────────────── */
  function startProgress() {
    clearInterval(progId);
    progVal = 0;
    progBar.style.transition = 'none';
    progBar.style.width = '0%';
    if (paused) return;
    const step = 100 / (INTERVAL / 80);
    progId = setInterval(() => {
      progVal = Math.min(progVal + step, 100);
      progBar.style.transition = 'width 0.08s linear';
      progBar.style.width = progVal + '%';
      if (progVal >= 100) clearInterval(progId);
    }, 80);
  }

  /* ── Pointer events (mouse + touch) ─────────────────────── */
  function onPointerDown(e) {
    if (e.button && e.button !== 0) return; // só botão esquerdo
    pointerDown = true;
    moved       = false;
    startX      = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    startOffset = offsetX;
    applyOffset(offsetX, false); // trava transição
    pauseAuto();
  }

  function onPointerMove(e) {
    if (!pointerDown) return;
    const x     = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const delta = x - startX;
    if (Math.abs(delta) > 4) moved = true;
    // Resistência nas bordas
    let target = startOffset + delta;
    const min  = -(total - 1) * cardWidth();
    if (target > 0)   target = target * 0.25;
    if (target < min) target = min + (target - min) * 0.25;
    applyOffset(target, false);
  }

  function onPointerUp(e) {
    if (!pointerDown) return;
    pointerDown = false;
    const x     = e.type === 'touchend'
      ? (e.changedTouches[0]?.clientX ?? startX)
      : e.clientX;
    const delta = x - startX;

    if (!moved) {
      // Era clique real — não faz nada aqui (card click cuida)
      goTo(current); // restaura posição
      resumeAuto();
      return;
    }

    if (Math.abs(delta) >= THRESHOLD) {
      goTo(delta < 0 ? current + 1 : current - 1);
    } else {
      goTo(current); // snap de volta
    }
    resumeAuto();
  }

  /* Previne scroll vertical enquanto arrasta horizontalmente */
  viewport.addEventListener('touchstart', onPointerDown, { passive: true });
  viewport.addEventListener('touchmove', (e) => {
    if (!pointerDown) return;
    onPointerMove(e);
  }, { passive: true });
  viewport.addEventListener('touchend',   onPointerUp,   { passive: true });

  viewport.addEventListener('mousedown',  onPointerDown);
  window.addEventListener('mousemove',   onPointerMove);
  window.addEventListener('mouseup',     onPointerUp);

  /* Pausa no hover (apenas desktop) */
  viewport.addEventListener('mouseenter', () => { if (!pointerDown) pauseAuto(); });
  viewport.addEventListener('mouseleave', () => { if (!pointerDown) resumeAuto(); });

  /* ── Botões prev / next ──────────────────────────────────── */
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  /* ── Clique no card → modal ──────────────────────────────── */
  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (moved) return; // foi drag
      openModal(parseInt(card.dataset.produto));
    });
  });

  /* ── Recalcula ao redimensionar ──────────────────────────── */
  window.addEventListener('resize', () => {
    applyOffset(-current * cardWidth(), false);
  });

  /* ── Init ────────────────────────────────────────────────── */
  setTimeout(() => goTo(0, false), 100);

  /* ═══════════════════════════════════════════════════════════
     MODAL
     ═══════════════════════════════════════════════════════════ */
  const overlay   = document.getElementById('prodModal');
  const closeBtn  = document.getElementById('modalClose');
  const closeBtnB = document.getElementById('modalCloseBtn');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');
  const modalImg  = document.getElementById('modalImg');
  let modalIdx    = 0;

  function openModal(idx) {
    modalIdx = idx;
    renderModal(idx);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    pauseAuto();
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    resumeAuto();
  }

  function renderModal(idx) {
    const p = PRODUTOS[idx];

    /* Imagem — lê o src diretamente do <img> do card no carrossel */
    const cardImg  = cards[idx] && cards[idx].querySelector('img');
    const modalImg = document.getElementById('modalImg');
    modalImg.src   = cardImg ? cardImg.src : (CARD_IMAGES[idx] || '');
    modalImg.alt   = p.nome;

    /* Ícone decorativo no canto */
    const iconEl = document.getElementById('modalIcon');
    iconEl.setAttribute('data-lucide', p.icon);

    /* Textos */
    document.getElementById('modalBadge').textContent   = p.badge;
    document.getElementById('modalSub').textContent     = p.sub;
    document.getElementById('modalTitle').textContent   = p.nome;
    document.getElementById('modalDesc').textContent    = p.desc;
    document.getElementById('modalNavInfo').textContent = `${idx + 1} de ${total}`;

    /* Features */
    document.getElementById('modalFeatures').innerHTML = p.features.map(f => `
      <div class="modal-feat-item">
        <i data-lucide="${f.icon}" style="width:14px;height:14px"></i>
        <span>${f.label}</span>
      </div>
    `).join('');

    /* WA link */
    const waLink = document.getElementById('modalWaLink');
    waLink.href = `https://wa.me/5511940629488?text=${encodeURIComponent(p.waMsg)}`;

    /* Re-render icons */
    lucide.createIcons();
  }

  closeBtn.addEventListener('click',  closeModal);
  closeBtnB.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  modalPrev.addEventListener('click', () => { modalIdx = (modalIdx - 1 + total) % total; renderModal(modalIdx); });
  modalNext.addEventListener('click', () => { modalIdx = (modalIdx + 1) % total; renderModal(modalIdx); });

  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape')      closeModal();
    if (e.key === 'ArrowLeft')   modalPrev.click();
    if (e.key === 'ArrowRight')  modalNext.click();
  });

  window._carousel = { goTo, openModal, closeModal };
})();
