import { buildClientError, createHeaders, getJson, normalizeApiResult, type ApiResponse } from './api.shared';
const publicApiUrl = process.env.NEXT_PUBLIC_AUTH_API_URL;

if (!publicApiUrl) {
  throw new Error('NEXT_PUBLIC_AUTH_API_URL not defined');
}
async function baseFetch<T>(input: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(input, {
    ...init,
    headers: createHeaders(init),
    cache: 'no-store',
  });

  const payload = await getJson(response);
  const result = normalizeApiResult<T>(response, payload);

  if (!result.ok) {
    throw buildClientError(payload, result.status);
  }

  return result;
}

export function apiFetchExternal<T>(path: string, init?: RequestInit) {
  return baseFetch<T>(`${publicApiUrl}${path}`, init);
}

export async function apiFetchExternalData<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiFetchExternal<T>(path, init);
  return res.data;
}
export function apiFetchInternal<T>(path: string, init?: RequestInit) {
  return baseFetch<T>(path, init);
}
export async function apiFetchInternalData<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiFetchInternal<T>(path, init);
  return res.data;
}
