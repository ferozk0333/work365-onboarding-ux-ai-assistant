from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import chat, knowledge

app = FastAPI(title="Work365 Onboarding Assistant", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(knowledge.router)
# These routers will be added as features are built:
# app.include_router(progress.router)
# app.include_router(messages.router)
# app.include_router(lessons.router)


@app.get("/health")
def health():
    from services.rag_service import rag_service
    return {
        "status": "ok",
        "knowledge_base_ready": rag_service.is_ready,
        "chunk_count": rag_service.chunk_count,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
