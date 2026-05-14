import { NextRequest } from 'next/server';
import { apiFetchWithAuth } from '@/lib/api/express.server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get('scope');
    const params = new URLSearchParams();

    if (scope) {
      params.set('scope', scope);
    }

    const queryString = params.size > 0 ? `?${params.toString()}` : '';
    const data = await apiFetchWithAuth(`/admin/permissions${queryString}`, {
      method: 'GET',
    });

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to fetch permissions', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_PERMISSIONS_FAILED',
      message: apiError.message ?? 'Failed to fetch permissions',
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await apiFetchWithAuth('/admin/permissions', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return toRouteResponse({ data }, 201);
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to create permission', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'CREATE_PERMISSION_FAILED',
      message: apiError.message ?? 'Failed to create permission',
    });
  }
}
