import { type JwtPayload, jwtDecode } from 'jwt-decode';
import { tokenUtils } from '@/utils/token';

export function isAuthenticated(): boolean {
  try {
    const token = tokenUtils.getAccessToken();
    if (!token) return false;
    const { exp } = jwtDecode<JwtPayload>(token);
    return (exp ?? 0) > Date.now() / 1000;
  } catch {
    return false;
  }
}

export const clearAuth = () => {
  tokenUtils.removeTokens();
};

export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  tokenUtils.setTokens(accessToken, refreshToken);
};
