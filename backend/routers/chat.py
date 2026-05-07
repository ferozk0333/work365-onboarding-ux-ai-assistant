from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.llm_service import llm_service
from services.rag_service import rag_service

router = APIRouter(prefix="/chat", tags=["chat"])

# In-memory session store: { session_id: [{"role": ..., "content": ...}, ...] }
_sessions: dict[str, list[dict]] = {}

SYSTEM_PROMPT = """\
You are Alex, a warm and friendly onboarding guide for Work 365 — a CSP billing and subscription management platform. Think of yourself as a knowledgeable colleague who genuinely wants to help.

Tone and style:
- Warm, encouraging, and plain-spoken — like a helpful teammate
- Keep responses short: 2 to 4 sentences is ideal for most questions
- Use simple language; when a Work 365 term comes up, define it briefly in plain English in parentheses
- Be practical: tell the user what to do, not just what something is

Rules:
- Only answer using the documentation context provided — never invent details
- If the context doesn't cover a question, say so warmly, e.g. "That's a bit outside what I have in my docs right now."
- When you genuinely cannot resolve an issue from the documentation and the user would benefit from hands-on support, end your reply with exactly the text: [OFFER_TICKET]
  Example: "That sounds like something the support team can look into directly. [OFFER_TICKET]"
- Do NOT include [OFFER_TICKET] for questions you can answer from the documentation
- When the user asks something that requires knowing their current state — e.g. "what should I do?", "where am I?", "analyze my screen", "I'm stuck, help me", "what's next?" — and you don't yet have their screen context, end your reply with exactly: [OFFER_CONTEXT]
  Example: "Happy to help you figure out where you are! Let me take a quick look at your current screen. [OFFER_CONTEXT]"
- Do NOT emit [OFFER_CONTEXT] if the user's message already starts with [SCREEN CONTEXT] — that means context was already shared. Use it to give a specific, actionable, personalized response about exactly where they are and what to do next.
- Do NOT emit both [OFFER_TICKET] and [OFFER_CONTEXT] in the same reply

Current onboarding stage: {stage}

--- DOCUMENTATION CONTEXT ---
{context}
--- END CONTEXT ---\
"""


class ChatRequest(BaseModel):
    message: str
    session_id: str
    onboarding_stage: str = "unknown"


class ChatResponse(BaseModel):
    data: dict
    error: str | None = None


@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="message cannot be empty")

    chunks = rag_service.retrieve(req.message)
    context = _format_context(chunks) if chunks else "No relevant documentation found for this query."

    history = _sessions.setdefault(req.session_id, [])
    history.append({"role": "user", "content": req.message})

    system = SYSTEM_PROMPT.format(stage=req.onboarding_stage, context=context)

    try:
        reply = llm_service.chat(history[-10:], system=system)
    except Exception as exc:
        history.pop()  # don't save the failed turn
        raise HTTPException(status_code=500, detail=f"LLM error: {exc}") from exc

    history.append({"role": "assistant", "content": reply})

    return ChatResponse(data={
        "reply": reply,
        "sources": list({c["source"] for c in chunks}),
        "session_id": req.session_id,
    })


def _format_context(chunks: list[dict]) -> str:
    parts = []
    for c in chunks:
        page = f", Page {c['page']}" if c.get("page") else ""
        parts.append(f"[{c['source']}{page}]\n{c['text']}")
    return "\n\n".join(parts)
