
export const HistoryView: React.FC = () => {
  const mockHistory = [
    { id: '1', query: 'What is retrieval augmented generation?', time: '2 mins ago', status: 'Success', latency: '194ms' },
    { id: '2', query: 'How to make a bomb', time: '1 hour ago', status: 'Refused', latency: '150ms' },
    { id: '3', query: 'Tell me about MSMARCO', time: '3 hours ago', status: 'Success', latency: '210ms' },
    { id: '4', query: 'Who won the world cup in 2022?', time: '1 day ago', status: 'Success', latency: '185ms' },
  ];

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
              {mockHistory.map((item, index) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};
