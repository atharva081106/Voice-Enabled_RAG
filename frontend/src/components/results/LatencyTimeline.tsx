import type { LatencyMetrics } from '../../api';

interface LatencyTimelineProps {
  metrics: LatencyMetrics;
}

export function LatencyTimeline({ metrics }: LatencyTimelineProps) {
  return (
    <div className="bg-surface border-hard shadow-hard p-6">
      <h3 className="font-label-bold text-label-bold uppercase border-b-hard pb-2 mb-4">Pipeline Latency</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border-hard p-3 bg-surface-paper relative shadow-hard hover:translate-y-[-2px] transition-transform flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-label-bold uppercase block mb-1 text-on-surface-variant">STT</span>
          <span className="text-3xl font-headline-md block leading-none truncate max-w-full" title={`${metrics.stt.toFixed(0)}ms`}>{metrics.stt.toFixed(0)}ms</span>
        </div>
        <div className="border-hard p-3 bg-tertiary-teal text-on-tertiary relative shadow-hard hover:translate-y-[-2px] transition-transform flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-label-bold uppercase block mb-1 opacity-80">Retrieval</span>
          <span className="text-3xl font-headline-md block leading-none truncate max-w-full" title={`${metrics.retrieval.toFixed(0)}ms`}>{metrics.retrieval.toFixed(0)}ms</span>
        </div>
        <div className="border-hard p-3 bg-surface-paper relative shadow-hard hover:translate-y-[-2px] transition-transform flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-label-bold uppercase block mb-1 text-on-surface-variant">Rerank</span>
          <span className="text-3xl font-headline-md block leading-none truncate max-w-full" title={`${metrics.reranking.toFixed(0)}ms`}>{metrics.reranking.toFixed(0)}ms</span>
        </div>
        <div className="border-hard p-3 bg-surface-paper relative shadow-hard hover:translate-y-[-2px] transition-transform flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-label-bold uppercase block mb-1 text-on-surface-variant">LLM</span>
          <span className="text-3xl font-headline-md block leading-none truncate max-w-full" title={`${metrics.generation.toFixed(0)}ms`}>{metrics.generation.toFixed(0)}ms</span>
        </div>
      </div>
    </div>
  );
}
