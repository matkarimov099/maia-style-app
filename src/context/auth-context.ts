import { createContext } from 'react';
import type { Role } from '@/types/enums';

export interface AuthedUser {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  role: Role;
  status: string;
  avatar?: string;
}

export interface AuthContextType {
  authedUser: AuthedUser | null;
  role: Role | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  hasRole: (...roles: Role[]) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  authedUser: null,
  role: null,
  isLoggedIn: false,
  isLoading: true,
  hasRole: () => false,
  logout: () => null,
});
