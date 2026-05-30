import 'server-only';

import { apiFetchWithAuth } from '@/lib/api/express.server';
import type { ClassGroupCourse, ClassGroupStudent, Subject } from '../types/mitra-academic.types';

type MyAcademicQuery = {
  academicYearId?: string;
  semesterId?: string;
};

function withQuery(path: string, query?: MyAcademicQuery) {
  const params = new URLSearchParams();

  if (query?.academicYearId) {
    params.set('academicYearId', query.academicYearId);
  }

  if (query?.semesterId) {
    params.set('semesterId', query.semesterId);
  }

  return params.size ? `${path}?${params.toString()}` : path;
}

export function getMyAcademicClasses(
  mitraId: string,
  query?: MyAcademicQuery,
) {
  return apiFetchWithAuth<Array<ClassGroupCourse | ClassGroupStudent>>(
    withQuery(`/mitras/${mitraId}/academic/kelas-saya`, query),
    { method: 'GET' },
  );
}

export function getMyAcademicSubjects(
  mitraId: string,
  query?: MyAcademicQuery,
) {
  return apiFetchWithAuth<Subject[]>(
    withQuery(`/mitras/${mitraId}/academic/mapel-saya`, query),
    { method: 'GET' },
  );
}
