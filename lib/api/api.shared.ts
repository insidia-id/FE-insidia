import { stat } from 'fs';

export type ApiSuccess<T> = {
  data: T;
};

export type ApiErrorBody = {
  error: {
    code: string;
    status?: number;
    message: string;
  };
};

export type ApiClientError = Error & {
  status: number;
  code: string;
  message: string;
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function getJson(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

export function createHeaders(init?: RequestInit): Headers {
  const headers = new Headers(init?.headers);

  if (!(init?.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return headers;
}

export function unwrapData<T>(payload: unknown): T {
  if (isRecord(payload) && 'data' in payload) {
    return payload.data as T;
  }

  return payload as T;
}

export function normalizeErrorData(payload: unknown) {
  const error = isRecord(payload) && isRecord(payload.error) ? payload.error : null;

  return {
    code: typeof error?.code === 'string' ? error.code : 'FETCH_FAILED',
    message: typeof error?.message === 'string' ? error.message : 'Fetch request failed',
    status: typeof error?.status === 'number' ? error.status : 500,
  };
}

export function buildClientError(payload: unknown, status: number): ApiClientError {
  const data = normalizeErrorData(payload);

  const error = new Error(data.message) as ApiClientError;
  error.status = status;
  error.code = data.code;
  error.message = data.message;
  return error;
}
