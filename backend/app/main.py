from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
import uuid

from app.models import QueryState, FinalResponse, LatencyMetrics, DatasetResponse, DatasetItem, TextQueryRequest, TextQueryResponse, Source
from app.workflow import workflow, qdrant, mistral_client

app = FastAPI(title="Voice-Enabled RAG API")

# Global in-memory history
HISTORY = []

# Add CORS so frontend can communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "vector_db": "qdrant_local",
        "model": "all-MiniLM-L6-v2",
        "stt": "mock"
    }

import os
import tempfile

@app.post("/api/voice/query", response_model=FinalResponse)
async def voice_query(audio: UploadFile = File(...), session_id: Optional[str] = Form(None)):
    request_id = str(uuid.uuid4())
    
    # Save audio to a temporary file
    temp_dir = tempfile.gettempdir()
    temp_filepath = os.path.join(temp_dir, f"{request_id}_{audio.filename}")
    with open(temp_filepath, "wb") as f:
        f.write(await audio.read())
    
    # Initialize the state
    initial_state = QueryState(
        request_id=request_id,
        session_id=session_id,
        audio_filepath=temp_filepath
    )
    
    # Run the LangGraph workflow
    try:
        final_state = workflow.invoke(initial_state.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup temp file
        if os.path.exists(temp_filepath):
            os.remove(temp_filepath)
            
    import datetime
    HISTORY.insert(0, {
        "id": request_id,
        "query": final_state.get("transcript") or "Audio not transcribed",
        "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "status": "Success" if final_state.get("answer") else "Refused",
        "latency": f"{final_state.get('latency', 0)}ms"
    })
        
    return FinalResponse(
        request_id=final_state["request_id"],
        transcript=final_state["transcript"] or "",
        answer=final_state["answer"] or "Error processing request.",
        sources=final_state["sources"],
        grounded=final_state["grounding_status"] == "grounded",
        refused=final_state["refusal_reason"] is not None,
        refusal_reason=final_state["refusal_reason"],
        latency_ms=final_state["latency"]
    )

@app.get("/api/metrics")
async def metrics():
    # In a real app, this would query prometheus/datadog or a DB
    return {"metrics": "Not implemented"}

@app.get("/api/datasets", response_model=DatasetResponse)
async def get_datasets():
    if not qdrant:
        raise HTTPException(status_code=500, detail="Qdrant client not initialized")
    
    collection_name = "msmarco_chunks"
    try:
        # Get collection info
        collection_info = qdrant.get_collection(collection_name)
        total_vectors = collection_info.points_count
        
        # Scroll points to get a sample
        results, next_page_offset = qdrant.scroll(
            collection_name=collection_name,
            limit=50,
            with_payload=True,
            with_vectors=False
        )
        
        items = []
        for res in results:
            payload = res.payload or {}
            items.append(DatasetItem(
                chunk_id=str(res.id),
                parent_id=str(payload.get("parent_id", "")),
                title=payload.get("metadata", {}).get("title", "Unknown"),
                text=payload.get("text", ""),
                strategy=payload.get("strategy", "unknown"),
                token_count=payload.get("token_count", 0)
            ))
            
        return DatasetResponse(
            collection_name=collection_name,
            total_vectors=total_vectors,
            items=items
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/text/retrieve", response_model=TextQueryResponse)
async def text_retrieve(request: TextQueryRequest):
    if not qdrant:
        raise HTTPException(status_code=500, detail="Search engine not initialized")
        
    try:
        response = mistral_client.embeddings(
            model="mistral-embed",
            input=[request.query],
        )
        query_vector = response.data[0].embedding
        results = qdrant.search(
            collection_name="msmarco_chunks",
            query_vector=query_vector,
            limit=request.limit
        )
        
        sources = [
            Source(
                chunk_id=str(res.id),
                text=res.payload.get("text", ""),
                metadata=res.payload.get("metadata", {}),
                score=res.score
            ) for res in results
        ]
        
        return TextQueryResponse(query=request.query, results=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# MOCK DATA FOR DASHBOARD WIRING
MOCK_PROFILE = {
    "name": "Neo",
    "email": "neo@matrix.io",
    "role": "Architect"
}

MOCK_SETTINGS = {
    "theme": "dark",
    "default_model": "mistral-large-latest",
    "notifications": True
}

@app.get("/api/profile")
async def get_profile():
    return MOCK_PROFILE

@app.post("/api/profile")
async def update_profile(data: dict):
    global MOCK_PROFILE
    MOCK_PROFILE.update(data)
    return {"status": "success", "profile": MOCK_PROFILE}

@app.get("/api/settings")
async def get_settings():
    return MOCK_SETTINGS

@app.post("/api/settings")
async def update_settings(data: dict):
    global MOCK_SETTINGS
    MOCK_SETTINGS.update(data)
    return {"status": "success", "settings": MOCK_SETTINGS}

@app.post("/api/support")
async def submit_support(data: dict):
    # Mock saving a ticket
    return {"status": "success", "ticket_id": str(uuid.uuid4())}

@app.get("/api/history")
async def get_history():
    return HISTORY

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
