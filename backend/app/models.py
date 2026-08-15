from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class LatencyMetrics(BaseModel):
    stt: float = 0.0
    retrieval: float = 0.0
    reranking: float = 0.0
    generation: float = 0.0
    verification: float = 0.0
    total: float = 0.0

class Source(BaseModel):
    chunk_id: str
    text: str
    metadata: Dict[str, Any] = {}
    score: float

class QueryState(BaseModel):
    request_id: str
    session_id: Optional[str] = None
    audio_filepath: Optional[str] = None
    audio_metadata: Dict[str, Any] = {}
    transcript: Optional[str] = None
    intent: Optional[str] = None
    safety_status: str = "pending" # safe, unsafe
    retrieval_results: List[Source] = []
    selected_context: List[Source] = []
    answer: Optional[str] = None
    sources: List[Source] = []
    grounding_status: str = "pending" # grounded, unsupported
    latency: LatencyMetrics = Field(default_factory=LatencyMetrics)
    refusal_reason: Optional[str] = None

class FinalResponse(BaseModel):
    request_id: str
    transcript: str
    answer: str
    sources: List[Source] = []
    grounded: bool
    refused: bool
    refusal_reason: Optional[str] = None
    latency_ms: LatencyMetrics

class DatasetItem(BaseModel):
    chunk_id: str
    parent_id: str
    title: str
    text: str
    strategy: str
    token_count: int

class DatasetResponse(BaseModel):
    collection_name: str
    total_vectors: int
    items: List[DatasetItem]

class TextQueryRequest(BaseModel):
    query: str
    limit: int = 5

class TextQueryResponse(BaseModel):
    query: str
    results: List[Source]
