import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useAcademicYears } from '../../academic-year/hooks/useAcademicYear';
import { useCurricula } from '../../curriculum/hooks/useCurriculum';
import { useGetSemesters } from '../../semester/hooks/useQuerySemester';
import { mitraAcademicKeys } from '../../shared/hooks/query-keys';
import { useCrudMutations } from '../../shared/hooks/useCrudMutations';
import { createClassBatch, deleteClassBatch, getClassBatches, updateClassBatch } from '../api/class-batch.api';
import { classBatchFormSchema, type ClassBatchFormValues } from '../schema/class-batch.schema';
import type { AcademicClass } from '../types/class-batch.types';

const RESOURCE_KEY = 'academic-classes';

function getDefaultValues(options?: { academicYearId?: string; semesterId?: string; curriculumId?: string }): ClassBatchFormValues {
  return {
    academicYearId: options?.academicYearId ?? '',
    semesterId: options?.semesterId ?? '',
    curriculumId: options?.curriculumId ?? '',
    name: '',
    level: '',
    status: 'ACTIVE',
  };
}

function toFormValues(item: AcademicClass | null, fallback: ClassBatchFormValues): ClassBatchFormValues {
  return {
    academicYearId: item?.academicYearId ?? fallback.academicYearId,
    semesterId: item?.semesterId ?? fallback.semesterId,
    curriculumId: item?.curriculumId ?? fallback.curriculumId,
    name: item?.name ?? '',
    level: item?.level ?? '',
    status: item?.status ?? 'ACTIVE',
  };
}

export function useClassBatches() {
  return useQuery({
    queryKey: mitraAcademicKeys.resource(RESOURCE_KEY),
    queryFn: () => getClassBatches(),
    refetchOnWindowFocus: false,
  });
}

export function useClassBatchMutations() {
  return useCrudMutations<ClassBatchFormValues>({
    resourceKey: RESOURCE_KEY,
    createFn: createClassBatch,
    updateFn: updateClassBatch,
    deleteFn: deleteClassBatch,
    successLabel: 'Kelas',
  });
}

export function useClassBatch() {
  const query = useClassBatches();
  const academicYearsQuery = useAcademicYears();
  const semestersQuery = useGetSemesters();
  const curriculaQuery = useCurricula();
  const mutations = useClassBatchMutations();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AcademicClass | null>(null);
  const [deletingItem, setDeletingItem] = useState<AcademicClass | null>(null);

  const academicYearOptions = useMemo(() => (academicYearsQuery.data ?? []).map((item) => ({ label: item.name, value: item.id })), [academicYearsQuery.data]);
  const semesterOptions = useMemo(() => (semestersQuery.data ?? []).map((item) => ({ label: `${item.name} - ${item.academicYear.name}`, value: item.id })), [semestersQuery.data]);
  const curriculumOptions = useMemo(() => (curriculaQuery.data ?? []).map((item) => ({ label: `${item.name}${item.code ? ` (${item.code})` : ''}`, value: item.id })), [curriculaQuery.data]);
  const classBatchOptions = useMemo(() => (query.data ?? []).map((item) => ({ label: `${item.name} - ${item.level}`, value: item.id })), [query.data]);

  const fallbackValues = useMemo(
    () =>
      getDefaultValues({
        academicYearId: academicYearOptions[0]?.value,
        semesterId: semesterOptions[0]?.value,
        curriculumId: curriculumOptions[0]?.value,
      }),
    [academicYearOptions, curriculumOptions, semesterOptions],
  );

  const form = useForm<ClassBatchFormValues>({
    resolver: zodResolver(classBatchFormSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (isFormOpen) {
      form.reset(toFormValues(editingItem, fallbackValues));
    }
  }, [editingItem, fallbackValues, form, isFormOpen]);

  const isSubmitting = mutations.createMutation.isPending || mutations.updateMutation.isPending;

  const handleCreate = () => {
    setEditingItem(null);
    form.reset(fallbackValues);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    form.reset(fallbackValues);
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
      classBatches: query.data ?? [],
      classBatchOptions,
      academicYearOptions,
      semesterOptions,
      curriculumOptions,
      isLoading: query.isLoading,
      isError: query.isError,
      isLoadingAcademicYears: academicYearsQuery.isLoading,
      isErrorAcademicYears: academicYearsQuery.isError,
      isLoadingSemesters: semestersQuery.isLoading,
      isErrorSemesters: semestersQuery.isError,
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
