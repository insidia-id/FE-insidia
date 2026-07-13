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

export function getCurricula(mitraId: string) {
  return apiFetchInternal<Curriculum[]>(academicPath(mitraId, 'curriculum'), { method: 'GET' });
}

export function createCurriculum(mitraId: string, data: CurriculumFormValues) {
  return apiFetchInternal<Curriculum>(academicPath(mitraId, 'curriculum'), {
    method: 'POST',
    body: JSON.stringify(toPayload(data)),
  });
}

export function updateCurriculum(mitraId: string, id: string, data: CurriculumFormValues) {
  return apiFetchInternal<Curriculum>(academicPath(mitraId, `curriculum/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(toPayload(data)),
  });
}

export function deleteCurriculum(mitraId: string, id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(mitraId, `curriculum/${id}`), { method: 'DELETE' });
}
