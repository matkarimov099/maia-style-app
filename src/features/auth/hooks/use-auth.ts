import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/features/auth/services/auth.service';
import type { LoginCredentials } from '@/features/auth/types';
import { tokenUtils } from '@/utils/token';

export const authKeys = {
  all: ['auth'] as const,
  authedUser: () => [...authKeys.all, 'authedUser'] as const,
};

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginCredentials) => authService.login(data),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useAuthedUser() {
  const token = tokenUtils.getAccessToken();

  return useQuery({
    queryKey: authKeys.authedUser(),
    queryFn: () => authService.authedUser(),
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
