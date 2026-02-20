import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { profileService } from '@/features/profile/services/profile.service';
import type { ChangePasswordDto, UpdateProfileDto } from '@/features/profile/types';

export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
};

export function useProfile() {
  const { data, isLoading, error } = useQuery({
    queryKey: profileKeys.me(),
    queryFn: () => profileService.getProfile(),
  });

  return useMemo(
    () => ({
      profile: data ?? null,
      isLoading,
      error,
    }),
    [data, isLoading, error]
  );
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileDto) => profileService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordDto) => profileService.changePassword(data),
  });
}
