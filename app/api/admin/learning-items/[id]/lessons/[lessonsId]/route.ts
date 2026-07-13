import { NextRequest } from 'next/server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
import { forwardApiRequest } from '@/lib/api/route-proxy';

type RouteContext = {
  params: Promise<{
    id: string;
    lessonsId: string;
  }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id, lessonsId } = await context.params;
    const data = await forwardApiRequest(request, `/admin/learning-items/${id}/lessons/${lessonsId}`, 'DELETE');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to delete learning item', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'DELETE_LEARNING_ITEM_FAILED',
      message: apiError.message ?? 'Failed to delete learning item',
    });
  }
}
