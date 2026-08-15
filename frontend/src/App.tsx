import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { VoiceRecorder } from './components/voice/VoiceRecorder';
import { AnswerCard } from './components/results/AnswerCard';
import { TranscriptCard } from './components/results/TranscriptCard';
import { SourceCard } from './components/results/SourceCard';
import { LatencyTimeline } from './components/results/LatencyTimeline';
import { submitVoiceQuery, type FinalResponse } from './api';
import { HistoryView } from './components/views/HistoryView';
import { DatasetsView } from './components/views/DatasetsView';
import { ModelsView } from './components/views/ModelsView';
import { NewPipelineView } from './components/views/NewPipelineView';
import { DocsView } from './components/views/DocsView';
import { SupportView } from './components/views/SupportView';
import { ProfileView } from './components/views/ProfileView';
import { SettingsView } from './components/views/SettingsView';
import { LandingView } from './components/views/LandingView';
import { ExplorerView } from './components/views/ExplorerView';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('compute');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<FinalResponse | null>(null);

  const handleRecordingComplete = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      const result = await submitVoiceQuery(audioBlob);
      setResponse(result);
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Failed to process audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderContent = () => {
    if (activeTab === 'compute') {
      return (
        <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Voice Interaction & Metrics (Col 1-7) */}
          <section className="lg:col-span-7 flex flex-col gap-6">
            <VoiceRecorder 
              onRecordingComplete={handleRecordingComplete}
              isProcessing={isProcessing}
            />
            {response?.latency_ms && (
              <LatencyTimeline metrics={response.latency_ms} />
            )}
          </section>

          {/* Intelligence & Sources (Col 8-12) */}
          <section className="lg:col-span-5 flex flex-col gap-6">
            {response ? (
              <>
                {response.transcript && (
                  <TranscriptCard transcript={response.transcript} />
                )}
                
                {response.answer && (
                  <AnswerCard 
                    answer={response.answer} 
                    grounded={response.sources && response.sources.length > 0} 
                  />
                )}
                
                {response.sources && response.sources.length > 0 && (
                  <div className="bg-surface-paper border-hard shadow-hard p-4">
                    <h3 className="font-label-bold text-label-bold uppercase border-b-hard pb-2 mb-4">
                      Grounded Sources
                    </h3>
                    <div className="flex flex-col gap-4 max-h-[35vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                      {response.sources.map((source, index) => (
                        <SourceCard 
                          key={index} 
                          source={source} 
                          index={index} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-surface-paper border-hard shadow-hard p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <span className="material-symbols-outlined text-6xl text-tertiary-orange mb-4" style={{ fontVariationSettings: "'FILL' 0" }}>graphic_eq</span>
                <h3 className="font-headline-md text-headline-md uppercase text-primary mb-2">Awaiting Input</h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                  Record your voice query to search the knowledge base. The Neo-RAG pipeline will transcribe, retrieve, and synthesize an answer.
                </p>
              </div>
            )}
          </section>

        </main>
      );
    }

    if (activeTab === 'explorer') return <ExplorerView />;
    if (activeTab === 'history') return <HistoryView />;
    if (activeTab === 'datasets') return <DatasetsView />;
    if (activeTab === 'models') return <ModelsView />;
    if (activeTab === 'new-pipeline') return <NewPipelineView />;
    if (activeTab === 'docs') return <DocsView />;
    if (activeTab === 'support') return <SupportView />;
    if (activeTab === 'profile') return <ProfileView />;
    if (activeTab === 'settings') return <SettingsView />;

    // Fallback for unknown tabs
    return (
      <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full flex items-center justify-center">
        <div className="bg-surface-paper border-hard shadow-hard p-12 flex flex-col items-center justify-center text-center max-w-lg">
          <span className="material-symbols-outlined text-6xl text-tertiary-teal mb-4" style={{ fontVariationSettings: "'FILL' 0" }}>construction</span>
          <h2 className="font-headline-md text-headline-md uppercase text-primary mb-4 tracking-tighter">
            {activeTab.replace('-', ' ')}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            This module is currently under construction. Please check back later or use the Compute pipeline.
          </p>
          <button 
            onClick={() => setActiveTab('compute')}
            className="mt-8 bg-tertiary-orange text-primary border-hard shadow-hard font-label-bold text-label-bold uppercase py-3 px-8 hover:bg-primary hover:text-tertiary-orange active-press transition-colors cursor-pointer"
          >
            Back to Compute
          </button>
        </div>
      </main>
    );
  };

  if (showLanding) {
    return <LandingView onLaunch={() => setShowLanding(false)} />;
  }

  return (
    <div className="flex min-h-screen w-full bg-surface">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className={`flex-1 flex flex-col md:ml-64 ${activeTab === 'models' ? 'no-scrollbar' : ''}`}>
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        {renderContent()}
      </div>
    </div>
  );
}
