import { NextRequest } from 'next/server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
import { forwardApiRequest } from '@/lib/api/route-proxy';

type RouteContext = {
  params: Promise<{
    courseId: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { courseId } = await context.params;
    const data = await forwardApiRequest(request, `/admin/courses/${courseId}`, 'GET');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to fetch course', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_COURSE_FAILED',
      message: apiError.message ?? 'Failed to fetch course',
    });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { courseId } = await context.params;
    const data = await forwardApiRequest(request, `/admin/courses/${courseId}`, 'PATCH');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to update course', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'UPDATE_COURSE_FAILED',
      message: apiError.message ?? 'Failed to update course',
    });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { courseId } = await context.params;
    const data = await forwardApiRequest(request, `/admin/courses/${courseId}`, 'DELETE');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to delete course', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'DELETE_COURSE_FAILED',
      message: apiError.message ?? 'Failed to delete course',
    });
  }
}
