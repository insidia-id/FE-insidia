import { apiFetchInternal } from '@/lib/api/express.client';
import { CreateUserInput, UpdateUserPayload } from '../schema/user.schema';
import type { User, UserDetail, UserFilter } from '../types/user.types';

export async function createUser(data: CreateUserInput): Promise<User> {
  const res = await apiFetchInternal<User>('/api/admin/user', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res;
}

export async function getUsers(filter: UserFilter = 'active'): Promise<User[]> {
  const params = new URLSearchParams();
  params.set('filter', filter);

  const res = await apiFetchInternal<User[]>(`/api/admin/user?${params.toString()}`, {
    method: 'GET',
  });

  return res;
}

export async function getUserById(userId: string): Promise<UserDetail> {
  const res = await apiFetchInternal<UserDetail>(`/api/admin/user/${userId}`, {
    method: 'GET',
  });
  return res;
}

export async function updateUser(userId: string, data: UpdateUserPayload): Promise<UserDetail> {
  const payload = { ...(data as Record<string, unknown>) };
  delete payload.id;

  const res = await apiFetchInternal<UserDetail>(`/api/admin/user/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return res;
}

export async function deleteUser(userId: string): Promise<null> {
  const res = await apiFetchInternal<null>(`/api/admin/user/${userId}`, {
    method: 'DELETE',
  });
  return res;
}
