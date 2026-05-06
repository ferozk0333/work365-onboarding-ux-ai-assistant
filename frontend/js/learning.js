/* ── MOCK DATA ─────────────────────────────────────────────────────────────── */
const LM_MODULE = {
  mono:     'Learning Module',
  title:    'Subscription Config',
  desc:     'Configure subscription data sync, system training, reconciliation, and billing execution.',
  progress: 20,
  lessons: [
    { id: 'data_sync',       name: 'Data Synchronization',    status: 'in_progress' },
    { id: 'training',        name: 'Training & System Config', status: 'not_started' },
    { id: 'reconciliation',  name: 'Reconciliation',           status: 'not_started' },
    { id: 'validation',      name: 'Data Validation',          status: 'not_started' },
    { id: 'billing_exec',    name: 'Billing Execution',        status: 'not_started' },
  ],
};

const LM_CONTENT = {
  data_sync: {
    name:       'Data Synchronization',
    tx1:        'Work 365 efficiently synchronizes subscriber license data across all integrated Microsoft systems. This synchronization process happens on a scheduled basis, ensuring that every platform involved is consistently up-to-date. By maintaining this regular update cycle, Work 365 helps guarantee that all systems function seamlessly together, minimizing errors and improving overall operational efficiency for users managing licenses across multiple Microsoft environments.',
    tx2:        'In addition to its core functionality, Work 365 offers advanced reporting features that allow administrators to track license usage and compliance effortlessly. These insights empower organizations to make informed decisions about their licensing needs, optimizing costs and ensuring appropriate license allocation.',
    tip:        'Sync intervals adjust in real time based on license tier — active AI query tracking optimises the cadence.',
    nextLesson: 'training',
  },
  training: {
    name:       'Training & System Config',
    tx1:        'System configuration in Work 365 establishes the rules that govern how your billing engine operates. This includes setting up billing frequencies, configuring tax codes, defining currency rules, and establishing the anchor dates that determine when invoices generate each month.',
    tx2:        'Proper training ensures your team knows how to navigate the platform, interpret reconciliation reports, and respond to common scenarios like mid-cycle upgrades or customer cancellations. Work 365 provides guided workflows for each of these actions.',
    tip:        'The billing anchor date is one of the most impactful settings — get it right early to avoid downstream issues.',
    nextLesson: 'reconciliation',
  },
  reconciliation: {
    name:       'Reconciliation',
    tx1:        'Reconciliation is the process of comparing your expected license counts against what Microsoft Partner Center reports. Work 365 automates this comparison and surfaces any discrepancies in the Reconciliation Dashboard before invoices are generated.',
    tx2:        'Running reconciliation before each billing cycle ensures your invoices are accurate. Discrepancies caught at this stage are far easier to resolve than corrections after invoices have been sent to customers.',
    tip:        'Run reconciliation at least 48 hours before your billing cycle closes to give your team time to resolve discrepancies.',
    nextLesson: 'validation',
  },
  validation: {
    name:       'Data Validation',
    tx1:        'Data validation ensures that all customer records, subscription data, and billing configurations meet the requirements for accurate invoice generation. Work 365 flags records that have missing or inconsistent data before they cause billing errors.',
    tx2:        'Common validation issues include customers without a billing contact, subscriptions with missing SKU mappings, and accounts where the currency doesn\'t match the contract. These are surfaced as warnings in the Validation Report.',
    tip:        'Address validation warnings as soon as they appear — they become harder to untangle once invoices have been sent.',
    nextLesson: 'billing_exec',
  },
  billing_exec: {
    name:       'Billing Execution',
    tx1:        'Billing execution is the final step in the monthly cycle. Once reconciliation and validation are complete and approved, Work 365 generates finalized invoices and queues them for delivery through your configured distribution channel.',
    tx2:        'After execution, invoices are locked and can no longer be edited. Any adjustments must be made through credit notes. Work 365 maintains a full audit trail of every billing run in the Billing Ledger.',
    tip:        'Double-check your distribution channel settings before your first billing run — this determines where invoices are delivered.',
    nextLesson: null,
  },
};

let activeLessonId = 'data_sync';


/* ── INIT ──────────────────────────────────────────────────────────────────── */
function initLearning() {
  const el = document.getElementById('page-learning');
  el.innerHTML = `<div class="page-inner">${renderLearningShell()}</div>`;
  selectLesson('data_sync');
}


/* ── SHELL ─────────────────────────────────────────────────────────────────── */
function renderLearningShell() {
  const lessonItems = LM_MODULE.lessons.map(l => {
    const badgeCls = l.status === 'in_progress' ? 'badge-progress'
                   : l.status === 'completed'   ? 'badge-done'
                   :                              'badge-not';
    const badgeTxt = l.status === 'in_progress' ? 'In Progress'
                   : l.status === 'completed'   ? 'Done'
                   :                              'Not Started';
    return `
      <div class="lm-lesson" id="lesson-item-${l.id}" onclick="selectLesson('${l.id}')">
        <span class="badge ${badgeCls}">${badgeTxt}</span>
        <span class="lm-lesson-name">${l.name}</span>
      </div>`;
  }).join('');

  return `
    <div class="lm-grid">
      <div class="lm-panel">
        <div class="lm-mod-mono">${LM_MODULE.mono}</div>
        <div class="lm-mod-title">${LM_MODULE.title}</div>
        <div class="lm-mod-desc">${LM_MODULE.desc}</div>
        <div class="lm-prog-row">
          <span class="lm-prog-mono">Progress</span>
          <span class="lm-prog-mono">${LM_MODULE.progress}%</span>
        </div>
        <div class="lm-prog-bar">
          <div class="lm-prog-fill" style="width:${LM_MODULE.progress}%"></div>
        </div>
        <div class="lm-lessons-title">Lessons</div>
        ${lessonItems}
      </div>
      <div class="lm-content" id="lm-content"></div>
    </div>`;
}


