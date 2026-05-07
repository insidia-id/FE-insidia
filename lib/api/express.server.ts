import { headers } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { refreshAccessTokenOnce } from '@/features/auth/api/api';
import type { AppToken } from '@/features/auth/types/auth.types';
import { buildClientError, createHeaders, getJson, unwrapData } from './api.shared';

const apiUrl = process.env.API_URL;
const NODE_ENV = process.env.NODE_ENV;
if (!apiUrl) {
  throw new Error('API_URL environment variable is not defined');
}

export async function apiFetchWithAuth<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const requestHeaders = createHeaders(init);
  const token = await resolveAuthToken();
  const accessToken = typeof token?.accessToken === 'string' ? token.accessToken : null;
  if (NODE_ENV !== 'development') {
    console.log('Resolved access token:', accessToken);
  }
  if (!accessToken) {
    throw buildClientError(
      {
        error: {
          code: 'UNAUTHORIZED',
          message: 'Unauthorized',
        },
      },
      401,
    );
  }

  requestHeaders.set('Authorization', `Bearer ${accessToken}`);

  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: requestHeaders,
    cache: 'no-store',
  });

  const payload = await getJson(response);

  if (!response.ok) {
    throw buildClientError(payload, response.status);
  }

  return unwrapData<T>(payload);
}

async function resolveAuthToken(): Promise<AppToken | null> {
  const incomingHeaders = await headers();
  const secureCookie = incomingHeaders.get('x-forwarded-proto') === 'https' || process.env.NODE_ENV !== 'development';

  const token = (await getToken({
    req: {
      headers: Object.fromEntries(incomingHeaders.entries()),
    },
    secret: process.env.BETTER_AUTH_SECRET,
    secureCookie,
  })) as AppToken | null;

  if (!token?.refreshToken) {
    return token;
  }

  const refreshTokenExpiresAt = typeof token.refreshTokenExpiresAt === 'number' ? token.refreshTokenExpiresAt : null;

  if (refreshTokenExpiresAt && Date.now() >= refreshTokenExpiresAt) {
    return token;
  }

  const accessTokenExpiresAt = typeof token.accessTokenExpiresAt === 'number' ? token.accessTokenExpiresAt : null;

  if (!token.accessToken || (accessTokenExpiresAt !== null && Date.now() >= accessTokenExpiresAt - 5_000)) {
    return refreshAccessTokenOnce(token);
  }

  return token;
}
