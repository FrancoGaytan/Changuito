import { themeConfig } from '@/utils/theme';
import { listsLocale } from '@/locale/listsLocale';

const l = listsLocale;

interface Props {
  newName: string;
  setNewName: (v: string) => void;
  newTheme: string;
  setNewTheme: (v: string) => void;
  isPending: boolean;
  onClose: () => void;
  onCreate: () => void;
}

export function CreateListModal({
  newName,
  setNewName,
  newTheme,
  setNewTheme,
  isPending,
  onClose,
  onCreate,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] w-full max-w-md p-8 shadow-2xl">
        <h2 className="text-xl font-bold text-[#1b5e20] mb-6">{l.createModal.title}</h2>

        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5 ml-1">
          {l.createModal.labels.name}
        </label>
        <input
          autoFocus
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={l.createModal.labels.namePlaceholder}
          className="w-full bg-[#f4f5f5] border border-stone-200 focus:border-emerald-500 focus:bg-white rounded-2xl px-4 py-3.5 text-[15px] text-stone-800 placeholder:text-stone-400 outline-none transition-colors mb-4"
          onKeyDown={(e) => e.key === 'Enter' && onCreate()}
        />

        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-2 ml-1">
          {l.createModal.labels.theme}
        </label>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {Object.entries(themeConfig).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <button
                key={key}
                onClick={() => setNewTheme(key)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                  newTheme === key
                    ? 'border-[#1b5e20] bg-stone-50'
                    : 'border-stone-100/80 hover:border-stone-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center ${newTheme === key ? cfg.bg : 'bg-stone-100'}`}>
                  <Icon className={`w-5 h-5 ${newTheme === key ? cfg.color : 'text-stone-400'}`} />
                </div>
                <span className={`text-[11px] font-bold ${newTheme === key ? 'text-stone-800' : 'text-stone-500'}`}>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl border-2 border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-50 transition-colors"
          >
            {l.createModal.actions.cancel}
          </button>
          <button
            onClick={onCreate}
            disabled={!newName.trim() || isPending}
            className="flex-1 py-3.5 rounded-2xl bg-[#1b5e20] hover:bg-[#154c19] text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-green-900/20"
          >
            {isPending ? l.createModal.actions.submitPending : l.createModal.actions.submitDefault}
          </button>
        </div>
      </div>
    </div>
  );
}
