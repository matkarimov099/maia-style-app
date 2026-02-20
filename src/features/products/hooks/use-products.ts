import {
  keepPreviousData,
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useMemo } from 'react';
import { productService } from '@/features/products/services/products.service';
import type { CreateProductDto, ProductFilter, UpdateProductDto } from '@/features/products/types';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filter: ProductFilter) => [...productKeys.lists(), filter] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export function useProductList(filter?: ProductFilter) {
  const { data, isLoading, isFetching, error, isRefetching, refetch } = useQuery({
    queryKey: filter ? productKeys.list(filter) : productKeys.lists(),
    queryFn: filter ? () => productService.getList(filter) : skipToken,
    placeholderData: keepPreviousData,
  });

  return useMemo(
    () => ({
      products: data?.data ?? [],
      total: data?.total ?? 0,
      isLoading,
      isFetching,
      isRefetching,
      error,
      refetch,
      isEmpty: !isLoading && !data?.data?.length,
    }),
    [data, isLoading, isFetching, error, refetch, isRefetching]
  );
}

export function useProductById(id?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: id ? productKeys.detail(id) : productKeys.details(),
    queryFn: id ? () => productService.getById(id) : skipToken,
  });

  return useMemo(
    () => ({
      product: data ?? null,
      isLoading,
      error,
    }),
    [data, isLoading, error]
  );
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductDto) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProductDto) => productService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
