import { jwtDecode } from 'jwt-decode';
import type { AuthToken } from '@/features/auth/types';
import { clearAuth, setAuthTokens } from '@/lib/auth';
import { publicAxiosClient } from '@/plugins/axios';
import { tokenUtils } from '@/utils/token';

let refreshPromise: Promise<AuthToken | null> | null = null;

export async function refreshToken(): Promise<AuthToken | null> {
  const handleRefreshFailure = () => {
    clearAuth();
    window.location.href = '/auth/login';
    return null;
  };

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const currentRefreshToken = tokenUtils.getRefreshToken();
      if (!currentRefreshToken) return handleRefreshFailure();

      const oldAccessToken = tokenUtils.getAccessToken();
      let oldTokenPayload: { sub?: string | number; userId?: string | number } | null = null;
      if (oldAccessToken) {
        try {
          oldTokenPayload = jwtDecode(oldAccessToken);
        } catch {
          // ignore
        }
      }

      const { data } = await publicAxiosClient.post<AuthToken>('/auth/refresh', {
        refreshToken: currentRefreshToken,
      });

      if (data?.accessToken && data?.refreshToken) {
        try {
          const newTokenPayload = jwtDecode<{ sub?: string | number; userId?: string | number }>(
            data.accessToken
          );
          const oldUserId = oldTokenPayload?.sub || oldTokenPayload?.userId;
          const newUserId = newTokenPayload?.sub || newTokenPayload?.userId;

          if (oldUserId && newUserId && String(oldUserId) !== String(newUserId)) {
            return handleRefreshFailure();
          }
        } catch {
          // Token decode failed - ignore
        }

        setAuthTokens(data.accessToken, data.refreshToken);
        return data;
      }

      return handleRefreshFailure();
    } catch {
      return handleRefreshFailure();
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
