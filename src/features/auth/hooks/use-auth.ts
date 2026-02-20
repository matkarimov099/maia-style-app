import { useMutation } from '@tanstack/react-query';
import { authService } from '@/features/auth/services/auth.service';
import type { LoginCredentials } from '@/features/auth/types';

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginCredentials) => authService.login(data),
  });
}
