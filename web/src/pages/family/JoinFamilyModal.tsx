import { Modal } from '@/components/ui/Modal';
import { familyLocale } from '@/locale/familyLocale';

const l = familyLocale;

interface Props {
  joinCode: string;
  setJoinCode: (v: string) => void;
  isError: boolean;
  isPending: boolean;
  onClose: () => void;
  onJoin: () => void;
}

export function JoinFamilyModal({ joinCode, setJoinCode, isError, isPending, onClose, onJoin }: Props) {
  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold text-[#1b5e20] mb-6">{l.joinModal.title}</h2>
      <label className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5 ml-1">
        {l.joinModal.codeLabel}
      </label>
      <input
        autoFocus
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
        placeholder={l.joinModal.codePlaceholder}
        className="w-full bg-[#f4f5f5] border border-stone-200 focus:border-emerald-500 focus:bg-white rounded-2xl px-4 py-3.5 text-[15px] text-stone-800 placeholder:text-stone-400 outline-none transition-colors mb-2 uppercase tracking-widest text-center font-mono font-bold"
        onKeyDown={(e) => e.key === 'Enter' && onJoin()}
      />
      {isError && (
        <p className="text-red-500 text-[12px] text-center mb-4">
          {l.joinModal.errorMessage}
        </p>
      )}
      <div className="flex gap-3 mt-4">
        <button
          onClick={onClose}
          className="flex-1 py-3.5 rounded-2xl border-2 border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onJoin}
          disabled={!joinCode.trim() || isPending}
          className="flex-1 py-3.5 rounded-2xl bg-[#1b5e20] hover:bg-[#154c19] text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-green-900/20"
        >
          {isPending ? 'Uniéndome...' : 'Unirme'}
        </button>
      </div>
    </Modal>
  );
}
