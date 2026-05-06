# Work365 Onboarding Assistant — Prototype

## Project Overview

A functional prototype demonstrating AI-assisted B2B onboarding for Work365 (a CSP billing & subscription management platform). The goal is to reduce customer dependency on support staff by providing a contextual AI assistant, progress visibility, and structured learning — all in a single web interface.

**User testing target: May 6–12, 2026.**

## Architecture

```
prototype-iotap/
├── backend/                    # Python + FastAPI + SQLite
│   ├── main.py                 # FastAPI app, CORS, startup
│   ├── config.py               # LLM provider config (swap models here)
│   ├── database.py             # SQLite setup via SQLAlchemy
│   ├── models/                 # DB models
│   │   ├── message.py          # Messaging inbox records
│   │   ├── progress.py         # Onboarding stage/step records
│   │   └── session.py          # Conversation session/history
│   ├── routers/                # FastAPI route handlers
│   │   ├── chat.py             # POST /chat — AI assistant Q&A
│   │   ├── progress.py         # GET/PATCH /progress — onboarding stages
│   │   ├── messages.py         # GET/POST /messages — inbox
│   │   └── knowledge.py        # POST /ingest — doc ingestion trigger
│   ├── services/
│   │   ├── llm_service.py      # LLM abstraction (swap Claude ↔ OpenAI via config)
│   │   ├── rag_service.py      # FAISS vector store + retrieval
│   │   └── highlight_service.py# Term lookup for inline highlights
│   └── knowledge_base/
│       ├── docs/               # Source documents (PDF, markdown, txt)
│       └── vectors/            # Persisted FAISS index files
├── frontend/                   # Vanilla HTML/CSS/JS
│   ├── index.html              # Main onboarding dashboard
│   ├── css/
│   │   ├── main.css            # Layout, typography, theme variables
│   │   └── components.css      # Assistant panel, progress tracker, inbox
│   ├── js/
│   │   ├── app.js              # App init, state, API client
│   │   ├── assistant.js        # Collapsible panel, chat UI, session
│   │   ├── progress.js         # Progress tracker rendering + updates
│   │   ├── highlight.js        # Text selection → explain-term flow
│   │   └── messages.js         # Messaging inbox UI
│   └── assets/icons/
├── specs/                      # Feature specs (one file per feature)
├── design.md                   # Design system: colors, fonts, spacing (fill in)
├── .env.example                # Required env vars (copy to .env)
└── CLAUDE.md                   # This file
```

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | HTML5 / CSS3 / Vanilla JS | No framework — keeps it simple for prototype |
| Backend | Python 3.11+ / FastAPI | Async, auto-docs at /docs |
| Database | SQLite via SQLAlchemy | Single file, zero config |
| LLM | Claude API (Anthropic) | Configurable — see `config.py` |
| Embeddings | sentence-transformers (`all-MiniLM-L6-v2`) | Local, no API key required |
| Vector Store | FAISS | Persisted to `backend/knowledge_base/vectors/` |
| Knowledge Base | Work365 PDFs + markdown | Ingested via `/ingest` endpoint |

## LLM Configuration

All LLM settings live in `backend/config.py` and are overridable via `.env`:

```
LLM_PROVIDER=anthropic          # anthropic | openai
LLM_MODEL=claude-sonnet-4-6     # or gpt-4o, etc.
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...              # only needed if switching provider
```

To swap to OpenAI: change `LLM_PROVIDER=openai` and set `OPENAI_API_KEY`. No other code changes needed.

## Running Locally

```bash
# Backend
cd backend
pip install -r requirements.txt
cp ../.env.example ../.env      # fill in API key
python main.py                  # runs on http://localhost:8000

# Ingest knowledge base (run once after adding docs)
curl -X POST http://localhost:8000/knowledge/ingest

# Frontend — just open in browser
open ../frontend/index.html
```

## Key Features

See `specs/` for detailed specs per feature:

- **AI Assistant Panel** (`specs/ai-assistant.md`) — collapsible right-side panel, RAG-powered Q&A, session memory
- **Onboarding Progress Tracker** (`specs/progress-tracker.md`) — persistent stage display, milestone updates
- **Inline Term Highlighting** (`specs/inline-highlights.md`) — select text → ask assistant to explain
- **RAG Knowledge Base** (`specs/rag-knowledge-base.md`) — FAISS + Work365 docs ingestion pipeline
- **Learning Sessions** (`specs/learning-sessions.md`) — short, replayable lessons in assistant panel
- **Messaging Inbox** (`specs/messaging-inbox.md`) — unified ticket/message inbox

## Conventions

- Backend routes follow REST: `GET` for reads, `POST` for creates, `PATCH` for updates
- All API responses are JSON with consistent shape: `{ data: ..., error: null }`
- Frontend communicates with backend via `fetch()` — no external JS libraries
- No authentication — single demo user, session is implicit
- SQLite DB file: `backend/data.db` (gitignored)
- FAISS index: `backend/knowledge_base/vectors/index.faiss` (gitignored if large)

## Prototype Scope (MVP)

In scope for user testing May 6–12:
- [x] Onboarding progress tracker (always visible)
- [x] AI assistant panel (collapsible, right side)
- [x] RAG Q&A grounded in Work365 docs
- [x] Inline term highlight → explain
- [x] Messaging inbox (mock data OK)
- [x] 2–3 learning lessons (manual content, delivered via assistant)

Out of scope for this prototype:
- User authentication / multi-tenancy
- Real email integration for messaging
- Production deployment / scaling
- Admin panel for knowledge base updates
