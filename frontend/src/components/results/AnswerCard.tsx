import React from 'react';

interface AnswerCardProps {
  answer: string;
  grounded: boolean;
}

export function AnswerCard({ answer, grounded }: AnswerCardProps) {
  if (!answer) return null;
  
  return (
    <div className="bg-surface border-hard shadow-hard flex flex-col h-full max-h-[500px] mb-6">
      <div className="border-b-hard p-4 flex justify-between items-center bg-tertiary-container text-on-tertiary-container">
        <h3 className="font-label-bold text-label-bold uppercase text-on-tertiary">Generated Response</h3>
        {grounded && (
          <span className="bg-tertiary-teal text-on-tertiary px-2 py-1 font-label-bold text-label-bold border-hard">GROUNDED</span>
        )}
      </div>
      <div className="p-6 overflow-y-auto font-body-lg text-body-lg text-primary flex-1 px-8 py-8 max-w-[65ch] mx-auto">
        <p className="mb-4">{answer}</p>
      </div>
    </div>
  );
}
