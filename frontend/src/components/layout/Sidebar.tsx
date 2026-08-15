
interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const getTabClass = (tabId: string) => {
    const isActive = activeTab === tabId;
    if (isActive) {
      return "flex items-center gap-3 p-3 bg-tertiary-teal text-on-tertiary font-label-bold text-label-bold uppercase border-border-thick border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer";
    }
    return "flex items-center gap-3 p-3 text-on-surface-variant dark:text-on-tertiary-container hover:bg-surface-container-high font-label-bold text-label-bold uppercase hover:border-border-thick hover:border-primary hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all border border-transparent cursor-pointer";
  };

  return (
    <nav className="hidden md:flex flex-col h-full p-gutter gap-4 bg-surface-paper dark:bg-tertiary-container text-primary dark:text-primary-fixed border-r-border-thick border-primary dark:border-outline w-64 fixed left-0 top-0 z-20">
      <div className="mb-8">
        <h1 className="font-headline-md text-headline-md text-primary tracking-tighter">RAG CORE</h1>
        <p className="font-label-bold text-label-bold uppercase text-on-surface-variant">V2.0.4-STABLE</p>
      </div>
      <button onClick={() => onTabChange('new-pipeline')} className="bg-tertiary-orange text-primary border-hard shadow-hard font-label-bold text-label-bold uppercase py-3 px-4 w-full text-center hover:bg-primary hover:text-tertiary-orange active-press mb-8 transition-colors hover:shadow-hard-lg cursor-pointer">
        NEW PIPELINE
      </button>
      <div className="flex-1 flex flex-col gap-2">
        <a onClick={(e) => { e.preventDefault(); onTabChange('datasets'); }} className={getTabClass('datasets')} href="#">
          <span className="material-symbols-outlined">database</span>
          Datasets
        </a>
        <a onClick={(e) => { e.preventDefault(); onTabChange('models'); }} className={getTabClass('models')} href="#">
          <span className="material-symbols-outlined">layers</span>
          Models
        </a>
      </div>
      <div className="flex flex-col gap-2 mt-auto border-t-border-thick border-primary pt-4">
        <a onClick={(e) => { e.preventDefault(); onTabChange('docs'); }} className={getTabClass('docs')} href="#">
          <span className="material-symbols-outlined">description</span>
          Docs
        </a>
        <a onClick={(e) => { e.preventDefault(); onTabChange('support'); }} className={getTabClass('support')} href="#">
          <span className="material-symbols-outlined">help</span>
          Support
        </a>
      </div>
    </nav>
  );
}
