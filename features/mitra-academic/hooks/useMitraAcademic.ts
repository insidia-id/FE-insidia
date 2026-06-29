// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { getMutationErrorMessage } from '@/lib/error/error.message';
// import {
//   createAcademicClass,
//   createAcademicYear,
//   createClassGroup,
//   createClassGroupCourse,
//   createClassGroupStudent,
//   createCurriculum,
//   createSemester,
//   createSubject,
//   deleteAcademicClass,
//   deleteAcademicYear,
//   deleteClassGroup,
//   deleteClassGroupCourse,
//   deleteClassGroupStudent,
//   deleteCurriculum,
//   deleteSemester,
//   deleteSubject,
//   getAcademicClasses,
//   getAcademicYears,
//   getClassGroupCourses,
//   getClassGroups,
//   getClassGroupStudents,
//   getCurricula,
//   getSemesters,
//   getSubjects,
//   updateAcademicClass,
//   updateAcademicYear,
//   updateClassGroup,
//   updateClassGroupCourse,
//   updateClassGroupStudent,
//   updateCurriculum,
//   updateSemester,
//   updateSubject,
// } from '../api/api.client';
// import type {
//   AcademicClassFormValues,
//   AcademicYearFormValues,
//   ClassGroupCourseFormValues,
//   ClassGroupFormValues,
//   ClassGroupStudentFormValues,
//   CurriculumFormValues,
//   SemesterFormValues,
//   SubjectFormValues,
// } from '../schema/mitra-academic.schema';

// export const mitraAcademicKeys = {
//   all: ['mitra-academic'] as const,
//   resource: (resource: string) => [...mitraAcademicKeys.all, resource] as const,
// };

// function useCrudMutations<TFormValues>({
//   resourceKey,
//   createFn,
//   updateFn,
//   deleteFn,
//   successLabel,
// }: {
//   resourceKey: string;
//   createFn: (data: TFormValues) => Promise<unknown>;
//   updateFn: (id: string, data: TFormValues) => Promise<unknown>;
//   deleteFn: (id: string) => Promise<unknown>;
//   successLabel: string;
// }) {
//   const queryClient = useQueryClient();

//   const invalidate = () => queryClient.invalidateQueries({ queryKey: mitraAcademicKeys.resource(resourceKey) });

//   const createMutation = useMutation({
//     mutationFn: (data: TFormValues) => createFn(data),
//     onSuccess: () => {
//       invalidate();
//       toast.success(`${successLabel} berhasil dibuat`);
//     },
//     onError: (error) => {
//       toast.error(getMutationErrorMessage(error, `Gagal membuat ${successLabel.toLowerCase()}`));
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, data }: { id: string; data: TFormValues }) => updateFn(id, data),
//     onSuccess: () => {
//       invalidate();
//       toast.success(`${successLabel} berhasil diperbarui`);
//     },
//     onError: (error) => {
//       toast.error(getMutationErrorMessage(error, `Gagal memperbarui ${successLabel.toLowerCase()}`));
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id: string) => deleteFn(id),
//     onSuccess: () => {
//       invalidate();
//       toast.success(`${successLabel} berhasil dihapus`);
//     },
//     onError: (error) => {
//       toast.error(getMutationErrorMessage(error, `Gagal menghapus ${successLabel.toLowerCase()}`));
//     },
//   });

//   return {
//     createMutation,
//     updateMutation,
//     deleteMutation,
//   };
// }

// export function useAcademicYears() {
//   return useQuery({
//     queryKey: mitraAcademicKeys.resource('academic-years'),
//     queryFn: () => getAcademicYears(),
//     refetchOnWindowFocus: false,
//   });
// }

// export function useSemesters() {
//   return useQuery({
//     queryKey: mitraAcademicKeys.resource('semesters'),
//     queryFn: () => getSemesters(),
//     refetchOnWindowFocus: false,
//   });
// }

