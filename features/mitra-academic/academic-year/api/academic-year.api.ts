import { apiFetchInternal } from '@/lib/api/express.client';
import { academicPath } from '../../shared/api/path';
import type { AcademicYearFormValues } from '../schema/academic-year.schema';
import type { AcademicYear } from '../types/academic-year.types';

export function getAcademicYears() {
  return apiFetchInternal<AcademicYear[]>(academicPath('tahun-ajaran'), { method: 'GET' });
}

export function createAcademicYear(data: AcademicYearFormValues) {
  return apiFetchInternal<AcademicYear>(academicPath('tahun-ajaran'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateAcademicYear(id: string, data: AcademicYearFormValues) {
  return apiFetchInternal<AcademicYear>(academicPath(`tahun-ajaran/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteAcademicYear(id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(`tahun-ajaran/${id}`), { method: 'DELETE' });
}
