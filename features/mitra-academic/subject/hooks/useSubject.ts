import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { mitraAcademicKeys } from '../../shared/hooks/query-keys';
import { useCrudMutations } from '../../shared/hooks/useCrudMutations';
import { useCurricula } from '../../curriculum/hooks/useCurriculum';
import { createSubject, deleteSubject, getSubjects, updateSubject } from '../api/subject.api';
import { subjectFormSchema, type SubjectFormValues } from '../schema/subject.schema';
import type { Subject } from '../types/subject.types';

const RESOURCE_KEY = 'subjects';

function getDefaultValues(curriculumId = ''): SubjectFormValues {
  return {
    curriculumId,
    name: '',
    code: '',
    description: '',
    status: 'ACTIVE',
  };
}

function toFormValues(item: Subject | null, fallbackCurriculumId = ''): SubjectFormValues {
  return {
    curriculumId: item?.curriculumId ?? fallbackCurriculumId,
    name: item?.name ?? '',
    code: item?.code ?? '',
    description: item?.description ?? '',
    status: item?.status ?? 'ACTIVE',
  };
}

export function useSubjects() {
  return useQuery({
    queryKey: mitraAcademicKeys.resource(RESOURCE_KEY),
    queryFn: () => getSubjects(),
    refetchOnWindowFocus: false,
  });
}

export function useSubjectMutations() {
  return useCrudMutations<SubjectFormValues>({
    resourceKey: RESOURCE_KEY,
    createFn: createSubject,
    updateFn: updateSubject,
    deleteFn: deleteSubject,
    successLabel: 'Mapel',
  });
}

export function useSubject(mitraId: string | null) {
  const query = useSubjects();
  const curriculaQuery = useCurricula(mitraId ?? '');
  const mutations = useSubjectMutations();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Subject | null>(null);
  const [deletingItem, setDeletingItem] = useState<Subject | null>(null);

  const curriculumOptions = useMemo(() => (curriculaQuery.data ?? []).map((item) => ({ label: `${item.name}${item.code ? ` (${item.code})` : ''}`, value: item.id })), [curriculaQuery.data]);
  const subjectOptions = useMemo(() => (query.data ?? []).map((item) => ({ label: `${item.name}${item.code ? ` (${item.code})` : ''}`, value: item.id })), [query.data]);
  const fallbackCurriculumId = curriculumOptions[0]?.value ?? '';

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (isFormOpen) {
      form.reset(toFormValues(editingItem, fallbackCurriculumId));
    }
  }, [editingItem, fallbackCurriculumId, form, isFormOpen]);

  const isSubmitting = mutations.createMutation.isPending || mutations.updateMutation.isPending;

  const handleCreate = () => {
    setEditingItem(null);
    form.reset(getDefaultValues(fallbackCurriculumId));
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    form.reset(getDefaultValues(fallbackCurriculumId));
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
      subjects: query.data ?? [],
      subjectOptions,
      curriculumOptions,
      isLoading: query.isLoading,
      isError: query.isError,
      isLoadingCurricula: curriculaQuery.isLoading,
      isErrorCurricula: curriculaQuery.isError,
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
