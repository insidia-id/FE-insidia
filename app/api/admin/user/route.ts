import { NextRequest } from 'next/server';
import { apiFetchWithAuth } from '@/lib/api/express.server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
import { ApiErrorIssue } from '@/lib/api/api.shared';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await apiFetchWithAuth('/admin/user', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return toRouteResponse({ data }, 201);
  } catch (error) {
    const apiError = error as {
      status?: number;
      code?: string;
      message?: string;
      errors?: ApiErrorIssue[];
    };

    return toRouteError(apiError.message ?? 'Failed to create user', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'CREATE_USER_FAILED',
      message: apiError.message ?? 'Failed to create user',
      errors: apiError.errors,
    });
  }
}
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = new URLSearchParams();

    ['filter', 'scope', 'roleCode', 'search', 'page', 'limit', 'sort'].forEach((key) => {
      const value = searchParams.get(key);

      if (value) {
        params.set(key, value);
      }
    });
    const data = await apiFetchWithAuth(`/admin/user?${params.toString()}`, {
      method: 'GET',
    });
    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as {
      status?: number;
      code?: string;
      message?: string;
      errors?: ApiErrorIssue[];
    };
    return toRouteError(apiError.message ?? 'Failed to fetch users', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_USERS_FAILED',
      message: apiError.message ?? 'Failed to fetch users',
    });
  }
}
