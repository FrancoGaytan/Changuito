import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from '../services/inventory.service';
import { useInventoryStore } from '@/store/inventoryStore';

export function useProducts() {
  const { activeCategory, searchQuery } = useInventoryStore();

  return useQuery({
    queryKey: ['products', activeCategory, searchQuery],
    queryFn: () =>
      inventoryService
        .getProducts({
          category: activeCategory === 'todos' ? undefined : activeCategory,
          search: searchQuery || undefined,
        })
        .then((r) => r.data),
    refetchOnMount: 'always',
    refetchInterval: 1000 * 60, // cada 60s: refetch del stock
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; category: string; unit?: string; stock?: number }) =>
      inventoryService.createProduct(data as Omit<import('@/types/inventory').Product, 'id'>).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useUpdateStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, stock }: { productId: string; stock: number }) =>
      inventoryService.updateStock(productId, stock).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => inventoryService.deleteProduct(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}
