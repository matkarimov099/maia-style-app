import type { ComponentType } from 'react';

export interface NavItem {
  key: string;
  titleKey: string;
  descriptionKey?: string;
  path?: string;
  icon?: ComponentType<{ className?: string }>;
  children?: NavItem[];
  roles?: string[];
}

// Navigation items will be populated when sidebar is built
// This is the configuration structure for menu items
export const navigationConfig: NavItem[] = [
  {
    key: 'dashboard',
    titleKey: 'navigation.dashboard.title',
    descriptionKey: 'navigation.dashboard.description',
    path: '/dashboard',
  },
  {
    key: 'products',
    titleKey: 'navigation.products.title',
    descriptionKey: 'navigation.products.description',
    path: '/products',
  },
  {
    key: 'users',
    titleKey: 'navigation.users.title',
    descriptionKey: 'navigation.users.description',
    path: '/users',
    roles: ['ADMIN', 'MANAGER'],
  },
];
