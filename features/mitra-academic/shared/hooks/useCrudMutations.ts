import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getMutationErrorMessage } from '@/lib/error/error.message';

import { mitraAcademicKeys } from './query-keys';

type UseCrudMutationsOptions<TFormValues> = {
  resourceKey: string;
  createFn: (data: TFormValues) => Promise<unknown>;
  updateFn: (id: string, data: TFormValues) => Promise<unknown>;
  deleteFn: (id: string) => Promise<unknown>;
  successLabel: string;
};

export function useCrudMutations<TFormValues>({ resourceKey, createFn, updateFn, deleteFn, successLabel }: UseCrudMutationsOptions<TFormValues>) {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: mitraAcademicKeys.resource(resourceKey) });

  const createMutation = useMutation({
    mutationFn: (data: TFormValues) => createFn(data),
    onSuccess: () => {
      invalidate();
      toast.success(`${successLabel} berhasil dibuat`);
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, `Gagal membuat ${successLabel.toLowerCase()}`));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TFormValues }) => updateFn(id, data),
    onSuccess: () => {
      invalidate();
      toast.success(`${successLabel} berhasil diperbarui`);
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, `Gagal memperbarui ${successLabel.toLowerCase()}`));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFn(id),
    onSuccess: () => {
      invalidate();
      toast.success(`${successLabel} berhasil dihapus`);
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, `Gagal menghapus ${successLabel.toLowerCase()}`));
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
