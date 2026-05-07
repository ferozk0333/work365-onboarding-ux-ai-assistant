/* ── CONFIG ────────────────────────────────────────────────────────────────── */
const API_BASE = '';

/* ── SESSION ───────────────────────────────────────────────────────────────── */
const sessionId = (() => {
  let id = sessionStorage.getItem('w365_session');
  if (!id) {
    id = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    sessionStorage.setItem('w365_session', id);
  }
  return id;
})();

/* Current onboarding stage — injected into every /chat request */
let currentStage = 'stage_3_subscription_config';
let currentPage  = 'overview';


/* ── NAVIGATION ────────────────────────────────────────────────────────────── */
function navigate(page, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page)?.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) {
    el.classList.add('active');
  } else {
    document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
  }

  currentPage = page;
  updateDYK(page);

  if (typeof updateChips === 'function') updateChips(page);
  if (page === 'messages'       && typeof initMessages   === 'function') initMessages();
  if (page === 'documentation'  && typeof initDocs       === 'function') initDocs();
  if (page === 'learning'       && typeof initLearning   === 'function') initLearning();
}


/* ── LEFT NAV COLLAPSE ─────────────────────────────────────────────────────── */
function toggleNav() {
  const nav = document.getElementById('left-nav');
  const btn = document.getElementById('nav-collapse-btn');
  const collapsed = nav.classList.toggle('collapsed');
  btn.textContent = collapsed ? '→ Expand' : '← Collapse';
}


/* ── DID YOU KNOW ──────────────────────────────────────────────────────────── */
const DYK_TIPS = {
  overview:      'Work 365 auto-syncs license changes from Microsoft Partner Center so billing always stays up to date.',
  messages:      'You can message the implementation team directly. Responses typically arrive within one business day.',
  documentation: 'Try typing a term into the search bar — the knowledge base is fully searchable.',
  learning:      'Learning modules are replayable at any time. Revisit any lesson after you\'ve completed it.',
  settings:      'Changes to your account settings take effect immediately across all Work 365 services.',
};

const DYK_EXPLAIN = {
  overview:      'Can you explain how Work 365 auto-syncs license changes from Microsoft Partner Center?',
  messages:      'What is the best way to write a message to the implementation team?',
  documentation: 'How should I use the Work 365 knowledge base during onboarding?',
  learning:      'What are the learning modules and when should I complete them?',
  settings:      'What account settings should I configure first?',
};

function updateDYK(page) {
  const textEl    = document.getElementById('dyk-text');
  const explainBtn = document.getElementById('dyk-explain-btn');
  if (textEl)     textEl.textContent = DYK_TIPS[page] || DYK_TIPS.overview;
  if (explainBtn) explainBtn.onclick = () => openAI(DYK_EXPLAIN[page] || DYK_EXPLAIN.overview);
}


/* ── API CLIENT ────────────────────────────────────────────────────────────── */
async function apiPost(path, body) {
  const res = await fetch(API_BASE + path, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}


/* ── INIT ──────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof initAssistant === 'function') initAssistant();
  if (typeof initProgress  === 'function') initProgress();
  if (typeof initHighlight === 'function') initHighlight();

  /* Activate default page */
  navigate('overview', document.querySelector('[data-page="overview"]'));
});
