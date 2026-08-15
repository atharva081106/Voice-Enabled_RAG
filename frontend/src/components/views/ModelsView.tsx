
export const ModelsView: React.FC = () => {
  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full flex flex-col gap-8">
      <div className="border-b-hard pb-4">
        <h2 className="font-headline-md text-headline-md uppercase text-primary mb-2">Models configuration</h2>
        <p className="font-body-md text-on-surface-variant">Configure active endpoints and models for each pipeline stage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Transcription Model */}
        <div className="bg-surface-paper border-hard shadow-hard p-6">
          <div className="flex justify-between items-center border-b-hard pb-4 mb-4">
            <h3 className="font-headline-sm text-headline-sm uppercase text-primary">Speech to Text</h3>
            <span className="px-2 py-1 uppercase text-label-sm font-label-bold bg-tertiary-teal border-hard">Active</span>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-label-bold text-label-bold uppercase text-on-surface-variant mb-1">Provider</label>
              <div className="border-hard p-3 font-body-md bg-surface">Sarvam AI</div>
            </div>
            <div>
              <label className="block font-label-bold text-label-bold uppercase text-on-surface-variant mb-1">Model</label>
              <div className="border-hard p-3 font-body-md bg-surface">speech-to-text-translate</div>
            </div>
          </div>
        </div>

        {/* Embedding Model */}
        <div className="bg-surface-paper border-hard shadow-hard p-6">
          <div className="flex justify-between items-center border-b-hard pb-4 mb-4">
            <h3 className="font-headline-sm text-headline-sm uppercase text-primary">Embeddings</h3>
            <span className="px-2 py-1 uppercase text-label-sm font-label-bold bg-tertiary-teal border-hard">Active</span>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-label-bold text-label-bold uppercase text-on-surface-variant mb-1">Provider</label>
              <div className="border-hard p-3 font-body-md bg-surface">HuggingFace / Local</div>
            </div>
            <div>
              <label className="block font-label-bold text-label-bold uppercase text-on-surface-variant mb-1">Model</label>
              <div className="border-hard p-3 font-body-md bg-surface">all-MiniLM-L6-v2</div>
            </div>
          </div>
        </div>

        {/* Generation Model */}
        <div className="bg-surface-paper border-hard shadow-hard p-6">
          <div className="flex justify-between items-center border-b-hard pb-4 mb-4">
            <h3 className="font-headline-sm text-headline-sm uppercase text-primary">LLM Generation</h3>
            <span className="px-2 py-1 uppercase text-label-sm font-label-bold bg-tertiary-teal border-hard">Active</span>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-label-bold text-label-bold uppercase text-on-surface-variant mb-1">Provider</label>
              <div className="border-hard p-3 font-body-md bg-surface">Google DeepMind</div>
            </div>
            <div>
              <label className="block font-label-bold text-label-bold uppercase text-on-surface-variant mb-1">Model</label>
              <div className="border-hard p-3 font-body-md bg-surface">gemini-1.5-flash</div>
            </div>
          </div>
        </div>

        {/* Fallback Model */}
        <div className="bg-surface-paper border-hard shadow-hard p-6 opacity-75">
          <div className="flex justify-between items-center border-b-hard pb-4 mb-4">
            <h3 className="font-headline-sm text-headline-sm uppercase text-primary">LLM Fallback</h3>
            <span className="px-2 py-1 uppercase text-label-sm font-label-bold bg-surface-dim border-hard">Standby</span>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-label-bold text-label-bold uppercase text-on-surface-variant mb-1">Provider</label>
              <div className="border-hard p-3 font-body-md bg-surface">Mistral AI</div>
            </div>
            <div>
              <label className="block font-label-bold text-label-bold uppercase text-on-surface-variant mb-1">Model</label>
              <div className="border-hard p-3 font-body-md bg-surface">mistral-large-latest</div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};
