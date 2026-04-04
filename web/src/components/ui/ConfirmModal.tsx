import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-white rounded-[28px] w-full max-w-sm shadow-2xl overflow-hidden animate-fade-in-scale">
        {/* Icon strip */}
        <div className={`px-8 pt-8 pb-4 flex flex-col items-center text-center`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${danger ? 'bg-red-50' : 'bg-emerald-50'}`}>
            <AlertTriangle className={`w-8 h-8 ${danger ? 'text-red-500' : 'text-emerald-600'}`} />
          </div>
          <h2 className="text-lg font-black text-stone-800 mb-2">
            {title}
          </h2>
          <p className="text-sm text-stone-500 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-8 pb-8 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-2xl border-2 border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-sm ${
              danger
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'
                : 'bg-[#1b5e20] hover:bg-[#154c19] text-white shadow-green-900/20'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
