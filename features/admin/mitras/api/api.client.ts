import { apiFetchInternal } from '@/lib/api/express.client';
import { normalizeMitra, normalizeMitras } from '../mitras.normalizer';
import type { Mitra, MitraVisibilityFilter } from '../types/mitras.types';
import type { CreateMitraInput, UpdateMitraPayload } from '../schema/mitra.schema';

export async function createMitra(data: CreateMitraInput): Promise<Mitra> {
  const res = await apiFetchInternal<unknown>('/api/admin/mitras', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return normalizeMitra(res);
}

export async function getMitras(filter: MitraVisibilityFilter = 'available', query?: string): Promise<Mitra[]> {
  const params = new URLSearchParams();

  if (filter !== 'available') {
    params.set('includeDeleted', 'true');
  }

  if (query?.trim()) {
    params.set('query', query.trim());
  }

  const queryString = params.toString();

  const res = await apiFetchInternal<unknown>(`/api/admin/mitras${queryString ? `?${queryString}` : ''}`, {
    method: 'GET',
  });

  return normalizeMitras(res);
}
export async function getMitraById(id: string): Promise<Mitra> {
  const res = await apiFetchInternal<unknown>(`/api/admin/mitras/${id}`, {
    method: 'GET',
  });
  return normalizeMitra(res);
}
export async function updateMitra(id: string, data: UpdateMitraPayload): Promise<Mitra> {
  const res = await apiFetchInternal<unknown>(`/api/admin/mitras/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return normalizeMitra(res);
}
export async function deleteMitra(id: string): Promise<null> {
  const res = await apiFetchInternal<unknown>(`/api/admin/mitras/${id}`, {
    method: 'DELETE',
  });
  return res as null;
}
