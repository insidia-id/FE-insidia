import { NextRequest } from 'next/server';
import { apiFetchWithAuth } from '@/lib/api/express.server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await apiFetchWithAuth(`/admin/permissions/${id}`, {
      method: 'GET',
    });

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to fetch permission', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_PERMISSION_FAILED',
      message: apiError.message ?? 'Failed to fetch permission',
    });
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const data = await apiFetchWithAuth(`/admin/permissions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to update permission', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'UPDATE_PERMISSION_FAILED',
      message: apiError.message ?? 'Failed to update permission',
    });
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await apiFetchWithAuth(`/admin/permissions/${id}`, {
      method: 'DELETE',
    });

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to delete permission', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'DELETE_PERMISSION_FAILED',
      message: apiError.message ?? 'Failed to delete permission',
    });
  }
}
