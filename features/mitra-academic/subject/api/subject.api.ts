import { apiFetchInternal } from '@/lib/api/express.client';
import { academicPath } from '../../shared/api/path';
import type { SubjectFormValues } from '../schema/subject.schema';
import type { Subject } from '../types/subject.types';

function toPayload(data: SubjectFormValues) {
  return {
    ...data,
    description: data.description?.trim() ? data.description.trim() : null,
  };
}

export function getSubjects() {
  return apiFetchInternal<Subject[]>(academicPath('mapel'), { method: 'GET' });
}

export function createSubject(data: SubjectFormValues) {
  return apiFetchInternal<Subject>(academicPath('mapel'), {
    method: 'POST',
    body: JSON.stringify(toPayload(data)),
  });
}

export function updateSubject(id: string, data: SubjectFormValues) {
  return apiFetchInternal<Subject>(academicPath(`mapel/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(toPayload(data)),
  });
}

export function deleteSubject(id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(`mapel/${id}`), { method: 'DELETE' });
}
