import type { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '@/context/auth-context';
import { useAuthedUser, useLogout } from '@/features/auth/hooks/use-auth';
import { clearAuth, isAuthenticated } from '@/lib/auth';
import type { Role } from '@/types/enums';
import { tokenUtils } from '@/utils/token';

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();

  const { mutate: logoutUser, isPending: logoutPending } = useLogout();
  const { data: userData, isPending: userPending, isSuccess: userSuccess } = useAuthedUser();

  const logout = () =>
    logoutUser(undefined, {
      onSuccess: () => {
        clearAuth();
        navigate('/auth/login');
      },
    });

  const authedUser = userData ?? null;
  const authToken = tokenUtils.getAccessToken();

  const hasRole = (roles: Role | Role[]) => {
    const role = authedUser?.role;
    return !!role && (Array.isArray(roles) ? roles.includes(role) : role === roles);
  };

  const authenticated = isAuthenticated();
  const isLoading = logoutPending || (authenticated && userPending && !authedUser);
  const isLoggedIn = authenticated && (!!authedUser || userSuccess);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        authedUser,
        role: authedUser?.role || null,
        hasRole,
        logout,
        isLoading,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
