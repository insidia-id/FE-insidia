import { apiFetchInternal } from '@/lib/api/express.client';

export function getLearningItemsByModuleId(moduleId: string) {
  return apiFetchInternal(`/api/admin/modules/${moduleId}/learning-items`, {
    method: 'GET',
  });
}

export function reorderLearningItems(moduleId: string, items: { id: string; sortOrder: number }[]): Promise<void> {
  return apiFetchInternal(`/api/admin/modules/${moduleId}/learning-items/reorder`, {
    method: 'PATCH',
    body: JSON.stringify({ items }),
  });
}
