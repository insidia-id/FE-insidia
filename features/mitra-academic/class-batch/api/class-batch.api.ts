import { apiFetchInternal } from '@/lib/api/express.client';
import { academicPath } from '../../shared/api/path';
import type { ClassBatchFormValues } from '../schema/class-batch.schema';
import type { AcademicClass } from '../types/class-batch.types';

export function getClassBatches() {
  return apiFetchInternal<AcademicClass[]>(academicPath('kelas'), { method: 'GET' });
}

export function createClassBatch(data: ClassBatchFormValues) {
  return apiFetchInternal<AcademicClass>(academicPath('kelas'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateClassBatch(id: string, data: ClassBatchFormValues) {
  return apiFetchInternal<AcademicClass>(academicPath(`kelas/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteClassBatch(id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(`kelas/${id}`), { method: 'DELETE' });
}
