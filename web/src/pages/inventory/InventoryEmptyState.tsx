import { Plus, Package } from 'lucide-react';
import { inventoryLocale } from '@/locale/inventoryLocale';

const l = inventoryLocale;

interface Props {
  onAddClick: () => void;
}

export function InventoryEmptyState({ onAddClick }: Props) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Package className="w-10 h-10 text-emerald-600" />
      </div>
      <h3 className="text-lg font-bold text-stone-700 mb-2">{l.emptyState.title}</h3>
      <p className="text-stone-500 text-sm max-w-xs mx-auto mb-6">
        {l.emptyState.description}
      </p>
      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-2 bg-[#1b5e20] hover:bg-[#154c19] text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-lg shadow-green-900/20"
      >
        <Plus className="w-5 h-5" />
        {l.emptyState.cta}
      </button>
    </div>
  );
}
