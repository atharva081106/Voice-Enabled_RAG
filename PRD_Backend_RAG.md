# Backend PRD — Low-Latency Voice RAG

## Objective
Implement a robust backend that satisfies the task's voice, retrieval, orchestration, latency, and guardrail requirements.

## Pipeline
`Audio → STT → Query Classifier → Multi-Strategy Retrieval → Fusion/Reranking → Context Builder → LLM → Grounding Verifier → Response`

## Data Ingestion
Input dataset:
AI4Bharat MSMARCO-XI.

Build an offline ingestion pipeline that:
1. Downloads/loads the dataset.
2. Normalizes records.
3. Extracts useful metadata.
4. Creates multiple chunk representations.
5. Generates embeddings offline.
6. Writes vector indexes.
7. Builds lexical index if used.
8. Runs index validation.

## Chunking
Implement at least three meaningful strategies:
1. Semantic boundary chunking.
2. Adaptive token-window chunking with overlap.
3. Metadata/structure-aware chunking.

Optionally add parent-child retrieval.

Store:
- chunk_id
- parent_id
- source_id
- strategy
- text
- metadata
- embedding
- token_count

## Retrieval
For every query:
1. Generate query embedding.
2. Run dense retrieval.
3. Run lexical retrieval when useful.
4. Fuse results.
5. Deduplicate.
6. Rerank.
7. Select final evidence.

Keep top-k small enough to meet latency goals.

## Orchestration
Use a state-machine/harness approach.

State:
```text
request
  ↓
transcribe
  ↓
classify
  ├── unsafe → refuse
  ├── off-topic → refuse
  └── answerable
        ↓
      retrieve
        ↓
      rerank
        ↓
      generate
        ↓
      verify
        ├── grounded → respond
        └── unsupported → regenerate/refuse
```

Each node must expose:
- structured input
- structured output
- timeout
- retry count
- failure reason
- latency measurement

## Structured Schemas
### QueryState
- request_id
- session_id
- audio metadata
- transcript
- intent
- safety_status
- retrieval_results
- selected_context
- answer
- sources
- grounding_status
- latency

### FinalResponse
- transcript
- answer
- sources[]
- grounded
- refused
- refusal_reason
- latency

## Guardrails
### Unsafe
Refuse before retrieval/generation when possible.

### Off-topic
Detect questions outside the indexed corpus/domain.

### Insufficient evidence
If retrieval confidence is below threshold, do not invent an answer.

### Hallucination
Verify answer claims against selected evidence. On failure:
1. regenerate once with stricter evidence-only instructions;
2. if still unsupported, refuse.

## Generation Rules
System instruction:
- Answer only from supplied evidence.
- Do not invent facts.
- If evidence is insufficient, explicitly say so.
- Keep answers concise.
- Return source identifiers with claims where possible.

## API
### POST /api/voice/query
Multipart audio upload.

Response:
```json
{
  "request_id": "string",
  "transcript": "string",
  "answer": "string",
  "sources": [],
  "grounded": true,
  "refused": false,
  "refusal_reason": null,
  "latency_ms": {
    "stt": 0,
    "retrieval": 0,
    "reranking": 0,
    "generation": 0,
    "verification": 0,
    "total": 0
  }
}
```

### GET /api/health
Return:
- API status
- vector DB status
- model status
- STT status

## Performance
Measure P50, P70, P100 across a representative test suite.

Create:
`benchmark.py`

It should run N queries and output:
- percentile total latency
- stage percentiles
- retrieval quality metrics where labels exist
- error/refusal rate

## Optimization
- Precompute embeddings.
- Warm model workers.
- Keep vector DB connection alive.
- Parallelize independent retrieval operations.
- Use async FastAPI endpoints.
- Minimize context size.
- Avoid repeated model initialization.
- Cache safe reusable artifacts.
- Keep retries bounded.

## Testing
### Unit
- chunking
- metadata extraction
- ranking
- guardrails
- schemas

### Integration
- STT → retrieval
- retrieval → generation
- generation → verification
- complete voice query

### Evaluation
Create test sets for:
- answerable questions
- ambiguous questions
- off-topic questions
- unsafe questions
- no-evidence questions
- adversarial/prompt-injection attempts

## Definition of Done
- [ ] Dataset ingested.
- [ ] 3+ chunking strategies implemented.
- [ ] Vector retrieval working.
- [ ] Optional lexical retrieval integrated.
- [ ] Reranking working.
- [ ] STT provider integrated.
- [ ] Harness/orchestrator implemented.
- [ ] Guardrails implemented.
- [ ] Grounding verification implemented.
- [ ] Benchmark produces P50/P70/P100.
- [ ] End-to-end endpoint works.
- [ ] Frontend can consume the API.
- [ ] Production/demo deployment is stable.
