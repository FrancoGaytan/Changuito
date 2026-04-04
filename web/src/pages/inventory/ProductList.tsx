import { Plus, Minus, Package, Trash2 } from 'lucide-react';
import type { Product } from '@/types';
import { StockInput } from '@/components/ui/StockInput';
import { categories } from './categories';

interface Props {
  products: Product[];
  onUpdateStock: (productId: string, stock: number) => void;
  onDeleteProduct: (productId: string) => void;
}

export function ProductList({ products, onUpdateStock, onDeleteProduct }: Props) {
  return (
    <div className="space-y-2">
      {products.map((product: Product) => {
        const catCfg = categories.find((c) => c.key === product.category);
        const CatIcon = catCfg?.icon ?? Package;

        return (
          <div
            key={product.id}
            className="flex items-center bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-stone-100 gap-3 group"
          >
            <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <CatIcon className="w-5 h-5 text-emerald-700" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-800 truncate">
                {product.name}
              </p>
              <p className="text-[11px] text-stone-400 capitalize">
                {catCfg?.label ?? product.category} · {product.unit}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onUpdateStock(product.id, Math.max(0, product.stock - 1))}
                className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <StockInput
                stock={product.stock}
                isZero={product.stock === 0}
                onCommit={(val) => onUpdateStock(product.id, val)}
              />
              <button
                onClick={() => onUpdateStock(product.id, product.stock + 1)}
                className="w-8 h-8 rounded-lg bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center text-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => onDeleteProduct(product.id)}
              className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-stone-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
