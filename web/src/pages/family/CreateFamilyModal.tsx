import { Modal } from '@/components/ui/Modal';
import { familyLocale } from '@/locale/familyLocale';

const l = familyLocale;

interface Props {
  familyName: string;
  setFamilyName: (v: string) => void;
  isPending: boolean;
  onClose: () => void;
  onCreate: () => void;
}

export function CreateFamilyModal({ familyName, setFamilyName, isPending, onClose, onCreate }: Props) {
  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold text-[#1b5e20] mb-6">{l.createModal.title}</h2>
      <label className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5 ml-1">
        {l.createModal.nameLabel}
      </label>
      <input
        autoFocus
        value={familyName}
        onChange={(e) => setFamilyName(e.target.value)}
        placeholder={l.createModal.namePlaceholder}
        className="w-full bg-[#f4f5f5] border border-stone-200 focus:border-emerald-500 focus:bg-white rounded-2xl px-4 py-3.5 text-[15px] text-stone-800 placeholder:text-stone-400 outline-none transition-colors mb-6"
        onKeyDown={(e) => e.key === 'Enter' && onCreate()}
      />
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3.5 rounded-2xl border-2 border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onCreate}
          disabled={!familyName.trim() || isPending}
          className="flex-1 py-3.5 rounded-2xl bg-[#1b5e20] hover:bg-[#154c19] text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-green-900/20"
        >
          {isPending ? 'Creando...' : 'Crear'}
        </button>
      </div>
    </Modal>
  );
}
