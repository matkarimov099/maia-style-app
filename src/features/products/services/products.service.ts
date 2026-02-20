import type {
  CreateProductDto,
  Product,
  ProductFilter,
  UpdateProductDto,
} from '@/features/products/types';
import axiosClient from '@/plugins/axios';
import type { PaginatedResponse } from '@/types/common';

const PRODUCT_ENDPOINTS = {
  list: '/products/list',
  byId: (id: string) => `/products/${id}`,
  create: '/products',
  update: (id: string) => `/products/${id}`,
  delete: (id: string) => `/products/${id}`,
} as const;

export const productService = {
  getList: async (filter: ProductFilter): Promise<PaginatedResponse<Product>> => {
    const { data } = await axiosClient.post<PaginatedResponse<Product>>(
      PRODUCT_ENDPOINTS.list,
      filter
    );
    return data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await axiosClient.get<Product>(PRODUCT_ENDPOINTS.byId(id));
    return data;
  },

  create: async (dto: CreateProductDto): Promise<Product> => {
    const { data } = await axiosClient.post<Product>(PRODUCT_ENDPOINTS.create, dto);
    return data;
  },

  update: async (dto: UpdateProductDto): Promise<Product> => {
    const { data } = await axiosClient.put<Product>(PRODUCT_ENDPOINTS.update(dto.id), dto);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(PRODUCT_ENDPOINTS.delete(id));
  },
};
