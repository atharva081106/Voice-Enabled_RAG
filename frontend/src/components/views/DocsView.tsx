
export const DocsView: React.FC = () => {
  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full flex flex-col gap-8">
      <div className="border-b-hard pb-4">
        <h2 className="font-headline-md text-headline-md uppercase text-primary mb-2">Documentation</h2>
        <p className="font-body-md text-on-surface-variant">Guides, references, and tutorials for Neo-RAG.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Quick Start */}
        <div className="bg-surface-paper border-hard shadow-hard p-6 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-hard-lg transition-all cursor-pointer">
          <div className="w-12 h-12 bg-tertiary-orange text-primary border-hard flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">rocket_launch</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm uppercase text-primary border-b-hard pb-2">Quick Start</h3>
          <p className="font-body-md text-on-surface-variant flex-1">
            Learn how to set up your first RAG pipeline in under 5 minutes.
          </p>
          <span className="font-label-bold text-label-bold text-tertiary-teal uppercase flex items-center gap-1 mt-auto">
            Read More <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </span>
        </div>

        {/* API Reference */}
        <div className="bg-surface-paper border-hard shadow-hard p-6 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-hard-lg transition-all cursor-pointer">
          <div className="w-12 h-12 bg-tertiary-teal text-on-tertiary border-hard flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">code</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm uppercase text-primary border-b-hard pb-2">API Reference</h3>
          <p className="font-body-md text-on-surface-variant flex-1">
            Complete documentation of the Neo-RAG REST endpoints and WebSockets.
          </p>
          <span className="font-label-bold text-label-bold text-tertiary-teal uppercase flex items-center gap-1 mt-auto">
            Read More <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </span>
        </div>

        {/* Integrations */}
        <div className="bg-surface-paper border-hard shadow-hard p-6 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-hard-lg transition-all cursor-pointer">
          <div className="w-12 h-12 bg-primary text-on-primary border-hard flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">extension</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm uppercase text-primary border-b-hard pb-2">Integrations</h3>
          <p className="font-body-md text-on-surface-variant flex-1">
            Connect external vector databases (Qdrant, Pinecone) and custom LLMs.
          </p>
          <span className="font-label-bold text-label-bold text-tertiary-teal uppercase flex items-center gap-1 mt-auto">
            Read More <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </span>
        </div>

      </div>

    </main>
  );
};
