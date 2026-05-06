# Feature Spec: AI Assistant Panel

## Overview

A collapsible right-side panel that lets users ask onboarding-related questions in natural language. The assistant answers using Work365 documentation (via RAG) and maintains conversational context within a session.

---

## User Stories

- As a new customer, I want to ask "why is my onboarding paused?" and get a clear, specific answer without contacting support.
- As a new customer, I want the assistant to remember what I asked earlier in this session so I don't have to repeat myself.
- As a new customer, I want the assistant to tell me honestly when it doesn't know something, rather than giving me a wrong answer.
- As a new customer, I want to open and close the assistant panel without losing my conversation.

---

## UI Behaviour

### Panel States
- **Closed (default):** A visible tab or floating button on the right edge of the screen. Does not interrupt the main content.
- **Open:** Slides in from the right, fixed width (see `design.md`). Main content shifts left OR panel overlays (TBD based on layout).
- **Toggle:** Single click/tap on the tab or a close button inside the panel.

### Chat Interface
- Message history scrolls upward (newest at bottom).
- User input: single-line text box with a send button. Supports Enter key to send.
- Assistant messages are visually distinct from user messages (different bubble alignment + color).
- Loading state: typing indicator (three dots animation) while awaiting response.
- Timestamps on each message (relative: "just now", "2 min ago").

### Session Behaviour
- Conversation history is held in memory for the current browser session.
- On page refresh, history is cleared (prototype scope — no persistence needed).
- The session context includes: current onboarding stage, recent messages (last N turns).

---

## Context Injection

Every request to the LLM includes:
1. **System prompt** — role definition, tone, fallback instructions, grounding rules
2. **Retrieved RAG chunks** — top-k document passages relevant to the user's question
3. **Current onboarding stage** — so answers are contextually aware ("you're currently in Stage 2: Data Import")
4. **Conversation history** — last 6 message turns for follow-up coherence

---

## Assistant Capabilities

| Capability | In Scope | Notes |
|---|---|---|
| Terminology Q&A | Yes | "What is a billing contract?" |
| Onboarding status Q&A | Yes | "Why am I stuck on step 3?" |
| Error explanation | Yes | Grounded in docs — explains what error codes mean |
| Drafting a support message | Yes | "Help me write a message to the team about X" |
| Learning lesson delivery | Yes | See `specs/learning-sessions.md` |
| Inline term explanation | Yes | Triggered from `highlight.js` — see `specs/inline-highlights.md` |
| General off-topic questions | No | Politely out of scope |
| Real-time platform actions | No | Read-only assistant |

---

## Fallback Behaviour

When the assistant cannot answer reliably:
- It responds with: *"I don't have enough information to answer that confidently. You may want to check with your onboarding contact."*
- It does NOT fabricate an answer.
- It MAY suggest which section of the knowledge base is most relevant.

---

## API Contract

### POST /chat

**Request:**
```json
{
  "message": "What does a billing contract do?",
  "session_id": "abc123",
  "onboarding_stage": "stage_2_data_import"
}
```

**Response:**
```json
{
  "data": {
    "reply": "A billing contract in Work365 defines...",
    "sources": ["Work365 Module 5 — Billing Automation"],
    "session_id": "abc123"
  },
  "error": null
}
```

**Errors:**
- `500` — LLM call failed (return user-friendly message, log internally)
- `400` — Missing required fields

---

## Backend Implementation Notes

- `routers/chat.py` — route handler, validates input, calls `llm_service`
- `services/llm_service.py` — abstracts LLM provider (Claude / OpenAI)
- `services/rag_service.py` — retrieves relevant chunks from FAISS before each call
- Session history stored in-memory dict keyed by `session_id` (prototype scope)
- `session_id` is generated on first load in `app.js` and included in every request

---

## Open Questions

- [ ] Should the assistant panel open automatically on first visit with a welcome message?
- [ ] How many RAG chunks (k) should be retrieved per query? Start with k=4, tune during testing.
- [ ] Should the assistant suggest follow-up questions ("You might also want to ask...")?
