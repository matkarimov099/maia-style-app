import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import { LazyComponent } from '@/components/common/lazy-component';

const Login = lazy(() => import('@/pages/auth/Login'));

export const authRoutes: RouteObject[] = [
  {
    path: 'login',
    element: (
      <LazyComponent>
        <Login />
      </LazyComponent>
    ),
  },
];
