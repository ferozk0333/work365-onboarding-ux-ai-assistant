/* ── MOCK DATA ─────────────────────────────────────────────────────────────── */
const PROGRESS = {
  user:             'Alexander',
  company:          'Company Inc.',
  completion:       65,
  totalStages:      6,
  currentStageNum:  3,
  currentStageName: 'Subscription Config',
  estWeeks:         4,
  kickoffDate:      'Fri, May 15th 5:00PM',

  completedStages: [
    { name: 'Account Setup', date: 'Completed Jan 12' },
    { name: 'Data Import',   date: 'Completed Jan 15' },
  ],

  activeStage: {
    num:  3,
    name: 'Subscription Config',
    doneTasks: [
      { name: 'Subscription Setup' },
      { name: 'Sync Data' },
    ],
    currentTask: {
      name:      'Data Synchronization',
      sub:       'Billing spreadsheets + Partner Center access',
      completed: 1,
      total:     5,
    },
    allTasks: [
      { name: 'Data Synchronization',    status: 'in_progress' },
      { name: 'Training & System Config', status: 'not_started' },
      { name: 'Reconciliation',           status: 'not_started' },
      { name: 'Data Validation',          status: 'not_started' },
      { name: 'Billing Execution',        status: 'not_started' },
    ],
  },

  lockedStage: { name: 'Team Invites', note: 'Pending configuration' },

  upcomingStages: [
    { num: 4, name: 'Billing Setup' },
    { num: 5, name: 'Training' },
  ],
};


/* ── ICONS ─────────────────────────────────────────────────────────────────── */
const ICON = {
  check: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 7l3 3 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  sync:  `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7a5 5 0 1 1 1.5 3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><polyline points="2,4 2,7 5,7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  lock:  `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2" y="6" width="9" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M4 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  doc:   `<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="2" y="1" width="11" height="13" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="none"/><line x1="5" y1="5" x2="10" y2="5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="5" y1="7.5" x2="10" y2="7.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="5" y1="10" x2="8" y2="10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  chat:  `<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 2h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5l-3 3V3a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linejoin="round"/></svg>`,
  chevron: `<span style="color:var(--text-40)">›</span>`,
  calendarSvg: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="24" height="22" rx="2" stroke="#4a5c80" stroke-width="2" fill="none"/>
    <line x1="3" y1="13" x2="27" y2="13" stroke="#4a5c80" stroke-width="2"/>
    <line x1="9" y1="3" x2="9" y2="9" stroke="#4a5c80" stroke-width="2" stroke-linecap="round"/>
    <line x1="21" y1="3" x2="21" y2="9" stroke="#4a5c80" stroke-width="2" stroke-linecap="round"/>
    <line x1="28" y1="26" x2="35" y2="26" stroke="#4a5c80" stroke-width="2" stroke-linecap="round"/>
    <polyline points="31,23 35,26 31,29" stroke="#4a5c80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,
  clockSvg: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="18" r="11" stroke="#7a3b1a" stroke-width="2.2" fill="none"/>
    <line x1="18" y1="12" x2="18" y2="18" stroke="#7a3b1a" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="18" y1="18" x2="23" y2="18" stroke="#7a3b1a" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M7 10 Q4 14 4 18" stroke="#7a3b1a" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <polyline points="4,10 7,10 7,14" stroke="#7a3b1a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,
};


/* ── RENDER ────────────────────────────────────────────────────────────────── */
function initProgress() {
  const el = document.getElementById('page-overview');
  if (!el) return;
  el.innerHTML = `<div class="page-inner">${renderWelcomeRow()}${renderHeroCards()}${renderOnboardingSection()}</div>`;
}

function renderWelcomeRow() {
  const p = PROGRESS;
  return `
    <div class="page-mono-label">Dashboard</div>
    <div class="welcome-row">
      <div>
        <div class="welcome-name">Welcome back, ${p.user}</div>
        <div class="welcome-sub">You're in Stage ${p.currentStageNum}: ${p.currentStageName}.</div>
      </div>
      <div>
        <div class="progress-label">${p.completion}% Complete</div>
        <div class="progress-track"><div class="progress-fill" style="width:${p.completion}%"></div></div>
        <div class="progress-est">● EST. TIME REMAINING: ~${p.estWeeks} WEEKS</div>
      </div>
      <div class="stage-count">Stage ${p.currentStageNum} of ${p.totalStages}</div>
    </div>`;
}

