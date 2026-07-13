import { ApiErrorIssue } from '@/lib/api/api.shared';
import { apiFetchWithAuth } from '@/lib/api/express.server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
import { NextRequest as Request } from 'next/server';

type RouteContext = {
  params: Promise<{
    mitraId: string;
  }>;
};

export async function GET(req: Request, context: RouteContext) {
  try {
    const { mitraId } = await context.params;
    const data = await apiFetchWithAuth(`/mitras/${mitraId}/semesters`, {
      method: 'GET',
    });

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string; errors?: ApiErrorIssue[] };
    return toRouteError(apiError.message ?? 'Failed to fetch mitra semesters', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_MITRA_SEMESTERS_FAILED',
      message: apiError.message ?? 'Failed to fetch mitra semesters',
      errors: apiError.errors ?? [],
    });
  }
}

export async function POST(req: Request, context: RouteContext) {
  try {
    const { mitraId } = await context.params;
    const body = await req.json();
    const data = await apiFetchWithAuth(`/mitras/${mitraId}/semesters`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return toRouteResponse({ data }, 201);
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string; errors?: ApiErrorIssue[] };
    return toRouteError(apiError.message ?? 'Failed to create mitra semester', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'CREATE_MITRA_SEMESTER_FAILED',
      message: apiError.message ?? 'Failed to create mitra semester',
      errors: apiError.errors ?? [],
    });
  }
}
