import { NextRequest } from 'next/server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
import { forwardApiRequest } from '@/lib/api/route-proxy';

export async function POST(request: NextRequest) {
  try {
    const data = await forwardApiRequest(request, '/admin/user/preview', 'POST');

    return toRouteResponse({ data }, 201);
  } catch (error) {
    const apiError = error as {
      status?: number;
      code?: string;
      message?: string;
    };

    return toRouteError(apiError.message ?? 'Failed to preview bulk users', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'PREVIEW_BULK_USERS_FAILED',
      message: apiError.message ?? 'Failed to preview bulk users',
    });
  }
}
