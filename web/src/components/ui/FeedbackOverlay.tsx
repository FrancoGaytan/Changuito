import { useEffect, useState } from 'react';
import { ThumbsUp, XCircle } from 'lucide-react';

interface FeedbackOverlayProps {
  type: 'success' | 'error';
  message: string;
  onDone: () => void;
}

export function FeedbackOverlay({ type, message, onDone }: FeedbackOverlayProps) {
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter');

  useEffect(() => {
    const exitTimer = setTimeout(() => setPhase('exit'), 700);
    const doneTimer = setTimeout(() => onDone(), 1000);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  const isSuccess = type === 'success';

  return (
    <div
      className={[
        'fixed inset-0 z-[9999] flex flex-col items-center justify-center',
        'transition-opacity duration-300',
        phase === 'exit' ? 'opacity-0' : 'opacity-100',
      ].join(' ')}
      style={{
        backgroundColor: isSuccess ? 'rgba(187, 247, 208, 0.82)' : 'rgba(254, 202, 202, 0.82)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className={[
          'flex flex-col items-center gap-6',
          'transition-transform duration-300',
          phase === 'exit' ? 'scale-90' : 'scale-100',
        ].join(' ')}
        style={{ animation: phase === 'enter' ? 'feedback-bounce-in 0.35s ease-out' : undefined }}
      >
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center shadow-xl"
          style={{ backgroundColor: isSuccess ? 'rgba(21, 128, 61, 0.15)' : 'rgba(220, 38, 38, 0.15)' }}
        >
          {isSuccess
            ? <ThumbsUp className="w-16 h-16 text-green-700" />
            : <XCircle className="w-16 h-16 text-red-600" />
          }
        </div>
        <p
          className="text-2xl font-black tracking-tight text-center px-8"
          style={{ color: isSuccess ? '#14532d' : '#991b1b' }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
