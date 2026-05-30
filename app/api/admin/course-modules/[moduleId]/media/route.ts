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
    const data = await forwardApiRequest(
      request,
      `/admin/course-modules/${moduleId}/media`,
      'GET',
    );

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to fetch module media', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_MODULE_MEDIA_FAILED',
      message: apiError.message ?? 'Failed to fetch module media',
    });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { moduleId } = await context.params;
    const data = await forwardApiRequest(
      request,
      `/admin/course-modules/${moduleId}/media/upload`,
      'POST',
    );

    return toRouteResponse({ data }, 201);
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to upload module media', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'UPLOAD_MODULE_MEDIA_FAILED',
      message: apiError.message ?? 'Failed to upload module media',
    });
  }
}
