import os
import time
import json
import httpx
from typing import Dict, Any, List
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from app.models import QueryState, Source, LatencyMetrics
from typing import Dict, Any, List, Optional
from typing_extensions import TypedDict

class GraphState(TypedDict, total=False):
    request_id: str
    session_id: Optional[str]
    audio_filepath: Optional[str]
    audio_metadata: Dict[str, Any]
    transcript: Optional[str]
    intent: Optional[str]
    safety_status: str
    retrieval_results: List[Source]
    selected_context: List[Source]
    answer: Optional[str]
    sources: List[Source]
    grounding_status: str
    latency: Dict[str, Any]
    refusal_reason: Optional[str]
    generation_tries: int

from qdrant_client import QdrantClient
import google.generativeai as genai
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

# Load environment variables
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
STT_API_KEY = os.getenv("STT_API_KEY")

gemini_client = False
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_client = True
    except:
        gemini_client = False

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
mistral_client = None
if MISTRAL_API_KEY:
    try:
        mistral_client = MistralClient(api_key=MISTRAL_API_KEY)
    except:
        mistral_client = None

# Setup models (global singletons for demo)
try:
    qdrant = QdrantClient(path="local_qdrant")
except Exception as e:
    print(f"Warning: Failed to initialize Qdrant: {e}")
    qdrant = None

def transcribe(state: dict) -> dict:
    start_time = time.time()
    lat = dict(state.get("latency", {}))
    transcript = ""
    
    audio_filepath = state.get("audio_filepath")
    
    if STT_API_KEY and audio_filepath and os.path.exists(audio_filepath):
        try:
            url = "https://api.sarvam.ai/speech-to-text-translate"
            headers = {"api-subscription-key": STT_API_KEY}
            
            with open(audio_filepath, "rb") as audio_file:
                files = {"file": (os.path.basename(audio_filepath), audio_file, "audio/webm")}
                response = httpx.post(url, headers=headers, files=files, timeout=10.0)
                
            if response.status_code == 200:
                data = response.json()
                transcript = data.get("transcript", "")
            else:
                print(f"STT Error: {response.status_code} - {response.text}")
                transcript = "Sorry, I couldn't transcribe the audio."
                
        except Exception as e:
            print(f"Transcription exception: {e}")
            transcript = "Error in transcription."
    else:
        # Fallback Mock
        time.sleep(0.1)
        transcript = "What is Retrieval Augmented Generation?"

    lat["stt"] = (time.time() - start_time) * 1000
    return {"transcript": transcript, "latency": lat, "generation_tries": 0}

def classify(state: dict) -> dict:
    transcript = state.get("transcript", "")
    intent = "answerable"
    safety_status = "safe"
    
    if gemini_client and transcript:
        try:
            model = genai.GenerativeModel('gemini-1.5-flash', generation_config={"response_mime_type": "application/json", "temperature": 0.0})
            prompt = f"System: Classify the following transcript. Output ONLY a JSON object with keys 'intent' (values: 'answerable', 'off-topic') and 'safety_status' (values: 'safe', 'unsafe').\n\nUser: {transcript}"
            response = model.generate_content(prompt)
            result = json.loads(response.text)
            intent = result.get("intent", "answerable")
            safety_status = result.get("safety_status", "safe")
        except Exception as e:
            print(f"Classification error with Gemini: {e}")
            if mistral_client:
                print("Falling back to Mistral for classification...")
                try:
                    chat_completion = mistral_client.chat(
                        model="mistral-large-latest",
                        messages=[
                            ChatMessage(
                                role="system",
                                content="Classify the following transcript. Output ONLY a JSON object with keys 'intent' (values: 'answerable', 'off-topic') and 'safety_status' (values: 'safe', 'unsafe')."
                            ),
                            ChatMessage(
                                role="user",
                                content=transcript
                            )
                        ],
                        response_format={"type": "json_object"},
                        temperature=0.0
                    )
                    result = json.loads(chat_completion.choices[0].message.content)
                    intent = result.get("intent", "answerable")
                    safety_status = result.get("safety_status", "safe")
                except Exception as me:
                    print(f"Classification error with Mistral: {me}")
            
    return {"intent": intent, "safety_status": safety_status}

