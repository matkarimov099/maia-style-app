import type { PropsWithChildren } from 'react';
import { useLocation } from 'react-router';
import { useAuthContext } from '@/hooks/use-auth-context';

export function AuthGuard({ children }: PropsWithChildren) {
  const { isLoading, isLoggedIn } = useAuthContext();
  const _location = useLocation();

  // TODO: Backend tayyor bo'lganda quyidagi commentlarni olib tashlang
  // if (isLoading) {
  //   return <AppLoader />;
  // }

  // if (!isLoggedIn) {
  //   return <Navigate to="/auth/login" state={{ from: { pathname: location.pathname } }} replace />;
  // }

  return <>{children}</>;
}
