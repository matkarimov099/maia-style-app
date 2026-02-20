import type { AuthedUser, LoginCredentials, LoginResponse } from '@/features/auth/types';
import axiosClient, { publicAxiosClient } from '@/plugins/axios';
import { tokenUtils } from '@/utils/token';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
} as const;

export const authService = {
  login: async (data: LoginCredentials): Promise<LoginResponse> => {
    const { data: response } = await publicAxiosClient.post<LoginResponse>(
      AUTH_ENDPOINTS.LOGIN,
      data
    );
    return response;
  },

  logout: async (): Promise<void> => {
    const refreshToken = tokenUtils.getRefreshToken();
    await axiosClient.post(AUTH_ENDPOINTS.LOGOUT, { refreshToken });
  },

  authedUser: async (): Promise<AuthedUser> => {
    const { data } = await axiosClient.get<AuthedUser>(AUTH_ENDPOINTS.ME);
    return data;
  },
};
