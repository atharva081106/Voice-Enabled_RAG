import React, { useState, useEffect } from 'react';
import { getHistory } from '../../api';

interface HistoryItem {
  id: string;
  query: string;
  time: string;
  status: string;
  latency: string;
}

export const HistoryView: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full">
      <div className="bg-surface-paper border-hard shadow-hard-lg p-8">
        <div className="flex justify-between items-center mb-8 border-b-hard pb-4">
          <h2 className="font-headline-md text-headline-md uppercase text-primary">Query History</h2>
          <button className="bg-surface text-primary border-hard shadow-hard py-2 px-4 uppercase text-label-bold font-label-bold hover:bg-tertiary-orange active-press transition-colors cursor-pointer">
            Export CSV
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b-hard border-t-hard">
                <th className="py-4 px-4 font-label-bold text-label-bold uppercase border-r-hard">Query</th>
                <th className="py-4 px-4 font-label-bold text-label-bold uppercase border-r-hard w-32">Status</th>
                <th className="py-4 px-4 font-label-bold text-label-bold uppercase border-r-hard w-32">Latency</th>
                <th className="py-4 px-4 font-label-bold text-label-bold uppercase w-40">Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-4 px-4 text-center font-body-md">Loading history...</td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 px-4 text-center font-body-md">No queries yet. Go speak to the matrix.</td>
                </tr>
              ) : (
                history.map((item, index) => (
                  <tr key={item.id} className={`border-b-hard ${index % 2 === 0 ? 'bg-surface-paper' : 'bg-surface-dim'}`}>
                    <td className="py-4 px-4 font-body-md border-r-hard truncate max-w-md" title={item.query}>{item.query}</td>
                    <td className="py-4 px-4 border-r-hard">
                      <span className={`px-2 py-1 uppercase text-label-bold font-label-bold border-hard ${item.status === 'Success' ? 'bg-tertiary-teal' : 'bg-error text-on-error'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-body-md border-r-hard">{item.latency}</td>
                    <td className="py-4 px-4 font-body-sm text-on-surface-variant">{item.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};
