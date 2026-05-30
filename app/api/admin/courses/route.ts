import { NextRequest } from 'next/server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
import { appendSearchParams, forwardApiRequest } from '@/lib/api/route-proxy';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const data = await forwardApiRequest(request, appendSearchParams('/admin/courses', searchParams), 'GET');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to fetch courses', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_COURSES_FAILED',
      message: apiError.message ?? 'Failed to fetch courses',
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await forwardApiRequest(request, '/admin/courses', 'POST');

    return toRouteResponse({ data }, 201);
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to create course', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'CREATE_COURSE_FAILED',
      message: apiError.message ?? 'Failed to create course',
    });
  }
}
