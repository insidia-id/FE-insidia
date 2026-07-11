import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useAcademicYears } from '../../academic-year/hooks/useAcademicYear';
import { useGetSemesters } from '../../semester/hooks/useQuerySemester';
import { useRombels } from '../../rombel/hooks/useRombel';
import { useAcademicUserOptions } from '../../shared/hooks/useAcademicUserOptions';
import { mitraAcademicKeys } from '../../shared/hooks/query-keys';
import { useCrudMutations } from '../../shared/hooks/useCrudMutations';
import { createRombelStudent, deleteRombelStudent, getRombelStudents, updateRombelStudent } from '../api/rombel-student.api';
import { rombelStudentFormSchema, type RombelStudentFormValues } from '../schema/rombel-student.schema';
import type { ClassGroupStudent } from '../types/rombel-student.types';

const RESOURCE_KEY = 'class-group-students';

function getDefaultValues(options?: Partial<RombelStudentFormValues>): RombelStudentFormValues {
  return {
    classGroupId: options?.classGroupId ?? '',
    studentId: options?.studentId ?? '',
    academicYearId: options?.academicYearId ?? '',
    semesterId: options?.semesterId ?? '',
    status: 'ACTIVE',
  };
}

function toFormValues(item: ClassGroupStudent | null, fallback: RombelStudentFormValues): RombelStudentFormValues {
  return {
    classGroupId: item?.classGroupId ?? fallback.classGroupId,
    studentId: item?.studentId ?? fallback.studentId,
    academicYearId: item?.academicYearId ?? fallback.academicYearId,
    semesterId: item?.semesterId ?? fallback.semesterId,
    status: item?.status ?? 'ACTIVE',
  };
}

export function useRombelStudents(mitraId: string) {
  return useQuery({
    queryKey: mitraAcademicKeys.resource(RESOURCE_KEY),
    queryFn: () => getRombelStudents(mitraId),
    refetchOnWindowFocus: false,
  });
}

export function useRombelStudentMutations(mitraId: string) {
  return useCrudMutations<RombelStudentFormValues>({
    resourceKey: RESOURCE_KEY,
    createFn: (data) => createRombelStudent(mitraId, data),
    updateFn: (id, data) => updateRombelStudent(mitraId, id, data),
    deleteFn: (id) => deleteRombelStudent(mitraId, id),
    successLabel: 'Kelas siswa',
  });
}

export function useRombelStudent(mitraId: string) {
  const query = useRombelStudents(mitraId);
  const academicYearsQuery = useAcademicYears(mitraId);
  const semestersQuery = useGetSemesters(mitraId);
  const rombelsQuery = useRombels(mitraId);
  const userOptions = useAcademicUserOptions();
  const mutations = useRombelStudentMutations(mitraId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClassGroupStudent | null>(null);
  const [deletingItem, setDeletingItem] = useState<ClassGroupStudent | null>(null);

  const academicYearOptions = useMemo(() => (academicYearsQuery.data ?? []).map((item) => ({ label: item.name, value: item.id })), [academicYearsQuery.data]);
  const semesterOptions = useMemo(() => (semestersQuery.data ?? []).map((item) => ({ label: `${item.name} - ${item.academicYear.name}`, value: item.id })), [semestersQuery.data]);
  const rombelOptions = useMemo(() => (rombelsQuery.data ?? []).map((item) => ({ label: `${item.name} - ${item.academicClass.name}`, value: item.id })), [rombelsQuery.data]);

  const fallbackValues = useMemo(
    () =>
      getDefaultValues({
        classGroupId: rombelOptions[0]?.value,
        studentId: userOptions.studentOptions[0]?.value,
        academicYearId: academicYearOptions[0]?.value,
        semesterId: semesterOptions[0]?.value,
      }),
    [academicYearOptions, rombelOptions, semesterOptions, userOptions.studentOptions],
  );

  const form = useForm<RombelStudentFormValues>({
    resolver: zodResolver(rombelStudentFormSchema),
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
      rombelStudents: query.data ?? [],
      academicYearOptions,
      semesterOptions,
      rombelOptions,
      studentOptions: userOptions.studentOptions,
      isLoading: query.isLoading,
      isError: query.isError,
      isLoadingAcademicYears: academicYearsQuery.isLoading,
      isErrorAcademicYears: academicYearsQuery.isError,
      isLoadingSemesters: semestersQuery.isLoading,
      isErrorSemesters: semestersQuery.isError,
      isLoadingRombels: rombelsQuery.isLoading,
      isErrorRombels: rombelsQuery.isError,
      isLoadingStudents: userOptions.isLoading,
      isErrorStudents: userOptions.isError,
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
