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
  chevron: `<span class="help-row-chevron">›</span>`,
  helpCircle: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M9 8.5c0-1.1.9-2 2-2s2 .9 2 2c0 1-1 1.8-2 2.2V12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/><circle cx="11" cy="15" r="0.8" fill="currentColor"/></svg>`,
  calendarSvg: `<svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="24" height="22" rx="2" stroke="#4a5c80" stroke-width="2" fill="none"/>
    <line x1="3" y1="13" x2="27" y2="13" stroke="#4a5c80" stroke-width="2"/>
    <line x1="9" y1="3" x2="9" y2="9" stroke="#4a5c80" stroke-width="2" stroke-linecap="round"/>
    <line x1="21" y1="3" x2="21" y2="9" stroke="#4a5c80" stroke-width="2" stroke-linecap="round"/>
    <line x1="28" y1="26" x2="35" y2="26" stroke="#4a5c80" stroke-width="2" stroke-linecap="round"/>
    <polyline points="31,23 35,26 31,29" stroke="#4a5c80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,
  clockSvg: `<svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <div class="welcome-col">
        <div class="welcome-name">Welcome back, ${p.user}</div>
        <div class="welcome-sub">You're in Stage ${p.currentStageNum}: ${p.currentStageName}.</div>
      </div>
      <div class="progress-col">
        <div class="progress-header-row">
          <span class="progress-label">${p.completion}% Complete</span>
          <span class="stage-count">Stage ${p.currentStageNum} of ${p.totalStages}</span>
        </div>
        <div class="progress-track" role="progressbar" aria-valuenow="${p.completion}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-fill" style="width:${p.completion}%"></div>
        </div>
        <div class="progress-est">
          <span class="progress-est-dot"></span>
          Est. time remaining: ~${p.estWeeks} weeks
        </div>
      </div>
      <div></div>
    </div>`;
}

function renderHeroCards() {
  return `
    <div class="hero-cards">

      <div class="hero-card hc-kickoff">
        <div class="hero-icon">${ICON.calendarSvg}</div>
        <div class="hero-body">
          <div class="hero-title">Kick-off Meeting</div>
          <div class="hero-sub">${PROGRESS.kickoffDate}</div>
          <div class="hero-join" onclick="navigate('messages', null)">Join ↗</div>
        </div>
      </div>

      <div class="hero-card hc-resume" onclick="navigate('learning', null)">
        <div class="hero-icon">${ICON.clockSvg}</div>
        <div class="hero-body">
          <div class="hero-title hero-title-resume">Pick up from Last Time?</div>
          <div class="hero-sub hero-sub-resume">Resume Last Session →</div>
        </div>
      </div>

      <div class="hero-card hc-help">
        <div class="hero-help-header">
          <span style="color:var(--text-60)">${ICON.helpCircle}</span>
          <div class="help-title">Need Help?</div>
        </div>
        <div class="help-rows">
          <div class="help-row" onclick="navigate('documentation', null)">
            <div class="help-row-l">${ICON.doc} Access Documents</div>
            ${ICON.chevron}
          </div>
          <div class="help-row" onclick="openAI()">
            <div class="help-row-l">${ICON.chat} AI Assistant</div>
            ${ICON.chevron}
          </div>
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
    <div class="stage-row">
      <div class="stage-icon-circ si-done">${ICON.check}</div>
      <div class="stage-text">
        <div class="stage-name-v2">${s.name}</div>
        <div class="stage-subtitle">${s.date}</div>
      </div>
    </div>`).join('');

  const pct = Math.round((p.activeStage.currentTask.completed / p.activeStage.currentTask.total) * 100);
  const activeItem = `
    <div class="stage-row stage-row-active">
      <div class="stage-icon-circ si-active">${ICON.sync}</div>
      <div class="stage-text">
        <div class="stage-name-v2">${p.activeStage.name}</div>
        <div class="stage-mini-progress">
          <div class="stage-mini-fill" style="width:${pct}%"></div>
        </div>
      </div>
    </div>`;

  const lockedItem = `
    <div class="stage-row stage-row-locked">
      <div class="stage-icon-circ si-lock">${ICON.lock}</div>
      <div class="stage-text">
        <div class="stage-name-v2">${p.lockedStage.name}</div>
        <div class="stage-subtitle">${p.lockedStage.note}</div>
      </div>
    </div>`;

  return `<div class="stages-list">${completedItems}${activeItem}${lockedItem}</div>`;
}

