import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useAcademicYears } from '../../academic-year/hooks/useAcademicYear';
import { useGetSemesters } from '../../semester/hooks/useQuerySemester';
import { useRombels } from '../../rombel/hooks/useRombel';
import { useSubjects } from '../../subject/hooks/useSubject';
import { useAcademicUserOptions } from '../../shared/hooks/useAcademicUserOptions';
import { mitraAcademicKeys } from '../../shared/hooks/query-keys';
import { useCrudMutations } from '../../shared/hooks/useCrudMutations';
import { createRombelSubject, deleteRombelSubject, getRombelSubjects, updateRombelSubject } from '../api/rombel-subject.api';
import { rombelSubjectFormSchema, type RombelSubjectFormValues } from '../schema/rombel-subject.schema';
import type { ClassGroupCourse } from '../types/rombel-subject.types';

const RESOURCE_KEY = 'class-group-courses';

function getDefaultValues(options?: Partial<RombelSubjectFormValues>): RombelSubjectFormValues {
  return {
    classGroupId: options?.classGroupId ?? '',
    courseId: options?.courseId ?? '',
    teacherId: options?.teacherId ?? '',
    academicYearId: options?.academicYearId ?? '',
    semesterId: options?.semesterId ?? '',
    status: 'ACTIVE',
  };
}

function toFormValues(item: ClassGroupCourse | null, fallback: RombelSubjectFormValues): RombelSubjectFormValues {
  return {
    classGroupId: item?.classGroupId ?? fallback.classGroupId,
    courseId: item?.subject.id ?? fallback.courseId,
    teacherId: item?.teacherId ?? fallback.teacherId,
    academicYearId: item?.academicYearId ?? fallback.academicYearId,
    semesterId: item?.semesterId ?? fallback.semesterId,
    status: item?.status ?? 'ACTIVE',
  };
}

export function useRombelSubjects() {
  return useQuery({
    queryKey: mitraAcademicKeys.resource(RESOURCE_KEY),
    queryFn: () => getRombelSubjects(),
    refetchOnWindowFocus: false,
  });
}

export function useRombelSubjectMutations() {
  return useCrudMutations<RombelSubjectFormValues>({
    resourceKey: RESOURCE_KEY,
    createFn: createRombelSubject,
    updateFn: updateRombelSubject,
    deleteFn: deleteRombelSubject,
    successLabel: 'Kelas mata pelajaran',
  });
}

export function useRombelSubject() {
  const query = useRombelSubjects();
  const academicYearsQuery = useAcademicYears();
  const semestersQuery = useGetSemesters();
  const rombelsQuery = useRombels();
  const subjectsQuery = useSubjects();
  const userOptions = useAcademicUserOptions();
  const mutations = useRombelSubjectMutations();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClassGroupCourse | null>(null);
  const [deletingItem, setDeletingItem] = useState<ClassGroupCourse | null>(null);

  const academicYearOptions = useMemo(() => (academicYearsQuery.data ?? []).map((item) => ({ label: item.name, value: item.id })), [academicYearsQuery.data]);
  const semesterOptions = useMemo(() => (semestersQuery.data ?? []).map((item) => ({ label: `${item.name} - ${item.academicYear.name}`, value: item.id })), [semestersQuery.data]);
  const rombelOptions = useMemo(() => (rombelsQuery.data ?? []).map((item) => ({ label: `${item.name} - ${item.academicClass.name}`, value: item.id })), [rombelsQuery.data]);
  const subjectOptions = useMemo(() => (subjectsQuery.data ?? []).map((item) => ({ label: `${item.name}${item.code ? ` (${item.code})` : ''}`, value: item.id })), [subjectsQuery.data]);

  const fallbackValues = useMemo(
    () =>
      getDefaultValues({
        classGroupId: rombelOptions[0]?.value,
        courseId: subjectOptions[0]?.value,
        teacherId: userOptions.teacherOptions[0]?.value,
        academicYearId: academicYearOptions[0]?.value,
        semesterId: semesterOptions[0]?.value,
      }),
    [academicYearOptions, rombelOptions, semesterOptions, subjectOptions, userOptions.teacherOptions],
  );

  const form = useForm<RombelSubjectFormValues>({
    resolver: zodResolver(rombelSubjectFormSchema),
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
      rombelSubjects: query.data ?? [],
      academicYearOptions,
      semesterOptions,
      rombelOptions,
      subjectOptions,
      teacherOptions: userOptions.teacherOptions,
      isLoading: query.isLoading,
      isError: query.isError,
      isLoadingAcademicYears: academicYearsQuery.isLoading,
      isErrorAcademicYears: academicYearsQuery.isError,
      isLoadingSemesters: semestersQuery.isLoading,
      isErrorSemesters: semestersQuery.isError,
      isLoadingRombels: rombelsQuery.isLoading,
      isErrorRombels: rombelsQuery.isError,
      isLoadingSubjects: subjectsQuery.isLoading,
      isErrorSubjects: subjectsQuery.isError,
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
