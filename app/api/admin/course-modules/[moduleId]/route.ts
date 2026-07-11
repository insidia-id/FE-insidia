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
    const data = await forwardApiRequest(request, `/admin/course-modules/${moduleId}`, 'GET');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to fetch course module', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_COURSE_MODULE_FAILED',
      message: apiError.message ?? 'Failed to fetch course module',
    });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { moduleId } = await context.params;
    const data = await forwardApiRequest(request, `/admin/course-modules/${moduleId}`, 'PATCH');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to update course module', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'UPDATE_COURSE_MODULE_FAILED',
      message: apiError.message ?? 'Failed to update course module',
    });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { moduleId } = await context.params;
    const data = await forwardApiRequest(request, `/admin/course-modules/${moduleId}`, 'DELETE');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to delete course module', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'DELETE_COURSE_MODULE_FAILED',
      message: apiError.message ?? 'Failed to delete course module',
    });
  }
}
