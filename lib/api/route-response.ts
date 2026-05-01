import { NextResponse } from 'next/server';

type RouteResult<T = unknown> = {
  ok: boolean;
  status: number;
  data: T;
  shouldAutoLogout?: boolean;
};

type ErrorOptions = {
  code?: string | null;
  shouldAutoLogout?: boolean;
  status?: number;
};

export function toRouteResponse<T>(result: RouteResult<T>) {
  return NextResponse.json(result, { status: result.status });
}

export function toRouteError(message: string, options?: ErrorOptions) {
  const status = options?.status ?? 500;

  return NextResponse.json(
    {
      ok: false,
      status,
      data: {
        code: options?.code ?? (status >= 500 ? 'INTERNAL_SERVER_ERROR' : null),
        message,
      },
      shouldAutoLogout: options?.shouldAutoLogout ?? false,
    },
    { status },
  );
}
