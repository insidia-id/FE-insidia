import { apiFetchInternal } from '@/lib/api/express.client';
import type { CourseDetail, CourseListItem, CourseMedia, CourseModule, CourseScope, CourseStatus } from '../types/course.types';
import type { CourseFormValues, CourseModuleFormValues, MediaMetadataFormValues, MediaUploadFormValues } from '../schema/course.schema';

export async function getCourses(scope: CourseScope, status?: CourseStatus, mitraId?: string): Promise<CourseListItem[]> {
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

export async function createCourse(data: CourseFormValues): Promise<CourseDetail> {
  return apiFetchInternal<CourseDetail>('/api/admin/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCourse(courseId: string, data: CourseFormValues): Promise<CourseDetail> {
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

export async function getCourseModules(courseId: string): Promise<CourseModule[]> {
  return apiFetchInternal<CourseModule[]>(`/api/admin/courses/${courseId}/modules`, {
    method: 'GET',
  });
}

export async function createCourseModule(courseId: string, data: CourseModuleFormValues): Promise<CourseModule> {
  return apiFetchInternal<CourseModule>(`/api/admin/courses/${courseId}/modules`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCourseModule(moduleId: string, data: CourseModuleFormValues): Promise<CourseModule> {
  return apiFetchInternal<CourseModule>(`/api/admin/course-modules/${moduleId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteCourseModule(moduleId: string): Promise<{ message: string }> {
  return apiFetchInternal<{ message: string }>(`/api/admin/course-modules/${moduleId}`, {
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
