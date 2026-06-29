import { apiFetchInternal } from '@/lib/api/express.client';
import { academicPath } from '../../shared/api/path';
import type { RombelStudentFormValues } from '../schema/rombel-student.schema';
import type { ClassGroupStudent } from '../types/rombel-student.types';

export function getRombelStudents() {
  return apiFetchInternal<ClassGroupStudent[]>(academicPath('rombel-murid'), { method: 'GET' });
}

export function createRombelStudent(data: RombelStudentFormValues) {
  return apiFetchInternal<ClassGroupStudent>(academicPath('rombel-murid'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateRombelStudent(id: string, data: RombelStudentFormValues) {
  return apiFetchInternal<ClassGroupStudent>(academicPath(`rombel-murid/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteRombelStudent(id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(`rombel-murid/${id}`), { method: 'DELETE' });
}
