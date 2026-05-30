import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMutationErrorMessage } from '@/lib/error/error.message';
import {
  createCourse,
  createCourseModule,
  deleteCourse,
  deleteCourseModule,
  deleteMedia,
  getCourseById,
  getCourseMedia,
  getCourseModules,
  getCourses,
  updateCourse,
  updateCourseModule,
  updateMedia,
  uploadCourseMedia,
  uploadModuleMedia,
} from '../api/api.client';
import type { CourseScope, CourseStatus } from '../types/course.types';
import type { CourseFormValues, CourseModuleFormValues, MediaMetadataFormValues, MediaUploadFormValues } from '../schema/course.schema';

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (scope: CourseScope, status?: CourseStatus, mitraId?: string) => [...courseKeys.lists(), { scope, status: status ?? null, mitraId: mitraId ?? null }] as const,
  detail: (courseId: string) => [...courseKeys.all, 'detail', courseId] as const,
  modules: (courseId: string) => [...courseKeys.all, 'modules', courseId] as const,
  media: (courseId: string) => [...courseKeys.all, 'media', courseId] as const,
};

export function useGetCourses(scope: CourseScope, status?: CourseStatus, mitraId?: string) {
  return useQuery({
    queryKey: courseKeys.list(scope, status, mitraId),
    queryFn: () => getCourses(scope, status, mitraId),
    refetchOnWindowFocus: false,
  });
}

export function useGetCourseById(courseId: string) {
  return useQuery({
    queryKey: courseKeys.detail(courseId),
    queryFn: () => getCourseById(courseId),
    enabled: Boolean(courseId),
    refetchOnWindowFocus: false,
  });
}

export function useGetCourseModules(courseId: string) {
  return useQuery({
    queryKey: courseKeys.modules(courseId),
    queryFn: () => getCourseModules(courseId),
    enabled: Boolean(courseId),
    refetchOnWindowFocus: false,
  });
}

export function useGetCourseMedia(courseId: string) {
  return useQuery({
    queryKey: courseKeys.media(courseId),
    queryFn: () => getCourseMedia(courseId),
    enabled: Boolean(courseId),
    refetchOnWindowFocus: false,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CourseFormValues) => createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.success('Course berhasil dibuat');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal membuat course'));
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: CourseFormValues }) => updateCourse(courseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(variables.courseId) });
      toast.success('Course berhasil diperbarui');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal memperbarui course'));
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.success('Course berhasil dihapus');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal menghapus course'));
    },
  });
}

export function useCreateCourseModule(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CourseModuleFormValues) => createCourseModule(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.modules(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      toast.success('Modul berhasil ditambahkan');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal menambah modul'));
    },
  });
}

export function useUpdateCourseModule(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduleId, data }: { moduleId: string; data: CourseModuleFormValues }) => updateCourseModule(moduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.modules(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      toast.success('Modul berhasil diperbarui');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal memperbarui modul'));
    },
  });
}

export function useDeleteCourseModule(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (moduleId: string) => deleteCourseModule(moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.modules(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      toast.success('Modul berhasil dihapus');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal menghapus modul'));
    },
  });
}

export function useUploadCourseMedia(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MediaUploadFormValues) => uploadCourseMedia(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.media(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      toast.success('Media course berhasil diunggah');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal mengunggah media course'));
    },
  });
}

export function useUploadModuleMedia(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduleId, data }: { moduleId: string; data: MediaUploadFormValues }) => uploadModuleMedia(moduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.media(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.modules(courseId) });
      toast.success('Media modul berhasil diunggah');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal mengunggah media modul'));
    },
  });
}

export function useUpdateMedia(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mediaId, data }: { mediaId: string; data: MediaMetadataFormValues }) => updateMedia(mediaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.media(courseId) });
      toast.success('Media berhasil diperbarui');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal memperbarui media'));
    },
  });
}

export function useDeleteMedia(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mediaId: string) => deleteMedia(mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.media(courseId) });
      toast.success('Media berhasil dihapus');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal menghapus media'));
    },
  });
}
