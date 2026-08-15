
export const NewPipelineView: React.FC = () => {
  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full flex flex-col gap-8">
      <div className="border-b-hard pb-4">
        <h2 className="font-headline-md text-headline-md uppercase text-primary mb-2">Create New Pipeline</h2>
        <p className="font-body-md text-on-surface-variant">Configure a new ingestion and RAG pipeline.</p>
      </div>

      <div className="bg-surface-paper border-hard shadow-hard-lg p-8 max-w-4xl">
        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          
          {/* Pipeline Name */}
          <div className="flex flex-col gap-2">
            <label className="font-label-bold text-label-bold uppercase text-primary">Pipeline Name</label>
            <input 
              type="text" 
              className="border-hard p-3 font-body-md bg-surface w-full focus:outline-none focus:ring-2 focus:ring-tertiary-orange" 
              placeholder="e.g. Customer Support Q&A"
            />
          </div>

          <div className="border-t-hard my-2"></div>

          {/* Data Source */}
          <div className="flex flex-col gap-2">
            <label className="font-label-bold text-label-bold uppercase text-primary">Data Source</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button type="button" className="border-hard p-4 bg-tertiary-teal text-on-tertiary hover:opacity-90 active-press transition-all flex flex-col items-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-3xl">upload_file</span>
                <span className="font-label-bold text-label-bold uppercase">Upload Documents</span>
              </button>
              <button type="button" className="border-hard p-4 bg-surface hover:bg-surface-dim active-press transition-all flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
                <span className="material-symbols-outlined text-3xl">link</span>
                <span className="font-label-bold text-label-bold uppercase">Web Scraper</span>
              </button>
              <button type="button" className="border-hard p-4 bg-surface hover:bg-surface-dim active-press transition-all flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
                <span className="material-symbols-outlined text-3xl">database</span>
                <span className="font-label-bold text-label-bold uppercase">Database URL</span>
              </button>
            </div>
          </div>

          <div className="border-t-hard my-2"></div>

          {/* Models */}
          <div className="flex flex-col gap-2">
            <label className="font-label-bold text-label-bold uppercase text-primary">Model Configuration</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-bold text-label-sm uppercase text-on-surface-variant mb-1">Embedding Model</label>
                <select className="border-hard p-3 font-body-md bg-surface w-full focus:outline-none focus:ring-2 focus:ring-tertiary-orange">
                  <option>all-MiniLM-L6-v2 (Local)</option>
                  <option>text-embedding-3-small (OpenAI)</option>
                  <option>voyage-large-2 (Voyage)</option>
                </select>
              </div>
              <div>
                <label className="block font-label-bold text-label-sm uppercase text-on-surface-variant mb-1">LLM Generation</label>
                <select className="border-hard p-3 font-body-md bg-surface w-full focus:outline-none focus:ring-2 focus:ring-tertiary-orange">
                  <option>gemini-1.5-flash (Google)</option>
                  <option>gpt-4o-mini (OpenAI)</option>
                  <option>claude-3-haiku (Anthropic)</option>
                  <option>mistral-large-latest (Mistral)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button type="submit" className="bg-tertiary-orange text-primary border-hard shadow-hard py-3 px-8 font-label-bold text-label-bold uppercase hover:bg-primary hover:text-tertiary-orange active-press transition-colors cursor-pointer">
              Create Pipeline
            </button>
          </div>

        </form>
      </div>
    </main>
  );
};
