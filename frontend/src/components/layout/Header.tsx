import { useState, useEffect } from 'react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const [isDark, setIsDark] = useState(() => {
    // Check local storage or system preference on initial load
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const getNavClass = (tabId: string) => {
    const isActive = activeTab === tabId;
    if (isActive) {
      return "font-headline-md text-headline-md uppercase text-tertiary-orange font-bold underline decoration-border-thick hover:bg-secondary-container dark:hover:bg-secondary-fixed-dim hover:text-on-secondary-container transition-all px-2 py-1 active:translate-x-1 active:translate-y-1 active:shadow-none transition-transform underline-offset-8 cursor-pointer";
    }
    return "font-headline-md text-headline-md uppercase text-on-surface dark:text-surface-variant hover:bg-secondary-container dark:hover:bg-secondary-fixed-dim hover:text-on-secondary-container transition-all px-2 py-1 active:translate-x-1 active:translate-y-1 active:shadow-none transition-transform cursor-pointer";
  };

  return (
    <header className="bg-surface dark:bg-on-background text-primary dark:text-inverse-primary w-full top-0 sticky border-b-border-thick border-primary dark:border-tertiary-fixed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10">
      <div className="flex justify-between items-center w-full px-margin-desktop py-4">
        <div className="flex items-center gap-8">
          <span className="font-display-xl text-headline-md font-bold text-tertiary-orange tracking-tighter block md:hidden">NEO-RAG</span>
          <nav className="hidden md:flex gap-6 items-center">
            <a onClick={(e) => { e.preventDefault(); onTabChange('explorer'); }} className={getNavClass('explorer')} href="#">Explorer</a>
            <a onClick={(e) => { e.preventDefault(); onTabChange('dashboard'); }} className={getNavClass('dashboard')} href="#">Dashboard</a>
            <a onClick={(e) => { e.preventDefault(); onTabChange('history'); }} className={getNavClass('history')} href="#">History</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex border-hard bg-surface overflow-hidden shadow-hard">
            <button 
              onClick={() => setIsDark(false)}
              className={`p-2 flex items-center justify-center transition-colors cursor-pointer ${!isDark ? 'bg-tertiary-teal text-on-tertiary' : 'hover:bg-tertiary-teal hover:text-on-tertiary'}`} 
              title="Light Mode"
            >
              <span className="material-symbols-outlined text-body-md" style={{ fontVariationSettings: "'FILL' 1" }}>light_mode</span>
            </button>
            <button 
              onClick={() => setIsDark(true)}
              className={`p-2 flex items-center justify-center transition-colors border-l-hard cursor-pointer ${isDark ? 'bg-tertiary-orange text-primary' : 'hover:bg-tertiary-orange'}`} 
              title="Dark Mode"
            >
              <span className="material-symbols-outlined text-body-md" style={{ fontVariationSettings: "'FILL' 1" }}>dark_mode</span>
            </button>
          </div>
          <button onClick={() => onTabChange('profile')} className={`p-2 border-hard bg-surface hover:bg-tertiary-teal hover:text-on-tertiary active-press shadow-hard cursor-pointer flex items-center justify-center ${activeTab === 'profile' ? 'bg-tertiary-teal text-on-tertiary' : ''}`}>
            <span className="material-symbols-outlined">account_circle</span>
          </button>
          <button onClick={() => onTabChange('settings')} className={`p-2 border-hard bg-surface hover:bg-tertiary-teal hover:text-on-tertiary active-press shadow-hard cursor-pointer flex items-center justify-center ${activeTab === 'settings' ? 'bg-tertiary-teal text-on-tertiary' : ''}`}>
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
