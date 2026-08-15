import os
from typing import List, Dict, Any
from datasets import load_dataset
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client import models as qmodels
from langchain.text_splitter import RecursiveCharacterTextSplitter
import uuid

# Configuration
DATASET_NAME = "ai4bharat/msmarco-xi"
LANGUAGE = "en" # Start with English for demonstration
EMBEDDING_MODEL = "all-MiniLM-L6-v2" # Fast, low-latency model
QDRANT_PATH = "local_qdrant"
COLLECTION_NAME = "msmarco_chunks"
BATCH_SIZE = 100
MAX_SAMPLES = 500 # Limit for demo purposes

def initialize_qdrant() -> QdrantClient:
    client = QdrantClient(path=QDRANT_PATH)
    # Check if collection exists
    collections = client.get_collections().collections
    if not any(c.name == COLLECTION_NAME for c in collections):
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=qmodels.VectorParams(
                size=384, # all-MiniLM-L6-v2 dimension
                distance=qmodels.Distance.COSINE
            )
        )
    return client

def chunk_text(text: str, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
    chunks = []
    
    # Strategy 1: Adaptive token-window chunking (recursive char)
    recursive_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        length_function=len
    )
    rec_chunks = recursive_splitter.split_text(text)
    for i, c in enumerate(rec_chunks):
        chunks.append({
            "chunk_id": str(uuid.uuid4()),
            "parent_id": metadata["id"],
            "strategy": "recursive_character",
            "text": c,
            "metadata": {**metadata, "chunk_index": i},
            "token_count": len(c.split()) # Rough estimate
        })
        
    # Strategy 2: Semantic boundary (simple paragraph split for speed)
    paragraphs = [p for p in text.split('\n\n') if p.strip()]
    for i, p in enumerate(paragraphs):
        chunks.append({
            "chunk_id": str(uuid.uuid4()),
            "parent_id": metadata["id"],
            "strategy": "semantic_paragraph",
            "text": p,
            "metadata": {**metadata, "chunk_index": i},
            "token_count": len(p.split())
        })
        
    # Strategy 3: Semantic Sentence Split (Simple period split for speed)
    sentences = [s.strip() + "." for s in text.replace('?', '.').replace('!', '.').split('.') if s.strip()]
    for i, s in enumerate(sentences):
        # Only take sentences that are meaningful in length
        if len(s.split()) >= 3:
            chunks.append({
                "chunk_id": str(uuid.uuid4()),
                "parent_id": metadata["id"],
                "strategy": "semantic_sentence",
                "text": s,
                "metadata": {**metadata, "chunk_index": i},
                "token_count": len(s.split())
            })
        
    return chunks

def ingest():
    print(f"Loading mock data for {DATASET_NAME} ({LANGUAGE}) due to network timeouts...")
    mock_data = [
        {"id": "1", "title": "AI4Bharat MSMARCO-XI", "text": "MSMARCO-XI is a multilingual machine reading comprehension dataset by AI4Bharat. It contains translated versions of MSMARCO for various Indian languages."},
        {"id": "2", "title": "Retrieval Augmented Generation", "text": "Retrieval-Augmented Generation (RAG) is an AI framework for retrieving facts from an external knowledge base to ground large language models (LLMs) on the most accurate, up-to-date information."},
        {"id": "3", "title": "Vector Databases", "text": "Qdrant is a vector similarity search engine and vector database. It provides a production-ready service with a convenient API to store, search, and manage points (vectors with an additional payload)."},
        {"id": "4", "title": "Sentence Transformers", "text": "SentenceTransformers is a Python framework for state-of-the-art sentence, text and image embeddings. We use all-MiniLM-L6-v2 as a fast and efficient model."},
        {"id": "5", "title": "Chunking Strategies", "text": "Semantic chunking breaks text by logical boundaries. Adaptive token-window chunking uses a fixed size and overlap to ensure context is not lost across chunk boundaries. Semantic sentence chunking splits the text sentence by sentence."}
    ]
    
    print(f"Loading embedding model {EMBEDDING_MODEL}...")
    encoder = SentenceTransformer(EMBEDDING_MODEL)
    
    print("Initializing Qdrant...")
    client = initialize_qdrant()
    
    print("Processing and ingesting data...")
    count = 0
    batch_points = []
    
    for row in mock_data:
        if count >= MAX_SAMPLES:
            break
            
        doc_id = row.get("id") or str(uuid.uuid4())
        text = row.get("text", "") or row.get("passage", "")
        if not text:
            # Maybe the dataset has different column names
            # fallback to trying 'content' or converting dict to string for a quick mock if needed
            content = row.get("content", "")
            if content:
                text = content
            else:
                continue
            
        metadata = {"id": doc_id, "title": row.get("title", "No Title")}
        
        # Chunking
        chunks = chunk_text(text, metadata)
        
        for chunk in chunks:
            # Prepare for embedding
            batch_points.append(chunk)
            
        if len(batch_points) >= BATCH_SIZE:
            texts = [p["text"] for p in batch_points]
            embeddings = encoder.encode(texts).tolist()
            
            qdrant_points = [
                qmodels.PointStruct(
                    id=p["chunk_id"],
                    vector=emb,
                    payload={
                        "parent_id": p["parent_id"],
                        "strategy": p["strategy"],
                        "text": p["text"],
                        "metadata": p["metadata"],
                        "token_count": p["token_count"]
                    }
                )
                for p, emb in zip(batch_points, embeddings)
            ]
            
            client.upsert(
                collection_name=COLLECTION_NAME,
                points=qdrant_points
            )
            batch_points = []
            
        count += 1
        if count % 100 == 0:
            print(f"Processed {count} documents...")
            
    # Process remaining
    if batch_points:
        texts = [p["text"] for p in batch_points]
        embeddings = encoder.encode(texts).tolist()
        qdrant_points = [
            qmodels.PointStruct(
                id=p["chunk_id"],
                vector=emb,
                payload={
                    "parent_id": p["parent_id"],
                    "strategy": p["strategy"],
                    "text": p["text"],
                    "metadata": p["metadata"],
                    "token_count": p["token_count"]
                }
            )
            for p, emb in zip(batch_points, embeddings)
        ]
        client.upsert(
            collection_name=COLLECTION_NAME,
            points=qdrant_points
        )
            
    print(f"Ingestion complete. Processed {count} documents.")

if __name__ == "__main__":
    ingest()
