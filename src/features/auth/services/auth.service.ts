import type { AuthedUser, LoginCredentials, LoginResponse } from '@/features/auth/types';
import axiosClient, { publicAxiosClient } from '@/plugins/axios';

const AUTH_ENDPOINTS = {
  login: '/auth/login',
  me: '/auth/me',
  logout: '/auth/logout',
} as const;

export const authService = {
  login: async (data: LoginCredentials): Promise<LoginResponse> => {
    const { data: response } = await publicAxiosClient.post<LoginResponse>(
      AUTH_ENDPOINTS.login,
      data
    );
    return response;
  },

  getMe: async (): Promise<AuthedUser> => {
    const { data } = await axiosClient.get<AuthedUser>(AUTH_ENDPOINTS.me);
    return data;
  },

  logout: async (): Promise<void> => {
    await axiosClient.post(AUTH_ENDPOINTS.logout);
  },
};
