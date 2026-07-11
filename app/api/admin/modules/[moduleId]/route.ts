import { NextRequest } from 'next/server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
import { forwardApiRequest } from '@/lib/api/route-proxy';

type RouteContext = {
  params: Promise<{
    moduleId: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { moduleId } = await context.params;
    const data = await forwardApiRequest(request, `/admin/modules/${moduleId}`, 'GET');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to fetch module', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_MODULE_FAILED',
      message: apiError.message ?? 'Failed to fetch module',
    });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { moduleId } = await context.params;
    const data = await forwardApiRequest(request, `/admin/modules/${moduleId}`, 'PATCH');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to update module', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'UPDATE_MODULE_FAILED',
      message: apiError.message ?? 'Failed to update module',
    });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { moduleId } = await context.params;
    const data = await forwardApiRequest(request, `/admin/modules/${moduleId}`, 'DELETE');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to delete module', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'DELETE_MODULE_FAILED',
      message: apiError.message ?? 'Failed to delete module',
    });
  }
}
