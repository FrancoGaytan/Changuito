import { useEffect, useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';

interface QrScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export function QrScanner({ onScan, onClose }: QrScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const handler = (ev: MessageEvent) => {
      const data = ev.data || {};
      if (!data || typeof data !== 'object') return;
      if (data.type === 'qr-scan') {
        try {
          onScan(String(data.data));
        } catch (e) {}
      }
      if (data.type === 'qr-error') {
        setError(String(data.error || 'Error del scanner'));
      }
      if (data.type === 'stopped') {
        // iframe reported it stopped — nothing else required
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    try {
      iframeRef.current?.contentWindow?.postMessage({ type: 'stop' }, '*');
    } catch (e) {
      // ignore
    }
    // give iframe a moment to stop, then close modal
    setTimeout(() => onClose(), 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-stone-800">Escanear QR</h3>
          </div>
          <button
            onClick={() => {
              handleClose();
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-100 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-stone-900">
            <iframe
              ref={iframeRef}
              title="qr-scanner"
              src="/qr-scanner.html"
              allow="camera; microphone; autoplay; encrypted-media"
              className="w-full h-full border-0"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-4 bg-red-50 rounded-xl py-3 px-4">
              {error}
            </p>
          )}

          <p className="text-stone-400 text-xs text-center mt-4">
            Apuntá la cámara al código QR del grupo familiar.
          </p>
        </div>
      </div>
    </div>
  );
}
