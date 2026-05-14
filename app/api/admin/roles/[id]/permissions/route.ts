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
    const data = await apiFetchWithAuth(`/admin/roles/${id}/permissions`, {
      method: 'GET',
    });

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to fetch role permissions', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_ROLE_PERMISSIONS_FAILED',
      message: apiError.message ?? 'Failed to fetch role permissions',
    });
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const data = await apiFetchWithAuth(`/admin/roles/${id}/permissions`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to update role permissions', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'UPDATE_ROLE_PERMISSIONS_FAILED',
      message: apiError.message ?? 'Failed to update role permissions',
    });
  }
}
