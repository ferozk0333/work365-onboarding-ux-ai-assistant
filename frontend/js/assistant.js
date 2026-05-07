/* ── SUGGESTION CHIPS — context-aware per page ─────────────────────────────── */
const CHIPS = {
  overview: [
    'What is my current onboarding progress?',
    'What does Data Synchronization involve?',
    'Help me troubleshoot an issue.',
  ],
  messages: [
    'Help me draft a message to the team.',
    'What should I include in a support ticket?',
    'How long do support responses typically take?',
  ],
  documentation: [
    'What is a license change log?',
    'How does Partner Center sync operate?',
    'What is a billing contract in Work 365?',
  ],
  learning: [
    'What will I learn in this module?',
    'Explain Data Synchronization in simple terms.',
    'What comes after the current lesson?',
  ],
  settings: [
    'What settings should I configure first?',
    'How do I update my billing contact?',
  ],
};

/* Whether chips have been dismissed for this session */
let chipsVisible = true;

/* ── SIGNAL STATE ───────────────────────────────────────────────────────────── */
const TICKET_SIGNAL  = '[OFFER_TICKET]';
const CONTEXT_SIGNAL = '[OFFER_CONTEXT]';
let _ticketMode       = null; // null | { phase: 'ask_desc', title: string }
let _lastUserMsg      = '';
let _pendingFollowUps = null; // string[] | null — shown after next reply


/* ── INIT ──────────────────────────────────────────────────────────────────── */
function initAssistant() {
  renderWelcome();
  updateChips('overview');

  document.getElementById('ai-send-btn').addEventListener('click', sendMessage);
  document.getElementById('ai-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
  });
}


/* ── OPEN / CLOSE ──────────────────────────────────────────────────────────── */
function handleExplain(btn) {
  const msg       = btn.dataset.msg;
  const followUps = JSON.parse(btn.dataset.followups || '[]');
  openAI(msg, followUps);
}

function openAI(prefillMessage, followUps) {
  document.getElementById('ai-sidebar').classList.add('open');

  if (prefillMessage && typeof prefillMessage === 'string') {
    hideChips();
    appendUserBubble(prefillMessage);
    _lastUserMsg = prefillMessage;
    if (Array.isArray(followUps) && followUps.length) _pendingFollowUps = followUps;
    fetchReply(prefillMessage);
  } else {
    chipsVisible = true;
    updateChips(currentPage || 'overview');
  }
}

function openAIWithContext(apiMessage, followUps, displayMessage) {
  document.getElementById('ai-sidebar').classList.add('open');
  hideChips();
  appendUserBubble(displayMessage || apiMessage);
  _lastUserMsg = apiMessage;
  if (Array.isArray(followUps) && followUps.length) _pendingFollowUps = followUps;
  fetchReply(apiMessage);
}

function closeAI() {
  document.getElementById('ai-sidebar').classList.remove('open');
}


/* ── SEND ──────────────────────────────────────────────────────────────────── */
function sendMessage() {
  const input = document.getElementById('ai-input');
  const text  = input.value.trim();
  if (!text) return;
  input.value = '';

  hideChips();
  appendUserBubble(text);

  if (_ticketMode) {
    handleTicketInput(text);
    return;
  }

  _lastUserMsg = text;
  fetchReply(text);
}

function sendChip(text) {
  hideChips();
  openAI(text);
}

async function fetchReply(message) {
  showTyping();
  try {
    const data = await apiPost('/chat', {
      message,
      session_id:       sessionId,
      onboarding_stage: currentStage,
    });
    removeTyping();
    const rawReply     = data.data.reply;
    const offerTicket  = rawReply.includes(TICKET_SIGNAL);
    const offerContext = rawReply.includes(CONTEXT_SIGNAL);
    const cleanReply   = rawReply.replace(TICKET_SIGNAL, '').replace(CONTEXT_SIGNAL, '').trim();
    appendAssistantBubble(formatReply(cleanReply));
    if (offerTicket)  showTicketOffer();
    if (offerContext) showContextOffer();
    if (_pendingFollowUps && !offerContext) {
      showFollowUpChips(_pendingFollowUps);
      _pendingFollowUps = null;
    }
  } catch {
    removeTyping();
    _pendingFollowUps = null;
    appendAssistantBubble("I'm having trouble connecting right now. Please try again in a moment.");
  }
}


