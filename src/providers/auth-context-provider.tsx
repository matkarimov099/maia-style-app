import { useQuery, useQueryClient } from '@tanstack/react-query';
import { type ReactNode, useCallback, useMemo } from 'react';
import { AuthContext, type AuthedUser } from '@/context/auth-context';
import { authService } from '@/features/auth/services/auth.service';
import { clearAuth, isAuthenticated } from '@/lib/auth';
import type { Role } from '@/types/enums';

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: authedUser, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.getMe(),
    enabled: isAuthenticated(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const logout = useCallback(() => {
    clearAuth();
    queryClient.clear();
    window.location.href = '/auth/login';
  }, [queryClient]);

  const hasRole = useCallback(
    (...roles: Role[]) => {
      if (!authedUser?.role) return false;
      return roles.includes(authedUser.role);
    },
    [authedUser]
  );

  const value = useMemo(
    () => ({
      authedUser: (authedUser as AuthedUser) ?? null,
      role: (authedUser?.role as Role) ?? null,
      isLoggedIn: !!authedUser,
      isLoading,
      hasRole,
      logout,
    }),
    [authedUser, isLoading, hasRole, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
