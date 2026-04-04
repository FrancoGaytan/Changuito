import type { ProductCategory } from '@/types';
import { categories } from './categories';

interface Props {
  activeCategory: ProductCategory | 'todos';
  onCategoryChange: (key: ProductCategory | 'todos') => void;
}

export function CategoryPills({ activeCategory, onCategoryChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide -mx-4 px-4">
      {categories.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onCategoryChange(key)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium border-2 transition-all flex-shrink-0 ${
            activeCategory === key
              ? 'border-[#1b5e20] bg-emerald-50 text-[#1b5e20]'
              : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
