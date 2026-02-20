import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';

const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const Products = lazy(() => import('@/pages/products/Products'));
const Users = lazy(() => import('@/pages/users/Users'));
const Profile = lazy(() => import('@/pages/profile/Profile'));

function LazyPage({
  Component,
}: {
  Component: React.LazyExoticComponent<() => React.JSX.Element>;
}) {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center">...</div>}>
      <Component />
    </Suspense>
  );
}

export const mainRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: <LazyPage Component={Dashboard} />,
  },
  {
    path: 'products',
    element: <LazyPage Component={Products} />,
  },
  {
    path: 'users',
    element: <LazyPage Component={Users} />,
  },
  {
    path: 'profile',
    element: <LazyPage Component={Profile} />,
  },
];
