export type ApiResponse<T> = {
  ok: true;
  status: number;
  data: T;
  shouldAutoLogout: boolean;
};

export type ApiErrorResponse = {
  ok: false;
  status: number;
  data: ApiErrorData;
  shouldAutoLogout: boolean;
};

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

export type ApiErrorData = {
  code: string;
  message: string;
  errors?: unknown;
};

export type ApiClientError = Error & {
  status: number;
  code: string;
  shouldAutoLogout: boolean;
  data: ApiErrorData;
};

type ApiEnvelope = {
  ok?: boolean;
  status?: number;
  data?: unknown;
  code?: unknown;
  message?: unknown;
  errors?: unknown;
  shouldAutoLogout?: unknown;
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function isApiEnvelope(payload: unknown): payload is ApiEnvelope {
  return isRecord(payload) && typeof payload.ok === 'boolean';
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
  if (isApiEnvelope(payload) && 'data' in payload) {
    return payload.data as T;
  }

  return payload as T;
}

export function normalizeErrorData(payload: unknown): ApiErrorData {
  const source = isApiEnvelope(payload) && isRecord(payload.data) ? payload.data : isRecord(payload) ? payload : null;

  return {
    code: typeof source?.code === 'string' ? source.code : 'FETCH_FAILED',
    message: typeof source?.message === 'string' ? source.message : 'Fetch request failed',
    errors: source?.errors,
  };
}

export function getShouldAutoLogout(status: number, payload: unknown): boolean {
  const source = isApiEnvelope(payload) && isRecord(payload.data) ? payload.data : isRecord(payload) ? payload : null;

  if (typeof source?.shouldAutoLogout === 'boolean') {
    return source.shouldAutoLogout;
  }

  const code = typeof source?.code === 'string' ? source.code : null;

  return (status === 403 && code === 'ACCOUNT_UNAVAILABLE') || (status === 401 && (code === 'SESSION_NOT_FOUND' || code === 'INVALID_REFRESH_TOKEN'));
}

export function buildClientError(payload: unknown, status: number): ApiClientError {
  const data = normalizeErrorData(payload);
  const error = new Error(data.message) as ApiClientError;
  error.status = status;
  error.code = data.code;
  error.shouldAutoLogout = getShouldAutoLogout(status, payload);
  error.data = data;

  return error;
}

export function normalizeApiResult<T>(response: Response, payload: unknown): ApiResult<T> {
  const status = isApiEnvelope(payload) && typeof payload.status === 'number' ? payload.status : response.status;

  if (isApiEnvelope(payload) && payload.ok === false) {
    return {
      ok: false,
      status,
      data: normalizeErrorData(payload),
      shouldAutoLogout: getShouldAutoLogout(status, payload),
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      status,
      data: normalizeErrorData(payload),
      shouldAutoLogout: getShouldAutoLogout(status, payload),
    };
  }

  return {
    ok: true,
    status,
    data: unwrapData<T>(payload),
    shouldAutoLogout: getShouldAutoLogout(status, payload),
  };
}