function renderHeroCards() {
  return `
    <div class="hero-cards">

      <div class="hero-card hc-kickoff">
        <div class="hero-icon">${ICON.calendarSvg}</div>
        <div class="hero-title">Kick-off Meeting</div>
        <div class="hero-sub">${PROGRESS.kickoffDate}</div>
        <div class="hero-join" onclick="navigate('messages', null)">Join ↗</div>
      </div>

      <div class="hero-card hc-resume" onclick="navigate('learning', null)">
        <div class="hero-icon">${ICON.clockSvg}</div>
        <div class="hero-title hero-title-resume">Pick up from Last Time?</div>
        <div class="hero-sub hero-sub-resume">Resume Last Session →</div>
      </div>

      <div class="hero-card hc-help">
        <div class="help-title">Need Help?</div>
        <div class="help-row" onclick="navigate('documentation', null)">
          <div class="help-row-l">${ICON.doc} Access Documents</div>
          ${ICON.chevron}
        </div>
        <div class="help-row" onclick="openAI('Hello! I need help with my onboarding.')">
          <div class="help-row-l">${ICON.chat} AI Assistant</div>
          ${ICON.chevron}
        </div>
      </div>

    </div>`;
}

function renderOnboardingSection() {
  return `
    <div class="section-mono">Onboarding Stage</div>
    <div class="onboarding-grid">
      ${renderStageList()}
      ${renderRightColumn()}
    </div>`;
}

function renderStageList() {
  const p = PROGRESS;
  const completedItems = p.completedStages.map(s => `
    <div class="stage-item">
      <div class="stage-icon si-done">${ICON.check}</div>
      <div>
        <div class="stage-item-name">${s.name}</div>
        <div class="stage-item-date">${s.date}</div>
      </div>
    </div>`).join('');

  const activeItem = `
    <div class="stage-item s-active">
      <div class="stage-icon si-active">${ICON.sync}</div>
      <div>
        <div class="stage-item-name">${p.activeStage.name}</div>
        <div class="stage-item-date">In Progress</div>
      </div>
    </div>`;

  const lockedItem = `
    <div class="stage-item">
      <div class="stage-icon si-lock">${ICON.lock}</div>
      <div>
        <div class="stage-item-name">${p.lockedStage.name}</div>
        <div class="stage-item-date">${p.lockedStage.note}</div>
      </div>
    </div>`;

  return `<div class="stage-list">${completedItems}${activeItem}${lockedItem}</div>`;
}

function renderRightColumn() {
  const p = PROGRESS;
  const a = p.activeStage;

  const doneRows = a.doneTasks.map(t => `
    <div class="task-done-row">
      <div>
        <span class="check-icon">${ICON.check}</span>${t.name}
      </div>
      <span class="badge badge-done">Done</span>
    </div>`).join('');

  const taskRows = a.allTasks.map(t => {
    const isActive = t.status === 'in_progress';
    const badge    = isActive
      ? `<span class="badge badge-progress">In Progress</span>`
      : `<span class="badge badge-not">Not Started</span>`;
    return `
      <div class="task-row">
        <div class="task-row-l">
          <div class="t-dot ${isActive ? 't-dot-active' : ''}"></div>
          ${t.name}
        </div>
        ${badge}
      </div>`;
  }).join('');

  const ct = a.currentTask;
  const pct = Math.round((ct.completed / ct.total) * 100);
  const explainMsg = `Can you explain the ${a.name} stage and what tasks I need to complete?`;

  const tasksPanel = `
    <div class="tasks-panel">
      ${doneRows}
      <div class="cur-stage-bar">
        <div class="cur-stage-l">
          <div class="stage-num-badge">${a.num}</div>
          <div class="cur-stage-name">${a.name}</div>
        </div>
        <div class="cur-stage-r">
          <span class="badge badge-progress">In Progress</span>
          <button class="explain-link" onclick="openAI(${JSON.stringify(explainMsg)})">Explain to me</button>
        </div>
      </div>
      <div class="cur-task-box">
        <div class="ct-mono-label">Current Task</div>
        <div class="ct-row">
          <div>
            <div class="ct-name">${ct.name}</div>
            <div class="ct-sub">${ct.sub}</div>
          </div>
          <div class="ct-count">${ct.completed} of ${ct.total} tasks complete</div>
        </div>
        <div class="ct-bar"><div class="ct-bar-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="task-list">${taskRows}</div>
    </div>`;

  const upcomingRows = p.upcomingStages.map(s => `
    <div class="upcoming-stage-row">
      <div class="upcoming-stage-l">
        <div class="upcoming-num">${s.num}</div>
        <div class="upcoming-name">${s.name}</div>
      </div>
      <span class="badge badge-not">Upcoming</span>
    </div>`).join('');

  return `<div class="right-col">${tasksPanel}${upcomingRows}</div>`;
}
