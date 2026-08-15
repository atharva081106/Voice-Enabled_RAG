interface LandingViewProps {
  onLaunch: () => void;
}

export const LandingView = ({ onLaunch }: LandingViewProps) => {
  return (
    <div className="min-h-screen w-full bg-surface-paper flex flex-col font-body-md selection:bg-primary selection:text-on-primary">
      {/* Navigation Bar */}
      <nav className="w-full border-b-hard p-4 md:p-6 flex justify-between items-center bg-surface-paper">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary text-on-primary flex items-center justify-center border-hard">
            <span className="font-label-bold text-label-bold uppercase">NR</span>
          </div>
          <span className="font-headline-sm text-headline-sm uppercase text-primary hidden md:block">Neo-RAG</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/atharva081106/Voice-Enabled_RAG" target="_blank" rel="noreferrer" className="font-label-bold text-label-bold uppercase text-on-surface-variant hover:text-primary transition-colors">
            GitHub
          </a>
          <button 
            onClick={onLaunch}
            className="bg-tertiary-orange text-primary border-hard shadow-hard py-2 px-6 font-label-bold text-label-bold uppercase hover:bg-primary hover:text-tertiary-orange active-press transition-colors cursor-pointer"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 md:p-12 relative overflow-hidden bg-surface">

        <div className="max-w-4xl flex flex-col items-center">
          <div className="inline-block bg-surface-dim border-hard px-4 py-1 mb-6 transform -rotate-2">
            <span className="font-label-bold text-label-bold uppercase text-primary">v2.0 Architecture</span>
          </div>
          
          <h1 className="font-headline-lg text-headline-lg uppercase text-primary mb-6 leading-none tracking-tighter" style={{ fontSize: 'clamp(4rem, 10vw, 8rem)' }}>
            Speak.<br/>Retrieve.<br/>
            <span className="text-on-primary bg-primary px-4 inline-block transform rotate-1 mt-2">Generate.</span>
          </h1>
          
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-12">
            The ultimate neo-brutalist dashboard for Voice-Enabled Retrieval Augmented Generation. Built for speed, precision, and unapologetic aesthetics.
          </p>

          <button 
            onClick={onLaunch}
            className="bg-primary text-on-primary border-hard shadow-hard-lg py-4 px-12 font-headline-sm text-headline-sm uppercase hover:bg-surface-paper hover:text-primary active-press transition-all cursor-pointer flex items-center gap-4 group"
          >
            Enter the Matrix
            <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
          </button>
        </div>
      </main>

      {/* Feature Grid */}
      <section className="w-full border-t-hard grid grid-cols-1 md:grid-cols-3 bg-surface-paper">
        <div className="p-8 md:p-12 border-b-hard md:border-b-0 md:border-r-hard flex flex-col gap-4 hover:bg-surface-dim transition-colors group cursor-pointer">
          <div className="w-16 h-16 bg-tertiary-orange border-hard flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">mic</span>
          </div>
          <h2 className="font-headline-sm text-headline-sm uppercase text-primary">Voice-First</h2>
          <p className="font-body-md text-on-surface-variant">Instant dictation and transcription powered by blazing-fast local models.</p>
        </div>
        
        <div className="p-8 md:p-12 border-b-hard md:border-b-0 md:border-r-hard flex flex-col gap-4 hover:bg-surface-dim transition-colors group cursor-pointer">
          <div className="w-16 h-16 bg-primary border-hard flex items-center justify-center text-on-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">database</span>
          </div>
          <h2 className="font-headline-sm text-headline-sm uppercase text-primary">Vector Grounding</h2>
          <p className="font-body-md text-on-surface-variant">Semantic retrieval utilizing Qdrant to ensure zero hallucinations in output.</p>
        </div>

        <div className="p-8 md:p-12 flex flex-col gap-4 hover:bg-surface-dim transition-colors group cursor-pointer">
          <div className="w-16 h-16 bg-surface-dim border-hard flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">bolt</span>
          </div>
          <h2 className="font-headline-sm text-headline-sm uppercase text-primary">LLM Synthesis</h2>
          <p className="font-body-md text-on-surface-variant">Intelligent agent pipelines synthesize multiple sources into clear, actionable answers.</p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full border-t-hard bg-primary text-on-primary p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-label-bold text-label-bold uppercase">&copy; 2026 NEO-RAG Initiative.</span>
        <span className="font-body-sm opacity-50 uppercase">Brutalist Design System Enabled</span>
      </footer>
    </div>
  );
};
