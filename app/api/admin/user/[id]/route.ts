import { NextRequest } from 'next/server';
import { apiFetchWithAuth } from '@/lib/api/express.server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const data = await apiFetchWithAuth(`/admin/user/${id}`, {
      method: 'GET',
    });
    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as {
      status?: number;
      code?: string;
      message?: string;
    };

    return toRouteError(apiError.message ?? 'Failed to fetch user', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_USER_FAILED',
      message: apiError.message ?? 'Failed to fetch user',
    });
  }
}
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const data = await apiFetchWithAuth(`/admin/user/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as {
      status?: number;
      code?: string;
      message?: string;
    };
    return toRouteError(apiError.message ?? 'Failed to update user', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'UPDATE_USER_FAILED',
      message: apiError.message ?? 'Failed to update user',
    });
  }
}
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await apiFetchWithAuth(`/admin/user/${id}`, {
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
