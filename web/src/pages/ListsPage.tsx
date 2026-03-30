import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  ShoppingCart,
  Trash2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useLists, useCreateList, useDeleteList } from '@/features/lists/hooks/useLists';
import type { ShoppingList } from '@/types';
import { themeConfig } from '@/utils/theme';

export function ListsPage() {
  const { data: lists, isLoading } = useLists();
  const createList = useCreateList();
  const deleteList = useDeleteList();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTheme, setNewTheme] = useState('default');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const handleCreate = () => {
    if (!newName.trim()) return;
    createList.mutate(
      { name: newName.trim(), theme: newTheme },
      {
        onSuccess: () => {
          setNewName('');
          setNewTheme('default');
          setShowCreate(false);
        },
      },
    );
  };

  return (
    <div className="min-h-full px-4 py-6 md:px-8 md:py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
            Mis Listas
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Organizá las compras de la semana por temática.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-[#1b5e20] hover:bg-[#154c19] text-white font-bold px-5 py-3 rounded-2xl text-sm transition-all active:scale-[.97] shadow-lg shadow-green-900/20"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Nueva Lista</span>
        </button>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-[#1b5e20] mb-6">Nueva Lista</h2>

            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5 ml-1">
              Nombre
            </label>
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ej: Súper Semanal"
              className="w-full bg-[#f4f5f5] border border-stone-200 focus:border-emerald-500 focus:bg-white rounded-2xl px-4 py-3.5 text-[15px] text-stone-800 placeholder:text-stone-400 outline-none transition-colors mb-4"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />

            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-2 ml-1">
              Temática
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
                onClick={() => setShowCreate(false)}
                className="flex-1 py-3.5 rounded-2xl border-2 border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim() || createList.isPending}
                className="flex-1 py-3.5 rounded-2xl bg-[#1b5e20] hover:bg-[#154c19] text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-green-900/20"
              >
                {createList.isPending ? 'Creando...' : 'Crear Lista'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="w-10 h-10 bg-stone-200 rounded-xl mb-4" />
              <div className="h-5 bg-stone-200 rounded w-2/3 mb-2" />
              <div className="h-3 bg-stone-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!lists || lists.length === 0) && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-stone-700 mb-2">No tenés listas todavía</h3>
          <p className="text-stone-500 text-sm max-w-xs mx-auto mb-6">
            Creá tu primera lista de compras y empezá a organizar tu semana.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 bg-[#1b5e20] hover:bg-[#154c19] text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-lg shadow-green-900/20"
          >
            <Plus className="w-5 h-5" />
            Crear mi primera lista
          </button>
        </div>
      )}

      {/* Lists grid */}
      {lists && lists.length > 0 && (
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
                      {/* Optional check circle if fully completed */}
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
                        Items
                      </p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-stone-800 leading-none">{list.productCount || 0}</span>
                        <span className="text-stone-600 font-semibold text-sm">productos</span>
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
                        deleteList.mutate(list.id);
                        setMenuOpen(null);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