function renderRightColumn() {
  const p = PROGRESS;
  const a = p.activeStage;
  const ct = a.currentTask;
  const pct = Math.round((ct.completed / ct.total) * 100);
  const explainMsg  = `Can you explain the ${a.name} stage and what tasks I need to complete?`;
  const followUps   = [
    `What does the ${ct.name} task involve exactly?`,
    `How long does the ${a.name} stage typically take?`,
    `What do I need to have ready before this stage is done?`,
  ];

  const doneRows = a.doneTasks.map(t => `
    <div class="task-flat-row">
      <div class="task-flat-l">
        <span class="task-check-icon">${ICON.check}</span>
        <span class="task-flat-label">${t.name}</span>
      </div>
      <span class="badge badge-done">Done</span>
    </div>`).join('');

  const subtaskRows = a.allTasks.map((t, i) => {
    const isActive = t.status === 'in_progress';
    const dot   = `<span class="subtask-dot ${isActive ? 'dot-active' : 'dot-upcoming'}"></span>`;
    const label = `<span class="subtask-lbl ${isActive ? 'subtask-lbl-active' : 'subtask-lbl-upcoming'}">${t.name}</span>`;
    const badge = isActive
      ? `<span class="badge badge-progress">In Progress</span>`
      : `<span class="badge badge-not">Not Started</span>`;
    return `
      ${i > 0 ? '<div class="subtask-hr"></div>' : ''}
      <div class="subtask-row">
        <div class="subtask-l">${dot}${label}</div>
        ${badge}
      </div>`;
  }).join('');

  const activeCard = `
    <div class="task-card-active">
      <div class="task-card-hdr">
        <div class="task-card-l">
          <div class="task-num-badge"><span class="task-num-inner">${a.num}</span></div>
          <span class="task-card-title-v2">${a.name}</span>
        </div>
        <div class="task-card-r">
          <span class="badge badge-progress">In Progress</span>
          <button class="task-explain-link" data-msg="${explainMsg.replace(/"/g,'&quot;')}" data-followups='${JSON.stringify(followUps)}' onclick="handleExplain(this)">Explain to me</button>
        </div>
      </div>
      <div class="task-divider"></div>
      <div class="cur-task-box-v2">
        <div class="ct-details">
          <div class="ct-label-mono">Current Task</div>
          <div class="ct-name-v2">${ct.name}</div>
          <div class="ct-sub-v2">${ct.sub}</div>
        </div>
        <div class="ct-progress-col">
          <div class="ct-count-v2">${ct.completed} of ${ct.total} tasks complete</div>
          <div class="ct-mini-bar"><div class="ct-mini-fill" style="width:${pct}%"></div></div>
        </div>
      </div>
      <div class="task-divider"></div>
      <div class="tasks-sublabel-v2">Tasks</div>
      <div class="subtasks-list">${subtaskRows}</div>
    </div>`;

  const upcomingRows = p.upcomingStages.map(s => `
    <div class="task-flat-row task-flat-upcoming">
      <div class="task-flat-l">
        <span class="upcoming-num-badge">${s.num}</span>
        <span class="task-flat-label">${s.name}</span>
      </div>
      <span class="badge badge-not">Upcoming</span>
    </div>`).join('');

  return `<div class="tasks-col">${doneRows}${activeCard}${upcomingRows}</div>`;
}


/* ── SCREEN CONTEXT CAPTURE ─────────────────────────────────────────────────
   Lives here so PROGRESS is guaranteed in scope (cross-script const access
   is unreliable across non-module scripts in Chrome).
── */
function captureScreenContext() {
  const p = PROGRESS;
  const pageLabels = {
    overview:      'Overview (Dashboard)',
    messages:      'Messages / Inbox',
    documentation: 'Documentation',
    learning:      'Learning Modules',
    settings:      'Settings',
  };

  const page = (typeof currentPage !== 'undefined' && pageLabels[currentPage])
    ? pageLabels[currentPage]
    : 'Overview (Dashboard)';

  const lines = ['=== CURRENT SCREEN STATE ===', `Page: ${page}`];

  lines.push(`Onboarding: ${p.completion}% complete — Stage ${p.currentStageNum} of ${p.totalStages} (${p.currentStageName})`);
  lines.push(`Est. time remaining: ~${p.estWeeks} weeks`);

  if (p.completedStages && p.completedStages.length) {
    lines.push('', 'Completed stages:');
    p.completedStages.forEach(function(s) { lines.push('  ✓ ' + s.name + ' (' + s.date + ')'); });
  }

  const a = p.activeStage;
  if (a) {
    const ct = a.currentTask;
    lines.push('', 'Active stage: ' + a.name);
    lines.push('  Current task: ' + ct.name + ' (' + ct.completed + ' of ' + ct.total + ' subtasks complete)');
    lines.push('  Task detail: ' + ct.sub);
    lines.push('  All tasks:');
    a.allTasks.forEach(function(t) {
      const marker = t.status === 'in_progress' ? '->' : 'o';
      const label  = t.status === 'in_progress' ? 'In Progress' : 'Not Started';
      lines.push('    ' + marker + ' ' + t.name + ' [' + label + ']');
    });
    if (a.doneTasks && a.doneTasks.length) {
      lines.push('  Completed tasks in this stage:');
      a.doneTasks.forEach(function(t) { lines.push('    ✓ ' + t.name); });
    }
  }

  if (p.upcomingStages && p.upcomingStages.length) {
    lines.push('', 'Upcoming: ' + p.upcomingStages.map(function(s) { return 'Stage ' + s.num + ' - ' + s.name; }).join(', '));
  }

  if (p.lockedStage) {
    lines.push('Locked next: ' + p.lockedStage.name + ' (' + p.lockedStage.note + ')');
  }

  lines.push('=== END STATE ===');
  return lines.join('\n');
}

function captureScreenSummary() {
  const p = PROGRESS;
  const task = (p.activeStage && p.activeStage.currentTask) ? p.activeStage.currentTask.name : 'N/A';
  return p.currentStageName + ' - Stage ' + p.currentStageNum + '/' + p.totalStages + ' - ' + p.completion + '% complete - Active task: ' + task;
}
