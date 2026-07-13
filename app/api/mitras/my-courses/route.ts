import { NextRequest } from 'next/server';
import { apiFetchWithAuth } from '@/lib/api/express.server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
import type { MyAcademicQueryDto } from '@/features/my-courses/types/my-courses.types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query: MyAcademicQueryDto = {
      academicYearId: searchParams.get('academicYearId') ?? undefined,
      semesterId: searchParams.get('semesterId') ?? undefined,
      classGroupId: searchParams.get('classGroupId') ?? undefined,
      courseId: searchParams.get('courseId') ?? undefined,
      teacherId: searchParams.get('teacherId') ?? undefined,
    };

    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value) {
        params.set(key, value as string);
      }
    });

    const queryString = params.toString() ? `?${params.toString()}` : '';

    const data = await apiFetchWithAuth(`/mitras/my-courses${queryString}`, {
      method: 'GET',
    });
    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as {
      status?: number;
      code?: string;
      message?: string;
    };

    return toRouteError(apiError.message ?? 'Failed to fetch', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_FAILED',
      message: apiError.message ?? 'Failed to fetch',
    });
  }
}
