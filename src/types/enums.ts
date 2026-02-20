// ============ USER ENUMS ============

export const Role = {
  Admin: 'ADMIN',
  SuperAdmin: 'SUPER_ADMIN',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const UserStatus = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
  Deleted: 'DELETED',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

// ============ PRODUCT ENUMS ============

export const ProductStatus = {
  Active: 'ACTIVE',
  Draft: 'DRAFT',
  Archived: 'ARCHIVED',
} as const;

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];

export const ProductCategory = {
  Electronics: 'ELECTRONICS',
  Clothing: 'CLOTHING',
  Food: 'FOOD',
  Other: 'OTHER',
} as const;

export type ProductCategory = (typeof ProductCategory)[keyof typeof ProductCategory];

// ============ HELPER TYPES ============

export const RoleValues = Object.values(Role);
export const UserStatusValues = Object.values(UserStatus);
export const ProductStatusValues = Object.values(ProductStatus);
export const ProductCategoryValues = Object.values(ProductCategory);
