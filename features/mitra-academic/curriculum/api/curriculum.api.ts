import { apiFetchInternal } from '@/lib/api/express.client';
import { academicPath } from '../../shared/api/path';
import type { CurriculumFormValues } from '../schema/curriculum.schema';
import type { Curriculum } from '../types/curriculum.types';

function toPayload(data: CurriculumFormValues) {
  return {
    ...data,
    code: data.code?.trim() ? data.code.trim() : null,
    description: data.description?.trim() ? data.description.trim() : null,
  };
}

export function getCurricula() {
  return apiFetchInternal<Curriculum[]>(academicPath('kurikulum'), { method: 'GET' });
}

export function createCurriculum(data: CurriculumFormValues) {
  return apiFetchInternal<Curriculum>(academicPath('kurikulum'), {
    method: 'POST',
    body: JSON.stringify(toPayload(data)),
  });
}

export function updateCurriculum(id: string, data: CurriculumFormValues) {
  return apiFetchInternal<Curriculum>(academicPath(`kurikulum/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(toPayload(data)),
  });
}

export function deleteCurriculum(id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(`kurikulum/${id}`), { method: 'DELETE' });
}
