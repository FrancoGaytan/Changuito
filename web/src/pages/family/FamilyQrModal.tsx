import { Modal } from '@/components/ui/Modal';
import { Check, Copy } from 'lucide-react';
import { familyLocale } from '@/locale/familyLocale';

const l = familyLocale;

interface Props {
  qrDataUrl?: string;
  code?: string;
  inviteCode?: string;
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
}

export function FamilyQrModal({ qrDataUrl, code, inviteCode, copied, onCopy, onClose }: Props) {
  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <h2 className="text-xl font-bold text-[#1b5e20] mb-2">
          {l.qrModal.title}
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          {l.qrModal.description}
        </p>
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt={l.qrModal.imgAlt}
            className="w-64 h-64 mx-auto rounded-2xl shadow-lg mb-4"
          />
        ) : (
          <div className="w-64 h-64 mx-auto bg-stone-100 rounded-2xl animate-pulse mb-4" />
        )}
        <div className="bg-[#f4f5f5] rounded-xl px-4 py-3 inline-flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-stone-700 tracking-widest">
            {code ?? inviteCode}
          </span>
          <button
            onClick={onCopy}
            className="text-stone-500 hover:text-emerald-600 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </Modal>
  );
}
