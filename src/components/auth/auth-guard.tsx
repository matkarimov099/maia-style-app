import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AppLoader } from '@/components/common/app-loader';
import { useAuthContext } from '@/hooks/use-auth-context';

export function AuthGuard({ children }: PropsWithChildren) {
  const { isLoading, isLoggedIn } = useAuthContext();
  const location = useLocation();

  // TODO: Backend tayyor bo'lganda quyidagi commentlarni olib tashlang
  // if (isLoading) {
  //   return <AppLoader />;
  // }

  // if (!isLoggedIn) {
  //   return <Navigate to="/auth/login" state={{ from: { pathname: location.pathname } }} replace />;
  // }

  return <>{children}</>;
}
