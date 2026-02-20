import type { RouteObject } from 'react-router';
import { Navigate } from 'react-router';
import { generateRoutes } from '@/config/navigation/routes';

export const mainRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="dashboard" replace />,
  },
  ...generateRoutes(),
];
