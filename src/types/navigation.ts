import type { ComponentType, ReactNode } from 'react';
import type { Role } from '@/types/enums';

/**
 * Menu item types
 */
export type MenuItemType = 'group' | 'collapse' | 'item';

/**
 * Menu item configuration interface
 * Supports multi-level nesting, breadcrumb control, and advanced features
 */
export interface MenuItemConfig {
  id: string;
  title: string | ReactNode;
  type: MenuItemType;

  path?: string;
  url?: string;
  link?: string;

  icon?: ReactNode;

  children?: MenuItemConfig[];
  items?: MenuItemConfig[];

  roles?: Role[];
  disabled?: boolean;

  external?: boolean;
  target?: '_blank' | '_self';

  chip?: {
    label: string;
    color?: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  };
  badge?: number;

  breadcrumbs?: boolean;

  component?: ComponentType;

  caption?: ReactNode | string;
}

/**
 * Menu group configuration
 */
export interface MenuGroupConfig {
  id: string;
  title: string | ReactNode;
  type: 'group';
  icon?: ReactNode;
  caption?: ReactNode | string;
  children: MenuItemConfig[];
  roles?: Role[];
}

/**
 * Menu configuration structure
 */
export interface MenuConfig {
  items: (MenuItemConfig | MenuGroupConfig)[];
}
