let _hlTooltip = null;

function initHighlight() {
  document.addEventListener('mouseup',   onSelectionEnd);
  document.addEventListener('touchend',  onSelectionEnd);
  document.addEventListener('keydown',   e => { if (e.key === 'Escape') dismissTooltip(); });
  document.addEventListener('mousedown', e => {
    if (_hlTooltip && !_hlTooltip.contains(e.target)) dismissTooltip();
  });
}

function onSelectionEnd() {
  setTimeout(() => {
    const sel = window.getSelection();
    const text = sel ? sel.toString().trim() : '';

    if (!text || text.length < 2 || text.length > 200) { dismissTooltip(); return; }

    // Skip selections inside the AI sidebar or form inputs
    const anchor = sel.anchorNode?.parentElement;
    if (anchor?.closest('#ai-sidebar, input, textarea, [contenteditable]')) { dismissTooltip(); return; }

    const range = sel.getRangeAt(0);
    const rect  = range.getBoundingClientRect();
    if (!rect.width) { dismissTooltip(); return; }

    showTooltip(rect, text);
  }, 0);
}

function showTooltip(rect, selectedText) {
  dismissTooltip();

  const btn = document.createElement('button');
  btn.id        = 'hl-tooltip';
  btn.className = 'hl-tooltip';
  btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" style="flex-shrink:0">
    <path d="M6.5 1L7.8 4.7H11.7L8.5 6.9L9.8 10.6L6.5 8.4L3.2 10.6L4.5 6.9L1.3 4.7H5.2Z"
      fill="#fff" opacity="0.9"/>
  </svg> Explain this`;

  btn.addEventListener('click', () => {
    const msg = `Explain this term in the context of Work 365 onboarding: "${selectedText}"`;
    dismissTooltip();
    window.getSelection()?.removeAllRanges();
    openAI(msg);
  });

  document.body.appendChild(btn);
  _hlTooltip = btn;

  // Position: centered above selection, nudge away from viewport edges
  // position:fixed means we use raw viewport coordinates from getBoundingClientRect
  const ARROW_H = 7;
  const GAP     = 6;
  const bw      = btn.offsetWidth  || 130;
  const bh      = btn.offsetHeight || 34;

  let left = rect.left + rect.width / 2 - bw / 2;
  let top  = rect.top  - bh - ARROW_H - GAP;

  // Clamp horizontally — keep 8px from viewport edges
  left = Math.max(8, Math.min(left, window.innerWidth - bw - 8));

  // If clipped at top, flip below the selection
  if (top < 4) {
    top = rect.bottom + GAP + ARROW_H;
    btn.classList.add('hl-tooltip-below');
  }

  btn.style.left = `${left}px`;
  btn.style.top  = `${top}px`;
}

function dismissTooltip() {
  if (_hlTooltip) { _hlTooltip.remove(); _hlTooltip = null; }
}
