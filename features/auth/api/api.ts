import { apiFetchInternal, apiFetchInternalData } from '@/lib/api/express.client';
import { VerifyAuthOtpInput } from '../schema/auth.schema';
import { AppAuthResponse, AppToken, GoogleExchangePayload, RefreshResponse } from '../types/auth.types';
import { clearAuthToken, getInternalAuthToken } from '../auth.utils';
const apiUrl = process.env.API_URL;

export const verifyAuthOtp = (data: VerifyAuthOtpInput) => {
  return apiFetchInternalData<AppAuthResponse>(`${apiUrl}/auth/verify-otp`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
export function exchangeGoogleLogin(data: GoogleExchangePayload) {
  return apiFetchInternalData<AppAuthResponse>(`${apiUrl}/auth/google/exchange`, {
    method: 'POST',
    headers: {
      'x-internal-token': getInternalAuthToken(),
    },
    body: JSON.stringify(data),
  });
}
export async function refreshAccessToken(token: AppToken): Promise<AppToken> {
  if (!token.refreshToken) {
    return clearAuthToken(token, 'SessionExpired');
  }

  try {
    const result = await apiFetchInternal<RefreshResponse>(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    if (!result.ok) {
      if (result.status === 401) {
        return clearAuthToken(token, 'SessionExpired');
      }

      return {
        ...token,
        accessToken: undefined,
        error: 'RefreshAccessTokenError',
      };
    }

    const data = result.data.data ?? result.data;

    if (!data?.accessToken || !data.accessTokenExpiresInSeconds) {
      console.error('Invalid refresh payload:', result);
      return {
        ...token,
        accessToken: undefined,
        error: 'RefreshAccessTokenError',
      };
    }

    return {
      ...token,
      user: data.user ?? token.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      accessTokenExpiresAt: Date.now() + data.accessTokenExpiresInSeconds * 1000,
      refreshTokenExpiresAt: data.refreshTokenExpiresInSeconds ? Date.now() + data.refreshTokenExpiresInSeconds * 1000 : token.refreshTokenExpiresAt,
      error: undefined,
    };
  } catch (error) {
    console.error('Refresh access token exception:', error);
    return {
      ...token,
      accessToken: undefined,
      error: 'RefreshAccessTokenError',
    };
  }
}
const refreshQueue = new Map<string, Promise<AppToken>>();

export async function refreshAccessTokenOnce(token: AppToken): Promise<AppToken> {
  if (!token.refreshToken) {
    return clearAuthToken(token, 'SessionExpired');
  }

  const key = token.user?.id ?? token.refreshToken;
  const existing = refreshQueue.get(key);

  if (existing) {
    return existing;
  }

  const promise = refreshAccessToken(token).finally(() => {
    refreshQueue.delete(key);
  });

  refreshQueue.set(key, promise);
  return promise;
}
export async function logout() {
  return apiFetchInternalData(`/api/auth/logout`, {
    method: 'POST',
  });
}
