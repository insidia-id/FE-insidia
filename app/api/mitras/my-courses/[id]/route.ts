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

    const data = await forwardApiRequest(request, `/mitras/my-courses/${id}`, 'GET');

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
