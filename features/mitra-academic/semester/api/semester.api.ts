import { apiFetchInternal } from '@/lib/api/express.client';
import { academicPath } from '../../shared/api/path';
import type { SemesterFormValues } from '../schema/semester.schema';
import type { Semester } from '../types/semester.types';

export function getSemesters() {
  return apiFetchInternal<Semester[]>(academicPath('semester'), { method: 'GET' });
}

export function createSemester(data: SemesterFormValues) {
  return apiFetchInternal<Semester>(academicPath('semester'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateSemester(id: string, data: SemesterFormValues) {
  return apiFetchInternal<Semester>(academicPath(`semester/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteSemester(id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(`semester/${id}`), { method: 'DELETE' });
}
