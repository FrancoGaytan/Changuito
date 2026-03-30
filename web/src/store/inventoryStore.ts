import { create } from 'zustand';
import type { ProductCategory } from '@/types';

interface InventoryState {
  activeCategory: ProductCategory | 'todos';
  searchQuery: string;
  activeListId: string | null;
  setActiveCategory: (category: ProductCategory | 'todos') => void;
  setSearchQuery: (query: string) => void;
  setActiveListId: (listId: string | null) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  activeCategory: 'todos',
  searchQuery: '',
  activeListId: null,
  setActiveCategory: (category) => set({ activeCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveListId: (listId) => set({ activeListId: listId }),
}));