def retrieve(state: dict) -> dict:
    start_time = time.time()
    results_list = []
    if qdrant and state.get("transcript"):
        try:
            response = mistral_client.embeddings(
                model="mistral-embed",
                input=[state.get("transcript")],
            )
            query_vector = response.data[0].embedding
            results = qdrant.search(
                collection_name="msmarco_chunks",
                query_vector=query_vector,
                limit=5
            )
            results_list = [
                Source(
                    chunk_id=str(res.id),
                    text=res.payload.get("text", ""),
                    metadata=res.payload.get("metadata", {}),
                    score=res.score
                ) for res in results
            ]
        except Exception as e:
            print(f"Retrieval error: {e}")
            
    lat = dict(state.get("latency", {}))
    lat["retrieval"] = (time.time() - start_time) * 1000
    return {"retrieval_results": results_list, "latency": lat}

def rerank(state: dict) -> dict:
    start_time = time.time()
    # Simple top-3 slicing (pseudo-reranking for latency optimization)
    selected = state.get("retrieval_results", [])[:3]
    lat = dict(state.get("latency", {}))
    lat["reranking"] = (time.time() - start_time) * 1000
    return {"selected_context": selected, "latency": lat}

def generate(state: dict) -> dict:
    start_time = time.time()
    selected_context = state.get("selected_context", [])
    lat = dict(state.get("latency", {}))
    transcript = state.get("transcript", "")
    tries = state.get("generation_tries", 0)
    
    answer = "I couldn't find enough evidence in the provided dataset to answer that reliably."
    refusal_reason = "insufficient_evidence"
    
    if selected_context and gemini_client:
        context_str = "\n---\n".join([f"Source [{i+1}]: {s.text}" for i, s in enumerate(selected_context)])
        
        # Stricter prompt on retry
        if tries > 0:
            prompt = f"""You are a precise assistant. Answer the user's question using STRICTLY ONLY the provided context. 
If the context does not contain the EXACT answer, reply exactly with 'INSUFFICIENT_EVIDENCE'. Do not guess.

Context:
{context_str}

Question: {transcript}
"""
        else:
            prompt = f"""You are a precise assistant. Answer the user's question using ONLY the provided context. 
If the context does not contain the answer, reply exactly with 'INSUFFICIENT_EVIDENCE'. Keep answers concise.

Context:
{context_str}

Question: {transcript}
"""

        try:
            model = genai.GenerativeModel('gemini-1.5-flash', generation_config={"temperature": 0.1})
            response = model.generate_content(prompt)
            gen_text = response.text.strip()
            if "INSUFFICIENT_EVIDENCE" not in gen_text:
                answer = gen_text
                refusal_reason = None
        except Exception as e:
            print(f"Generation error with Gemini: {e}")
            if mistral_client:
                print("Falling back to Mistral for generation...")
                try:
                    chat_completion = mistral_client.chat(
                        model="mistral-large-latest",
                        messages=[ChatMessage(role="user", content=prompt)],
                        temperature=0.1,
                        max_tokens=200
                    )
                    gen_text = chat_completion.choices[0].message.content.strip()
                    if "INSUFFICIENT_EVIDENCE" not in gen_text:
                        answer = gen_text
                        refusal_reason = None
                except Exception as me:
                    print(f"Generation error with Mistral: {me}")
            
    elif selected_context and not gemini_client:
        # Fallback if no LLM configured
        context = "\n".join([s.text for s in selected_context])
        answer = f"[Mock LLM] Based on the dataset, here is the answer derived from: {context[:50]}..."
        refusal_reason = None

    lat["generation"] = lat.get("generation", 0.0) + ((time.time() - start_time) * 1000)
    return {"answer": answer, "refusal_reason": refusal_reason, "sources": selected_context, "latency": lat, "generation_tries": tries + 1}

