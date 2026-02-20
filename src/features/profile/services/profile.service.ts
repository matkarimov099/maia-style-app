import type { ChangePasswordDto, ProfileData, UpdateProfileDto } from '@/features/profile/types';
import axiosClient from '@/plugins/axios';

const PROFILE_ENDPOINTS = {
  me: '/profile',
  update: '/profile',
  changePassword: '/profile/password',
  uploadAvatar: '/profile/avatar',
} as const;

export const profileService = {
  getProfile: async (): Promise<ProfileData> => {
    const { data } = await axiosClient.get<ProfileData>(PROFILE_ENDPOINTS.me);
    return data;
  },

  updateProfile: async (dto: UpdateProfileDto): Promise<ProfileData> => {
    const { data } = await axiosClient.put<ProfileData>(PROFILE_ENDPOINTS.update, dto);
    return data;
  },

  changePassword: async (dto: ChangePasswordDto): Promise<void> => {
    await axiosClient.post(PROFILE_ENDPOINTS.changePassword, dto);
  },

  uploadAvatar: async (file: FormData): Promise<{ url: string }> => {
    const { data } = await axiosClient.post<{ url: string }>(PROFILE_ENDPOINTS.uploadAvatar, file);
    return data;
  },
};
