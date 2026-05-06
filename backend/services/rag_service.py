from __future__ import annotations

import json
import os
from pathlib import Path

import fitz  # pymupdf
import faiss
import numpy as np

from config import settings

VECTORS_DIR = Path(__file__).parent.parent / "knowledge_base" / "vectors"
DOCS_DIR = Path(__file__).parent.parent / "knowledge_base" / "docs"
INDEX_PATH = VECTORS_DIR / "index.faiss"
METADATA_PATH = VECTORS_DIR / "metadata.json"


class RAGService:
    def __init__(self):
        self.index: faiss.Index | None = None
        self.metadata: list[dict] = []
        self._load_index()

    # ------------------------------------------------------------------ #
    # Public API
    # ------------------------------------------------------------------ #

    def ingest(self) -> dict:
        chunks, meta = [], []

        for filepath in sorted(DOCS_DIR.iterdir()):
            if filepath.suffix == ".pdf":
                for page_num, text in self._extract_pdf(filepath):
                    for chunk in self._chunk(text):
                        chunks.append(chunk)
                        meta.append({"source": filepath.name, "page": page_num})
            elif filepath.suffix in (".txt", ".md"):
                text = filepath.read_text(encoding="utf-8", errors="ignore")
                for chunk in self._chunk(text):
                    chunks.append(chunk)
                    meta.append({"source": filepath.name, "page": None})

        if not chunks:
            return {"documents_processed": 0, "chunks_indexed": 0}

        print(f"Embedding {len(chunks)} chunks via {settings.EMBEDDING_PROVIDER}...")
        embeddings = self._embed(chunks)
        embeddings = np.array(embeddings, dtype=np.float32)

        # Normalise for cosine similarity with IndexFlatIP
        norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
        embeddings = embeddings / np.where(norms == 0, 1, norms)

        self.index = faiss.IndexFlatIP(embeddings.shape[1])
        self.index.add(embeddings)
        self.metadata = [{"text": c, **m} for c, m in zip(chunks, meta)]

        VECTORS_DIR.mkdir(parents=True, exist_ok=True)
        faiss.write_index(self.index, str(INDEX_PATH))
        METADATA_PATH.write_text(json.dumps(self.metadata, ensure_ascii=False, indent=2))

        docs_processed = len({m["source"] for m in meta})
        print(f"Ingestion complete: {docs_processed} docs, {len(chunks)} chunks.")
        return {"documents_processed": docs_processed, "chunks_indexed": len(chunks)}

    def retrieve(self, query: str) -> list[dict]:
        if self.index is None or self.index.ntotal == 0:
            return []

        query_vec = np.array(self._embed([query]), dtype=np.float32)
        norm = np.linalg.norm(query_vec)
        if norm > 0:
            query_vec = query_vec / norm

        k = min(settings.RAG_TOP_K, self.index.ntotal)
        scores, indices = self.index.search(query_vec, k)

        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1 or float(score) < settings.RAG_MIN_SCORE:
                continue
            entry = self.metadata[idx]
            results.append({
                "text": entry["text"],
                "source": entry["source"],
                "page": entry.get("page"),
                "score": float(score),
            })
        return results

    @property
    def is_ready(self) -> bool:
        return self.index is not None and self.index.ntotal > 0

    @property
    def chunk_count(self) -> int:
        return self.index.ntotal if self.index else 0

    # ------------------------------------------------------------------ #
    # Embedding (API-based, no local model)
    # ------------------------------------------------------------------ #

    def _embed(self, texts: list[str]) -> list[list[float]]:
        if settings.EMBEDDING_PROVIDER == "openai":
            return self._embed_openai(texts)
        if settings.EMBEDDING_PROVIDER == "voyage":
            return self._embed_voyage(texts)
        raise ValueError(f"Unknown EMBEDDING_PROVIDER: {settings.EMBEDDING_PROVIDER!r}")

    def _embed_openai(self, texts: list[str]) -> list[list[float]]:
        from openai import OpenAI
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        # Batch in groups of 100 to stay within API limits
        all_embeddings = []
        for i in range(0, len(texts), 100):
            batch = texts[i:i + 100]
            response = client.embeddings.create(
                model="text-embedding-3-small",
                input=batch,
            )
            all_embeddings.extend([item.embedding for item in response.data])
        return all_embeddings

    def _embed_voyage(self, texts: list[str]) -> list[list[float]]:
        import voyageai
        client = voyageai.Client(api_key=settings.VOYAGE_API_KEY)
        result = client.embed(texts, model="voyage-3-lite", input_type="document")
        return result.embeddings

    # ------------------------------------------------------------------ #
    # Document parsing & chunking
    # ------------------------------------------------------------------ #

    def _load_index(self):
        if INDEX_PATH.exists() and METADATA_PATH.exists():
            self.index = faiss.read_index(str(INDEX_PATH))
            self.metadata = json.loads(METADATA_PATH.read_text())

    def _extract_pdf(self, filepath: Path) -> list[tuple[int, str]]:
        doc = fitz.open(str(filepath))
        return [
            (i + 1, page.get_text().strip())
            for i, page in enumerate(doc)
            if page.get_text().strip()
        ]

    def _chunk(self, text: str) -> list[str]:
        size = settings.CHUNK_SIZE
        overlap = settings.CHUNK_OVERLAP
        chunks, start = [], 0

        while start < len(text):
            end = min(start + size, len(text))

            if end < len(text):
                para = text.rfind("\n\n", start + size // 2, end)
                if para != -1:
                    end = para
                else:
                    sent = max(
                        text.rfind(". ", start + size // 2, end),
                        text.rfind(".\n", start + size // 2, end),
                    )
                    if sent != -1:
                        end = sent + 1

            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)
            start = end - overlap

        return chunks


rag_service = RAGService()
