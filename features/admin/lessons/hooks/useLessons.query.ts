import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMutationErrorMessage } from '@/lib/error/error.message';
import { LessonsSchema, UpdatableLessonValues } from '../schema/lessons.schema';
import { toast } from 'sonner';
import { createLesson, deleteLesson, getLessonById, updateLesson } from '../api/api';
import { learningItemKeys } from '../../learning-items/hooks/useLearning-Items.query';
export const lessonKeys = {
  all: ['lessons'] as const,
  detail: (learningItemId: string) => [...lessonKeys.all, 'detail', learningItemId] as const,
  learningItemLessons: (learningItemId: string) => [...lessonKeys.all, 'learning-item-lessons', learningItemId] as const,
};

export function useGetLessonByLearningItemId(learningItemId: string | undefined | null) {
  return useQuery({
    queryKey: lessonKeys.detail(learningItemId ?? ''),
    queryFn: () => getLessonById(learningItemId ?? ''),
    enabled: Boolean(learningItemId),
    refetchOnWindowFocus: false,
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduleId, data }: { moduleId: string; data: LessonsSchema }) => createLesson(moduleId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: lessonKeys.learningItemLessons(variables.moduleId),
      });

      toast.success('Materi berhasil ditambahkan');
    },

    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal menambah materi'));
    },
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ learningItemId, data, moduleId }: { learningItemId: string; data: UpdatableLessonValues; moduleId?: string }) => updateLesson(learningItemId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: lessonKeys.detail(variables.learningItemId),
      });
      queryClient.invalidateQueries({ queryKey: learningItemKeys.moduleItems(variables?.moduleId) });

      toast.success('Materi berhasil diperbarui');
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ learningItemId, lessonId, moduleId }: { learningItemId: string; lessonId: string; moduleId?: string }) => deleteLesson(learningItemId, lessonId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.learningItemLessons(variables.learningItemId) });
      queryClient.invalidateQueries({ queryKey: learningItemKeys.moduleItems(variables.moduleId) });
      toast.success('Materi berhasil dihapus');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal menghapus materi'));
    },
  });
}
