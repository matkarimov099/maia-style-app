import type { Role } from '@/types/enums';

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn?: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthedUser {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  role: Role;
  status: string;
  avatar?: string;
}
