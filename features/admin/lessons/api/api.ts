import { apiFetchInternal } from '@/lib/api/express.client';
import { LessonsSchema, UpdatableLessonValues } from '../schema/lessons.schema';
import { Lesson } from '../types/lessons.types';
export function createLesson(moduleId: string, data: LessonsSchema) {
  return apiFetchInternal(`/api/admin/modules/${moduleId}/lessons`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function deleteLesson(learningItemsId: string, lessonId: string) {
  return apiFetchInternal(`/api/admin/learning-items/${learningItemsId}/lessons/${lessonId}`, {
    method: 'DELETE',
  });
}

export function updateLesson(learningItemsId: string, payload: UpdatableLessonValues) {
  return apiFetchInternal(`/api/admin/learning-items/${learningItemsId}/lessons`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function getLessonById(learningItemsId: string) {
  return apiFetchInternal<Lesson>(`/api/admin/learning-items/${learningItemsId}/lessons`, {
    method: 'GET',
  });
}
