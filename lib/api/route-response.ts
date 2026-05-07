import { NextResponse } from 'next/server';

type RouteResult<T = unknown> = {
  data: T;
  meta?: unknown;
};

export type ErrorOptions = {
  code?: string;
  status?: number;
  message: string;
};

export function toRouteResponse<T>(result: RouteResult<T>, status = 200) {
  return NextResponse.json(result, { status });
}

export function toRouteError(message: string, options?: ErrorOptions) {
  const status = options?.status ?? 500;

  return NextResponse.json(
    {
      error: {
        code: options?.code ?? mapStatusToCode(status),
        message,
      },
    },
    { status },
  );
}

function mapStatusToCode(status: number) {
  switch (status) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    default:
      return 'INTERNAL_SERVER_ERROR';
  }
}
