import { Search, X } from 'lucide-react';
import { inventoryLocale } from '@/locale/inventoryLocale';

const l = inventoryLocale;

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

export function InventorySearch({ searchQuery, onSearchChange, onClear }: Props) {
  return (
    <div className="flex items-center bg-white border border-stone-200 rounded-2xl px-4 py-3 mb-4 focus-within:border-emerald-500 transition-colors shadow-sm">
      <Search className="w-5 h-5 text-stone-400 mr-3 flex-shrink-0" />
      <input
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={l.search.placeholder}
        className="bg-transparent border-none outline-none w-full text-[15px] text-stone-800 placeholder:text-stone-400"
      />
      {searchQuery && (
        <button onClick={onClear} className="text-stone-400 hover:text-stone-600">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