/* ── RENDER ────────────────────────────────────────────────────────────────── */
function renderWelcome() {
  const msgs = document.getElementById('ai-msgs');
  if (!msgs) return;
  msgs.innerHTML = '';
  appendAssistantBubble("Hi Alexander! I'm here to help with your Subscription Config stage. What would you like to know?");
}

function appendUserBubble(text) {
  const msgs = document.getElementById('ai-msgs');
  msgs.insertAdjacentHTML('beforeend', `
    <div class="ai-msg-row ai-msg-user">
      <div class="ai-bubble-user">${escapeHtml(text)}</div>
    </div>
  `);
  msgs.scrollTop = msgs.scrollHeight;
}

function appendAssistantBubble(htmlContent) {
  const msgs = document.getElementById('ai-msgs');
  msgs.insertAdjacentHTML('beforeend', `
    <div class="ai-msg-row">
      <div class="ai-avatar">W</div>
      <div class="ai-bubble">${htmlContent}</div>
    </div>
  `);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('ai-msgs');
  msgs.insertAdjacentHTML('beforeend', `
    <div class="ai-msg-row" id="ai-typing">
      <div class="ai-avatar">W</div>
      <div class="ai-bubble ai-typing-indicator">
        <span></span><span></span><span></span>
      </div>
    </div>
  `);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  document.getElementById('ai-typing')?.remove();
}

function hideChips() {
  const chips = document.getElementById('ai-chips');
  if (chips) chips.style.display = 'none';
  chipsVisible = false;
}

function updateChips(page) {
  const chips = document.getElementById('ai-chips');
  if (!chips || !chipsVisible) return;
  chips.style.display = '';
  const list = CHIPS[page] || CHIPS.overview;
  chips.innerHTML = list
    .map(c => `<button class="ai-chip" data-q="${c.replace(/"/g,'&quot;')}" onclick="sendChip(this.dataset.q)">${escapeHtml(c)}</button>`)
    .join('');
}


/* ── FOLLOW-UP CHIPS ────────────────────────────────────────────────────────── */
function showFollowUpChips(questions) {
  const msgs = document.getElementById('ai-msgs');
  const buttons = questions.map(q =>
    `<button class="ai-inline-chip" data-q="${q.replace(/"/g,'&quot;')}" onclick="sendChip(this.dataset.q)">${escapeHtml(q)}</button>`
  ).join('');
  msgs.insertAdjacentHTML('beforeend', `<div class="ai-follow-ups">${buttons}</div>`);
  msgs.scrollTop = msgs.scrollHeight;
}


/* ── SCREEN CONTEXT FLOW ────────────────────────────────────────────────────── */
const SCREEN_ICON = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2" width="11" height="7.5" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="none"/><line x1="4" y1="11.5" x2="9" y2="11.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="6.5" y1="9.5" x2="6.5" y2="11.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`;

function showContextOffer() {
  const msgs = document.getElementById('ai-msgs');
  msgs.insertAdjacentHTML('beforeend', `
    <div class="ai-context-offer" id="ai-context-offer">
      <div class="ai-context-offer-header">
        ${SCREEN_ICON}
        <span class="ai-context-offer-label">Screen Access Request</span>
      </div>
      <div class="ai-context-offer-text">To give you a precise answer, I'd like to read your current screen — your page, stage, and task progress. Nothing is sent to any third party.</div>
      <div class="ai-ticket-offer-btns">
        <button class="ai-ticket-yes" onclick="allowContext()">Allow</button>
        <button class="ai-ticket-no" onclick="declineContext()">No thanks</button>
      </div>
    </div>
  `);
  msgs.scrollTop = msgs.scrollHeight;
}

function allowContext() {
  document.getElementById('ai-context-offer')?.remove();

  let ctx = '';
  let summary = 'screen state';
  try {
    ctx     = captureScreenContext();
    summary = captureScreenSummary();
    console.log('[allowContext] captured ok, ctx length:', ctx.length);
  } catch (err) {
    console.error('[allowContext] capture failed:', err);
  }

  try {
    appendContextCard(summary);
  } catch (err) {
    console.error('[allowContext] card render failed:', err);
  }

  const message = ctx
    ? `[SCREEN CONTEXT]\n${ctx}`
    : 'Please analyze my current onboarding status and tell me what I should focus on next.';
  fetchReply(message);
}

