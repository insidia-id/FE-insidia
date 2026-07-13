import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCourseInsidiaModules, getClassGroupCourseModules, createClassGroupCourseModule, createCourseInsidiaModule, deleteCourseModule, updateCourseModule, getCourseModuleById } from '../api/api';
import { getMutationErrorMessage } from '@/lib/error/error.message';
import { CourseModuleFormValues } from '../schema/courses-module.schema';
import { toast } from 'sonner';

export const courseKeys = {
  all: ['courses'] as const,
  detail: (courseId: string) => [...courseKeys.all, 'detail', courseId] as const,
  insidiaModules: (courseInsidiaId: string) => [...courseKeys.all, 'modules', 'insidia', courseInsidiaId] as const,
  mitraModules: (classGroupCourseId: string | null) => [...courseKeys.all, 'modules', 'mitra', classGroupCourseId] as const,
  media: (courseId: string) => [...courseKeys.all, 'media', courseId] as const,
};

export function useGetCourseInsidiaModules(courseInsidiaId: string | undefined | null) {
  return useQuery({
    queryKey: courseKeys.insidiaModules(courseInsidiaId ?? ''),
    queryFn: () => getCourseInsidiaModules(courseInsidiaId!),
    enabled: Boolean(courseInsidiaId),
    refetchOnWindowFocus: false,
  });
}

export function useGetClassGroupCourseModules(classGroupCourseId: string | undefined | null) {
  return useQuery({
    queryKey: courseKeys.mitraModules(classGroupCourseId ?? ''),
    queryFn: () => getClassGroupCourseModules(classGroupCourseId!),
    enabled: Boolean(classGroupCourseId),
    refetchOnWindowFocus: false,
  });
}

export function useGetCourseModuleById(moduleId: string | undefined | null) {
  return useQuery({
    queryKey: ['courseModule', moduleId],
    queryFn: () => getCourseModuleById(moduleId!),
    enabled: Boolean(moduleId),
    refetchOnWindowFocus: false,
  });
}

export function useCreateCourseInsidiaModule(courseInsidiaId: string, courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CourseModuleFormValues) => createCourseInsidiaModule(courseInsidiaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.insidiaModules(courseInsidiaId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      toast.success('Modul berhasil ditambahkan');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal menambah modul'));
    },
  });
}

export function useCreateClassGroupCourseModule(classGroupCourseId: string | null, courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CourseModuleFormValues) => createClassGroupCourseModule(classGroupCourseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.mitraModules(classGroupCourseId) });
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
      queryClient.invalidateQueries({ queryKey: [...courseKeys.all, 'modules'] });
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
      queryClient.invalidateQueries({ queryKey: [...courseKeys.all, 'modules'] });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      toast.success('Modul berhasil dihapus');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal menghapus modul'));
    },
  });
}
