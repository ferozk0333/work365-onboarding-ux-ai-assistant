from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).parent


class Settings(BaseSettings):
    # LLM
    LLM_PROVIDER: str = "anthropic"
    LLM_MODEL: str = "claude-sonnet-4-6"
    ANTHROPIC_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    # Embeddings (API-based, no local model)
    # "openai"  → text-embedding-3-small, needs OPENAI_API_KEY
    # "voyage"  → voyage-3-lite, needs VOYAGE_API_KEY
    EMBEDDING_PROVIDER: str = "openai"
    VOYAGE_API_KEY: str = ""

    # RAG tuning
    RAG_TOP_K: int = 4
    RAG_MIN_SCORE: float = 0.35
    CHUNK_SIZE: int = 2000
    CHUNK_OVERLAP: int = 200

    model_config = {"env_file": BASE_DIR.parent / ".env", "env_file_encoding": "utf-8"}


settings = Settings()
