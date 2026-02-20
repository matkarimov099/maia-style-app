import type { RouteObject } from 'react-router';
import { ProtectedRoute } from '@/components/auth/router-components';
import { LazyComponent } from '@/components/common/lazy-component';
import { PageTitle } from '@/components/common/page-title';
import type { MenuItemConfig } from '@/types/navigation';
import menuItems, { hiddenRoutes } from '@/config/navigation/index';

/**
 * Recursively collect all menu items that have a path and component
 */
function collectRouteItems(items: MenuItemConfig[]): MenuItemConfig[] {
  const routeItems: MenuItemConfig[] = [];

  for (const item of items) {
    if (item.path && item.component) {
      routeItems.push(item);
    }

    if (item.children && item.children.length > 0) {
      routeItems.push(...collectRouteItems(item.children));
    }
    if (item.items && item.items.length > 0) {
      routeItems.push(...collectRouteItems(item.items));
    }
  }

  return routeItems;
}

/**
 * Generate React Router routes from menu configuration
 */
export function generateRoutes(): RouteObject[] {
  const allItems = [...menuItems.items, ...hiddenRoutes];
  const routeItems = collectRouteItems(allItems);

  const routes: RouteObject[] = [];

  for (const item of routeItems) {
    const { path, title, component: Component, roles } = item;

    if (!path || !Component) continue;

    const routePath = path.startsWith('/') ? path.slice(1) : path;
    const titleStr = typeof title === 'string' ? title : String(title);

    const pageElement = (
      <LazyComponent>
        <PageTitle title={titleStr} />
        <Component />
      </LazyComponent>
    );

    const element =
      roles && roles.length > 0 ? (
        <ProtectedRoute roles={roles}>{pageElement}</ProtectedRoute>
      ) : (
        pageElement
      );

    routes.push({ path: routePath, element });
  }

  return routes;
}
