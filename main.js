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
