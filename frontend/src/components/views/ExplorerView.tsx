import React, { useState } from 'react';
import { submitTextRetrieval, Source } from '../../api';
import { SourceCard } from '../results/SourceCard';

export const ExplorerView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const data = await submitTextRetrieval(query);
      setResults(data);
    } catch (err) {
      console.error(err);
      alert('Failed to retrieve chunks.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full flex flex-col gap-8">
      <div className="border-b-hard pb-4">
        <h2 className="font-headline-md text-headline-md uppercase text-primary mb-2">Explorer</h2>
        <p className="font-body-md text-on-surface-variant">Perform semantic search directly against the raw vector database.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for chunks... (e.g. 'What is RAG?')"
          className="flex-1 border-hard shadow-hard p-4 font-body-md bg-surface focus:outline-none focus:ring-2 focus:ring-tertiary-orange"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-primary text-on-primary border-hard shadow-hard px-8 font-label-bold text-label-bold uppercase hover:bg-tertiary-orange hover:text-primary active-press transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="bg-surface-paper border-hard shadow-hard-lg p-6">
          <h3 className="font-headline-sm text-headline-sm uppercase text-primary border-b-hard pb-2 mb-6">Top Matches</h3>
          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
            {results.map((source, idx) => (
              <SourceCard key={idx} source={source} index={idx} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
};
