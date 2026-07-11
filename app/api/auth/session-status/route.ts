import { sessionResponse } from '@/features/auth/types/auth.types';
import { apiFetchWithAuth } from '@/lib/api/express.server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
import { mapStatusSessionResponse } from '@/features/auth/lib/auth.mapper';
export async function GET() {
  try {
    const res = await apiFetchWithAuth<sessionResponse>('/auth/session-status', {
      method: 'GET',
    });

    if (!res.status) {
      return toRouteError('Unauthorized', {
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
      });
    }

    if (res.status === 'BANNED') {
      return toRouteError('User has been banned', {
        status: 403,
        code: 'USER_BANNED',
        message: 'User has been banned',
      });
    }

    return toRouteResponse({
      data: mapStatusSessionResponse(res),
    });
  } catch (error) {
    console.error('SESSION_STATUS_FAILED', error);

    const apiError = error as {
      status?: number;
      code?: string;
      message?: string;
    };

    return toRouteError(apiError.message ?? 'Failed to validate session', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'SESSION_STATUS_FAILED',
      message: apiError.message ?? 'Failed to validate session',
    });
  }
}
