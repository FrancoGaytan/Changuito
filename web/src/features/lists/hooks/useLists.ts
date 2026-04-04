import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listsService } from '../services/lists.service';

export function useLists() {
  return useQuery({
    queryKey: ['lists'],
    queryFn: () => listsService.getAll().then((r) => r.data),
    refetchInterval: 1000 * 30, // cada 30s: ve nuevas listas que creó otro familiar
  });
}

export function useList(listId: string) {
  return useQuery({
    queryKey: ['lists', listId],
    queryFn: () => listsService.getById(listId).then((r) => r.data),
    enabled: !!listId,
    refetchInterval: 1000 * 20, // cada 20s: otro familiar puede modificar la lista
  });
}

export function useCreateList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; theme: string }) =>
      listsService.create(data as Pick<import('@/types/lists').ShoppingList, 'name' | 'theme'>).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lists'] }),
  });
}

export function useDeleteList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => listsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lists'] }),
  });
}

export function useListItems(listId: string) {
  return useQuery({
    queryKey: ['lists', listId, 'items'],
    queryFn: () => listsService.getItems(listId).then((r) => r.data),
    enabled: !!listId,
    refetchInterval: 1000 * 20, // cada 20s: ve ítems que agregó/tachó otro familiar
  });
}

export function useAddItem(listId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      listsService.addItem(listId, productId, quantity).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lists', listId, 'items'] });
      qc.invalidateQueries({ queryKey: ['lists'] });
    },
  });
}

export function useUpdateItem(listId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: string;
      data: { quantity?: number; checked?: boolean; note?: string; failed?: boolean };
    }) => listsService.updateItem(listId, itemId, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lists', listId, 'items'] });
      qc.invalidateQueries({ queryKey: ['lists'] });
    },
  });
}

export function useRemoveItem(listId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => listsService.removeItem(listId, itemId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lists', listId, 'items'] });
      qc.invalidateQueries({ queryKey: ['lists'] });
    },
  });
}

export function useCloseList(listId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => listsService.closeList(listId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lists', listId, 'items'] });
      qc.invalidateQueries({ queryKey: ['lists'] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useSyncItems(listId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: { productId: string; quantity: number; checked: boolean }[]) => 
      listsService.syncItems(listId, items as any).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lists', listId, 'items'] });
      qc.invalidateQueries({ queryKey: ['lists'] });
    },
  });
}
