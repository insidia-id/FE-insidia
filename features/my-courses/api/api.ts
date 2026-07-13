import { academicPath } from '@/features/mitra-academic/shared/api/path';
import { apiFetchInternal } from '@/lib/api/express.client';
import { MyAcademicQueryDto, MyCourseStudentResponse, MyCourseTeacherResponse } from '../types/my-courses.types';

export const getMyCourses = async (query?: MyAcademicQueryDto) => {
  const params = new URLSearchParams(Object.entries(query ?? {}).filter(([, value]) => value != null));

  const apiCall = await apiFetchInternal<MyCourseTeacherResponse[] | MyCourseStudentResponse[]>(`/api/mitras/my-courses${params.toString() ? `?${params.toString()}` : ''}`, {
    method: 'GET',
  });
  return apiCall;
};

export const getMyCourseDetail = async (id: string) => {
  const apiCall = await apiFetchInternal<MyCourseTeacherResponse | MyCourseStudentResponse>(`/api/mitras/my-courses/${id}`, {
    method: 'GET',
  });
  return apiCall;
};
