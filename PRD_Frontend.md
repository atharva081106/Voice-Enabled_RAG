# Frontend PRD — Voice RAG Demo

## Objective
Create a polished, judge-friendly interface for the Voice-Enabled RAG Model.

## Visual Direction
- Light, modern, premium AI-product aesthetic.
- Avoid dark/heavy visual treatment.
- Strong typography hierarchy.
- Generous whitespace.
- Subtle gradients and glass/soft-card surfaces only where useful.
- Responsive desktop-first design.
- Micro-interactions should communicate system state rather than decorate.

## Main Layout
### Header
- Product logo/name
- Dataset indicator
- System status
- Optional GitHub/demo links

### Hero
- Short one-line value proposition
- Microphone CTA
- Supporting text explaining: ask a question by voice and receive a grounded answer.

### Query Workspace
- Large microphone button
- Recording waveform
- Timer
- Stop/cancel controls
- Transcript card
- Submit/retry controls

### Answer Workspace
- Answer prominently displayed
- Grounded source cards below
- Confidence/evidence indicator
- “Why this answer?” expandable panel

### Performance Panel
Show:
- STT
- Retrieval
- Reranking
- Generation
- Verification
- Total latency

Use a compact timeline/bar rather than a dense table.

### Refusal State
When the system cannot safely answer:
- Clear explanation
- No fabricated answer
- Suggested reformulation
- Evidence status

## Component Requirements
- VoiceRecorder
- RecordingWaveform
- TranscriptCard
- AnswerCard
- SourceCard
- LatencyTimeline
- GuardrailBanner
- SystemStatus
- ErrorState
- LoadingState

## Accessibility
- Keyboard accessible controls
- Visible focus states
- ARIA labels
- High contrast text
- Do not rely on color alone
- Clear recording state for color-blind users

## UX Acceptance Criteria
- User understands what to do within 3 seconds.
- Recording state is unmistakable.
- Transcription appears before final answer when available.
- Answer and evidence are visually connected.
- Latency is visible without overwhelming the user.
- Refusal is treated as a valid system outcome, not an error.
- Demo can be completed without navigating multiple pages.

## Technical Requirements
- React + TypeScript
- Vite
- Componentized architecture
- API client with typed response models
- WebSocket/SSE only if needed for streaming UX
- Error boundaries
- Responsive CSS
- No hardcoded API secrets

## Demo Priority
The primary demo path must be:
**Open app → click microphone → speak → see transcript → receive grounded answer → inspect sources → inspect latency.**
