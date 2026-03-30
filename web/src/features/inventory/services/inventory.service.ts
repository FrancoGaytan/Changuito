import { api } from '@/services/api';
import type { Product, ProductCategory } from '@/types';

export interface InventoryFilters {
  category?: ProductCategory;
  search?: string;
}

export const inventoryService = {
  getProducts: (filters?: InventoryFilters) =>
    api.get<Product[]>('/products', { params: filters }),

  createProduct: (payload: Omit<Product, 'id'>) =>
    api.post<Product>('/products', payload),

  updateStock: (productId: string, stock: number) =>
    api.patch<Product>(`/products/${productId}/stock`, { stock }),

  deleteProduct: (productId: string) =>
    api.delete<void>(`/products/${productId}`),
};
