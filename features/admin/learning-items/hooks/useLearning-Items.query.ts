import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getLearningItemsByModuleId, reorderLearningItems } from '../api/api';
import { getMutationErrorMessage } from '@/lib/error/error.message';
import { toast } from 'sonner';

export const learningItemKeys = {
  all: ['learning-items'] as const,
  detail: (learningItemId: string) => [...learningItemKeys.all, 'detail', learningItemId] as const,
  moduleItems: (moduleId?: string) => [...learningItemKeys.all, 'module-items', moduleId] as const,
};

export function useGetLearningItemsByModuleId(moduleId: string | undefined | null) {
  return useQuery({
    queryKey: learningItemKeys.moduleItems(moduleId ?? ''),
    queryFn: () => getLearningItemsByModuleId(moduleId!),
    enabled: Boolean(moduleId),
    refetchOnWindowFocus: false,
  });
}

export function useReorderLearningItems(moduleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: { id: string; sortOrder: number }[]) => reorderLearningItems(moduleId, items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: learningItemKeys.moduleItems(moduleId) });
      toast.success('Urutan learning item berhasil diperbarui');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal memperbarui urutan learning item'));
    },
  });
}
