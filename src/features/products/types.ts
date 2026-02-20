import type { PaginationFilter } from '@/types/common';
import type { ProductCategory, ProductStatus } from '@/types/enums';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  status: ProductStatus;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilter extends PaginationFilter {
  name?: string;
  category?: ProductCategory;
  status?: ProductStatus;
}

export interface CreateProductDto {
  name: string;
  price: number;
  category: ProductCategory;
  status?: ProductStatus;
  image?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  id: string;
}
