import { useState } from 'react';
import {
  Search,
  Plus,
  Minus,
  Package,
  Trash2,
  X,
  Milk,
  ShoppingBasket,
  SprayCan,
  Sparkles,
  Salad,
  Beef,
  Croissant,
  Snowflake,
  MoreHorizontal,
} from 'lucide-react';
import {
  useProducts,
  useCreateProduct,
  useUpdateStock,
  useDeleteProduct,
} from '@/features/inventory/hooks/useInventory';
import { useInventoryStore } from '@/store/inventoryStore';
import type { Product, ProductCategory } from '@/types';

const categories: {
  key: ProductCategory | 'todos';
  label: string;
  icon: typeof Package;
}[] = [
  { key: 'todos', label: 'Todos', icon: Package },
  { key: 'lacteos', label: 'Lácteos', icon: Milk },
  { key: 'almacen', label: 'Almacén', icon: ShoppingBasket },
  { key: 'limpieza', label: 'Limpieza', icon: SprayCan },
  { key: 'perfumeria', label: 'Perfumería', icon: Sparkles },
  { key: 'verduleria', label: 'Verdulería', icon: Salad },
  { key: 'carniceria', label: 'Carnicería', icon: Beef },
  { key: 'panaderia', label: 'Panadería', icon: Croissant },
  { key: 'frescos', label: 'Frescos', icon: Snowflake },
  { key: 'otros', label: 'Otros', icon: MoreHorizontal },
];

export function InventoryPage() {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateStock = useUpdateStock();
  const deleteProduct = useDeleteProduct();
  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery } =
    useInventoryStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('almacen');
  const [newUnit, setNewUnit] = useState('unidad');
  const [newStock, setNewStock] = useState(0);

  const handleCreate = () => {
    if (!newName.trim()) return;
    createProduct.mutate(
      { name: newName.trim(), category: newCategory, unit: newUnit, stock: newStock },
      {
        onSuccess: () => {
          setNewName('');
          setNewCategory('almacen');
          setNewUnit('unidad');
          setNewStock(0);
          setShowCreate(false);
        },
      },
    );
  };

  return (
    <div className="min-h-full px-4 py-6 md:px-8 md:py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
            Inventario
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Tu despensa digital. Controlá el stock de tu hogar.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-[#1b5e20] hover:bg-[#154c19] text-white font-bold px-5 py-3 rounded-2xl text-sm transition-all active:scale-[.97] shadow-lg shadow-green-900/20"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Agregar</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white border border-stone-200 rounded-2xl px-4 py-3 mb-4 focus-within:border-emerald-500 transition-colors shadow-sm">
        <Search className="w-5 h-5 text-stone-400 mr-3 flex-shrink-0" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar en tu inventario..."
          className="bg-transparent border-none outline-none w-full text-[15px] text-stone-800 placeholder:text-stone-400"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-stone-400 hover:text-stone-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide -mx-4 px-4">
        {categories.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
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

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-[#1b5e20] mb-6">Nuevo Producto</h2>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5 ml-1">
                  Nombre
                </label>
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Leche Entera"
                  className="w-full bg-[#f4f5f5] border border-stone-200 focus:border-emerald-500 focus:bg-white rounded-2xl px-4 py-3.5 text-[15px] text-stone-800 placeholder:text-stone-400 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-2 ml-1">
                  Categoría
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
                    Unidad
                  </label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full bg-[#f4f5f5] border border-stone-200 focus:border-emerald-500 rounded-2xl px-4 py-3.5 text-[15px] text-stone-800 outline-none transition-colors appearance-none"
                  >
                    <option value="unidad">Unidad</option>
                    <option value="kg">Kg</option>
                    <option value="L">Litros</option>
                    <option value="g">Gramos</option>
                    <option value="ml">ml</option>
                    <option value="paquete">Paquete</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5 ml-1">
                    Stock Inicial
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
                onClick={() => setShowCreate(false)}
                className="flex-1 py-3.5 rounded-2xl border-2 border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim() || createProduct.isPending}
                className="flex-1 py-3.5 rounded-2xl bg-[#1b5e20] hover:bg-[#154c19] text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-green-900/20"
              >
                {createProduct.isPending ? 'Guardando...' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse flex gap-3">
              <div className="w-11 h-11 bg-stone-200 rounded-xl" />
              <div className="flex-1">
                <div className="h-4 bg-stone-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-stone-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!products || products.length === 0) && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-stone-700 mb-2">Inventario vacío</h3>
          <p className="text-stone-500 text-sm max-w-xs mx-auto mb-6">
            Empezá cargando los productos que tenés en tu hogar.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 bg-[#1b5e20] hover:bg-[#154c19] text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-lg shadow-green-900/20"
          >
            <Plus className="w-5 h-5" />
            Agregar primer producto
          </button>
        </div>
      )}

      {/* Products list */}
      {products && products.length > 0 && (
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

                {/* Stock controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      updateStock.mutate({
                        productId: product.id,
                        stock: Math.max(0, product.stock - 1),
                      })
                    }
                    className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span
                    className={`text-sm font-bold w-8 text-center ${
                      product.stock === 0 ? 'text-red-500' : 'text-stone-700'
                    }`}
                  >
                    {product.stock}
                  </span>
                  <button
                    onClick={() =>
                      updateStock.mutate({
                        productId: product.id,
                        stock: product.stock + 1,
                      })
                    }
                    className="w-8 h-8 rounded-lg bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center text-emerald-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteProduct.mutate(product.id)}
                  className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-stone-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
