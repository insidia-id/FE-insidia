import { NextRequest } from 'next/server';
import { apiFetchWithAuth } from '@/lib/api/express.server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
import { ApiErrorIssue } from '@/lib/api/api.shared';

type RouteContext = {
  params: Promise<{
    id: string;
    mitraId: string;
  }>;
};

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id, mitraId } = await context.params;
    const body = await req.json();

    const targetPath = `/admin/roles/${id}/permissions/mitras/${mitraId}`;
    const data = await apiFetchWithAuth(targetPath, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string; errors?: ApiErrorIssue[] };

    return toRouteError(apiError.message ?? 'Failed to update role permissions', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'UPDATE_ROLE_PERMISSIONS_FAILED',
      message: apiError.message ?? 'Failed to update role permissions',
      errors: apiError.errors,
    });
  }
}
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id, mitraId } = await context.params;
    const targetPath = `/admin/roles/${id}/permissions/mitras/${mitraId}`;
    const data = await apiFetchWithAuth(targetPath, {
      method: 'GET',
    });
    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string; errors?: ApiErrorIssue[] };

    return toRouteError(apiError.message ?? 'Failed to update role permissions', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'UPDATE_ROLE_PERMISSIONS_FAILED',
      message: apiError.message ?? 'Failed to update role permissions',
      errors: apiError.errors,
    });
  }
}
