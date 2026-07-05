import { ApiErrorIssue } from '@/lib/api/api.shared';
import { apiFetchWithAuth } from '@/lib/api/express.server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
import { NextRequest as Request } from 'next/server';

type RouteContext = {
  params: Promise<{
    mitraId: string;
    id: string;
  }>;
};

export async function GET(req: Request, context: RouteContext) {
  try {
    const { mitraId, id } = await context.params;
    const data = await apiFetchWithAuth(`/mitras/${mitraId}/class/${id}`, {
      method: 'GET',
    });

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string; errors?: ApiErrorIssue[] };
    return toRouteError(apiError.message ?? 'Failed to fetch mitra class', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_MITRA_CLASS_FAILED',
      message: apiError.message ?? 'Failed to fetch mitra class',
      errors: apiError.errors ?? [],
    });
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const { mitraId, id } = await context.params;
    const data = await apiFetchWithAuth(`/mitras/${mitraId}/class/${id}`, {
      method: 'DELETE',
    });

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string; errors?: ApiErrorIssue[] };
    return toRouteError(apiError.message ?? 'Failed to delete mitra class', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'DELETE_MITRA_CLASS_FAILED',
      message: apiError.message ?? 'Failed to delete mitra class',
      errors: apiError.errors ?? [],
    });
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { mitraId, id } = await context.params;
    const body = await req.json();
    const data = await apiFetchWithAuth(`/mitras/${mitraId}/class/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string; errors?: ApiErrorIssue[] };
    return toRouteError(apiError.message ?? 'Failed to update mitra class', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'UPDATE_MITRA_CLASS_FAILED',
      message: apiError.message ?? 'Failed to update mitra class',
      errors: apiError.errors ?? [],
    });
  }
}
