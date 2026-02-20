import {
  keepPreviousData,
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useMemo } from 'react';
import { userService } from '@/features/users/services/users.service';
import type { CreateUserDto, UpdateUserDto, UserFilter } from '@/features/users/types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filter: UserFilter) => [...userKeys.lists(), filter] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export function useUserList(filter?: UserFilter) {
  const { data, isLoading, isFetching, error, isRefetching, refetch } = useQuery({
    queryKey: filter ? userKeys.list(filter) : userKeys.lists(),
    queryFn: filter ? () => userService.getList(filter) : skipToken,
    placeholderData: keepPreviousData,
  });

  return useMemo(
    () => ({
      users: data?.data ?? [],
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

export function useUserById(id?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: id ? userKeys.detail(id) : userKeys.details(),
    queryFn: id ? () => userService.getById(id) : skipToken,
  });

  return useMemo(
    () => ({
      user: data ?? null,
      isLoading,
      error,
    }),
    [data, isLoading, error]
  );
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserDto) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserDto) => userService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
