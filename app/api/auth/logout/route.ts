import { apiFetchWithAuth } from '@/lib/api/express.server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';

export async function POST() {
  try {
    const data = await apiFetchWithAuth<{ message?: string }>(`/auth/logout`, {
      method: 'POST',
    });

    return toRouteResponse({
      data: {
        message: data?.message ?? 'Logged out successfully',
      },
    });
  } catch (error) {
    console.error('BACKEND_LOGOUT_FAILED', error);

    const apiError = error as {
      status?: number;
      code?: string;
      message?: string;
    };

    if (apiError.status === 401) {
      return toRouteResponse({
        data: {
          message: 'Logged out successfully',
        },
      });
    }

    return toRouteError(apiError.message ?? 'Failed to log out', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'LOGOUT_FAILED',
      message: apiError.message ?? 'Failed to log out',
    });
  }
}
