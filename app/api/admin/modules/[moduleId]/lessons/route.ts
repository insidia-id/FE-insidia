import { NextRequest } from 'next/server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
import { forwardApiRequest } from '@/lib/api/route-proxy';
import { ApiErrorIssue } from '@/lib/api/api.shared';

type RouteContext = {
  params: Promise<{
    moduleId: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { moduleId } = await context.params;
    const data = await forwardApiRequest(request, `/admin/modules/${moduleId}/lessons`, 'POST');
    return toRouteResponse({ data }, 201);
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string; errors?: ApiErrorIssue[] };

    return toRouteError(apiError.message ?? 'Failed to create lesson', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'CREATE_LESSON_FAILED',
      message: apiError.message ?? 'Failed to create lesson',
      errors: apiError.errors ?? [],
    });
  }
}
