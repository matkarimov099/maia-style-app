import { lazy, type ReactNode, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router';
import { isAuthenticated } from '@/lib/auth';
import { AuthContextProvider } from '@/providers/auth-context-provider';

const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));
const DefaultLayout = lazy(() => import('@/layouts/DefaultLayout'));

function LazyComponent({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">...</div>}>
      {children}
    </Suspense>
  );
}

export function RootRedirect() {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/auth/login" replace />;
}

export function AuthLayoutWrapper() {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <LazyComponent>
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    </LazyComponent>
  );
}

export function MainLayoutWrapper() {
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <AuthContextProvider>
      <LazyComponent>
        <DefaultLayout>
          <Outlet />
        </DefaultLayout>
      </LazyComponent>
    </AuthContextProvider>
  );
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: string[];
}) {
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }

  // Role check can be implemented with useAuthContext when needed
  if (allowedRoles) {
    // For now, allow all authenticated users
  }

  return <>{children}</>;
}
