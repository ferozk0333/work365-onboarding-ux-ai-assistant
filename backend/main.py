import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

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


@app.get("/health")
def health():
    from services.rag_service import rag_service
    return {
        "status": "ok",
        "knowledge_base_ready": rag_service.is_ready,
        "chunk_count": rag_service.chunk_count,
    }


# Serve frontend static files — path is relative to this file
FRONTEND_DIR = Path(__file__).parent.parent / "frontend"

if FRONTEND_DIR.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIR / "assets"), name="assets")
    app.mount("/css",    StaticFiles(directory=FRONTEND_DIR / "css"),    name="css")
    app.mount("/js",     StaticFiles(directory=FRONTEND_DIR / "js"),     name="js")

    @app.get("/", response_class=FileResponse)
    def serve_index():
        return FileResponse(FRONTEND_DIR / "index.html")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
