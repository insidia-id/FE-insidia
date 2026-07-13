import { apiFetchInternal } from '@/lib/api/express.client';
import { VerifyAuthOtpInput } from '../schema/auth.schema';
import { AppAuthResponse, AppToken, GoogleExchangePayload, MiddlewareSessionRequest, RefreshResponse, ResolvedSessionState } from '../types/auth.types';
import { clearAuthToken, getInternalAuthToken } from '../auth.utils';

const apiUrl = process.env.API_URL;
const debugAuthTiming = process.env.DEBUG_AUTH_TIMING === 'true';

export const verifyAuthOtp = (data: VerifyAuthOtpInput) => {
  return apiFetchInternal<AppAuthResponse>(`${apiUrl}/auth/verify-otp`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
export function exchangeGoogleLogin(data: GoogleExchangePayload) {
  return apiFetchInternal<AppAuthResponse>(`${apiUrl}/auth/google/exchange`, {
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
    const result = await apiFetchInternal(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    const data = result as RefreshResponse;
    if (!data?.accessToken || !data.accessTokenExpiresInSeconds) {
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
    const apiError = error as {
      status?: number;
      code?: string;
      message?: string;
    };

    if (apiError.status === 401) {
      return clearAuthToken(token, 'SessionExpired');
    }

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
  return apiFetchInternal(`/api/auth/logout`, {
    method: 'POST',
  });
}
export async function resolveSessionState(req: MiddlewareSessionRequest): Promise<ResolvedSessionState> {
  if (!req.auth?.user || req.auth.error) {
    return null;
  }

  const startedAt = performance.now();
  let outcome = 'ok';

  try {
    const response = await fetch(new URL('/api/auth/session-status', req.nextUrl.toString()), {
      method: 'GET',
      headers: {
        cookie: req.headers.get('cookie') ?? '',
        'x-forwarded-proto': req.headers.get('x-forwarded-proto') ?? req.nextUrl.protocol.replace(':', ''),
      },
      cache: 'no-store',
    });
    const result = await response.json();

    if (response.ok) {
      return result.data;
    }

    if (response.status === 401) {
      outcome = 'unauthorized';
      return 'UNAUTHORIZED';
    }

    if (response.status === 403) {
      if (result?.error?.code === 'USER_BANNED') {
        outcome = 'banned';
        return 'BANNED';
      }

      outcome = 'forbidden';
      return null;
    }

    outcome = `http-${response.status}`;
  } catch (error) {
    outcome = 'error';
    console.error('MIDDLEWARE_SESSION_STATUS_FAILED', error);
  } finally {
    if (debugAuthTiming) {
      console.info(`[auth-timing] resolveSessionState outcome=${outcome} duration=${Math.round(performance.now() - startedAt)}ms`);
    }
  }

  return null;
}
