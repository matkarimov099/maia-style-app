import { DataTable } from '@/components/data-table/data-table';
import type { Product } from '@/features/products/types';
import { productsTableConfig } from '../utils/table-config';
import { useProductsData } from '../utils/use-products-data';
import { getColumns } from './columns';
import { CreateProductDialog } from './create-product-dialog';

export default function ProductsTable() {
  const {
    products,
    total,
    isLoading,
    page,
    pageSize,
    search,
    sorting,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleSortingChange,
  } = useProductsData();

  return (
    <DataTable<Product>
      config={productsTableConfig}
      getColumns={getColumns}
      data={products}
      totalItems={total}
      idField="id"
      isLoading={isLoading}
      currentPage={page}
      pageSize={pageSize}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      sorting={sorting}
      onSortingChange={handleSortingChange}
      searchValue={search}
      onSearchChange={handleSearchChange}
      renderToolbarContent={() => ({
        right: <CreateProductDialog />,
      })}
    />
  );
}
