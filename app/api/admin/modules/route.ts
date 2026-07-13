import { NextRequest } from 'next/server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
import { forwardApiRequest } from '@/lib/api/route-proxy';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const courseInsidiaId = searchParams.get('courseInsidiaId');
    const classGroupCourseId = searchParams.get('classGroupCourseId');

    let backendPath: string;

    if (courseInsidiaId) {
      backendPath = `/admin/courses-insidia/${courseInsidiaId}/modules`;
    } else if (classGroupCourseId) {
      backendPath = `/admin/class-group-courses/${classGroupCourseId}/modules`;
    } else {
      return toRouteError('Missing courseInsidiaId or classGroupCourseId', {
        status: 400,
        code: 'MISSING_OWNER_ID',
        message: 'Either courseInsidiaId or classGroupCourseId is required',
      });
    }

    const data = await forwardApiRequest(request, backendPath, 'GET');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to fetch modules', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_MODULES_FAILED',
      message: apiError.message ?? 'Failed to fetch modules',
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseInsidiaId, classGroupCourseId, ...moduleData } = body;

    let backendPath: string;

    if (courseInsidiaId) {
      backendPath = `/admin/courses-insidia/${courseInsidiaId}/modules`;
    } else if (classGroupCourseId) {
      backendPath = `/admin/class-group-courses/${classGroupCourseId}/modules`;
    } else {
      return toRouteError('Missing courseInsidiaId or classGroupCourseId', {
        status: 400,
        code: 'MISSING_OWNER_ID',
        message: 'Either courseInsidiaId or classGroupCourseId is required',
      });
    }

    const newRequest = new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(moduleData),
    });

    const data = await forwardApiRequest(newRequest, backendPath, 'POST');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to create module', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'CREATE_MODULE_FAILED',
      message: apiError.message ?? 'Failed to create module',
    });
  }
}
