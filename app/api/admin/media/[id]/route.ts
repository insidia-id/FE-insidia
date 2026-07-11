import { NextRequest } from 'next/server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
import { forwardApiRequest } from '@/lib/api/route-proxy';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await forwardApiRequest(request, `/admin/media/${id}`, 'GET');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to fetch media', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_MEDIA_FAILED',
      message: apiError.message ?? 'Failed to fetch media',
    });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await forwardApiRequest(request, `/admin/media/${id}`, 'PATCH');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to update media', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'UPDATE_MEDIA_FAILED',
      message: apiError.message ?? 'Failed to update media',
    });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await forwardApiRequest(request, `/admin/media/${id}`, 'DELETE');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to delete media', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'DELETE_MEDIA_FAILED',
      message: apiError.message ?? 'Failed to delete media',
    });
  }
}