/* ── LESSON VIEW ───────────────────────────────────────────────────────────── */
function selectLesson(id) {
  activeLessonId = id;
  document.querySelectorAll('.lm-lesson').forEach(el => el.classList.remove('lm-active'));
  document.getElementById(`lesson-item-${id}`)?.classList.add('lm-active');

  const lesson    = LM_CONTENT[id];
  if (!lesson) return;

  const explainMsg = `Can you explain "${lesson.name}" in simple terms for someone new to Work 365?`;
  const nextBtn    = lesson.nextLesson
    ? `<button class="btn-next" onclick="selectLesson('${lesson.nextLesson}')">Next Lesson →</button>`
    : `<button class="btn-next" style="background:var(--done-text);cursor:default" disabled>Module Complete ✓</button>`;

  document.getElementById('lm-content').innerHTML = `
    <div class="lm-vid-title">${lesson.name}</div>
    <div class="lm-video">${LM_VIDEO_SVG}<div class="lm-play">▶</div></div>
    <div class="lm-tx-mono">Transcript</div>
    <div class="lm-tx">${lesson.tx1}</div>
    <div class="lm-tx">${lesson.tx2}</div>
    <div class="lm-tip">${lesson.tip}</div>
    <button class="btn-explain" style="margin-bottom:var(--sp-4)" onclick="openAI(${JSON.stringify(explainMsg)})">Ask AI to explain →</button>
    ${nextBtn}
    <div style="clear:both"></div>`;
}


/* ── VIDEO PLACEHOLDER SVG ─────────────────────────────────────────────────── */
const LM_VIDEO_SVG = `
  <svg viewBox="0 0 560 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0">
    <rect width="560" height="240" fill="#dce8f5"/>
    <rect x="175" y="18" width="150" height="30" rx="4" fill="#75A2D1"/>
    <text x="250" y="37" text-anchor="middle" font-size="11" fill="#fff" font-family="sans-serif" font-weight="600">Partner Centre Sync</text>
    <rect x="345" y="10" width="130" height="54" rx="4" fill="#f0f4fa" stroke="#c5d5e8" stroke-width="0.8"/>
    <text x="410" y="28" text-anchor="middle" font-size="9" fill="#555" font-family="sans-serif">Invoice</text>
    <text x="410" y="42" text-anchor="middle" font-size="8" fill="#888" font-family="sans-serif">Qty · Price · Amt</text>
    <rect x="345" y="68" width="130" height="22" rx="3" fill="#75A2D1" opacity="0.75"/>
    <text x="410" y="83" text-anchor="middle" font-size="9" fill="#fff" font-family="sans-serif">License Added</text>
    <rect x="50"  y="72" width="110" height="38" rx="4" fill="#e8f1fb" stroke="#75A2D1" stroke-width="0.8"/>
    <text x="105" y="94" text-anchor="middle" font-size="10" fill="#1a4a8a" font-family="sans-serif">Subscriptions</text>
    <rect x="185" y="72" width="90"  height="38" rx="4" fill="#e8f1fb" stroke="#75A2D1" stroke-width="0.8"/>
    <text x="230" y="94" text-anchor="middle" font-size="10" fill="#1a4a8a" font-family="sans-serif">Invoices</text>
    <line x1="160" y1="91" x2="185" y2="91" stroke="#75A2D1" stroke-width="1.2"/>
    <circle cx="105" cy="162" r="34" fill="#ddeaf7" stroke="#75A2D1" stroke-width="0.8"/>
    <text x="105" y="157" text-anchor="middle" font-size="9" fill="#1a4a8a" font-family="sans-serif">Acme Inc.</text>
    <text x="105" y="172" text-anchor="middle" font-size="8" fill="#75A2D1" font-family="sans-serif">Customer</text>
    <rect x="210" y="140" width="76" height="40" rx="4" fill="#f5f0fb" stroke="#c5b8f0" stroke-width="0.8"/>
    <text x="248" y="164" text-anchor="middle" font-size="14" fill="#6a4ac4" font-family="sans-serif">%</text>
    <rect x="300" y="140" width="60" height="40" rx="4" fill="#eaf6f0" stroke="#a8d8be" stroke-width="0.8"/>
    <text x="330" y="162" text-anchor="middle" font-size="12" fill="#0f6e56" font-family="sans-serif">$</text>
    <rect x="390" y="140" width="90" height="40" rx="4" fill="#f8f4e8" stroke="#d4c48a" stroke-width="0.8"/>
    <text x="435" y="157" text-anchor="middle" font-size="9" fill="#7a6020" font-family="sans-serif">Self-Service</text>
    <text x="435" y="172" text-anchor="middle" font-size="9" fill="#7a6020" font-family="sans-serif">Portal</text>
    <rect x="0"   y="232" width="180" height="4" rx="2" fill="#d3e4fe"/>
    <rect x="0"   y="232" width="70"  height="4" rx="2" fill="#75A2D1"/>
  </svg>`;
