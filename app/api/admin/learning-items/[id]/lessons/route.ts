import { NextRequest } from 'next/server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
import { forwardApiRequest } from '@/lib/api/route-proxy';
import { ApiErrorIssue } from '@/lib/api/api.shared';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await forwardApiRequest(request, `/admin/learning-items/${id}/lessons`, 'GET');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to fetch learning item', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_LEARNING_ITEM_FAILED',
      message: apiError.message ?? 'Failed to fetch learning item',
    });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await forwardApiRequest(request, `/admin/learning-items/${id}/lessons`, 'POST');

    return toRouteResponse({ data }, 201);
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string; errors?: ApiErrorIssue[] };

    return toRouteError(apiError.message ?? 'Failed to create learning item', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'CREATE_LEARNING_ITEM_FAILED',
      message: apiError.message ?? 'Failed to create learning item',
      errors: apiError.errors ?? [],
    });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await forwardApiRequest(request, `/admin/learning-items/${id}/lessons`, 'PATCH');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string; errors?: ApiErrorIssue[] };

    return toRouteError(apiError.message ?? 'Failed to update learning item', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'UPDATE_LEARNING_ITEM_FAILED',
      message: apiError.message ?? 'Failed to update learning item',
      errors: apiError.errors ?? [],
    });
  }
}
