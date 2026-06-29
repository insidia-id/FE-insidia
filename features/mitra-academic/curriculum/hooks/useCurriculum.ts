import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { mitraAcademicKeys } from '../../shared/hooks/query-keys';
import { useCrudMutations } from '../../shared/hooks/useCrudMutations';
import { createCurriculum, deleteCurriculum, getCurricula, updateCurriculum } from '../api/curriculum.api';
import { curriculumFormSchema, type CurriculumFormValues } from '../schema/curriculum.schema';
import type { Curriculum } from '../types/curriculum.types';

const RESOURCE_KEY = 'curricula';

const defaultValues: CurriculumFormValues = {
  name: '',
  code: '',
  description: '',
  status: 'ACTIVE',
};

function toFormValues(item: Curriculum | null): CurriculumFormValues {
  return {
    name: item?.name ?? '',
    code: item?.code ?? '',
    description: item?.description ?? '',
    status: item?.status ?? 'ACTIVE',
  };
}

export function useCurricula() {
  return useQuery({
    queryKey: mitraAcademicKeys.resource(RESOURCE_KEY),
    queryFn: () => getCurricula(),
    refetchOnWindowFocus: false,
  });
}

export function useCurriculumMutations() {
  return useCrudMutations<CurriculumFormValues>({
    resourceKey: RESOURCE_KEY,
    createFn: createCurriculum,
    updateFn: updateCurriculum,
    deleteFn: deleteCurriculum,
    successLabel: 'Kurikulum',
  });
}

export function useCurriculum() {
  const query = useCurricula();
  const mutations = useCurriculumMutations();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Curriculum | null>(null);
  const [deletingItem, setDeletingItem] = useState<Curriculum | null>(null);

  const form = useForm<CurriculumFormValues>({
    resolver: zodResolver(curriculumFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isFormOpen) {
      form.reset(toFormValues(editingItem));
    }
  }, [editingItem, form, isFormOpen]);

  const isSubmitting = mutations.createMutation.isPending || mutations.updateMutation.isPending;

  const options = useMemo(() => (query.data ?? []).map((item) => ({ label: `${item.name}${item.code ? ` (${item.code})` : ''}`, value: item.id })), [query.data]);

  const handleCreate = () => {
    setEditingItem(null);
    form.reset(defaultValues);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    form.reset(defaultValues);
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
      curricula: query.data ?? [],
      options,
      isLoading: query.isLoading,
      isError: query.isError,
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
