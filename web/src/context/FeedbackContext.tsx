import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { FeedbackOverlay } from '@/components/ui/FeedbackOverlay';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FeedbackOptions {
  type: 'success' | 'error';
  message: string;
}

interface FeedbackContextValue {
  showFeedback: (opts: FeedbackOptions) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<FeedbackOptions | null>(null);

  const showFeedback = useCallback((opts: FeedbackOptions) => {
    setCurrent(opts);
  }, []);

  return (
    <FeedbackContext.Provider value={{ showFeedback }}>
      {children}
      {current && (
        <FeedbackOverlay
          type={current.type}
          message={current.message}
          onDone={() => setCurrent(null)}
        />
      )}
    </FeedbackContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback debe usarse dentro de FeedbackProvider');
  return ctx;
}
