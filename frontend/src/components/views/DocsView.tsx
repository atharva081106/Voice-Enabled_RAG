
export const DocsView: React.FC = () => {
  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full flex flex-col gap-8">
      <div className="border-b-hard pb-4">
        <h2 className="font-headline-md text-headline-md uppercase text-primary mb-2">Documentation</h2>
        <p className="font-body-md text-on-surface-variant">Guides, references, and tutorials for Neo-RAG.</p>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* /api/voice/query */}
        <div className="bg-surface-paper border-hard shadow-hard p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b-hard pb-2">
            <h3 className="font-headline-sm text-headline-sm uppercase text-primary flex items-center gap-2">
              <span className="bg-tertiary-orange text-primary px-2 py-1 text-xs">POST</span>
              /api/voice/query
            </h3>
          </div>
          <p className="font-body-md text-on-surface-variant">
            Upload an audio file to be transcribed, processed through the RAG pipeline, and answered.
          </p>
          <div className="bg-surface-dim border-hard p-4 font-mono text-sm">
            <p className="font-bold mb-2">Request (FormData):</p>
            <ul className="list-disc pl-5 mb-4 text-on-surface-variant">
              <li><span className="text-primary font-bold">audio</span>: File (webm/wav/mp3)</li>
              <li><span className="text-primary font-bold">session_id</span>: string (optional)</li>
            </ul>
            <p className="font-bold mb-2">Response:</p>
            <pre className="text-tertiary-teal">{`{
  "request_id": "uuid",
  "transcript": "Transcribed text...",
  "answer": "Generated LLM response...",
  "sources": [...],
  "grounded": true,
  "latency_ms": { ... }
}`}</pre>
          </div>
        </div>

        {/* /api/text/retrieve */}
        <div className="bg-surface-paper border-hard shadow-hard p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b-hard pb-2">
            <h3 className="font-headline-sm text-headline-sm uppercase text-primary flex items-center gap-2">
              <span className="bg-tertiary-orange text-primary px-2 py-1 text-xs">POST</span>
              /api/text/retrieve
            </h3>
          </div>
          <p className="font-body-md text-on-surface-variant">
            Perform a semantic search against the vector database using Mistral embeddings.
          </p>
          <div className="bg-surface-dim border-hard p-4 font-mono text-sm">
            <p className="font-bold mb-2">Request (JSON):</p>
            <pre className="text-on-surface-variant mb-4">{`{
  "query": "search query text",
  "limit": 5
}`}</pre>
            <p className="font-bold mb-2">Response:</p>
            <pre className="text-tertiary-teal">{`{
  "query": "search query text",
  "results": [
    {
      "chunk_id": "uuid",
      "text": "Chunk content...",
      "score": 0.89
    }
  ]
}`}</pre>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-8">
        
        {/* /api/history */}
        <div className="bg-surface-paper border-hard shadow-hard p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b-hard pb-2">
            <h3 className="font-headline-sm text-headline-sm uppercase text-primary flex items-center gap-2">
              <span className="bg-tertiary-teal text-primary px-2 py-1 text-xs">GET</span>
              /api/history
            </h3>
          </div>
          <p className="font-body-md text-on-surface-variant">
            Retrieve the session's voice query history.
          </p>
          <div className="bg-surface-dim border-hard p-4 font-mono text-sm">
            <p className="font-bold mb-2">Response:</p>
            <pre className="text-tertiary-teal">{`[
  {
    "id": "uuid",
    "query": "What is RAG?",
    "time": "2026-08-15 14:32",
    "status": "Success",
    "latency": "1540ms"
  }
]`}</pre>
          </div>
        </div>

        {/* /api/datasets */}
        <div className="bg-surface-paper border-hard shadow-hard p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b-hard pb-2">
            <h3 className="font-headline-sm text-headline-sm uppercase text-primary flex items-center gap-2">
              <span className="bg-tertiary-teal text-primary px-2 py-1 text-xs">GET</span>
              /api/datasets
            </h3>
          </div>
          <p className="font-body-md text-on-surface-variant">
            Get statistics and sample items from the Qdrant vector collection.
          </p>
          <div className="bg-surface-dim border-hard p-4 font-mono text-sm">
            <p className="font-bold mb-2">Response:</p>
            <pre className="text-tertiary-teal">{`{
  "collection_name": "msmarco_chunks",
  "total_vectors": 8800,
  "items": [
    {
      "chunk_id": "uuid",
      "parent_id": "doc_123",
      "title": "MSMARCO Docs",
      "text": "Chunk text...",
      "strategy": "recursive",
      "token_count": 256
    }
  ]
}`}</pre>
          </div>
        </div>

      </div>

    </main>
  );
};
