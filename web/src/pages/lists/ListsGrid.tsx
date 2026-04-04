import { Link } from 'react-router-dom';
import { Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import type { ShoppingList } from '@/types';
import { themeConfig } from '@/utils/theme';
import { listsLocale } from '@/locale/listsLocale';

const l = listsLocale;

interface Props {
  lists: ShoppingList[];
  menuOpen: string | null;
  setMenuOpen: (id: string | null) => void;
  onDeleteList: (id: string) => void;
}

export function ListsGrid({ lists, menuOpen, setMenuOpen, onDeleteList }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {lists.map((list: ShoppingList) => {
        const cfg = themeConfig[list.theme] || themeConfig.default;
        const Icon = cfg.icon;
        const pct = list.productCount
          ? Math.round((list.completedCount / list.productCount) * 100)
          : 0;

        return (
          <div key={list.id} className="relative group h-full">
            <Link
              to={`/mis-listas/${list.id}`}
              className="block h-full min-h-[220px] relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all overflow-hidden border border-stone-100 flex flex-col"
            >
              {/* Background Image Setup */}
              <div
                className="absolute inset-x-0 inset-y-0 opacity-[0.06] bg-cover bg-center pointer-events-none group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url('${cfg.bgImage}')` }}
              />
              {/* Solid Gradient at top to ensure text readability if needed */}
              <div className={`absolute inset-0 bg-gradient-to-t from-white/90 to-white/30 pointer-events-none`} />

              <div className="flex-1 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${cfg.bg} rounded-2xl flex items-center justify-center shadow-sm`}>
                    <Icon className={`w-6 h-6 ${cfg.color}`} />
                  </div>
                  {pct === 100 && list.productCount > 0 && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  )}
                </div>

                <h3 className="font-extrabold text-stone-800 text-2xl tracking-tight mb-2 truncate">
                  {list.name}
                </h3>
                <div className="flex items-center mb-6">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.tagClass}`}>
                    {cfg.tag}
                  </span>
                </div>
              </div>

              <div className="relative z-10 flex items-end justify-between mt-auto">
                <div>
                  <p className="text-stone-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                    {l.grid.itemsLabel}
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-stone-800 leading-none">{list.productCount || 0}</span>
                    <span className="text-stone-600 font-semibold text-sm">{l.grid.productsUnit}</span>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center shadow-sm ${cfg.bg}`}>
                  <ArrowRight className={`w-5 h-5 ${cfg.color}`} />
                </div>
              </div>
            </Link>

            {/* Menu */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(menuOpen === list.id ? null : list.id);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 opacity-0 group-hover:opacity-100 hover:bg-white/80 backdrop-blur-sm transition-all z-20"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {menuOpen === list.id && (
              <div className="absolute top-12 right-4 bg-white rounded-xl shadow-xl border border-stone-100 py-1 z-30 min-w-[140px]">
                <button
                  onClick={() => {
                    onDeleteList(list.id);
                    setMenuOpen(null);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  {l.grid.deleteItem}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
