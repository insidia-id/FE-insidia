import { NextRequest } from 'next/server';
import { apiFetchWithAuth } from '@/lib/api/express.server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';

export async function POST(req: NextRequest) {
  try {
    const result = await apiFetchWithAuth(`/auth/logout`, {
      method: 'POST',
    });
    if (!result.ok) {
      return toRouteResponse(result);
    }
  } catch (error) {
    console.error('BACKEND_LOGOUT_FAILED', error);
    return toRouteError('Failed to log out');
  }

  return toRouteResponse({
    ok: true,
    status: 200,
    data: {
      message: 'Logged out successfully',
    },
  });
}
