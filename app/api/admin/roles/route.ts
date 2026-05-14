import { NextRequest } from 'next/server';
import { apiFetchWithAuth } from '@/lib/api/express.server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';

export async function GET(req: NextRequest) {
  try {
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

    const queryString = params.size > 0 ? `?${params.toString()}` : '';
    const data = await apiFetchWithAuth(`/admin/roles${queryString}`, {
      method: 'GET',
    });

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to fetch roles', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_ROLES_FAILED',
      message: apiError.message ?? 'Failed to fetch roles',
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await apiFetchWithAuth('/admin/roles', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return toRouteResponse({ data }, 201);
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to create role', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'CREATE_ROLE_FAILED',
      message: apiError.message ?? 'Failed to create role',
    });
  }
}
