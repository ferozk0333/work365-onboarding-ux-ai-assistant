/* ── SUGGESTION CHIPS — context-aware per page ─────────────────────────────── */
const CHIPS = {
  overview: [
    'What is my current onboarding stage?',
    'Explain the Subscription Config tasks.',
    'What does Data Synchronization involve?',
  ],
  messages: [
    'Help me draft a message to the team.',
    'What should I include in a support ticket?',
    'How long do support responses typically take?',
  ],
  documentation: [
    'Summarize how the billing cycle works.',
    'What is a billing contract in Work 365?',
    'How does Partner Center sync operate?',
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
function openAI(prefillMessage) {
  document.getElementById('ai-sidebar').classList.add('open');

  if (prefillMessage && typeof prefillMessage === 'string') {
    hideChips();
    appendUserBubble(prefillMessage);
    fetchReply(prefillMessage);
  }
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
    appendAssistantBubble(formatReply(data.data.reply));
  } catch {
    removeTyping();
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
    .map(c => `<button class="ai-chip" onclick="sendChip(${JSON.stringify(c)})">${escapeHtml(c)}</button>`)
    .join('');
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
