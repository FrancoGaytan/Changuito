import { useState } from 'react';
import type { ProductCategory } from '@/types';
import {
  useProducts,
  useCreateProduct,
  useUpdateStock,
  useDeleteProduct,
} from '@/features/inventory/hooks/useInventory';
import { useInventoryStore } from '@/store/inventoryStore';
import { InventoryHeader } from './InventoryHeader';
import { InventorySearch } from './InventorySearch';
import { CategoryPills } from './CategoryPills';
import { CreateProductModal } from './CreateProductModal';
import { InventoryLoading } from './InventoryLoading';
import { InventoryEmptyState } from './InventoryEmptyState';
import { ProductList } from './ProductList';

export function InventoryPage() {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateStock = useUpdateStock();
  const deleteProduct = useDeleteProduct();
  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery } =
    useInventoryStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('almacen');
  const [newUnit, setNewUnit] = useState('unidad');
  const [newStock, setNewStock] = useState(0);

  const handleCreate = () => {
    if (!newName.trim()) return;
    createProduct.mutate(
      { name: newName.trim(), category: newCategory, unit: newUnit, stock: newStock },
      {
        onSuccess: () => {
          setNewName('');
          setNewCategory('almacen');
          setNewUnit('unidad');
          setNewStock(0);
          setShowCreate(false);
        },
      },
    );
  };

  return (
    <div className="min-h-full px-4 py-6 md:px-8 md:py-8 max-w-5xl mx-auto">
      <InventoryHeader onAddClick={() => setShowCreate(true)} />

      <InventorySearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />

      <CategoryPills
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {showCreate && (
        <CreateProductModal
          newName={newName}
          setNewName={setNewName}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          newUnit={newUnit}
          setNewUnit={setNewUnit}
          newStock={newStock}
          setNewStock={setNewStock}
          isPending={createProduct.isPending}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}

      {isLoading && <InventoryLoading />}

      {!isLoading && (!products || products.length === 0) && (
        <InventoryEmptyState onAddClick={() => setShowCreate(true)} />
      )}

      {products && products.length > 0 && (
        <ProductList
          products={products}
          onUpdateStock={(productId, stock) => updateStock.mutate({ productId, stock })}
          onDeleteProduct={(productId) => deleteProduct.mutate(productId)}
        />
      )}
    </div>
  );
}
