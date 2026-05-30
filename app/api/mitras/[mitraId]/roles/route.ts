import { NextRequest } from 'next/server';
import { apiFetchWithAuth } from '@/lib/api/express.server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';

type RouteContext = {
  params: Promise<{
    mitraId: string;
  }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { mitraId } = await context.params;
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get('scope');
    const includeDeleted = searchParams.get('includeDeleted');
    const params = new URLSearchParams();

    if (scope) {
      params.set('scope', scope);
    }

    if (includeDeleted) {
      params.set('includeDeleted', includeDeleted);
    }

    params.set('mitraId', mitraId);

    const queryString = `?${params.toString()}`;
    const data = await apiFetchWithAuth(`/admin/roles${queryString}`, {
      method: 'GET',
    });

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to fetch mitra roles', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_MITRA_ROLES_FAILED',
      message: apiError.message ?? 'Failed to fetch mitra roles',
    });
  }
}
