import { apiFetchInternal } from '@/lib/api/express.client';
import { academicPath } from '../../shared/api/path';
import { NO_HOMEROOM_TEACHER_VALUE } from '../../shared/constants/academic.constants';
import type { RombelFormValues } from '../schema/rombel.schema';
import type { ClassGroup } from '../types/rombel.types';

function toPayload(data: RombelFormValues) {
  return {
    ...data,
    waliKelasId: data.waliKelasId?.trim() && data.waliKelasId !== NO_HOMEROOM_TEACHER_VALUE ? data.waliKelasId : null,
  };
}

export async function getRombels(mitraId: string) {
  const response = await apiFetchInternal<ClassGroup[]>(academicPath(mitraId, 'class-group'), { method: 'GET' });
  return response;
}

export function createRombel(mitraId: string, data: RombelFormValues) {
  return apiFetchInternal<ClassGroup>(academicPath(mitraId, 'class-group'), {
    method: 'POST',
    body: JSON.stringify(toPayload(data)),
  });
}

export function updateRombel(mitraId: string, id: string, data: RombelFormValues) {
  return apiFetchInternal<ClassGroup>(academicPath(mitraId, `class-group/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(toPayload(data)),
  });
}

export function deleteRombel(mitraId: string, id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(mitraId, `class-group/${id}`), { method: 'DELETE' });
}
