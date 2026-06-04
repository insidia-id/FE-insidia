import { NextRequest } from 'next/server';
import { apiFetchWithAuth } from '@/lib/api/express.server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(req.url);
    const mitraId = searchParams.get('mitraId');
    const params = new URLSearchParams();

    if (mitraId) {
      params.set('mitraId', mitraId);
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';

    await apiFetchWithAuth(`/admin/user/${id}/mitra-roles${queryString}`, {
      method: 'DELETE',
    });

    return toRouteResponse({ data: null });
  } catch (error) {
    const apiError = error as {
      status?: number;
      code?: string;

      message?: string;
    };
    return toRouteError(apiError.message ?? 'Failed to delete user', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'DELETE_USER_FAILED',
      message: apiError.message ?? 'Failed to delete user',
    });
  }
}
