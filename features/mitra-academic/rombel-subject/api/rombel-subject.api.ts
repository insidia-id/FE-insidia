import { apiFetchInternal } from '@/lib/api/express.client';
import { academicPath } from '../../shared/api/path';
import type { RombelSubjectFormValues } from '../schema/rombel-subject.schema';
import type { ClassGroupCourse } from '../types/rombel-subject.types';
import { mapClassGroupCourses } from '../mapper/RombelSubject.mapper';
import type { ClassGroupCourseResponse } from '../types/rombel-subject.types';
export async function getRombelSubjects(mitraId: string) {
  const response = await apiFetchInternal<ClassGroupCourseResponse[]>(academicPath(mitraId, 'class-group-courses'), { method: 'GET' });
  const classGroupCourses = mapClassGroupCourses(response);
  return classGroupCourses;
}

export function createRombelSubject(mitraId: string, data: RombelSubjectFormValues) {
  return apiFetchInternal<ClassGroupCourse>(academicPath(mitraId, 'class-group-courses'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateRombelSubject(mitraId: string, id: string, data: RombelSubjectFormValues) {
  return apiFetchInternal<ClassGroupCourse>(academicPath(mitraId, `class-group-courses/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteRombelSubject(mitraId: string, id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(mitraId, `class-group-courses/${id}`), { method: 'DELETE' });
}
