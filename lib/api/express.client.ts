import { buildClientError, createHeaders, getJson, unwrapData } from './api.shared';
import { publicEnv } from '@/lib/config/env.public';
const publicApiUrl = publicEnv.NEXT_PUBLIC_AUTH_API_URL;

async function baseFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: createHeaders(init),
    cache: 'no-store',
  });
  const payload = await getJson(response);
  if (!response.ok) {
    throw buildClientError(payload, response.status);
  }

  return unwrapData<T>(payload);
}

export function apiFetchExternal<T>(path: string, init?: RequestInit): Promise<T> {
  return baseFetch<T>(`${publicApiUrl}${path}`, init);
}

export function apiFetchInternal<T>(path: string, init?: RequestInit): Promise<T> {
  return baseFetch<T>(path, init);
}
