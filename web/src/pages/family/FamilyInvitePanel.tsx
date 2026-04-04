import { QrCode, Camera, Check, Copy } from 'lucide-react';
import { familyLocale } from '@/locale/familyLocale';

const l = familyLocale;

interface Props {
  inviteCode?: string;
  copied: boolean;
  onCopy: () => void;
  onShowQr: () => void;
  onScanQr: () => void;
}

export function FamilyInvitePanel({ inviteCode, copied, onCopy, onShowQr, onScanQr }: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
        <div className="flex items-center gap-2 mb-4">
          <QrCode className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-stone-800">{l.invite.title}</h3>
        </div>

        <div className="bg-[#f4f5f5] rounded-2xl p-4 mb-4">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">
            {l.invite.codeLabel}
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-stone-800 tracking-widest">
              {inviteCode}
            </span>
            <button
              onClick={onCopy}
              className="w-8 h-8 rounded-lg hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onShowQr}
          className="w-full bg-[#1b5e20] hover:bg-[#154c19] text-white font-bold py-3 rounded-2xl text-sm transition-all shadow-lg shadow-green-900/20"
        >
          {l.invite.showQrButton}
        </button>
      </div>

      <button
        onClick={onScanQr}
        className="w-full bg-white rounded-2xl p-5 shadow-sm border border-stone-100 hover:shadow-md transition-all flex items-center gap-3"
      >
        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
          <Camera className="w-5 h-5 text-violet-700" />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-stone-800">{l.invite.scan.title}</p>
          <p className="text-xs text-stone-400">{l.invite.scan.subtitle}</p>
        </div>
      </button>
    </div>
  );
}
