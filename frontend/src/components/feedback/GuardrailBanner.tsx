import { ShieldAlert } from 'lucide-react';

interface GuardrailBannerProps {
  reason: string;
}

export const GuardrailBanner: React.FC<GuardrailBannerProps> = ({ reason }) => {
  let title = "Request Refused";
  let description = reason;

  if (reason === 'insufficient_evidence') {
    title = "Insufficient Evidence";
    description = "I couldn't find enough evidence in the provided dataset to answer that reliably. Please try rephrasing your question or ask something covered by the dataset.";
  } else if (reason === 'unsafe') {
    title = "Safety Violation";
    description = "This request violates our safety guidelines and cannot be processed.";
  } else if (reason === 'off-topic') {
    title = "Off-Topic";
    description = "This question appears to be off-topic. Please ask questions related to the provided dataset.";
  }

  return (
    <div className="card mb-6" style={{ backgroundColor: 'var(--error-bg)', borderColor: '#fca5a5' }}>
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-1" style={{ color: 'var(--error-color)' }} size={24} />
        <div>
          <h3 className="font-semibold text-lg" style={{ color: '#991b1b' }}>{title}</h3>
          <p className="mt-1" style={{ color: '#7f1d1d' }}>{description}</p>
        </div>
      </div>
    </div>
  );
};
