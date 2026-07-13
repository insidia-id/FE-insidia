import 'server-only';

import { cache } from 'react';
import { apiFetchWithAuth } from '@/lib/api/express.server';
import type { ClassGroupCourse, ClassGroupStudent, Subject } from '../types/mitra-academic.types';
import { CourseSummary } from '@/features/admin/courses/types/course.types';

export type MyAcademicQuery = {
  academicYearId?: string;
  semesterId?: string;
};

function academicServerPath(path: string, query?: MyAcademicQuery) {
  const params = new URLSearchParams();

  if (query?.academicYearId) {
    params.set('academicYearId', query.academicYearId);
  }

  if (query?.semesterId) {
    params.set('semesterId', query.semesterId);
  }

  const queryString = params.toString();

  return `/mitras/${path}${queryString ? `?${queryString}` : ''}`;
}

export const getMyAcademicClasses = cache(async (query?: MyAcademicQuery) => {
  return apiFetchWithAuth<Array<ClassGroupCourse | ClassGroupStudent>>(academicServerPath('my-classes', query), { method: 'GET' });
});

export const getMyAcademicSubjects = cache(async (query?: MyAcademicQuery) => {
  return apiFetchWithAuth<Array<CourseSummary>>(academicServerPath('my-courses', query), { method: 'GET' });
});
