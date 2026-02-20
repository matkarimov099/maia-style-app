import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useAuthContext } from '@/hooks/use-auth-context';
import { DefaultLayout } from '@/layouts';
import AuthLayout from '@/layouts/AuthLayout';
import AuthContextProvider from '@/providers/auth-context-provider';
import type { Role } from '@/types/enums';

/**
 * MainLayoutWrapper component with auth context and default layout
 */
export function MainLayoutWrapper() {
  return (
    <AuthContextProvider>
      <AuthGuard>
        <DefaultLayout />
      </AuthGuard>
    </AuthContextProvider>
  );
}

/**
 * AuthLayoutWrapper component with auth context and auth layouts
 */
export function AuthLayoutWrapper() {
  return (
    <AuthContextProvider>
      <AuthLayout />
    </AuthContextProvider>
  );
}

/**
 * RootRedirect component to redirect based on user role
 */
export function RootRedirect() {
  // TODO: Backend tayyor bo'lganda quyidagi commentlarni olib tashlang
  // const { isLoading, authedUser } = useAuthContext();
  //
  // if (isLoading || !authedUser) {
  //   return null;
  // }

  return <Navigate to="/dashboard" replace />;
}

/**
 * ProtectedRoute component with role-based access control
 */
interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Role[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { hasRole, isLoading, authedUser } = useAuthContext();

  if (isLoading || !authedUser) {
    return null;
  }

  if (!roles || roles.length === 0) {
    return <>{children}</>;
  }

  if (!hasRole(roles)) {
    return <Navigate to="/not-access" replace />;
  }

  return <>{children}</>;
}