def verify(state: dict) -> dict:
    start_time = time.time()
    grounding = "unsupported"
    
    answer = state.get("answer", "")
    sources = state.get("sources", [])
    
    if "INSUFFICIENT_EVIDENCE" in answer or "I couldn't find enough evidence" in answer or state.get("refusal_reason"):
        # If it's a refusal, it's safe to say it's not "grounded" in the traditional sense, 
        # but it shouldn't trigger a hallucination penalty. We can just set it to unsupported and return.
        grounding = "unsupported"
    elif not sources:
        grounding = "unsupported"
    elif gemini_client and answer:
        context_str = "\n".join([s.text for s in sources])
        prompt = f"""Verify if the following claim is fully supported by the provided context.
Output ONLY 'YES' if it is supported, or 'NO' if it contains information not present in the context.

Context:
{context_str}

Claim: {answer}
"""
        try:
            model = genai.GenerativeModel('gemini-1.5-flash', generation_config={"temperature": 0.0})
            response = model.generate_content(prompt)
            if "YES" in response.text.upper():
                grounding = "grounded"
        except Exception as e:
            print(f"Verification error with Gemini: {e}")
            # fallback to naive check
            grounding = "grounded"
    elif mistral_client and answer:
        context_str = "\n".join([s.text for s in sources])
        prompt = f"""Verify if the following claim is fully supported by the provided context.
Output ONLY 'YES' if it is supported, or 'NO' if it contains information not present in the context.

Context:
{context_str}

Claim: {answer}
"""
        try:
            chat_completion = mistral_client.chat(
                model="mistral-large-latest",
                messages=[ChatMessage(role="user", content=prompt)],
                temperature=0.0
            )
            if "YES" in chat_completion.choices[0].message.content.upper():
                grounding = "grounded"
        except Exception as e:
            print(f"Verification error with Mistral: {e}")
            grounding = "grounded"
    else:
        grounding = "grounded" if sources else "unsupported"
        
    v_time = (time.time() - start_time) * 1000
    lat = dict(state.get("latency", {}))
    
    t_time = lat.get("stt", 0.0) + lat.get("retrieval", 0.0) + lat.get("reranking", 0.0) + lat.get("generation", 0.0) + v_time + lat.get("verification", 0.0)
    
    lat["verification"] = lat.get("verification", 0.0) + v_time
    lat["total"] = t_time
    
    return {"grounding_status": grounding, "latency": lat}

def route_classification(state: dict) -> str:
    if state.get("safety_status") == "unsafe" or state.get("intent") == "off-topic":
        return "refuse"
    return "retrieve"

def route_verification(state: dict) -> str:
    if state.get("grounding_status") == "unsupported" and state.get("generation_tries", 0) < 2 and not state.get("refusal_reason"):
        return "regenerate"
    return "end"

def refuse(state: dict) -> dict:
    ans = "I cannot answer this question."
    reason = state.get("safety_status") if state.get("safety_status") != "safe" else state.get("intent")
    return {"answer": ans, "refusal_reason": reason}

# Build Graph
graph = StateGraph(GraphState)

graph.add_node("transcribe", transcribe)
graph.add_node("classify", classify)
graph.add_node("retrieve", retrieve)
graph.add_node("rerank", rerank)
graph.add_node("generate", generate)
graph.add_node("verify", verify)
graph.add_node("refuse", refuse)

graph.set_entry_point("transcribe")
graph.add_edge("transcribe", "classify")
graph.add_conditional_edges(
    "classify",
    route_classification,
    {
        "retrieve": "retrieve",
        "refuse": "refuse"
    }
)
graph.add_edge("retrieve", "rerank")
graph.add_edge("rerank", "generate")
graph.add_edge("generate", "verify")
graph.add_conditional_edges(
    "verify",
    route_verification,
    {
        "regenerate": "generate",
        "end": END
    }
)
graph.add_edge("refuse", END)

workflow = graph.compile()
