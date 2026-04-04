import { Search, Plus, Package } from 'lucide-react';
import { useProducts } from '@/features/inventory/hooks/useInventory';
import type { Product } from '@/types';
import { listDetailLocale } from '@/locale/listDetailLocale';

const l = listDetailLocale;

interface InventoryPanelProps {
  search: string;
  onSearch: (s: string) => void;
  onAdd: (product: Product) => void;
}

export function InventoryPanel({ search, onSearch, onAdd }: InventoryPanelProps) {
  const { data: products, isLoading } = useProducts();

  const filtered = (products ?? []).filter((p: Product) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-5 h-full flex flex-col">
      <h3 className="text-sm font-bold text-stone-700 mb-3 hidden md:block">
        {l.inventoryPanel.title}
      </h3>

      <div className="flex items-center bg-[#f4f5f5] border border-stone-200 rounded-xl px-3 py-2.5 mb-4 focus-within:border-emerald-500 focus-within:bg-white transition-colors">
        <Search className="w-4 h-4 text-stone-400 mr-2 flex-shrink-0" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={l.inventoryPanel.searchPlaceholder}
          className="bg-transparent border-none outline-none w-full text-sm text-stone-800 placeholder:text-stone-400"
        />
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 bg-stone-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <p className="text-stone-400 text-sm text-center py-6">
          {search ? l.inventoryPanel.emptySearch : l.inventoryPanel.emptyInventory}
        </p>
      )}

      <div className="space-y-1.5 flex-1 overflow-y-auto min-h-0 pb-16 md:pb-0">
        {filtered.map((product: Product) => (
          <button
            key={product.id}
            onClick={() => onAdd(product)}
            className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50 text-left transition-colors group"
          >
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-800 truncate">
                {product.name}
              </p>
              <p className="text-[11px] text-stone-400 capitalize">
                {product.category} · {product.stock} {product.unit}
              </p>
            </div>
            <Plus className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
