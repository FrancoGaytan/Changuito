export type ProductCategory =
  | 'lacteos'
  | 'almacen'
  | 'limpieza'
  | 'perfumeria'
  | 'verduleria'
  | 'carniceria'
  | 'panaderia'
  | 'frescos'
  | 'bebidas'
  | 'otros';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unit?: string;
  stock: number;
}