// export function useCurricula() {
//   return useQuery({
//     queryKey: mitraAcademicKeys.resource('curricula'),
//     queryFn: () => getCurricula(),
//     refetchOnWindowFocus: false,
//   });
// }

// export function useSubjects() {
//   return useQuery({
//     queryKey: mitraAcademicKeys.resource('subjects'),
//     queryFn: () => getSubjects(),
//     refetchOnWindowFocus: false,
//   });
// }

// export function useAcademicClasses() {
//   return useQuery({
//     queryKey: mitraAcademicKeys.resource('academic-classes'),
//     queryFn: () => getAcademicClasses(),
//     refetchOnWindowFocus: false,
//   });
// }

// export function useClassGroups() {
//   return useQuery({
//     queryKey: mitraAcademicKeys.resource('class-groups'),
//     queryFn: () => getClassGroups(),
//     refetchOnWindowFocus: false,
//   });
// }

// export function useClassGroupCourses() {
//   return useQuery({
//     queryKey: mitraAcademicKeys.resource('class-group-courses'),
//     queryFn: () => getClassGroupCourses(),
//     refetchOnWindowFocus: false,
//   });
// }

// export function useClassGroupStudents() {
//   return useQuery({
//     queryKey: mitraAcademicKeys.resource('class-group-students'),
//     queryFn: () => getClassGroupStudents(),
//     refetchOnWindowFocus: false,
//   });
// }

// export function useAcademicYearMutations() {
//   return useCrudMutations<AcademicYearFormValues>({
//     resourceKey: 'academic-years',
//     createFn: createAcademicYear,
//     updateFn: updateAcademicYear,
//     deleteFn: deleteAcademicYear,
//     successLabel: 'Tahun Ajaran',
//   });
// }

// export function useSemesterMutations() {
//   return useCrudMutations<SemesterFormValues>({
//     resourceKey: 'semesters',
//     createFn: createSemester,
//     updateFn: updateSemester,
//     deleteFn: deleteSemester,
//     successLabel: 'Semester',
//   });
// }

// export function useCurriculumMutations() {
//   return useCrudMutations<CurriculumFormValues>({
//     resourceKey: 'curricula',
//     createFn: createCurriculum,
//     updateFn: updateCurriculum,
//     deleteFn: deleteCurriculum,
//     successLabel: 'Kurikulum',
//   });
// }

// export function useSubjectMutations() {
//   return useCrudMutations<SubjectFormValues>({
//     resourceKey: 'subjects',
//     createFn: createSubject,
//     updateFn: updateSubject,
//     deleteFn: deleteSubject,
//     successLabel: 'Mapel',
//   });
// }

// export function useAcademicClassMutations() {
//   return useCrudMutations<AcademicClassFormValues>({
//     resourceKey: 'academic-classes',
//     createFn: createAcademicClass,
//     updateFn: updateAcademicClass,
//     deleteFn: deleteAcademicClass,
//     successLabel: 'Kelas',
//   });
// }

// export function useClassGroupMutations() {
//   return useCrudMutations<ClassGroupFormValues>({
//     resourceKey: 'class-groups',
//     createFn: createClassGroup,
//     updateFn: updateClassGroup,
//     deleteFn: deleteClassGroup,
//     successLabel: 'Rombel',
//   });
// }

// export function useClassGroupCourseMutations() {
//   return useCrudMutations<ClassGroupCourseFormValues>({
//     resourceKey: 'class-group-courses',
//     createFn: createClassGroupCourse,
//     updateFn: updateClassGroupCourse,
//     deleteFn: deleteClassGroupCourse,
//     successLabel: 'Rombel mapel',
//   });
// }

// export function useClassGroupStudentMutations() {
//   return useCrudMutations<ClassGroupStudentFormValues>({
//     resourceKey: 'class-group-students',
//     createFn: createClassGroupStudent,
//     updateFn: updateClassGroupStudent,
//     deleteFn: deleteClassGroupStudent,
//     successLabel: 'Rombel murid',
//   });
// }
