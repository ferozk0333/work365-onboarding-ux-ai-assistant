/* ── MOCK DATA ─────────────────────────────────────────────────────────────── */
const THREADS_DATA = {
  sync: {
    id:      'sync',
    title:   'Trouble syncing company data in Subscription Module',
    preview: 'Hi, I\'m having trouble syncing data from my company…',
    date:    'May 1, 2026 · 2:15 PM',
    badges:  [{ label: 'Technical', cls: 'badge-purple' }, { label: 'In Progress', cls: 'badge-progress' }],
    meta:    'TICKET #K365-5921 · CLIENT: ALEXANDER (CLOUDTECH SOLUTIONS) · ASSIGNED AGENT: CHRIS · CREATED: MAY 1, 2026',
    messages: [
      { from: 'Me',           time: '2:15 PM', text: 'Hello! I\'m currently experiencing some difficulties with syncing data from my company within the subscription module. Any assistance would be greatly appreciated!', plain: true,  support: false },
      { from: 'Support Team', time: '2:30 PM', text: 'Hey Alexander! Can you clarify how we can sync our data effectively?',                                                                                                plain: false, support: true  },
      { from: 'Me',           time: '2:45 PM', text: 'Yes, but this problem is specific to our company.',                                                                                                                 plain: false, support: false },
      { from: 'Support Team', time: '2:38 PM', text: 'Got it. I can schedule you a meeting with our support agent, Chris, tomorrow at 5:00 PM. We will send a Teams invite to your calendar.',                            plain: false, support: true  },
    ],
    meeting: { title: 'Support Team Subscription Module Meeting Added', date: 'Fri, May 15th 5:00PM' },
  },
  billing: {
    id:      'billing',
    title:   'Billing invoice discrepancy – Q2',
    preview: 'I noticed an issue with our April invoice amount…',
    date:    'Apr 28, 2026 · 10:40 AM',
    badges:  [{ label: 'Billing', cls: 'badge-blue' }, { label: 'In Progress', cls: 'badge-progress' }],
    meta:    'TICKET #B221-0042 · CLIENT: ALEXANDER (CLOUDTECH SOLUTIONS) · ASSIGNED AGENT: SARAH · CREATED: APR 28, 2026',
    messages: [
      { from: 'Me',           time: '10:40 AM', text: 'I noticed an issue with our April invoice amount. The total doesn\'t match what was agreed in the contract.', plain: true,  support: false },
      { from: 'Support Team', time: '11:05 AM', text: 'Hi Alexander, thanks for flagging this. Can you share the invoice number so we can look into it?',             plain: false, support: true  },
    ],
    meeting: null,
  },
  account: {
    id:      'account',
    title:   'Account access setup',
    preview: 'Thanks for your help getting our team onboarded.',
    date:    'Apr 20, 2026 · 3:05 PM',
    badges:  [{ label: 'Account', cls: 'badge-not' }, { label: 'Closed', cls: 'badge-done' }],
    meta:    'TICKET #A118-8833 · CLIENT: ALEXANDER (CLOUDTECH SOLUTIONS) · ASSIGNED AGENT: JAMES · CREATED: APR 20, 2026',
    messages: [
      { from: 'Me',           time: '3:05 PM', text: 'Thanks for your help getting our team onboarded. Everything is working now!',           plain: true,  support: false },
      { from: 'Support Team', time: '3:22 PM', text: 'Great to hear, Alexander! Feel free to reach out if anything else comes up.',           plain: false, support: true  },
    ],
    meeting: null,
  },
};

let activeThreadId = 'sync';


/* ── INIT ──────────────────────────────────────────────────────────────────── */
function initMessages() {
  const el = document.getElementById('page-messages');
  el.innerHTML = renderMessagesPage();
  selectThread('sync');
}


/* ── RENDER ────────────────────────────────────────────────────────────────── */
function renderMessagesPage() {
  const items = Object.values(THREADS_DATA).map(t => renderThreadItem(t)).join('');
  return `
    <div class="msg-layout">
      <div class="msg-list">
        <div class="msg-new-wrap">
          <button class="btn-new">+ New Request</button>
        </div>
        ${items}
      </div>
      <div class="msg-thread" id="msg-thread"></div>
    </div>`;
}

function renderThreadItem(t) {
  const badges = t.badges.map(b => `<span class="badge ${b.cls}">${b.label}</span>`).join('');
  return `
    <div class="msg-item" id="msg-item-${t.id}" onclick="selectThread('${t.id}')">
      <div class="msg-item-title">${t.title}</div>
      <div class="msg-item-preview">${t.preview}</div>
      <div class="msg-item-meta">
        <span class="msg-item-date">${t.date.toUpperCase()}</span>
        ${badges}
      </div>
    </div>`;
}

function selectThread(id) {
  activeThreadId = id;
  document.querySelectorAll('.msg-item').forEach(el => el.classList.remove('msg-active'));
  document.getElementById(`msg-item-${id}`)?.classList.add('msg-active');
  document.getElementById('msg-thread').innerHTML = renderThread(THREADS_DATA[id]);
}

function renderThread(t) {
  const badges = t.badges.map(b => `<span class="badge ${b.cls}">${b.label}</span>`).join('');

  const msgs = t.messages.map((m, i) => {
    const content = (i === 0 && m.plain)
      ? `<div class="msg-plain">${m.text}</div>`
      : `<div class="msg-bubble${m.support ? ' msg-bubble-support' : ''}">${m.text}</div>`;
    return `
      <div class="msg-block">
        <div class="msg-sender-row">
          <span class="msg-sender">${m.from}</span>
          <span class="msg-time">${m.time}</span>
        </div>
        ${content}
      </div>`;
  }).join('');

  const meetingCard = t.meeting ? `
    <div class="msg-block">
      <div class="msg-meeting-card">
        <div class="msg-meeting-icon">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="2" y="4" width="18" height="16" rx="2" stroke="#4a5c80" stroke-width="1.6" fill="none"/>
            <line x1="2"  y1="9"  x2="20" y2="9"  stroke="#4a5c80" stroke-width="1.6"/>
            <line x1="7"  y1="2"  x2="7"  y2="6"  stroke="#4a5c80" stroke-width="1.6" stroke-linecap="round"/>
            <line x1="15" y1="2"  x2="15" y2="6"  stroke="#4a5c80" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="msg-meeting-title">${t.meeting.title}</div>
        <div class="msg-meeting-date">${t.meeting.date}</div>
      </div>
    </div>` : '';

  return `
    <div class="msg-thread-hdr">
      <div class="msg-thread-top">
        <div class="msg-thread-title">${t.title}</div>
        <div class="msg-thread-badges">${badges}</div>
      </div>
      <div class="msg-thread-meta">${t.meta}</div>
    </div>
    <div class="msg-messages">${msgs}${meetingCard}</div>
    <div class="msg-reply">
      <input class="msg-reply-input" placeholder="Reply to Alexander…">
      <button class="btn-send">Send</button>
    </div>`;
}
