import React from 'react';

export const DatasetsView: React.FC = () => {
  const mockDatasets = [
    { id: '1', name: 'ai4bharat/msmarco-xi', language: 'en', chunks: 1450, status: 'Active' },
    { id: '2', name: 'internal-docs-v1', language: 'en', chunks: 320, status: 'Active' },
    { id: '3', name: 'customer-support-logs', language: 'en', chunks: 8900, status: 'Indexing' },
  ];

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full flex flex-col gap-8">
      <div className="flex justify-between items-end border-b-hard pb-4">
        <div>
          <h2 className="font-headline-md text-headline-md uppercase text-primary mb-2">Datasets</h2>
          <p className="font-body-md text-on-surface-variant">Manage the vector database sources and chunking strategies.</p>
        </div>
        <button className="bg-tertiary-orange text-primary border-hard shadow-hard py-3 px-6 uppercase text-label-bold font-label-bold hover:bg-primary hover:text-tertiary-orange active-press transition-colors cursor-pointer">
          + Ingest New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockDatasets.map((dataset) => (
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
        ))}
      </div>
    </main>
  );
};
