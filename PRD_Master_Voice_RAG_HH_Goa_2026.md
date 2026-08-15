# Product Requirements Document — Voice-Enabled RAG Model

## 1. Product Overview
Build a production-quality voice-enabled Retrieval-Augmented Generation (RAG) application for the HH Goa 2026 Shortlisting Task.

Core flow:
**Voice Input → Speech-to-Text → Query Processing → Multi-Strategy Chunking/Retrieval → Context Reranking → Grounded Answer Generation → Voice/Text Output**

The system must be fast, observable, resilient, and able to refuse unsupported or unsafe questions.

## 2. Source Requirements
Dataset: AI4Bharat MSMARCO-XI.
Speech-to-text: choose exactly one provider between Sarvam and ElevenLabs.
Target: complete processing pipeline under 200 ms.
Required latency reporting: P50, P70, P100 over a reasonable test set.
Required orchestration: tools, retries, structured I/O, and error recovery.
Required guardrails: off-topic detection, unsafe-input handling, hallucination/grounding checks, and refusal when evidence is insufficient.

## 3. Product Goals
- Deliver an end-to-end working voice RAG experience.
- Make retrieval substantially better than naive fixed-size chunking.
- Keep the hot query path extremely low latency.
- Make every generated answer traceable to retrieved context.
- Fail safely instead of hallucinating.
- Provide measurable latency and retrieval analytics.
- Produce a polished demo suitable for judging.

## 4. Non-Goals
- General-purpose autonomous agents unrelated to RAG.
- Training a new foundation model.
- Returning answers unsupported by the supplied corpus.
- Optimizing only for a single benchmark query.
- Building unnecessary enterprise infrastructure.

## 5. User Experience
### Main screen
- Clear product identity.
- Large microphone control.
- Recording state and waveform/level indicator.
- Live transcription.
- Answer area with concise response.
- Retrieved-source/context panel.
- Latency breakdown.
- Error/refusal state.

### Interaction states
1. Idle
2. Recording
3. Transcribing
4. Retrieving
5. Generating
6. Answer ready
7. Refused / insufficient evidence
8. Error / retry

## 6. Functional Requirements
### FR-01 Voice Input
User can start/stop recording and submit speech.

### FR-02 Speech-to-Text
Use Sarvam OR ElevenLabs. Return structured transcription with confidence/metadata where available.

### FR-03 Query Normalization
Normalize transcription, detect language/noise, remove irrelevant filler, and preserve question intent.

### FR-04 Query Classification
Classify as:
- in-domain
- off-topic
- unsafe
- ambiguous
- answerable
- insufficient-evidence candidate

### FR-05 Retrieval
Support multiple retrieval strategies rather than one naive fixed-size split.

Recommended strategy portfolio:
- semantic sentence/paragraph chunks
- adaptive token-window chunks
- overlap-aware chunks
- metadata-aware chunks
- parent-child retrieval
- query-dependent expansion

### FR-06 Hybrid Retrieval
Combine dense vector retrieval with lexical/BM25-style retrieval where useful, then rerank candidates.

### FR-07 Context Assembly
Deduplicate overlapping passages, preserve metadata, and fit the final context within the model's context budget.

### FR-08 Answer Generation
Generate concise answers using only retrieved evidence.

### FR-09 Grounding Check
Verify generated claims against retrieved evidence. If unsupported, regenerate with stricter context or refuse.

### FR-10 Guardrails
Reject or safely handle unsafe, malicious, off-topic, and unsupported requests.

### FR-11 Observability
Record:
- STT latency
- retrieval latency
- reranking latency
- generation latency
- guardrail latency
- total latency
- retrieval scores
- number of retrieved chunks
- refusal reason
- answer-grounding status

### FR-12 Error Recovery
Use bounded retries and graceful fallbacks for STT, vector DB, model, and network failures.

## 7. Technical Architecture
### Ingestion path
Dataset → document normalization → metadata extraction → multiple chunking strategies → embeddings → vector indexes + lexical index → index validation.

### Query path
Microphone → STT → query classifier → query embedding → parallel retrieval → fusion/reranking → context compression → guarded generation → grounding verifier → final response.

