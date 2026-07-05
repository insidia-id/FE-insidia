import { apiFetchInternal } from '@/lib/api/express.client';
import type { CourseDetail, CourseListItem, CourseMedia, CourseModule, CourseScope, CourseStatus } from '../types/course.types';
import type { CourseFormValues, CourseModuleFormValues, CreateCourseDto, MediaMetadataFormValues, MediaUploadFormValues } from '../schema/course.schema';

export async function getCourses(scope: CourseScope, status?: CourseStatus, mitraId?: string | null): Promise<CourseListItem[]> {
  const params = new URLSearchParams();
  params.set('scope', scope);

  if (status) {
    params.set('status', status);
  }

  if (mitraId) {
    params.set('mitraId', mitraId);
  }

  return apiFetchInternal<CourseListItem[]>(`/api/admin/courses?${params.toString()}`, {
    method: 'GET',
  });
}

export async function getCourseById(courseId: string): Promise<CourseDetail> {
  return apiFetchInternal<CourseDetail>(`/api/admin/courses/${courseId}`, {
    method: 'GET',
  });
}

export async function createCourse(data: CreateCourseDto): Promise<CourseDetail> {
  return apiFetchInternal<CourseDetail>('/api/admin/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCourse(courseId: string, data: CreateCourseDto): Promise<CourseDetail> {
  return apiFetchInternal<CourseDetail>(`/api/admin/courses/${courseId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteCourse(courseId: string): Promise<{ message: string }> {
  return apiFetchInternal<{ message: string }>(`/api/admin/courses/${courseId}`, {
    method: 'DELETE',
  });
}

/**
 * Get modules for an INSIDIA course (marketplace)
 */
export async function getCourseInsidiaModules(courseInsidiaId: string): Promise<CourseModule[]> {
  const params = new URLSearchParams();
  params.set('courseInsidiaId', courseInsidiaId);

  return apiFetchInternal<CourseModule[]>(`/api/admin/modules?${params.toString()}`, {
    method: 'GET',
  });
}

/**
 * Get modules for a MITRA ClassGroupCourse (academic workspace)
 */
export async function getClassGroupCourseModules(classGroupCourseId: string): Promise<CourseModule[]> {
  const params = new URLSearchParams();
  params.set('classGroupCourseId', classGroupCourseId);

  return apiFetchInternal<CourseModule[]>(`/api/admin/modules?${params.toString()}`, {
    method: 'GET',
  });
}

/**
 * Create a module for an INSIDIA course (marketplace)
 */
export async function createCourseInsidiaModule(courseInsidiaId: string, data: CourseModuleFormValues): Promise<CourseModule> {
  return apiFetchInternal<CourseModule>('/api/admin/modules', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      courseInsidiaId,
    }),
  });
}

/**
 * Create a module for a MITRA ClassGroupCourse (academic workspace)
 */
export async function createClassGroupCourseModule(classGroupCourseId: string, data: CourseModuleFormValues): Promise<CourseModule> {
  return apiFetchInternal<CourseModule>('/api/admin/modules', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      classGroupCourseId,
    }),
  });
}

/**
 * @deprecated Use getCourseInsidiaModules or getClassGroupCourseModules instead.
 * This function uses the old endpoint that assumes Course owns modules directly.
 */
export async function getCourseModules(courseId: string): Promise<CourseModule[]> {
  return apiFetchInternal<CourseModule[]>(`/api/admin/courses/${courseId}/modules`, {
    method: 'GET',
  });
}

/**
 * @deprecated Use createCourseInsidiaModule or createClassGroupCourseModule instead.
 * This function uses the old endpoint that assumes Course owns modules directly.
 */
export async function createCourseModule(courseId: string, data: CourseModuleFormValues): Promise<CourseModule> {
  return apiFetchInternal<CourseModule>(`/api/admin/courses/${courseId}/modules`, {
    method: 'POST',
    body: JSON.stringify(data),
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

export async function getCourseMedia(courseId: string): Promise<CourseMedia[]> {
  return apiFetchInternal<CourseMedia[]>(`/api/admin/courses/${courseId}/media`, {
    method: 'GET',
  });
}

export async function getModuleMedia(moduleId: string): Promise<CourseMedia[]> {
  return apiFetchInternal<CourseMedia[]>(`/api/admin/course-modules/${moduleId}/media`, {
    method: 'GET',
  });
}

export async function uploadCourseMedia(courseId: string, data: MediaUploadFormValues): Promise<CourseMedia> {
  const formData = new FormData();
  formData.set('file', data.file);
  formData.set('sortOrder', String(data.sortOrder));
  formData.set('isPrimary', String(data.isPrimary));

  if (data.type) {
    formData.set('type', data.type);
  }
  if (data.alt) {
    formData.set('alt', data.alt);
  }
  if (data.caption) {
    formData.set('caption', data.caption);
  }

  return apiFetchInternal<CourseMedia>(`/api/admin/courses/${courseId}/media`, {
    method: 'POST',
    body: formData,
  });
}

export async function uploadModuleMedia(moduleId: string, data: MediaUploadFormValues): Promise<CourseMedia> {
  const formData = new FormData();
  formData.set('file', data.file);
  formData.set('sortOrder', String(data.sortOrder));
  formData.set('isPrimary', String(data.isPrimary));

  if (data.type) {
    formData.set('type', data.type);
  }
  if (data.alt) {
    formData.set('alt', data.alt);
  }
  if (data.caption) {
    formData.set('caption', data.caption);
  }

  return apiFetchInternal<CourseMedia>(`/api/admin/course-modules/${moduleId}/media`, {
    method: 'POST',
    body: formData,
  });
}

export async function updateMedia(mediaId: string, data: MediaMetadataFormValues): Promise<CourseMedia> {
  return apiFetchInternal<CourseMedia>(`/api/admin/media/${mediaId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteMedia(mediaId: string): Promise<{ message: string }> {
  return apiFetchInternal<{ message: string }>(`/api/admin/media/${mediaId}`, {
    method: 'DELETE',
  });
}
