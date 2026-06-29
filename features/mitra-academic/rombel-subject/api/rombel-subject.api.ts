import { apiFetchInternal } from '@/lib/api/express.client';
import { academicPath } from '../../shared/api/path';
import type { RombelSubjectFormValues } from '../schema/rombel-subject.schema';
import type { ClassGroupCourse } from '../types/rombel-subject.types';

export function getRombelSubjects() {
  return apiFetchInternal<ClassGroupCourse[]>(academicPath('rombel-mapel'), { method: 'GET' });
}

export function createRombelSubject(data: RombelSubjectFormValues) {
  return apiFetchInternal<ClassGroupCourse>(academicPath('rombel-mapel'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateRombelSubject(id: string, data: RombelSubjectFormValues) {
  return apiFetchInternal<ClassGroupCourse>(academicPath(`rombel-mapel/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteRombelSubject(id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(`rombel-mapel/${id}`), { method: 'DELETE' });
}
