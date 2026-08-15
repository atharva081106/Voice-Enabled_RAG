import React from 'react';

interface TranscriptCardProps {
  transcript: string;
}

export function TranscriptCard({ transcript }: TranscriptCardProps) {
  if (!transcript) return null;
  
  return (
    <div className="bg-surface-paper border-hard shadow-hard flex flex-col mb-6">
      <div className="border-b-hard p-4 flex justify-between items-center bg-tertiary-orange text-primary">
        <h3 className="font-label-bold text-label-bold uppercase text-primary">Live Transcription</h3>
      </div>
      <div className="p-6 font-body-lg text-body-lg text-on-surface">
        "{transcript}"
      </div>
    </div>
  );
}
