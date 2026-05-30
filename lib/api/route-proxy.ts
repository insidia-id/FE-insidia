import { NextRequest } from 'next/server';
import { apiFetchWithAuth } from './express.server';

export async function forwardApiRequest<T = unknown>(request: NextRequest, path: string, method: RequestInit['method']): Promise<T> {
  const body = await resolveRequestBody(request, method);

  return apiFetchWithAuth<T>(path, {
    method,
    body,
  });
}

async function resolveRequestBody(request: NextRequest, method: RequestInit['method']) {
  if (!method || method === 'GET' || method === 'HEAD') {
    return undefined;
  }

  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('multipart/form-data')) {
    return request.formData();
  }

  if (contentType.includes('application/json')) {
    const text = await request.text();
    if (!text) {
      return undefined;
    }

    try {
      const payload = JSON.parse(text);
      return JSON.stringify(payload);
    } catch {
      return text;
    }
  }

  const rawBody = await request.text();
  return rawBody || undefined;
}

export function appendSearchParams(path: string, searchParams: URLSearchParams) {
  const queryString = searchParams.toString();

  if (!queryString) {
    return path;
  }

  return `${path}?${queryString}`;
}
