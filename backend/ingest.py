"""Run once to build the FAISS vector index from docs in knowledge_base/docs/."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from services.rag_service import rag_service

print("Starting ingestion...")
result = rag_service.ingest()
print(f"\nDone! Documents: {result['documents_processed']}, Chunks: {result['chunks_indexed']}")

print("\n--- Retrieval test ---")
for q in ["what is a billing contract", "provisioning failure", "onboarding stages"]:
    hits = rag_service.retrieve(q)
    if hits:
        h = hits[0]
        print(f"\nQ: {q}")
        print(f"   Score {h['score']:.3f} | {h['source']} p{h['page']}")
        print(f"   {h['text'][:180].strip()}...")
    else:
        print(f"\nQ: {q} -> no results above threshold")
