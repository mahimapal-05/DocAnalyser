import os
from typing import List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn

from backend.parser import extract_document_text
from backend.agents import analyze_document_profile, answer_document_query

app = FastAPI(title="ClarityDoc AI Backend")

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store (simple cache for documents)
# In production, this can be backed by a DB or redis, but session cache is fine for a lightweight app
document_cache = {}

@app.get("/api/health")
async def health_check():
    """
    Checks if the Gemini API Key is configured in the environment.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    return {
        "status": "healthy",
        "has_key": bool(api_key)
    }

class ChatRequest(BaseModel):
    document_id: str
    message: str
    history: List[Dict[str, str]]

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Accepts file upload, extracts text, profiles the content, and caches it.
    """
    try:
        filename = file.filename
        file_bytes = await file.read()
        
        # 1. Parse text
        text = extract_document_text(filename, file_bytes)
        
        if not text:
            raise HTTPException(status_code=400, detail="Document contains no readable text.")
            
        # 2. Run agentic profiling
        profile = analyze_document_profile(filename, text)
        
        # Create a unique ID for the document session
        import uuid
        doc_id = str(uuid.uuid4())
        
        # Cache text and category
        document_cache[doc_id] = {
            "text": text,
            "category": profile.get("category", "general"),
            "filename": filename
        }
        
        # Return profile + doc_id
        return {
            "success": True,
            "doc_id": doc_id,
            "profile": profile,
            "filename": filename,
            "char_count": len(text)
        }
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload and analyze document: {str(e)}")

@app.post("/api/chat")
async def chat_with_document(payload: ChatRequest):
    """
    Handles conversational interactions regarding the uploaded document.
    """
    doc_id = payload.document_id
    if doc_id not in document_cache:
        raise HTTPException(status_code=404, detail="Document session not found or expired.")
        
    doc_info = document_cache[doc_id]
    text = doc_info["text"]
    category = doc_info["category"]
    
    try:
        # Get response and thoughts from routing agent
        result = answer_document_query(
            doc_text=text,
            category=category,
            chat_history=payload.history,
            user_query=payload.message
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent analysis failed: {str(e)}")

# Serve Static Files in Production (React Frontend Build)
# Locate frontend build files relative to the workspace root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
frontend_dist = os.path.join(BASE_DIR, "frontend", "dist")

if os.path.exists(frontend_dist):
    # Mount assets folder
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
    
    # Catch-all to serve index.html for frontend routing
    @app.get("/{catchall:path}")
    async def serve_frontend(catchall: str):
        # Prevent intercepting API endpoints
        if catchall.startswith("api/") or catchall.startswith("docs") or catchall.startswith("redoc") or catchall.startswith("openapi.json"):
            return None
        index_path = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        raise HTTPException(status_code=404, detail="Frontend build files not found.")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
