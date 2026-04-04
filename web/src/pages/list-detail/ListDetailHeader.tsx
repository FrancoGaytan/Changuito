import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Save } from 'lucide-react';
import { listDetailLocale } from '@/locale/listDetailLocale';

const l = listDetailLocale;

interface Props {
  listName?: string;
  listTheme?: string;
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDelete: () => void;
}

export function ListDetailHeader({
  listName,
  listTheme,
  isDirty,
  isSaving,
  onSave,
  onDelete,
}: Props) {
  return (
    <div className="flex items-center justify-between mb-6 relative z-10">
      <div className="flex items-center gap-3">
        <Link
          to="/mis-listas"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-md hover:bg-white text-stone-600 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-3xl font-black text-stone-800 truncate drop-shadow-sm">
            {listName}
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/80 backdrop-blur text-stone-600 shadow-sm mt-1 capitalize">
            {listTheme === 'default' ? l.header.themeDefault : listTheme}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isDirty && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#1b5e20] hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            <span className="hidden md:inline">
            {isSaving ? l.header.savePending : l.header.saveDefault}
            </span>
          </button>
        )}

        <button
          onClick={onDelete}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-md hover:bg-red-50 hover:text-red-600 text-stone-400 transition-colors shadow-sm"
          title={l.header.deleteTitle}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
