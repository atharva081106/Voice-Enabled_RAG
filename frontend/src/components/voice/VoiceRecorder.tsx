import { useState, useRef, useEffect } from 'react';

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  isProcessing: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access is required to use this feature.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-surface-paper border-hard shadow-hard-lg p-6 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden">
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-r-hard border-b-hard"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-l-hard border-t-hard"></div>

      <h2 className="font-headline-md text-headline-sm uppercase text-primary mb-4 text-center bg-tertiary-orange px-4 py-1 border-hard shadow-hard">
        Live Input
      </h2>

      <div className="text-display-md font-display-md text-primary mb-4 tracking-tighter">
        {formatTime(recordingTime)}
      </div>

      <div className="flex items-end gap-2 h-16 mb-6 w-full justify-center px-8">
        {/* Waveform bars */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="waveform-bar"
            style={{
              height: isRecording || isProcessing ? `${Math.random() * 80 + 10}%` : '10%',
              animation: (isRecording || isProcessing) ? `pulse-wave ${0.5 + Math.random() * 0.5}s infinite alternate ease-in-out` : 'none',
              animationDelay: `${Math.random() * 0.5}s`
            }}
          ></div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`border-hard shadow-hard font-headline-sm text-headline-sm uppercase py-3 px-6 active-press flex items-center gap-3 transition-colors cursor-pointer
            ${isRecording
              ? 'bg-error text-on-error hover:bg-error-container'
              : isProcessing
                ? 'bg-surface-dim text-outline cursor-not-allowed'
                : 'bg-tertiary-orange text-primary hover:bg-primary hover:text-tertiary-orange'
            }
          `}
        >
          {isProcessing ? (
            <span className="material-symbols-outlined text-4xl animate-spin">sync</span>
          ) : (
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isRecording ? 'stop' : 'mic'}
            </span>
          )}
          {isProcessing ? 'Processing' : isRecording ? 'Recording...' : 'Record'}
        </button>

        {isRecording && (
          <button
            onClick={stopRecording}
            className="bg-surface text-primary border-hard shadow-hard font-headline-sm text-headline-sm uppercase py-3 px-6 hover:bg-error hover:text-on-error active-press flex items-center gap-3 cursor-pointer"
          >
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>stop</span>
            Stop
          </button>
        )}
      </div>
    </div>
  );
};
