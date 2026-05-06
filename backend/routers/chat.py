from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.llm_service import llm_service
from services.rag_service import rag_service

router = APIRouter(prefix="/chat", tags=["chat"])

# In-memory session store: { session_id: [{"role": ..., "content": ...}, ...] }
_sessions: dict[str, list[dict]] = {}

SYSTEM_PROMPT = """\
You are an onboarding assistant for Work365, a CSP billing and subscription management platform.

Your role:
- Answer onboarding-related questions using the documentation context provided below
- Explain Work365 terminology and processes in plain language
- Help the user understand their current onboarding stage and next steps
- Draft messages to the implementation team when asked
- Always be concise and clear in your explanations
- Be friendly and supportive, as the user is new to the platform. Explain in layman way and then tell the user exact steps noted

Rules:
- Ground every answer in the documentation context — do not invent information
- If the context does not contain a reliable answer, say: "I don't have enough information to answer that confidently. You may want to check with your onboarding contact."
- Be concise and clear — the user is new to the platform
- When referencing a Work365 term for the first time in a response, briefly define it

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
