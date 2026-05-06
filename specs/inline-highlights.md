# Feature Spec: Inline Term Highlighting

## Overview

When a user selects (highlights) any text on the page, a small tooltip appears near the selection offering to explain the highlighted term via the AI assistant. Clicking it opens the assistant panel with the explanation pre-loaded.

---

## User Stories

- As a new customer, when I see an unfamiliar term like "billing contract" or "provisioning" anywhere on the page, I want to highlight it and instantly get a plain-language explanation without switching tabs or typing a query.
- As a new customer, I want the explanation to appear in the assistant panel so I can follow up with more questions.

---

## Interaction Flow

```
1. User selects text on the page (any element)
2. A small tooltip bubble appears near the selection
   → Label: "Ask assistant" (or a small wand/sparkle icon + "Explain this")
3. User clicks the tooltip
4. Assistant panel opens (if closed)
5. A pre-filled query is sent: "Explain this term in the context of Work365 onboarding: [selected text]"
6. Assistant responds with explanation
7. Tooltip dismisses on click outside or on selection clear
```

---

## UI Behaviour

### Tooltip
- Appears within 150ms of text selection completing (mouseup / touchend)
- Positioned: just above the selection, horizontally centered on it
- Does NOT appear for: selections inside the assistant panel input box (avoid recursion)
- Dismisses on: click outside, escape key, or new selection
- Style: small pill / chip, subtle shadow, matches design system accent color

### Tooltip Trigger Conditions
- Minimum selection length: 2 characters (avoid triggering on accidental single-char selections)
- Maximum selection length: 200 characters (don't trigger on paragraph-length selections — too broad)
- Only triggers on page body content — not on form inputs, the chat input, or the inbox compose area

### Assistant Panel Integration
- If panel is already open: add the query as a new user message and get response
- If panel is closed: open it, then add and send the query
- The query is pre-formatted so the user doesn't have to type anything — it "just works"

---

## Implementation Notes (`frontend/js/highlight.js`)

```javascript
// Core events to handle:
document.addEventListener('mouseup', onSelectionEnd)
document.addEventListener('touchend', onSelectionEnd)

function onSelectionEnd() {
  const selection = window.getSelection()
  const text = selection.toString().trim()

  if (text.length < 2 || text.length > 200) {
    dismissTooltip()
    return
  }

  // Don't trigger inside assistant panel or inputs
  const anchor = selection.anchorNode?.parentElement
  if (anchor?.closest('#assistant-panel') || anchor?.closest('input, textarea')) {
    dismissTooltip()
    return
  }

  showTooltip(selection, text)
}

function showTooltip(selection, text) {
  // Position tooltip at selection bounding rect
  // On click: call assistantPanel.askAboutTerm(text)
}
```

### `assistantPanel.askAboutTerm(text)` (in `assistant.js`)
- Opens panel if closed
- Sends message: `"Explain this term in the context of Work365 onboarding: ${text}"`
- Does not add it as a visible user bubble — or shows it as a "quick query" in a distinct style (TBD)

---

## Scope Notes

- This feature does NOT highlight corresponding elements on-screen (the PRD mentions spatial highlighting of UI elements — that is complex and deferred).
- This feature replaces that with the simpler, more robust "explain selected text" pattern.
- If the selected term appears in Work365 documentation, the RAG response will naturally explain it with the correct context.

---

## Open Questions

- [ ] Should the tooltip show a preview of the term category (e.g., "Work365 term")? Needs a pre-check against a glossary list.
- [ ] Should the explanation appear as a distinct "quick query" bubble style vs a normal user message?
