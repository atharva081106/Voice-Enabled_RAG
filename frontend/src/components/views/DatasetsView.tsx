import React, { useState, useEffect, useRef } from 'react';
import { getDatasets, ingestDocument } from '../../api';

export const DatasetsView: React.FC = () => {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDatasets = async () => {
      setLoading(true);
      try {
        const data = await getDatasets();
        setDatasets([
          {
            id: '1',
            name: data.collection_name || 'unknown-collection',
            language: 'en',
            chunks: data.total_vectors || 0,
            status: 'Active'
          }
        ]);
      } catch (err) {
        console.error('Failed to fetch datasets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDatasets();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await ingestDocument(file);
      alert(`Successfully ingested ${res.chunks_indexed} chunks!`);
      // Refetch datasets to update count
      const data = await getDatasets();
      setDatasets([
        {
          id: '1',
          name: data.collection_name || 'unknown-collection',
          language: 'en',
          chunks: data.total_vectors || 0,
          status: 'Active'
        }
      ]);
    } catch (err) {
      console.error(err);
      alert('Failed to upload document.');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full flex flex-col gap-8">
      <div className="flex justify-between items-end border-b-hard pb-4">
        <div>
          <h2 className="font-headline-md text-headline-md uppercase text-primary mb-2">Datasets</h2>
          <p className="font-body-md text-on-surface-variant">Manage the vector database sources and chunking strategies.</p>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".txt,.pdf"
          onChange={handleFileChange}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-tertiary-orange text-primary border-hard shadow-hard py-3 px-6 uppercase text-label-bold font-label-bold hover:bg-primary hover:text-tertiary-orange active-press transition-colors cursor-pointer disabled:opacity-50"
        >
          {uploading ? 'Ingesting...' : '+ Ingest New'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-8 text-center font-body-md">Loading datasets...</div>
        ) : datasets.length === 0 ? (
          <div className="col-span-full py-8 text-center font-body-md text-error">Failed to load datasets or Qdrant is offline.</div>
        ) : (
          datasets.map((dataset) => (
            <div key={dataset.id} className="bg-surface-paper border-hard shadow-hard p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 uppercase text-label-sm font-label-bold border-hard ${dataset.status === 'Active' ? 'bg-tertiary-teal' : 'bg-surface-dim'}`}>
                    {dataset.status}
                  </span>
                  <span className="uppercase text-label-bold font-label-bold text-on-surface-variant">{dataset.language}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm uppercase text-primary mb-2 break-all">{dataset.name}</h3>
                <p className="font-body-md text-on-surface-variant mb-6">{dataset.chunks} chunks indexed</p>
              </div>
              
              <button className="w-full bg-surface text-primary border-hard shadow-hard py-2 uppercase text-label-bold font-label-bold hover:bg-surface-dim active-press transition-colors cursor-pointer">
                Manage
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
};
