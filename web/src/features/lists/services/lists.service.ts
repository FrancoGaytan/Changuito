import { api } from '@/services/api';
import type { ShoppingList, ListItem } from '@/types';

export const listsService = {
  getAll: () => api.get<ShoppingList[]>('/lists'),

  getById: (id: string) => api.get<ShoppingList>(`/lists/${id}`),

  create: (payload: Pick<ShoppingList, 'name' | 'theme'>) =>
    api.post<ShoppingList>('/lists', payload),

  delete: (id: string) => api.delete<void>(`/lists/${id}`),

  getItems: (listId: string) =>
    api.get<ListItem[]>(`/lists/${listId}/items`),

  addItem: (listId: string, productId: string, quantity: number) =>
    api.post<ListItem>(`/lists/${listId}/items`, { productId, quantity }),

  updateItem: (listId: string, itemId: string, data: Partial<ListItem>) =>
    api.patch<ListItem>(`/lists/${listId}/items/${itemId}`, data),
  syncItems: (listId: string, items: { productId: string; quantity: number; checked: boolean; failed?: boolean }[]) =>
    api.patch<ListItem[]>(`/lists/${listId}/sync`, { items }),
  removeItem: (listId: string, itemId: string) =>
    api.delete<void>(`/lists/${listId}/items/${itemId}`),
  closeList: (listId: string) =>
    api.post<void>(`/lists/${listId}/close`),
};
