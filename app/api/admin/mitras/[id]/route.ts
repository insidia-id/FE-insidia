import { NextRequest } from 'next/server';
import { apiFetchWithAuth } from '@/lib/api/express.server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await apiFetchWithAuth(`/admin/mitras/${id}`, {
      method: 'GET',
    });
    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };
    return toRouteError(apiError.message ?? 'Failed to fetch mitra', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_MITRA_FAILED',
      message: apiError.message ?? 'Failed to fetch mitra',
    });
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const data = await apiFetchWithAuth(`/admin/mitras/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };
    return toRouteError(apiError.message ?? 'Failed to update mitra', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'UPDATE_MITRA_FAILED',
      message: apiError.message ?? 'Failed to update mitra',
    });
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await apiFetchWithAuth(`/admin/mitras/${id}`, {
      method: 'DELETE',
    });
    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };
    return toRouteError(apiError.message ?? 'Failed to delete mitra', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'DELETE_MITRA_FAILED',
      message: apiError.message ?? 'Failed to delete mitra',
    });
  }
}