function declineContext() {
  document.getElementById('ai-context-offer')?.remove();
  appendAssistantBubble("No problem! Just describe what you're seeing or what you're trying to do, and I'll do my best to help.");
}

function appendContextCard(summary) {
  const msgs = document.getElementById('ai-msgs');
  if (!msgs) return;
  msgs.insertAdjacentHTML('beforeend', `
    <div class="ai-context-card">
      <div class="ai-context-card-top">
        ${SCREEN_ICON}
        <span class="ai-context-card-label">Screen context shared</span>
      </div>
      <div class="ai-context-card-summary">${escapeHtml(summary)}</div>
    </div>
  `);
  msgs.scrollTop = msgs.scrollHeight;
}


/* ── TICKET FLOW ────────────────────────────────────────────────────────────── */
function showTicketOffer() {
  const msgs = document.getElementById('ai-msgs');
  msgs.insertAdjacentHTML('beforeend', `
    <div class="ai-ticket-offer" id="ai-ticket-offer">
      <div class="ai-ticket-offer-text">Want me to raise a support ticket for this?</div>
      <div class="ai-ticket-offer-btns">
        <button class="ai-ticket-yes" onclick="startTicketFlow()">Yes, create ticket</button>
        <button class="ai-ticket-no" onclick="dismissTicketOffer()">No thanks</button>
      </div>
    </div>
  `);
  msgs.scrollTop = msgs.scrollHeight;
}

function dismissTicketOffer() {
  document.getElementById('ai-ticket-offer')?.remove();
  appendAssistantBubble("No worries! Let me know if there's anything else I can help with.");
}

function startTicketFlow() {
  document.getElementById('ai-ticket-offer')?.remove();
  const raw   = _lastUserMsg || 'Support request';
  const title = raw.length > 60 ? raw.slice(0, 57) + '…' : raw;
  _ticketMode = { phase: 'ask_desc', title };
  appendAssistantBubble(
    `Got it! I'll put a ticket together for the team. Here's the title I'll use: <strong>"${escapeHtml(title)}"</strong><br><br>Any extra detail you can share will help the support team get started faster — go ahead and type it below:`
  );
  document.getElementById('ai-msgs').scrollTop = 9999;
}

function handleTicketInput(text) {
  const { title } = _ticketMode;
  _ticketMode = null;
  const ticketId = 'K365-' + (Math.floor(Math.random() * 9000) + 1000);
  showTicketCard(ticketId, title, text);
}

function showTicketCard(id, title, desc) {
  const msgs = document.getElementById('ai-msgs');
  msgs.insertAdjacentHTML('beforeend', `
    <div class="ai-ticket-card">
      <div class="ai-ticket-card-top">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="1" width="12" height="12" rx="2" stroke="var(--done-text)" stroke-width="1.3" fill="none"/>
          <path d="M3.5 7l2.5 2.5 4.5-4.5" stroke="var(--done-text)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="ai-ticket-card-status">Ticket Created</span>
        <span class="ai-ticket-card-id">#${id}</span>
      </div>
      <div class="ai-ticket-card-title">${escapeHtml(title)}</div>
      ${desc ? `<div class="ai-ticket-card-desc">${escapeHtml(desc)}</div>` : ''}
      <div class="ai-ticket-card-footer">Our team will be in touch within 1 business day.</div>
    </div>
  `);
  msgs.scrollTop = msgs.scrollHeight;
  appendAssistantBubble(`Ticket <strong>#${id}</strong> is all set! The support team will pick it up and reach out within one business day. Anything else I can help with?`);
}


/* ── UTILITIES ─────────────────────────────────────────────────────────────── */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* Basic markdown → safe HTML for assistant replies */
function formatReply(text) {
  return escapeHtml(text)
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g,     '<em>$1</em>')
    .replace(/`([^`\n]+)`/g,       '<code style="background:rgba(1,1,32,0.06);padding:1px 4px;border-radius:3px;font-family:var(--mono);font-size:11px">$1</code>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g,   '<br>');
}
