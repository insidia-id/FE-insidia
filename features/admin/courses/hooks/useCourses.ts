import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMutationErrorMessage } from '@/lib/error/error.message';
import { createCourse, deleteCourse, deleteMedia, getCourseById, getCourseMedia, getCourses, updateCourse, updateMedia, uploadCourseMedia, uploadModuleMedia } from '../api/api.client';
import type { CourseScope, CourseStatus } from '../types/course.types';
import type { CreateCourseDto, MediaMetadataFormValues, MediaUploadFormValues } from '../schema/course.schema';
import { AccessScope } from '../../access-control/types/access-control.types';

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (scope: CourseScope, status?: CourseStatus, mitraId?: string | null) => [...courseKeys.lists(), { scope, status: status ?? null, mitraId: mitraId ?? null }] as const,
  detail: (courseId: string) => [...courseKeys.all, 'detail', courseId] as const,
  modules: (courseId: string) => [...courseKeys.all, 'modules', courseId] as const,
  insidiaModules: (courseInsidiaId: string) => [...courseKeys.all, 'modules', 'insidia', courseInsidiaId] as const,
  mitraModules: (classGroupCourseId: string) => [...courseKeys.all, 'modules', 'mitra', classGroupCourseId] as const,
  media: (courseId: string) => [...courseKeys.all, 'media', courseId] as const,
};

export function useGetCourses(scope: CourseScope, status?: CourseStatus, mitraId?: string | null) {
  return useQuery({
    queryKey: courseKeys.list(scope, status, mitraId),
    queryFn: () => getCourses(scope, status, mitraId),
    refetchOnWindowFocus: false,
  });
}

export function useGetCourseById(courseId: string, scope: AccessScope) {
  return useQuery({
    queryKey: courseKeys.detail(courseId),
    queryFn: () => getCourseById(courseId, scope),
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
    mutationFn: (data: CreateCourseDto) => createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.success('Mata Pelajaran berhasil dibuat');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal membuat Mata Pelajaran'));
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: CreateCourseDto }) => updateCourse(courseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(variables.courseId) });
      toast.success('Mata Pelajaran berhasil diperbarui');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal memperbarui Mata Pelajaran'));
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.success('Mata Pelajaran berhasil dihapus');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal menghapus Mata Pelajaran'));
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
      toast.success('Media Mata Pelajaran berhasil diunggah');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal mengunggah media Mata Pelajaran'));
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
