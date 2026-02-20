import type { CreateUserDto, UpdateUserDto, User, UserFilter } from '@/features/users/types';
import axiosClient from '@/plugins/axios';
import type { PaginatedResponse } from '@/types/common';

const USER_ENDPOINTS = {
  list: '/users/list',
  byId: (id: string) => `/users/${id}`,
  create: '/users',
  update: (id: string) => `/users/${id}`,
  delete: (id: string) => `/users/${id}`,
} as const;

export const userService = {
  getList: async (filter: UserFilter): Promise<PaginatedResponse<User>> => {
    const { data } = await axiosClient.post<PaginatedResponse<User>>(USER_ENDPOINTS.list, filter);
    return data;
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await axiosClient.get<User>(USER_ENDPOINTS.byId(id));
    return data;
  },

  create: async (dto: CreateUserDto): Promise<User> => {
    const { data } = await axiosClient.post<User>(USER_ENDPOINTS.create, dto);
    return data;
  },

  update: async (dto: UpdateUserDto): Promise<User> => {
    const { data } = await axiosClient.put<User>(USER_ENDPOINTS.update(dto.id), dto);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(USER_ENDPOINTS.delete(id));
  },
};
