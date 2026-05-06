# Feature Spec: RAG Knowledge Base

## Overview

The AI assistant's answers are grounded in Work365 documentation. Documents are chunked, embedded, and stored in a FAISS vector index. At query time, relevant chunks are retrieved and passed as context to the LLM, preventing hallucination and keeping answers accurate.

---

## Source Documents

Initial knowledge base (to be placed in `backend/knowledge_base/docs/`):

| File | Type | Description |
|------|------|-------------|
| `Work365_Team_Training_Guides.pdf` | PDF | PIQ framework, team roles, module guides, scenarios |
| _(add more as available)_ | PDF / MD / TXT | Onboarding guides, terminology glossary, workflow docs |

---

## Pipeline: Ingestion

Triggered via `POST /knowledge/ingest` (run once, or re-run when docs are updated).

```
1. Scan backend/knowledge_base/docs/ for supported files (PDF, .md, .txt)
2. For each file:
   a. Extract text (PyMuPDF for PDF, direct read for text/markdown)
   b. Split into chunks (chunk_size=500 tokens, overlap=50 tokens)
   c. Embed each chunk using sentence-transformers (all-MiniLM-L6-v2)
   d. Add to FAISS index with metadata: {source_file, page_number, chunk_index}
3. Persist FAISS index to backend/knowledge_base/vectors/index.faiss
4. Persist metadata mapping to backend/knowledge_base/vectors/metadata.json
```

### Chunking Strategy
- Chunk size: ~500 tokens (roughly 350–400 words)
- Overlap: 50 tokens — ensures context isn't cut at sentence boundaries
- Split on: paragraph breaks first, then sentence boundaries, then hard token limit

---

## Pipeline: Retrieval

Called by `services/rag_service.py` on every chat request.

```
1. Embed the user's query using the same model (all-MiniLM-L6-v2)
2. Search FAISS index for top-k=4 nearest chunks (cosine similarity)
3. Return chunks sorted by relevance score
4. Filter: discard chunks with similarity score < 0.35 (too low = not relevant)
5. Format as context block for LLM prompt
```

### Context Format Passed to LLM

```
--- KNOWLEDGE BASE CONTEXT ---
Source: Work365 Team Training Guides (Page 3)
"A billing contract in Work365 defines the billing cycle, proration rules,
 and invoice anchor date for a customer account..."

Source: Work365 Team Training Guides (Page 5)
"The billing anchor date determines when monthly invoices are generated..."
--- END CONTEXT ---
```

---

## Embedding Model

- **Model:** `sentence-transformers/all-MiniLM-L6-v2`
- **Rationale:** Runs locally, no API key needed, fast (~14ms/chunk), 384-dimensional vectors, strong performance on Q&A retrieval tasks
- **Alternative:** OpenAI `text-embedding-3-small` — swap in `rag_service.py` if needed

---

## FAISS Index

- **Index type:** `IndexFlatIP` (inner product = cosine similarity on normalized vectors)
- **Persistence:** `.faiss` binary + `.json` metadata sidecar
- **Re-ingestion:** deletes old index, rebuilds from scratch (acceptable for prototype scale)

---

## API Contract

### POST /knowledge/ingest

Triggers full re-ingestion of all docs in `knowledge_base/docs/`.

**Response:**
```json
{
  "data": {
    "documents_processed": 2,
    "chunks_indexed": 147,
    "index_path": "knowledge_base/vectors/index.faiss"
  },
  "error": null
}
```

### GET /knowledge/status

Returns current index status.

**Response:**
```json
{
  "data": {
    "indexed": true,
    "chunk_count": 147,
    "last_ingested": "2026-04-29T10:00:00Z",
    "documents": ["Work365_Team_Training_Guides.pdf"]
  },
  "error": null
}
```

---

## Backend Notes

- `services/rag_service.py` owns FAISS load/save, embed, search
- `routers/knowledge.py` exposes ingest and status endpoints
- FAISS index is loaded into memory at app startup (if exists)
- If no index exists at startup, the app still starts — the assistant will warn the user that the knowledge base isn't ready

---

## Adding New Documents

1. Drop file into `backend/knowledge_base/docs/`
2. Call `POST /knowledge/ingest`
3. No code changes needed

---

## Open Questions

- [ ] Should chunk metadata include section headings (e.g., "Module 5 — Billing") for better citations in assistant responses?
- [ ] Should the assistant cite sources in its responses (e.g., "Source: Training Guide, Page 3")? Likely yes — builds trust.
- [ ] Minimum similarity threshold (0.35) needs tuning during testing.
