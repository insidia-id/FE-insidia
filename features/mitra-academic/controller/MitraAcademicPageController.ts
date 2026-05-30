import { useMemo } from 'react';
import { useGetUsers } from '@/features/admin/user/hooks/useUser';
import { getUserRole } from '@/features/admin/user/HelperUser';
import {
  useAcademicClasses,
  useAcademicClassMutations,
  useAcademicYears,
  useAcademicYearMutations,
  useClassGroupCourses,
  useClassGroupCourseMutations,
  useClassGroups,
  useClassGroupStudents,
  useClassGroupStudentMutations,
  useClassGroupMutations,
  useCurricula,
  useCurriculumMutations,
  useSemesters,
  useSemesterMutations,
  useSubjects,
  useSubjectMutations,
} from '../hooks/useMitraAcademic';
import type { SelectOption } from '../types/mitra-academic.types';

export function MitraAcademicPageController(mitraId: string) {
  const academicYearsQuery = useAcademicYears(mitraId);
  const semestersQuery = useSemesters(mitraId);
  const curriculaQuery = useCurricula(mitraId);
  const subjectsQuery = useSubjects(mitraId);
  const academicClassesQuery = useAcademicClasses(mitraId);
  const classGroupsQuery = useClassGroups(mitraId);
  const classGroupCoursesQuery = useClassGroupCourses(mitraId);
  const classGroupStudentsQuery = useClassGroupStudents(mitraId);
  const usersQuery = useGetUsers('available', 'MITRA', mitraId);

  const teacherOptions = useMemo<SelectOption[]>(
    () =>
      (usersQuery.data ?? [])
        .filter((user) => getUserRole(user, 'MITRA') === 'GURU')
        .map((user) => ({
          label: user.name ?? user.email,
          value: user.id,
        })),
    [usersQuery.data],
  );

  const studentOptions = useMemo<SelectOption[]>(
    () =>
      (usersQuery.data ?? [])
        .filter((user) => getUserRole(user, 'MITRA') === 'MURID')
        .map((user) => ({
          label: user.name ?? user.email,
          value: user.id,
        })),
    [usersQuery.data],
  );

  const academicYearOptions = useMemo<SelectOption[]>(() => (academicYearsQuery.data ?? []).map((item) => ({ label: item.name, value: item.id })), [academicYearsQuery.data]);

  const semesterOptions = useMemo<SelectOption[]>(() => (semestersQuery.data ?? []).map((item) => ({ label: `${item.name} • ${item.academicYear.name}`, value: item.id })), [semestersQuery.data]);

  const curriculumOptions = useMemo<SelectOption[]>(() => (curriculaQuery.data ?? []).map((item) => ({ label: `${item.name}${item.code ? ` (${item.code})` : ''}`, value: item.id })), [curriculaQuery.data]);

  const subjectOptions = useMemo<SelectOption[]>(() => (subjectsQuery.data ?? []).map((item) => ({ label: `${item.name}${item.code ? ` (${item.code})` : ''}`, value: item.id })), [subjectsQuery.data]);

  const academicClassOptions = useMemo<SelectOption[]>(() => (academicClassesQuery.data ?? []).map((item) => ({ label: `${item.name} • ${item.level}`, value: item.id })), [academicClassesQuery.data]);

  const classGroupOptions = useMemo<SelectOption[]>(() => (classGroupsQuery.data ?? []).map((item) => ({ label: `${item.name} • ${item.academicClass.name}`, value: item.id })), [classGroupsQuery.data]);

  const isLoading = [academicYearsQuery, semestersQuery, curriculaQuery, subjectsQuery, academicClassesQuery, classGroupsQuery, classGroupCoursesQuery, classGroupStudentsQuery, usersQuery].some((query) => query.isLoading);

  const error =
    academicYearsQuery.error ??
    semestersQuery.error ??
    curriculaQuery.error ??
    subjectsQuery.error ??
    academicClassesQuery.error ??
    classGroupsQuery.error ??
    classGroupCoursesQuery.error ??
    classGroupStudentsQuery.error ??
    usersQuery.error ??
    null;

  return {
    academicYears: academicYearsQuery.data ?? [],
    semesters: semestersQuery.data ?? [],
    curricula: curriculaQuery.data ?? [],
    subjects: subjectsQuery.data ?? [],
    academicClasses: academicClassesQuery.data ?? [],
    classGroups: classGroupsQuery.data ?? [],
    classGroupCourses: classGroupCoursesQuery.data ?? [],
    classGroupStudents: classGroupStudentsQuery.data ?? [],
    teacherOptions,
    studentOptions,
    academicYearOptions,
    semesterOptions,
    curriculumOptions,
    subjectOptions,
    academicClassOptions,
    classGroupOptions,
    academicYearMutations: useAcademicYearMutations(mitraId),
    semesterMutations: useSemesterMutations(mitraId),
    curriculumMutations: useCurriculumMutations(mitraId),
    subjectMutations: useSubjectMutations(mitraId),
    academicClassMutations: useAcademicClassMutations(mitraId),
    classGroupMutations: useClassGroupMutations(mitraId),
    classGroupCourseMutations: useClassGroupCourseMutations(mitraId),
    classGroupStudentMutations: useClassGroupStudentMutations(mitraId),
    isLoading,
    error,
  };
}
