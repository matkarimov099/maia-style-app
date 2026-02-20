import { lazy } from 'react';
import type { MenuConfig, MenuItemConfig } from '@/types/navigation';

/**
 * Main menu items
 */
const dashboard: MenuItemConfig = {
  id: 'dashboard',
  title: 'navigation.dashboard.title',
  type: 'item',
  path: '/dashboard',
  roles: [],
  component: lazy(() => import('@/pages/dashboard/Dashboard')),
  breadcrumbs: true,
};

const products: MenuItemConfig = {
  id: 'products',
  title: 'navigation.products.title',
  type: 'item',
  path: '/products',
  roles: [],
  component: lazy(() => import('@/pages/products/Products')),
  breadcrumbs: true,
};

const users: MenuItemConfig = {
  id: 'users',
  title: 'navigation.users.title',
  type: 'item',
  path: '/users',
  roles: [],
  component: lazy(() => import('@/pages/users/Users')),
  breadcrumbs: true,
};

/**
 * Main menu configuration
 */
const menuItems: MenuConfig = {
  items: [dashboard, products, users],
};

/**
 * Hidden routes that don't appear in sidebar
 */
export const hiddenRoutes: MenuItemConfig[] = [
  {
    id: 'profile',
    title: 'navigation.profile.title',
    type: 'item',
    path: '/profile',
    roles: [],
    breadcrumbs: true,
    component: lazy(() => import('@/pages/profile/Profile')),
  },
];

export default menuItems;
