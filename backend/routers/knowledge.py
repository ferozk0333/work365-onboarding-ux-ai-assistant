import os
from pathlib import Path

from fastapi import APIRouter

from services.rag_service import rag_service, DOCS_DIR

router = APIRouter(prefix="/knowledge", tags=["knowledge"])


@router.post("/ingest")
async def ingest():
    result = rag_service.ingest()
    return {"data": result, "error": None}


@router.get("/status")
async def status():
    docs = [
        f for f in os.listdir(DOCS_DIR)
        if Path(f).suffix in (".pdf", ".txt", ".md")
    ] if DOCS_DIR.exists() else []

    return {
        "data": {
            "indexed": rag_service.is_ready,
            "chunk_count": rag_service.chunk_count,
            "documents": docs,
        },
        "error": None,
    }
