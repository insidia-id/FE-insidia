import { apiFetchInternal } from '@/lib/api/express.client';
import { academicPath } from '../../shared/api/path';
import type { ClassBatchFormValues } from '../schema/class-batch.schema';
import type { AcademicClass } from '../types/class-batch.types';

export function getClassBatches(mitraId: string) {
  return apiFetchInternal<AcademicClass[]>(academicPath(mitraId, 'class'), { method: 'GET' });
}

export function createClassBatch(mitraId: string, data: ClassBatchFormValues) {
  return apiFetchInternal<AcademicClass>(academicPath(mitraId, 'class'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateClassBatch(mitraId: string, id: string, data: ClassBatchFormValues) {
  return apiFetchInternal<AcademicClass>(academicPath(mitraId, `class/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteClassBatch(mitraId: string, id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(mitraId, `class/${id}`), { method: 'DELETE' });
}
