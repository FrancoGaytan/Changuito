export type ProductCategory =
  | 'lacteos'
  | 'almacen'
  | 'limpieza'
  | 'perfumeria'
  | 'verduleria'
  | 'carniceria'
  | 'panaderia'
  | 'frescos'
  | 'otros';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unit?: string;
  stock: number;
}
