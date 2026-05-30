import { apiFetchWithAuth } from '@/lib/api/express.server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await apiFetchWithAuth('/admin/mitras', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return toRouteResponse({ data }, 201);
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };
    return toRouteError(apiError.message ?? 'Failed to create mitra', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'CREATE_MITRA_FAILED',
      message: apiError.message ?? 'Failed to create mitra',
    });
  }
}
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const filter = searchParams.get('filter')?.trim();
    const query = searchParams.get('query')?.trim();

    const params = new URLSearchParams();

    if (query) params.set('query', query);
    if (filter) params.set('filter', filter);

    const queryString = params.toString();

    const data = await apiFetchWithAuth(`/admin/mitras${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as {
      status?: number;
      code?: string;
      message?: string;
    };

    return toRouteError(apiError.message ?? 'Failed to fetch mitras', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_MITRAS_FAILED',
      message: apiError.message ?? 'Failed to fetch mitras',
    });
  }
}
