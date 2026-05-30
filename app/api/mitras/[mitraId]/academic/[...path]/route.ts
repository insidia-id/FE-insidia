import { NextRequest } from 'next/server';
import { toRouteError, toRouteResponse } from '@/lib/api/route-response';
import { appendSearchParams, forwardApiRequest } from '@/lib/api/route-proxy';

type RouteContext = {
  params: Promise<{
    mitraId: string;
    path: string[];
  }>;
};

function buildAcademicPath(mitraId: string, path: string[], request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const backendPath = `/mitras/${mitraId}/academic/${path.join('/')}`;

  return appendSearchParams(backendPath, searchParams);
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { mitraId, path } = await context.params;
    const data = await forwardApiRequest(request, buildAcademicPath(mitraId, path, request), 'GET');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to fetch academic resource', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'FETCH_MITRA_ACADEMIC_FAILED',
      message: apiError.message ?? 'Failed to fetch academic resource',
    });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { mitraId, path } = await context.params;
    const data = await forwardApiRequest(request, buildAcademicPath(mitraId, path, request), 'POST');

    return toRouteResponse({ data }, 201);
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to create academic resource', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'CREATE_MITRA_ACADEMIC_FAILED',
      message: apiError.message ?? 'Failed to create academic resource',
    });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { mitraId, path } = await context.params;
    const data = await forwardApiRequest(request, buildAcademicPath(mitraId, path, request), 'PATCH');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to update academic resource', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'UPDATE_MITRA_ACADEMIC_FAILED',
      message: apiError.message ?? 'Failed to update academic resource',
    });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { mitraId, path } = await context.params;
    const data = await forwardApiRequest(request, buildAcademicPath(mitraId, path, request), 'PUT');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to replace academic resource', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'REPLACE_MITRA_ACADEMIC_FAILED',
      message: apiError.message ?? 'Failed to replace academic resource',
    });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { mitraId, path } = await context.params;
    const data = await forwardApiRequest(request, buildAcademicPath(mitraId, path, request), 'DELETE');

    return toRouteResponse({ data });
  } catch (error) {
    const apiError = error as { status?: number; code?: string; message?: string };

    return toRouteError(apiError.message ?? 'Failed to delete academic resource', {
      status: apiError.status ?? 500,
      code: apiError.code ?? 'DELETE_MITRA_ACADEMIC_FAILED',
      message: apiError.message ?? 'Failed to delete academic resource',
    });
  }
}
