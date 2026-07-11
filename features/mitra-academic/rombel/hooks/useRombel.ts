import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useClassBatches } from '../../class-batch/hooks/useClassBatch';
import { NO_HOMEROOM_TEACHER_VALUE } from '../../shared/constants/academic.constants';
import { useAcademicUserOptions } from '../../shared/hooks/useAcademicUserOptions';
import { mitraAcademicKeys } from '../../shared/hooks/query-keys';
import { useCrudMutations } from '../../shared/hooks/useCrudMutations';
import { createRombel, deleteRombel, getRombels, updateRombel } from '../api/rombel.api';
import { rombelFormSchema, type RombelFormValues } from '../schema/rombel.schema';
import type { ClassGroup } from '../types/rombel.types';

const RESOURCE_KEY = 'class-groups';

function getDefaultValues(classId = ''): RombelFormValues {
  return {
    classId,
    name: '',
    waliKelasId: NO_HOMEROOM_TEACHER_VALUE,
    status: 'ACTIVE',
  };
}

function toFormValues(item: ClassGroup | null, fallbackClassId = ''): RombelFormValues {
  return {
    classId: item?.classId ?? fallbackClassId,
    name: item?.name ?? '',
    waliKelasId: item?.waliKelasId ?? NO_HOMEROOM_TEACHER_VALUE,
    status: item?.status ?? 'ACTIVE',
  };
}

export function useRombels(mitraId: string) {
  return useQuery({
    queryKey: mitraAcademicKeys.resource(RESOURCE_KEY),
    queryFn: () => getRombels(mitraId),
    refetchOnWindowFocus: false,
  });
}

export function useRombelMutations(mitraId: string) {
  return useCrudMutations<RombelFormValues>({
    resourceKey: RESOURCE_KEY,
    createFn: (data) => createRombel(mitraId, data),
    updateFn: (id, data) => updateRombel(mitraId, id, data),
    deleteFn: (id) => deleteRombel(mitraId, id),
    successLabel: 'Rombel',
  });
}

export function useRombel(mitraId: string) {
  const query = useRombels(mitraId);
  const classBatchesQuery = useClassBatches(mitraId);
  const userOptions = useAcademicUserOptions();
  const mutations = useRombelMutations(mitraId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClassGroup | null>(null);
  const [deletingItem, setDeletingItem] = useState<ClassGroup | null>(null);

  const classBatchOptions = useMemo(() => (classBatchesQuery.data ?? []).map((item) => ({ label: `${item.name} - ${item.level}`, value: item.id })), [classBatchesQuery.data]);
  const rombelOptions = useMemo(() => (query.data ?? []).map((item) => ({ label: `${item.name} - ${item.academicClass.name}`, value: item.id })), [query.data]);
  const teacherOptions = useMemo(() => [{ label: 'Tanpa wali kelas', value: NO_HOMEROOM_TEACHER_VALUE }, ...userOptions.teacherOptions], [userOptions.teacherOptions]);
  const fallbackClassId = classBatchOptions[0]?.value ?? '';

  const form = useForm<RombelFormValues>({
    resolver: zodResolver(rombelFormSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (isFormOpen) {
      form.reset(toFormValues(editingItem, fallbackClassId));
    }
  }, [editingItem, fallbackClassId, form, isFormOpen]);

  const isSubmitting = mutations.createMutation.isPending || mutations.updateMutation.isPending;

  const handleCreate = () => {
    setEditingItem(null);
    form.reset(getDefaultValues(fallbackClassId));
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    form.reset(getDefaultValues(fallbackClassId));
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (editingItem) {
      mutations.updateMutation.mutate({ id: editingItem.id, data }, { onSuccess: handleCloseForm });
      return;
    }

    mutations.createMutation.mutate(data, { onSuccess: handleCloseForm });
  });

  const handleDelete = () => {
    if (!deletingItem) return;
    mutations.deleteMutation.mutate(deletingItem.id, { onSuccess: () => setDeletingItem(null) });
  };

  return {
    form,
    queries: {
      rombels: query.data ?? [],
      rombelOptions,
      classBatchOptions,
      teacherOptions,
      isLoading: query.isLoading,
      isError: query.isError,
      isLoadingClassBatches: classBatchesQuery.isLoading,
      isErrorClassBatches: classBatchesQuery.isError,
      isLoadingTeachers: userOptions.isLoading,
      isErrorTeachers: userOptions.isError,
      isSubmitting,
      isDeleting: mutations.deleteMutation.isPending,
    },
    state: {
      isFormOpen,
      editingItem,
      deletingItem,
      setIsFormOpen,
      setEditingItem,
      setDeletingItem,
    },
    actions: {
      handleCreate,
      handleCloseForm,
      handleSubmit,
      handleDelete,
    },
  };
}
