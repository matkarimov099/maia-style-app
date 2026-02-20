import { createBrowserRouter } from 'react-router';
import {
  AuthLayoutWrapper,
  MainLayoutWrapper,
  RootRedirect,
} from '@/components/auth/router-components';
import { ForbiddenPage } from '@/pages/errors/403';
import { NotFoundPage } from '@/pages/errors/404';
import { authRoutes } from '@/router/auth-routes';
import { mainRoutes } from '@/router/main-routes';

export const router = createBrowserRouter([
  // Root path redirect to dashboard
  {
    path: '/',
    element: <RootRedirect />,
  },

  // Main application routes
  {
    path: '/',
    element: <MainLayoutWrapper />,
    children: mainRoutes,
  },

  // Auth routes
  {
    path: '/auth',
    element: <AuthLayoutWrapper />,
    children: authRoutes,
  },

  // Error pages
  {
    path: '/not-access',
    element: <ForbiddenPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