### Suggested components
- Frontend: React + Vite + TypeScript
- Backend: FastAPI + Python
- Orchestration: LangGraph or equivalent explicit state machine
- Vector DB: Qdrant
- Lexical retrieval: BM25/OpenSearch/Elasticsearch equivalent depending on deployment constraints
- Embeddings: high-quality sentence embedding model compatible with corpus language
- LLM: low-latency model with structured output support
- STT: Sarvam or ElevenLabs
- Deployment: Dockerized services

## 8. Harness / Orchestration
Represent each query as a typed state object.

Suggested states:
`RECEIVE → TRANSCRIBE → CLASSIFY → RETRIEVE → RERANK → GENERATE → VERIFY → RESPOND`

Every state must have:
- typed input/output
- timeout
- retry policy
- failure state
- telemetry
- deterministic transition rules

No single raw prompt-in/text-out implementation.

## 9. Latency Requirements
Hard target: <200 ms for the full measured pipeline as defined by the task.

Track P50, P70, P100 across a reasonable test set.

Create a benchmark endpoint/script that reports:
- total latency
- stage latency
- percentile latency
- failure rate

Optimize using:
- precomputed embeddings
- warm model processes
- parallel retrieval
- bounded top-k
- cached query embeddings where appropriate
- connection pooling
- minimal serialization
- async I/O
- compact prompts
- early refusal for obviously invalid queries

Important: explicitly document what is and is not included in the measured 200 ms number.

## 10. Quality Requirements
Retrieval:
- Recall@K
- MRR / nDCG where ground truth permits
- source diversity
- duplicate rate

Generation:
- groundedness
- answer relevance
- refusal correctness
- citation/source alignment

System:
- latency percentiles
- availability during demo
- error recovery success rate

## 11. Guardrail Design
Input guardrails:
- unsafe-content detection
- prompt-injection detection
- off-topic detection
- malformed transcription handling

Retrieval guardrails:
- minimum evidence score
- source diversity
- empty retrieval detection

Generation guardrails:
- structured answer schema
- evidence-required claims
- hallucination verification
- refusal when evidence is inadequate

Example refusal:
“I couldn't find enough evidence in the provided dataset to answer that reliably.”

## 12. API Contract
### POST /api/voice/query
Input:
- audio
- session_id
- optional language

Output:
- transcript
- answer
- sources
- refusal flag
- refusal_reason
- latency breakdown
- request_id

### GET /api/health
Return service health and dependency status.

### GET /api/metrics
Return benchmark/latency metrics for authorized development use.

## 13. Security
- Never expose model/API keys to frontend.
- Validate uploaded audio.
- Apply request size/time limits.
- Sanitize metadata.
- Rate-limit public endpoints.
- Do not log raw audio unless explicitly required.
- Avoid storing unnecessary personal voice data.

## 14. Acceptance Criteria
- [ ] Voice question can be submitted end to end.
- [ ] STT uses Sarvam or ElevenLabs.
- [ ] Dataset is ingested and indexed.
- [ ] More than one meaningful chunking strategy is implemented.
- [ ] Retrieval uses vector search and a documented ranking strategy.
- [ ] Model is orchestrated through explicit states/tools/retries.
- [ ] Unsafe/off-topic/unsupported questions are handled safely.
- [ ] Answers are grounded in retrieved context.
- [ ] P50/P70/P100 are measured over multiple queries.
- [ ] Latency is optimized toward the <200 ms requirement.
- [ ] Live demo works reliably.
- [ ] GitHub repository and live link are ready.
- [ ] Team/process video and demo video are prepared.

## 15. Deliverables
1. GitHub repository
2. Live working application
3. Benchmark/latency report
4. Architecture documentation
5. Team/process video
6. End-to-end demo video
7. Submission form completion

## 16. Deadline
Task launch: August 13, 2026.
Submission deadline: August 22, 2026, 11:59 PM.

## 17. Design Principle
Prioritize measurable engineering depth over visual complexity:
**fast retrieval + intelligent chunking + explicit orchestration + strong grounding + safe refusal + excellent observability.**
