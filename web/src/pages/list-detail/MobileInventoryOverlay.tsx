import { X } from 'lucide-react';
import type { Product } from '@/types';
import { InventoryPanel } from './InventoryPanel';
import { listDetailLocale } from '@/locale/listDetailLocale';

const l = listDetailLocale;

interface Props {
  inventorySearch: string;
  onSearch: (v: string) => void;
  onAdd: (product: Product) => void;
  onClose: () => void;
}

export function MobileInventoryOverlay({ inventorySearch, onSearch, onAdd, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden flex items-end">
      <div className="bg-white w-full rounded-t-[28px] max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h3 className="text-lg font-bold text-stone-800">{l.mobileOverlay.title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-100 text-stone-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <InventoryPanel
            search={inventorySearch}
            onSearch={onSearch}
            onAdd={onAdd}
          />
        </div>
      </div>
    </div>
  );
}
