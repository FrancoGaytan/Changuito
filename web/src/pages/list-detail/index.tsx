import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import {
  useList,
  useListItems,
  useSyncItems,
  useUpdateItem,
  useDeleteList,
  useCloseList,
} from "@/features/lists/hooks/useLists";
import type { Product } from "@/types";
import { useFeedback } from "@/context/FeedbackContext";
import { useModal } from "@/hooks/useModal";
import { useAppVisibility } from "@/hooks/useAppVisibility";
import { listDetailLocale } from "@/locale/listDetailLocale";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ListItemRow } from "./ListItemRow";
import { InventoryPanel } from "./InventoryPanel";
import { ThemeBackground } from "./ThemeBackground";
import { ListDetailHeader } from "./ListDetailHeader";
import { MobileInventoryOverlay } from "./MobileInventoryOverlay";

export function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: list } = useList(id!);
  const { data: items, isLoading } = useListItems(id!);
  const syncItemsMutation = useSyncItems(id!);
  // separate, silent mutation to sync before closing without affecting the header Save button UI
  const silentSync = useSyncItems(id!);
  const deleteList = useDeleteList();
  const navigate = useNavigate();
  useAppVisibility(["lists", id]);

  const [showInventory, setShowInventory] = useState(false);
  const [inventorySearch, setInventorySearch] = useState("");

  // Draft State
  const updateItem = useUpdateItem(id!);
  const closeList = useCloseList(id!);
  const { showFeedback } = useFeedback();
  const { modalState, confirm } = useModal();

  const l = listDetailLocale;

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

  const handleDelete = async () => {
    const ok = await confirm({
      title: l.confirm.delete.title,
      message: l.confirm.delete.message,
      confirmLabel: l.confirm.delete.confirmLabel,
      danger: true,
    });
    if (!ok) return;
    deleteList.mutate(id!, {
      onSuccess: () => {
        navigate("/mis-listas");
      },
    });
  };

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

    setDraftItems((prev) => ({
      ...prev,
      [productId]: { ...(prev[productId] || {}), failed: newFailed },
    }));

    if (!itemId) {
      setIsDirty(true);
      return;
    }

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
        showFeedback({ type: "success", message: l.feedback.saved });
      },
      onError: () => {
        showFeedback({
          type: "error",
          message: l.feedback.saveError,
        });
      },
    });
  };

  const draftArray = Object.values(draftItems);
  const unavailable = draftArray.filter((i) => i.failed);
  const unchecked = draftArray.filter((i) => !i.checked && !i.failed);
  const checked = draftArray.filter((i) => i.checked && !i.failed);
  const groupedPending: Record<string, any[]> = unchecked.reduce(
    (acc, item) => {
      const cat = item.product?.category || "Otros";
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
      <ThemeBackground theme={list?.theme} />

      {/* Main content */}
      <div className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-3xl">
        <ListDetailHeader
          listName={list?.name}
          listTheme={list?.theme}
          isDirty={isDirty}
          isSaving={syncItemsMutation.isPending}
          onSave={handleSave}
          onDelete={handleDelete}
        />

        <button
          onClick={() => setShowInventory(true)}
          className="md:hidden w-full mb-6 bg-[#f4f5f5] text-stone-600 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {l.addProductsButton}
        </button>

        {unchecked.length === 0 && draftArray.length > 0 && (
          <button
            onClick={async () => {
              const ok = await confirm({
                title: l.confirm.close.title,
                message: l.confirm.close.message,
                confirmLabel: l.confirm.close.confirmLabel,
              });
              if (!ok) return;

              const doClose = () => {
                closeList.mutate(undefined, {
                  onSuccess: () => {
                    setDraftItems({});
                    setIsDirty(false);
                    showFeedback({
                      type: "success",
                      message: l.feedback.closed,
                    });
                  },
                  onError: () => {
                    showFeedback({
                      type: "error",
                      message: l.feedback.closeError,
                    });
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
                    showFeedback({
                      type: "error",
                      message: l.feedback.syncError,
                    });
                  },
                });
                return;
              }

              doClose();
            }}
            className="w-full mb-6 bg-green-800 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2"
          >
            {l.closeListButton}
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
                  {l.sections.unavailable} ({unavailable.length})
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
                  {l.sections.completed} ({checked.length})
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

      {showInventory && (
        <MobileInventoryOverlay
          inventorySearch={inventorySearch}
          onSearch={setInventorySearch}
          onAdd={handleAdd}
          onClose={() => setShowInventory(false)}
        />
      )}
    </div>
  );
}
