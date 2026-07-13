import { NextRequest } from 'next/server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
import { forwardApiRequest } from '@/lib/api/route-proxy';

type RouteContext = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { jobId } = await context.params;
    const data = await forwardApiRequest(
      request,
      `/admin/user/import/${jobId}`,
      'POST',
    );

    return toRouteResponse({ data }, 201);
  } catch (error) {
    const apiError = error as {
      status?: number;
      code?: string;
      message?: string;
    };

    return toRouteError(apiError.message ?? 'Failed to enqueue bulk user import', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'IMPORT_BULK_USERS_FAILED',
      message: apiError.message ?? 'Failed to enqueue bulk user import',
    });
  }
}
