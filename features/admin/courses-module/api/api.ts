import { apiFetchInternal } from '@/lib/api/express.client';
import { CourseModuleFormValues } from '@/features/admin/courses-module/schema/courses-module.schema';
import { CourseModule } from '@/features/admin/courses-module/types/courses-module.types';
export async function getCourseInsidiaModules(courseInsidiaId: string): Promise<CourseModule[]> {
  const params = new URLSearchParams();
  params.set('courseInsidiaId', courseInsidiaId);

  return apiFetchInternal<CourseModule[]>(`/api/admin/modules?${params.toString()}`, {
    method: 'GET',
  });
}

export async function getClassGroupCourseModules(classGroupCourseId: string): Promise<CourseModule[]> {
  const params = new URLSearchParams();
  params.set('classGroupCourseId', classGroupCourseId);

  return apiFetchInternal<CourseModule[]>(`/api/admin/modules?${params.toString()}`, {
    method: 'GET',
  });
}

export async function createCourseInsidiaModule(courseInsidiaId: string, data: CourseModuleFormValues): Promise<CourseModule> {
  return apiFetchInternal<CourseModule>('/api/admin/modules', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      courseInsidiaId,
    }),
  });
}

export async function createClassGroupCourseModule(classGroupCourseId: string | null, data: CourseModuleFormValues): Promise<CourseModule> {
  return apiFetchInternal<CourseModule>('/api/admin/modules', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      classGroupCourseId,
    }),
  });
}

export function getCourseModuleById(moduleId: string): Promise<CourseModule> {
  return apiFetchInternal<CourseModule>(`/api/admin/modules/${moduleId}`, {
    method: 'GET',
  });
}

export async function updateCourseModule(moduleId: string, data: CourseModuleFormValues): Promise<CourseModule> {
  return apiFetchInternal<CourseModule>(`/api/admin/modules/${moduleId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteCourseModule(moduleId: string): Promise<{ message: string }> {
  return apiFetchInternal<{ message: string }>(`/api/admin/modules/${moduleId}`, {
    method: 'DELETE',
  });
}
