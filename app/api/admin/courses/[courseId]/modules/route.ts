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
    const data = await forwardApiRequest(
      request,
      `/admin/courses/${courseId}/modules`,
      'GET',
    );

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to fetch course modules', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_COURSE_MODULES_FAILED',
      message: apiError.message ?? 'Failed to fetch course modules',
    });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { courseId } = await context.params;
    const data = await forwardApiRequest(
      request,
      `/admin/courses/${courseId}/modules`,
      'POST',
    );

    return toRouteResponse({ data }, 201);
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to create course module', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'CREATE_COURSE_MODULE_FAILED',
      message: apiError.message ?? 'Failed to create course module',
    });
  }
}
