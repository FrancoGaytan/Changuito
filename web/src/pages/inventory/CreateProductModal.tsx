import type { ProductCategory } from '@/types';
import { categories } from './categories';
import { inventoryLocale } from '@/locale/inventoryLocale';

const l = inventoryLocale;

interface Props {
  newName: string;
  setNewName: (v: string) => void;
  newCategory: ProductCategory;
  setNewCategory: (v: ProductCategory) => void;
  newUnit: string;
  setNewUnit: (v: string) => void;
  newStock: number;
  setNewStock: (v: number) => void;
  isPending: boolean;
  onClose: () => void;
  onCreate: () => void;
}

export function CreateProductModal({
  newName,
  setNewName,
  newCategory,
  setNewCategory,
  newUnit,
  setNewUnit,
  newStock,
  setNewStock,
  isPending,
  onClose,
  onCreate,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] w-full max-w-md p-8 shadow-2xl">
        <h2 className="text-xl font-bold text-[#1b5e20] mb-6">{l.createModal.title}</h2>

        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5 ml-1">
              {l.createModal.labels.name}
            </label>
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={l.createModal.labels.namePlaceholder}
              className="w-full bg-[#f4f5f5] border border-stone-200 focus:border-emerald-500 focus:bg-white rounded-2xl px-4 py-3.5 text-[15px] text-stone-800 placeholder:text-stone-400 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-2 ml-1">
              {l.createModal.labels.category}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories
                .filter((c) => c.key !== 'todos')
                .map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setNewCategory(key as ProductCategory)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border-2 transition-all ${
                      newCategory === key
                        ? 'border-[#1b5e20] bg-emerald-50 text-[#1b5e20]'
                        : 'border-stone-200 text-stone-500 hover:border-stone-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5 ml-1">
                {l.createModal.labels.unit}
              </label>
              <select
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                className="w-full bg-[#f4f5f5] border border-stone-200 focus:border-emerald-500 rounded-2xl px-4 py-3.5 text-[15px] text-stone-800 outline-none transition-colors appearance-none"
              >
                <option value="unidad">{l.createModal.units.unidad}</option>
                <option value="kg">{l.createModal.units.kg}</option>
                <option value="L">{l.createModal.units.L}</option>
                <option value="g">{l.createModal.units.g}</option>
                <option value="ml">{l.createModal.units.ml}</option>
                <option value="paquete">{l.createModal.units.paquete}</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5 ml-1">
                {l.createModal.labels.initialStock}
              </label>
              <input
                type="number"
                min={0}
                value={newStock}
                onChange={(e) => setNewStock(Math.max(0, +e.target.value))}
                className="w-full bg-[#f4f5f5] border border-stone-200 focus:border-emerald-500 focus:bg-white rounded-2xl px-4 py-3.5 text-[15px] text-stone-800 outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
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
