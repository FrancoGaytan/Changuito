import {
  Package,
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
import type { ProductCategory } from '@/types';

export const categories: {
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
