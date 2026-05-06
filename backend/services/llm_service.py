from __future__ import annotations

from config import settings


class LLMService:
    def __init__(self):
        self._client = None

    def chat(self, messages: list[dict], system: str = "") -> str:
        if settings.LLM_PROVIDER == "anthropic":
            return self._anthropic(messages, system)
        if settings.LLM_PROVIDER == "openai":
            return self._openai(messages, system)
        raise ValueError(f"Unknown LLM_PROVIDER: {settings.LLM_PROVIDER!r}")

    # ------------------------------------------------------------------ #
    # Provider implementations
    # ------------------------------------------------------------------ #

    def _anthropic(self, messages: list[dict], system: str) -> str:
        import anthropic

        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        kwargs: dict = {
            "model": settings.LLM_MODEL,
            "max_tokens": 1024,
            "messages": messages,
        }
        if system:
            kwargs["system"] = system

        response = client.messages.create(**kwargs)
        return response.content[0].text

    def _openai(self, messages: list[dict], system: str) -> str:
        from openai import OpenAI

        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        all_messages = []
        if system:
            all_messages.append({"role": "system", "content": system})
        all_messages.extend(messages)

        response = client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=all_messages,
            max_tokens=1024,
        )
        return response.choices[0].message.content


llm_service = LLMService()
