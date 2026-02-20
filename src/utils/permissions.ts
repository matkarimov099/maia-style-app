import type { Role } from '@/types/enums';

const ADMIN_ROLES: Role[] = ['ADMIN'];
const MANAGER_ROLES: Role[] = ['ADMIN', 'MANAGER'];

export function isAdmin(role: Role): boolean {
  return ADMIN_ROLES.includes(role);
}

export function isManagerOrAbove(role: Role): boolean {
  return MANAGER_ROLES.includes(role);
}

export function hasPermission(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}
