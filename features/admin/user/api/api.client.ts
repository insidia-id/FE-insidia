import { apiFetchInternal } from '@/lib/api/express.client';
import { CreateUserInput, UpdateUserPayload } from '../schema/user.schema';
import type { User, UserDetail, UserFilter, UserScope } from '../types/user.types';
import { normalizeUser, normalizeUserDetail, normalizeUsers } from '../types/user.normalizer';

function buildCreateUserPayload(data: CreateUserInput): CreateUserInput {
  return {
    email: data.email,
    name: data.name ?? null,
    phone: data.phone ?? null,
    role: data.role,
    scope: data.scope,
    status: data.status,
    mitraRole: data.mitraRole,
    mitraId: data.mitraId,
  };
}

export async function createUser(data: CreateUserInput): Promise<User> {
  const res = await apiFetchInternal<unknown>('/api/admin/user', {
    method: 'POST',
    body: JSON.stringify(buildCreateUserPayload(data)),
  });
  return normalizeUser(res);
}

export async function getUsers(filter: UserFilter = 'available', scope: UserScope = 'INSIDIA', mitraId?: string): Promise<User[]> {
  const params = new URLSearchParams();
  params.set('filter', filter);
  params.set('scope', scope);
  if (mitraId) {
    params.set('mitraId', mitraId);
  }

  const res = await apiFetchInternal<unknown>(`/api/admin/user?${params.toString()}`, {
    method: 'GET',
  });
  return normalizeUsers(res);
}

export async function getUserById(userId: string, scope: UserScope = 'INSIDIA', mitraId?: string): Promise<UserDetail> {
  const params = new URLSearchParams({
    scope,
  });
  if (mitraId) {
    params.set('mitraId', mitraId);
  }

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

export async function deleteUser(userId: string, scope: UserScope = 'INSIDIA', mitraId?: string): Promise<null> {
  const params = new URLSearchParams({
    scope,
  });
  if (mitraId) {
    params.set('mitraId', mitraId);
  }

  const res = await apiFetchInternal<null>(`/api/admin/user/${userId}?${params.toString()}`, {
    method: 'DELETE',
  });
  return res;
}
