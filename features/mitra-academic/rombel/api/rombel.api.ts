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

export function getRombels() {
  return apiFetchInternal<ClassGroup[]>(academicPath('rombel'), { method: 'GET' });
}

export function createRombel(data: RombelFormValues) {
  return apiFetchInternal<ClassGroup>(academicPath('rombel'), {
    method: 'POST',
    body: JSON.stringify(toPayload(data)),
  });
}

export function updateRombel(id: string, data: RombelFormValues) {
  return apiFetchInternal<ClassGroup>(academicPath(`rombel/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(toPayload(data)),
  });
}

export function deleteRombel(id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(`rombel/${id}`), { method: 'DELETE' });
}
