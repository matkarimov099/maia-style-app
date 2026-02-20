import { lazy, Suspense } from 'react';

const ProductsTable = lazy(() => import('@/features/products/components/ProductsTable'));

export default function Products() {
  return (
    <Suspense>
      <ProductsTable />
    </Suspense>
  );
}
