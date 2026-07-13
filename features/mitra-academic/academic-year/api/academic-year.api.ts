import { apiFetchInternal } from '@/lib/api/express.client';
import { academicPath } from '../../shared/api/path';
import type { AcademicYearFormValues } from '../schema/academic-year.schema';
import type { AcademicYear } from '../types/academic-year.types';

export function getAcademicYears(mitraId: string) {
  return apiFetchInternal<AcademicYear[]>(academicPath(mitraId, 'tahun-ajaran'), { method: 'GET' });
}

export function createAcademicYear(mitraId: string, data: AcademicYearFormValues) {
  return apiFetchInternal<AcademicYear>(academicPath(mitraId, 'tahun-ajaran'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateAcademicYear(mitraId: string, id: string, data: AcademicYearFormValues) {
  return apiFetchInternal<AcademicYear>(academicPath(mitraId, `tahun-ajaran/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteAcademicYear(mitraId: string, id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(mitraId, `tahun-ajaran/${id}`), { method: 'DELETE' });
}
