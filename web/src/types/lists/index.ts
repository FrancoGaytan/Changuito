import type { User } from '../auth';

export type ListTheme = 'default' | 'asado' | 'verduleria' | 'carniceria' | 'supermercado' | 'limpieza' | 'farmacia' | 'dietetica';

export interface ShoppingList {
  id: string;
  name: string;
  theme: ListTheme;
  icon?: string;
  productCount: number;
  completedCount: number;
  updatedAt: string;
  members: Pick<User, 'id' | 'name' | 'avatarUrl'>[];
}

export interface ListItem {
  id: string;
  product: import('../inventory').Product;
  quantity: number;
  checked: boolean;
  failed?: boolean;
  addedBy: Pick<User, 'id' | 'name'>;
  note?: string;
}
