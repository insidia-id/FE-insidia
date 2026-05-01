import { headers } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { createHeaders, getJson, normalizeApiResult, type ApiResult } from './api.shared';

const apiUrl = process.env.API_URL;

if (!apiUrl) {
  throw new Error('API_URL environment variable is not defined');
}

export async function apiFetchWithAuth<T = unknown>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const requestHeaders = createHeaders(init);

  const token = await getToken({
    req: {
      headers: Object.fromEntries((await headers()).entries()),
    },
    secret: process.env.BETTER_AUTH_SECRET,
  });
  const accessToken = typeof token?.accessToken === 'string' ? token.accessToken : null;

  if (!accessToken) {
    return {
      ok: false,
      status: 401,
      data: {
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
      },
      shouldAutoLogout: true,
    };
  }

  requestHeaders.set('Authorization', `Bearer ${accessToken}`);

  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: requestHeaders,
    cache: 'no-store',
  });

  const payload = await getJson(response);

  return normalizeApiResult<T>(response, payload);
}
