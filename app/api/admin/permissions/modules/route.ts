import { NextRequest } from 'next/server';
import { apiFetchWithAuth } from '@/lib/api/express.server';
import type { ApiErrorIssue } from '@/lib/api/api.shared';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';

type ApiRouteError = {
  status?: number;
  code?: string;
  message?: string;
  errors?: ApiErrorIssue[];
  details?: unknown;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get('scope');
    const mitraId = searchParams.get('mitraId');
    const params = new URLSearchParams();

    if (mitraId) {
      params.set('mitraId', mitraId);
    }
    if (scope) {
      params.set('scope', scope);
    }

    const queryString = params.size > 0 ? `?${params.toString()}` : '';
    const data = await apiFetchWithAuth(`/admin/permissions/modules${queryString}`, {
      method: 'GET',
    });

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as ApiRouteError;

    return toRouteError(apiError.message ?? 'Failed to fetch modules permissions', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_MODULES_PERMISSIONS_FAILED',
      message: apiError.message ?? 'Failed to fetch modules permissions',
      errors: apiError.errors,
      details: apiError.details,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await apiFetchWithAuth('/admin/permissions/modules', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return toRouteResponse({ data }, 201);
  } catch (error) {
    const apiError = error as ApiRouteError;
    return toRouteError(apiError.message ?? 'Failed to create module permission', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'CREATE_MODULES_PERMISSION_FAILED',
      message: apiError.message ?? 'Failed to create module permission',
      errors: apiError.errors,
      details: apiError.details,
    });
  }
}
