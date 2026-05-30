import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createMitra, deleteMitra, getMitraById, getMitras, updateMitra } from '../api/api.client';
import type { Mitra, MitraVisibilityFilter } from '../types/mitras.types';
import { getMutationErrorMessage } from '@/lib/error/error.message';
import type { CreateMitraInput, UpdateMitraPayload } from '../schema/mitra.schema';

export const mitraKeys = {
  all: ['mitras'] as const,

  lists: () => [...mitraKeys.all, 'list'] as const,

  list: (filter: MitraVisibilityFilter, query?: string) => [...mitraKeys.lists(), { filter, query }] as const,

  detail: (mitraId: string) => [...mitraKeys.all, mitraId] as const,
};
export const useGetMitras = (filter: MitraVisibilityFilter, query?: string) =>
  useQuery<Mitra[]>({
    queryKey: mitraKeys.list(filter, query),
    queryFn: () => getMitras(filter, query),
    refetchOnWindowFocus: false,
  });

export const useGetMitraById = (mitraId: string) =>
  useQuery<Mitra>({
    queryKey: mitraKeys.detail(mitraId),
    queryFn: () => getMitraById(mitraId),
    enabled: Boolean(mitraId),
    refetchOnWindowFocus: false,
  });

export function useCreateMitra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMitraInput) => createMitra(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mitraKeys.all });
      toast.success('Mitra berhasil dibuat');
    },
    onError: (error: unknown) => {
      toast.error(getMutationErrorMessage(error, 'Gagal membuat mitra'));
    },
  });
}

export function useUpdateMitra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mitraId, data }: { mitraId: string; data: UpdateMitraPayload }) => updateMitra(mitraId, data),
    onSuccess: (_, variables) => {
      toast.success('Mitra berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: mitraKeys.all });
      queryClient.invalidateQueries({ queryKey: mitraKeys.detail(variables.mitraId) });
    },
    onError: (error: unknown) => {
      toast.error(getMutationErrorMessage(error, 'Gagal memperbarui mitra'));
    },
  });
}

export function useDeleteMitra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mitraId: string) => deleteMitra(mitraId),
    onSuccess: (_, mitraId) => {
      queryClient.invalidateQueries({ queryKey: mitraKeys.all });
      queryClient.removeQueries({ queryKey: mitraKeys.detail(mitraId) });
      toast.success('Mitra berhasil dihapus');
    },
    onError: (error: unknown) => {
      toast.error(getMutationErrorMessage(error, 'Gagal menghapus mitra'));
    },
  });
}
