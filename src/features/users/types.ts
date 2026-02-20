import type { PaginationFilter } from '@/types/common';
import type { Role, UserStatus } from '@/types/enums';

export interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  role: Role;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilter extends PaginationFilter {
  search?: string;
  username?: string;
  role?: Role;
  status?: UserStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateUserDto {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateUserDto {
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  role?: Role;
  status?: UserStatus;
}
