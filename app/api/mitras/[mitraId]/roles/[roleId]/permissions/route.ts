import { NextRequest } from 'next/server';
import { apiFetchWithAuth } from '@/lib/api/express.server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';

type RouteContext = {
  params: Promise<{
    mitraId: string;
    roleId: string;
  }>;
};

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { mitraId, roleId } = await context.params;
    const body = await req.json();
    const data = await apiFetchWithAuth(
      `/admin/roles/${roleId}/permissions/mitras/${mitraId}`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
    );

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to update mitra role permissions', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'UPDATE_MITRA_ROLE_PERMISSIONS_FAILED',
      message: apiError.message ?? 'Failed to update mitra role permissions',
    });
  }
}
