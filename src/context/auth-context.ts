import { createContext } from 'react';
import type { AuthedUser } from '@/features/auth/types';
import type { Role } from '@/types/enums';

export interface AuthContextType {
  authToken?: string | null;
  authedUser?: AuthedUser | null;
  role?: Role | null;
  hasRole: (roles: Role | Role[]) => boolean;
  logout: () => void;
  isLoading: boolean;
  isLoggedIn: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
