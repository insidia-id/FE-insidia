import { apiFetchInternal } from '@/lib/api/express.client';
import { academicPath } from '../../shared/api/path';
import type { SemesterFormValues } from '../schema/semester.schema';
import type { Semester } from '../types/semester.types';

export function getSemesters(mitraId: string) {
  return apiFetchInternal<Semester[]>(academicPath(mitraId, 'semesters'), { method: 'GET' });
}

export function createSemester(mitraId: string, data: SemesterFormValues) {
  return apiFetchInternal<Semester>(academicPath(mitraId, 'semesters'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateSemester(mitraId: string, id: string, data: SemesterFormValues) {
  return apiFetchInternal<Semester>(academicPath(mitraId, `semesters/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteSemester(mitraId: string, id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(mitraId, `semesters/${id}`), { method: 'DELETE' });
}
