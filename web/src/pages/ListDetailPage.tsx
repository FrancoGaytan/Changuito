import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Plus,
  Check,
  Minus,
  Trash2,
  Package,
  X,
  AlertTriangle,
  Save,
} from "lucide-react";
import {
  useList,
  useListItems,
  useSyncItems,
  useUpdateItem,
  useDeleteList,
  useCloseList,
} from "@/features/lists/hooks/useLists";
import { useProducts } from "@/features/inventory/hooks/useInventory";
import type { Product } from "@/types";
import { useFeedback } from "@/context/FeedbackContext";
import { useModal } from "@/hooks/useModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: list } = useList(id!);
  const { data: items, isLoading } = useListItems(id!);
  const syncItemsMutation = useSyncItems(id!);
  // separate, silent mutation to sync before closing without affecting the header Save button UI
  const silentSync = useSyncItems(id!);
  const deleteList = useDeleteList();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const ok = await confirm({
      title: '¿Eliminar lista?',
      message: '¿Estás seguro de que deseas eliminar esta lista? Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      danger: true,
    });
    if (!ok) return;
    deleteList.mutate(id!, {
      onSuccess: () => {
        navigate("/mis-listas");
      },
    });
  };

  const [showInventory, setShowInventory] = useState(false);
  const [inventorySearch, setInventorySearch] = useState("");

  // Draft State
  const updateItem = useUpdateItem(id!);
  const closeList = useCloseList(id!);
  const { showFeedback } = useFeedback();
  const { modalState, confirm } = useModal();

  const [draftItems, setDraftItems] = useState<
    Record<
      string,
      {
        itemId?: string;
        productId: string;
        product: Product;
        quantity: number;
        checked: boolean;
        failed?: boolean;
      }
    >
  >({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (items && !isDirty) {
      const draft: Record<string, any> = {};
      items.forEach((i) => {
        draft[i.product.id] = {
          itemId: i.id,
          productId: i.product.id,
          product: i.product,
          quantity: i.quantity,
          checked: i.checked,
          failed: i.failed ?? false,
        };
      });
      setDraftItems(draft);
    }
  }, [items, isDirty]);

  const handleQuantity = (productId: string, delta: number) => {
    setDraftItems((prev) => {
      const item = prev[productId];
      if (!item) return prev;
      const q = item.quantity + delta;
      if (q <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: { ...item, quantity: q } };
    });
    setIsDirty(true);
  };

  const handleCheck = (productId: string) => {
    setDraftItems((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], checked: !prev[productId].checked },
    }));
    setIsDirty(true);
  };

  const handleRemove = (productId: string) => {
    setDraftItems((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
    setIsDirty(true);
  };

  const handleFail = (productId: string) => {
    const item = draftItems[productId];
    const itemId =
      item?.itemId || items?.find((it: any) => it.product.id === productId)?.id;

    const currentlyFailed =
      item?.failed ??
      items?.find((it: any) => it.product.id === productId)?.failed ??
      false;
    const newFailed = !currentlyFailed;

    // Optimistic UI: toggle locally immediately
    setDraftItems((prev) => ({
      ...prev,
      [productId]: { ...(prev[productId] || {}), failed: newFailed },
    }));

    // If there's no persisted item yet, mark dirty for sync
    if (!itemId) {
      setIsDirty(true);
      return;
    }

    // Persist change, rollback on error
    updateItem.mutate(
      { itemId, data: { failed: newFailed } },
      {
        onError: () => {
          setDraftItems((prev) => ({
            ...prev,
            [productId]: {
              ...(prev[productId] || {}),
              failed: currentlyFailed,
            },
          }));
        },
      },
    );
  };

  const handleAdd = (product: Product) => {
    setDraftItems((prev) => {
      const existing = prev[product.id];
      if (existing) {
        return {
          ...prev,
          [product.id]: { ...existing, quantity: existing.quantity + 1 },
        };
      }
      return {
        ...prev,
        [product.id]: {
          productId: product.id,
          product,
          quantity: 1,
          checked: false,
        },
      };
    });
    setIsDirty(true);
  };

  const handleSave = () => {
    const payload = Object.values(draftItems).map((d) => ({
      productId: d.productId,
      quantity: d.quantity,
      checked: d.checked,
      failed: d.failed || false,
    }));
    syncItemsMutation.mutate(payload, {
      onSuccess: () => {
        setIsDirty(false);
        showFeedback({ type: 'success', message: '¡Cambios guardados!' });
      },
      onError: () => {
        showFeedback({ type: 'error', message: 'Error al guardar los cambios' });
      },
    });
  };

  const draftArray = Object.values(draftItems);
  const unavailable = draftArray.filter((i) => i.failed);
  const unchecked = draftArray.filter((i) => !i.checked && !i.failed);
  const checked = draftArray.filter((i) => i.checked && !i.failed);
  // Group pending (unchecked) items by product category
  const groupedPending: Record<string, any[]> = unchecked.reduce(
    (acc, item) => {
      const cat = item.product?.category || 'Otros';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  return (
    <div
      className={`min-h-full flex flex-col md:flex-row relative ${
        list?.theme === "asado"
          ? "bg-orange-50/50"
          : list?.theme === "verduleria"
            ? "bg-green-50/50"
            : list?.theme === "carniceria"
              ? "bg-red-50/50"
              : "bg-emerald-50/30"
      }`}
    >
      {/* Decorative Background Icon */}
      {list?.theme === "asado" && (
        <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none">
          <div className="w-64 h-64 bg-[url('https://cdn-icons-png.flaticon.com/512/3238/3238714.png')] bg-contain bg-no-repeat" />
        </div>
      )}
      {list?.theme === "verduleria" && (
        <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none">
          <div className="w-64 h-64 bg-[url('https://cdn-icons-png.flaticon.com/512/2329/2329903.png')] bg-contain bg-no-repeat" />
        </div>
      )}
      {list?.theme === "carniceria" && (
        <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none">
          <div className="w-64 h-64 bg-[url('https://cdn-icons-png.flaticon.com/512/3143/3143644.png')] bg-contain bg-no-repeat" />
        </div>
      )}
      {list?.theme === "default" && (
        <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none">
          <div className="w-64 h-64 bg-[url('https://cdn-icons-png.flaticon.com/512/3081/3081840.png')] bg-contain bg-no-repeat" />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <Link
              to="/mis-listas"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-md hover:bg-white text-stone-600 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-3xl font-black text-stone-800 truncate drop-shadow-sm">
                {list?.name}
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/80 backdrop-blur text-stone-600 shadow-sm mt-1 capitalize">
                {list?.theme === "default" ? "General" : list?.theme}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isDirty && (
              <button
                onClick={handleSave}
                disabled={syncItemsMutation.isPending}
                className="flex items-center gap-2 bg-[#1b5e20] hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-70"
              >
                <Save className="w-4 h-4" />
                <span className="hidden md:inline">
                  {syncItemsMutation.isPending
                    ? "Guardando..."
                    : "Guardar cambios"}
                </span>
              </button>
            )}
            {/* Close list button moved below Add Products for consistency */}

            <button
              onClick={handleDelete}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-md hover:bg-red-50 hover:text-red-600 text-stone-400 transition-colors shadow-sm"
              title="Eliminar Lista"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowInventory(true)}
          className="md:hidden w-full mb-6 bg-[#f4f5f5] text-stone-600 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Agregar Productos
        </button>

        {unchecked.length === 0 && draftArray.length > 0 && (
          <button
            onClick={async () => {
              const ok = await confirm({
                title: '¿Cerrar lista?',
                message: 'Se agregarán al inventario los productos encontrados y se vaciará la lista.',
                confirmLabel: 'Cerrar lista',
              });
              if (!ok) return;

              const doClose = () => {
                closeList.mutate(undefined, {
                  onSuccess: () => {
                    setDraftItems({});
                    setIsDirty(false);
                    showFeedback({ type: 'success', message: '¡Lista cerrada!' });
                  },
                  onError: () => {
                    showFeedback({ type: 'error', message: 'Error al cerrar la lista' });
                  },
                });
              };

              if (isDirty) {
                const payload = Object.values(draftItems).map((d) => ({
                  productId: d.productId,
                  quantity: d.quantity,
                  checked: d.checked,
                  failed: d.failed || false,
                }));

                silentSync.mutate(payload, {
                  onSuccess: () => doClose(),
                  onError: () => {
                    showFeedback({ type: 'error', message: 'Error al guardar antes de cerrar' });
                  },
                });
                return;
              }

              // Not dirty -> close directly
              doClose();
            }}
            className="w-full mb-6 bg-green-800 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2"
          >
            Cerrar lista
          </button>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1b5e20]" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {Object.entries(groupedPending).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-semibold text-stone-600 capitalize">
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <ListItemRow
                        key={item.product.id}
                        item={item}
                        onCheck={() => handleCheck(item.product.id)}
                        onChangeQuantity={(q) =>
                          handleQuantity(item.product.id, q - item.quantity)
                        }
                        onRemove={() => handleRemove(item.product.id)}
                        onFail={() => handleFail(item.product.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {unavailable.length > 0 && (
              <div className="pt-6 border-t border-stone-200">
                <h3 className="text-sm font-bold text-stone-500 mb-3">
                  No disponibles ({unavailable.length})
                </h3>
                <div className="space-y-2">
                  {unavailable.map((item) => (
                    <ListItemRow
                      key={item.product.id}
                      item={item}
                      onCheck={() => handleCheck(item.product.id)}
                      onChangeQuantity={(q) =>
                        handleQuantity(item.product.id, q - item.quantity)
                      }
                      onRemove={() => handleRemove(item.product.id)}
                      onFail={() => handleFail(item.product.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {checked.length > 0 && (
              <div className="pt-6 border-t border-stone-200">
                <h3 className="text-sm font-bold text-stone-500 mb-3">
                  Completados ({checked.length})
                </h3>
                <div className="space-y-2 opacity-60">
                  {checked.map((item) => (
                    <ListItemRow
                      key={item.product.id}
                      item={item}
                      onCheck={() => handleCheck(item.product.id)}
                      onChangeQuantity={(q) =>
                        handleQuantity(item.product.id, q - item.quantity)
                      }
                      onRemove={() => handleRemove(item.product.id)}
                      onFail={() => handleFail(item.product.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inventory sidebar */}
      <div className="hidden md:block w-80 border-l border-stone-200 bg-white">
        <InventoryPanel
          search={inventorySearch}
          onSearch={setInventorySearch}
          onAdd={handleAdd}
        />
      </div>

      <ConfirmModal {...modalState} />

      {/* Mobile overlay */}
      {showInventory && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden flex items-end">
          <div className="bg-white w-full rounded-t-[28px] max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h3 className="text-lg font-bold text-stone-800">Inventario</h3>
              <button
                onClick={() => setShowInventory(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <InventoryPanel
                search={inventorySearch}
                onSearch={setInventorySearch}
                onAdd={handleAdd}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ListItemRow({
  item,
  onCheck,
  onChangeQuantity,
  onRemove,
  onFail,
}: {
  item: any;
  onCheck: () => void;
  onChangeQuantity: (q: number) => void;
  onRemove: () => void;
  onFail?: () => void;
}) {
  const [inputVal, setInputVal] = useState(String(item.quantity));

  // Keep local value in sync when external quantity changes (e.g. +/- buttons)
  useEffect(() => {
    setInputVal(String(item.quantity));
  }, [item.quantity]);

  const commitValue = () => {
    const parsed = parseInt(inputVal, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onChangeQuantity(parsed);
    } else {
      setInputVal(String(item.quantity));
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-sm transition-all">
      <button
        onClick={item.failed ? undefined : onCheck}
        disabled={item.failed}
        className={`w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
          item.checked
            ? "bg-[#1b5e20] border-[#1b5e20] text-white"
            : item.failed
              ? "border-stone-200 text-stone-300 cursor-not-allowed opacity-70"
              : "border-stone-300 text-transparent hover:border-stone-400"
        }`}
      >
        <Check className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            item.checked
              ? "text-stone-400 line-through"
              : item.failed
                ? "text-red-600 line-through"
                : "text-stone-800"
          }`}
        >
          {item.product.name}
        </p>
        {item.failed && (
          <span className="inline-block mt-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
            No disponible
          </span>
        )}
        <p className="text-[11px] text-stone-400">
          {item.product.category} · {item.product.unit}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-[#f4f5f5] rounded-lg p-0.5">
          <button
            onClick={() => onChangeQuantity(item.quantity - 1)}
            className="w-6 h-6 flex items-center justify-center text-stone-500 hover:bg-white hover:shadow-sm rounded-md transition-all"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <input
            type="number"
            min={0}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={commitValue}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.currentTarget.blur(); } }}
            className="w-8 text-center text-xs font-bold text-stone-700 bg-transparent border-none outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] cursor-pointer focus:cursor-text"
          />
          <button
            onClick={() => onChangeQuantity(item.quantity + 1)}
            className="w-6 h-6 flex items-center justify-center text-stone-500 hover:bg-white hover:shadow-sm rounded-md transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onFail}
          title={
            item.failed
              ? "Marcar como disponible"
              : "Marcar como fracaso / no disponible"
          }
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${item.failed ? "bg-red-50 text-red-500" : "text-amber-600 hover:bg-amber-50"}`}
        >
          <AlertTriangle className="w-4 h-4" />
        </button>
        <button
          onClick={onRemove}
          className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function InventoryPanel({
  search,
  onSearch,
  onAdd,
}: {
  search: string;
  onSearch: (s: string) => void;
  onAdd: (product: Product) => void;
}) {
  const { data: products, isLoading } = useProducts();

  const filtered = (products ?? []).filter((p: Product) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-5 h-full flex flex-col">
      <h3 className="text-sm font-bold text-stone-700 mb-3 hidden md:block">
        Agregar del inventario
      </h3>

      <div className="flex items-center bg-[#f4f5f5] border border-stone-200 rounded-xl px-3 py-2.5 mb-4 focus-within:border-emerald-500 focus-within:bg-white transition-colors">
        <Search className="w-4 h-4 text-stone-400 mr-2 flex-shrink-0" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar producto..."
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
          {search ? "Sin resultados" : "No hay productos en el inventario"}
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
