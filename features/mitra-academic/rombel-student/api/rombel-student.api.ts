import { apiFetchInternal } from '@/lib/api/express.client';
import { academicPath } from '../../shared/api/path';
import type { RombelStudentFormValues } from '../schema/rombel-student.schema';
import type { ClassGroupStudent } from '../types/rombel-student.types';

export function getRombelStudents(mitraId: string) {
  return apiFetchInternal<ClassGroupStudent[]>(academicPath(mitraId, `class-group-students`), { method: 'GET' });
}

export function createRombelStudent(mitraId: string, data: RombelStudentFormValues) {
  return apiFetchInternal<ClassGroupStudent>(academicPath(mitraId, 'class-group-students'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateRombelStudent(mitraId: string, id: string, data: RombelStudentFormValues) {
  return apiFetchInternal<ClassGroupStudent>(academicPath(mitraId, `class-group-students/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteRombelStudent(mitraId: string, id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(mitraId, `class-group-students/${id}`), { method: 'DELETE' });
}
