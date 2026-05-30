import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMutationErrorMessage } from '@/lib/error/error.message';
import {
  createAcademicClass,
  createAcademicYear,
  createClassGroup,
  createClassGroupCourse,
  createClassGroupStudent,
  createCurriculum,
  createSemester,
  createSubject,
  deleteAcademicClass,
  deleteAcademicYear,
  deleteClassGroup,
  deleteClassGroupCourse,
  deleteClassGroupStudent,
  deleteCurriculum,
  deleteSemester,
  deleteSubject,
  getAcademicClasses,
  getAcademicYears,
  getClassGroupCourses,
  getClassGroups,
  getClassGroupStudents,
  getCurricula,
  getSemesters,
  getSubjects,
  updateAcademicClass,
  updateAcademicYear,
  updateClassGroup,
  updateClassGroupCourse,
  updateClassGroupStudent,
  updateCurriculum,
  updateSemester,
  updateSubject,
} from '../api/api.client';
import type {
  AcademicClassFormValues,
  AcademicYearFormValues,
  ClassGroupCourseFormValues,
  ClassGroupFormValues,
  ClassGroupStudentFormValues,
  CurriculumFormValues,
  SemesterFormValues,
  SubjectFormValues,
} from '../schema/mitra-academic.schema';

export const mitraAcademicKeys = {
  all: ['mitra-academic'] as const,
  resource: (mitraId: string, resource: string) => [...mitraAcademicKeys.all, mitraId, resource] as const,
};

function useCrudMutations<TFormValues>({
  mitraId,
  resourceKey,
  createFn,
  updateFn,
  deleteFn,
  successLabel,
}: {
  mitraId: string;
  resourceKey: string;
  createFn: (mitraId: string, data: TFormValues) => Promise<unknown>;
  updateFn: (mitraId: string, id: string, data: TFormValues) => Promise<unknown>;
  deleteFn: (mitraId: string, id: string) => Promise<unknown>;
  successLabel: string;
}) {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: mitraAcademicKeys.resource(mitraId, resourceKey) });

  const createMutation = useMutation({
    mutationFn: (data: TFormValues) => createFn(mitraId, data),
    onSuccess: () => {
      invalidate();
      toast.success(`${successLabel} berhasil dibuat`);
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, `Gagal membuat ${successLabel.toLowerCase()}`));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TFormValues }) => updateFn(mitraId, id, data),
    onSuccess: () => {
      invalidate();
      toast.success(`${successLabel} berhasil diperbarui`);
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, `Gagal memperbarui ${successLabel.toLowerCase()}`));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFn(mitraId, id),
    onSuccess: () => {
      invalidate();
      toast.success(`${successLabel} berhasil dihapus`);
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, `Gagal menghapus ${successLabel.toLowerCase()}`));
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}

export function useAcademicYears(mitraId: string) {
  return useQuery({
    queryKey: mitraAcademicKeys.resource(mitraId, 'academic-years'),
    queryFn: () => getAcademicYears(mitraId),
    refetchOnWindowFocus: false,
  });
}

export function useSemesters(mitraId: string) {
  return useQuery({
    queryKey: mitraAcademicKeys.resource(mitraId, 'semesters'),
    queryFn: () => getSemesters(mitraId),
    refetchOnWindowFocus: false,
  });
}

export function useCurricula(mitraId?: string) {
  return useQuery({
    queryKey: mitraAcademicKeys.resource(mitraId ?? 'unknown', 'curricula'),
    queryFn: () => getCurricula(mitraId!),
    enabled: Boolean(mitraId),
    refetchOnWindowFocus: false,
  });
}

export function useSubjects(mitraId: string) {
  return useQuery({
    queryKey: mitraAcademicKeys.resource(mitraId, 'subjects'),
    queryFn: () => getSubjects(mitraId),
    refetchOnWindowFocus: false,
  });
}

export function useAcademicClasses(mitraId: string) {
  return useQuery({
    queryKey: mitraAcademicKeys.resource(mitraId, 'academic-classes'),
    queryFn: () => getAcademicClasses(mitraId),
    refetchOnWindowFocus: false,
  });
}

export function useClassGroups(mitraId: string) {
  return useQuery({
    queryKey: mitraAcademicKeys.resource(mitraId, 'class-groups'),
    queryFn: () => getClassGroups(mitraId),
    refetchOnWindowFocus: false,
  });
}

export function useClassGroupCourses(mitraId: string) {
  return useQuery({
    queryKey: mitraAcademicKeys.resource(mitraId, 'class-group-courses'),
    queryFn: () => getClassGroupCourses(mitraId),
    refetchOnWindowFocus: false,
  });
}

export function useClassGroupStudents(mitraId: string) {
  return useQuery({
    queryKey: mitraAcademicKeys.resource(mitraId, 'class-group-students'),
    queryFn: () => getClassGroupStudents(mitraId),
    refetchOnWindowFocus: false,
  });
}

export function useAcademicYearMutations(mitraId: string) {
  return useCrudMutations<AcademicYearFormValues>({
    mitraId,
    resourceKey: 'academic-years',
    createFn: createAcademicYear,
    updateFn: updateAcademicYear,
    deleteFn: deleteAcademicYear,
    successLabel: 'Tahun ajaran',
  });
}

export function useSemesterMutations(mitraId: string) {
  return useCrudMutations<SemesterFormValues>({
    mitraId,
    resourceKey: 'semesters',
    createFn: createSemester,
    updateFn: updateSemester,
    deleteFn: deleteSemester,
    successLabel: 'Semester',
  });
}

export function useCurriculumMutations(mitraId: string) {
  return useCrudMutations<CurriculumFormValues>({
    mitraId,
    resourceKey: 'curricula',
    createFn: createCurriculum,
    updateFn: updateCurriculum,
    deleteFn: deleteCurriculum,
    successLabel: 'Kurikulum',
  });
}

export function useSubjectMutations(mitraId: string) {
  return useCrudMutations<SubjectFormValues>({
    mitraId,
    resourceKey: 'subjects',
    createFn: createSubject,
    updateFn: updateSubject,
    deleteFn: deleteSubject,
    successLabel: 'Mapel',
  });
}

export function useAcademicClassMutations(mitraId: string) {
  return useCrudMutations<AcademicClassFormValues>({
    mitraId,
    resourceKey: 'academic-classes',
    createFn: createAcademicClass,
    updateFn: updateAcademicClass,
    deleteFn: deleteAcademicClass,
    successLabel: 'Kelas',
  });
}

export function useClassGroupMutations(mitraId: string) {
  return useCrudMutations<ClassGroupFormValues>({
    mitraId,
    resourceKey: 'class-groups',
    createFn: createClassGroup,
    updateFn: updateClassGroup,
    deleteFn: deleteClassGroup,
    successLabel: 'Rombel',
  });
}

export function useClassGroupCourseMutations(mitraId: string) {
  return useCrudMutations<ClassGroupCourseFormValues>({
    mitraId,
    resourceKey: 'class-group-courses',
    createFn: createClassGroupCourse,
    updateFn: updateClassGroupCourse,
    deleteFn: deleteClassGroupCourse,
    successLabel: 'Rombel mapel',
  });
}

export function useClassGroupStudentMutations(mitraId: string) {
  return useCrudMutations<ClassGroupStudentFormValues>({
    mitraId,
    resourceKey: 'class-group-students',
    createFn: createClassGroupStudent,
    updateFn: updateClassGroupStudent,
    deleteFn: deleteClassGroupStudent,
    successLabel: 'Rombel murid',
  });
}
