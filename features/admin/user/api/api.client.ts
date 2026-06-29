import { apiFetchInternal } from '@/lib/api/express.client';
import { CreateUserInput, UpdateUserPayload } from '../schema/user.schema';
import type { User, UserDetail, UserQueryParams, UserScope, UsersResponse } from '../types/user.types';
import { normalizeUser, normalizeUserDetail, normalizeUsersResponse } from '../types/user.normalizer';
import { normalizeBulkPreviewResult, normalizeBulkImportResult } from '@/features/bulk/utils/normalize.bulk';
import { BulkPreviewResult, BulkImportResult } from '@/features/bulk/types/bulk.types';
import { normalizeRoleQueryParam } from '../HelperUser';

export async function createUser(data: CreateUserInput): Promise<User> {
  const res = await apiFetchInternal<unknown>('/api/admin/user', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return normalizeUser(res);
}

export async function getUsers(params: UserQueryParams = {}): Promise<UsersResponse> {
  const urlParams = new URLSearchParams();

  if (params.filter) {
    urlParams.set('filter', params.filter);
  }

  if (params.scope) {
    urlParams.set('scope', params.scope);
  }

  const normalizedRoleCode = normalizeRoleQueryParam(params.roleCode);
  if (normalizedRoleCode) {
    urlParams.set('roleCode', normalizedRoleCode);
  }

  if (params.search) {
    urlParams.set('search', params.search);
  }

  if (typeof params.page === 'number') {
    urlParams.set('page', String(params.page));
  }

  if (typeof params.limit === 'number') {
    urlParams.set('limit', String(params.limit));
  }

  if (params.sort) {
    urlParams.set('sort', params.sort);
  }

  const res = await apiFetchInternal<unknown>(`/api/admin/user?${urlParams.toString()}`, {
    method: 'GET',
  });
  const result = normalizeUsersResponse(res);
  return result;
}

export async function getUserById(userId: string, scope: UserScope = 'INSIDIA'): Promise<UserDetail> {
  const params = new URLSearchParams({
    scope,
  });

  const res = await apiFetchInternal<unknown>(`/api/admin/user/${userId}?${params.toString()}`, {
    method: 'GET',
  });
  return normalizeUserDetail(res);
}

export async function updateUser(userId: string, data: UpdateUserPayload): Promise<UserDetail> {
  const payload = { ...(data as Record<string, unknown>) };
  delete payload.id;

  const res = await apiFetchInternal<unknown>(`/api/admin/user/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      ...payload,
      scope: data.scope ?? 'INSIDIA',
    }),
  });
  return normalizeUserDetail(res);
}

export async function deleteUser(userId: string, scope: UserScope = 'INSIDIA'): Promise<null> {
  const params = new URLSearchParams({
    scope,
  });

  const res = await apiFetchInternal<null>(`/api/admin/user/${userId}?${params.toString()}`, {
    method: 'DELETE',
  });
  return res;
}

export function deleteUserMitraRole(userId: string, mitraId?: string): Promise<null> {
  const params = new URLSearchParams();

  if (mitraId) {
    params.set('mitraId', mitraId);
  }

  const queryString = params.toString() ? `?${params.toString()}` : '';

  return apiFetchInternal<null>(`/api/admin/user/${userId}/mitra-roles${queryString}`, {
    method: 'DELETE',
  });
}

export async function switchUserMitra(userId: string, data: { mitraId: string }): Promise<UserDetail> {
  const res = await apiFetchInternal<unknown>(`/api/admin/user/${userId}/switch-mitra`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return normalizeUserDetail(res);
}

export async function previewBulkUsers(file: File): Promise<BulkPreviewResult> {
  const formData = new FormData();
  formData.set('file', file);

  const res = await apiFetchInternal<unknown>('/api/admin/user/preview', {
    method: 'POST',
    body: formData,
  });
  return normalizeBulkPreviewResult(res);
}

export async function importBulkUsers(jobId: string): Promise<BulkImportResult> {
  const res = await apiFetchInternal<unknown>(`/api/admin/user/import/${jobId}`, {
    method: 'POST',
  });
  return normalizeBulkImportResult(res);
}
