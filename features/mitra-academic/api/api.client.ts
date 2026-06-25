import { apiFetchInternal } from '@/lib/api/express.client';
import type { AcademicClass, AcademicYear, ClassGroup, ClassGroupCourse, ClassGroupStudent, Curriculum, Semester, Subject } from '../types/mitra-academic.types';
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

function academicPath(path: string) {
  return `/api/mitras/active/academic/${path}`;
}

function withQuery(path: string, query?: Record<string, string | undefined>) {
  const params = new URLSearchParams();

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  return params.size ? `${path}?${params.toString()}` : path;
}

export function getAcademicYears() {
  return apiFetchInternal<AcademicYear[]>(academicPath('tahun-ajaran'), { method: 'GET' });
}

export function createAcademicYear(data: AcademicYearFormValues) {
  return apiFetchInternal<AcademicYear>(academicPath('tahun-ajaran'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateAcademicYear(id: string, data: AcademicYearFormValues) {
  return apiFetchInternal<AcademicYear>(academicPath(`tahun-ajaran/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteAcademicYear(id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(`tahun-ajaran/${id}`), { method: 'DELETE' });
}

export function getSemesters() {
  return apiFetchInternal<Semester[]>(academicPath('semester'), { method: 'GET' });
}

export function createSemester(data: SemesterFormValues) {
  return apiFetchInternal<Semester>(academicPath('semester'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateSemester(id: string, data: SemesterFormValues) {
  return apiFetchInternal<Semester>(academicPath(`semester/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteSemester(id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(`semester/${id}`), { method: 'DELETE' });
}

export function getCurricula() {
  return apiFetchInternal<Curriculum[]>(academicPath('kurikulum'), { method: 'GET' });
}

export function createCurriculum(data: CurriculumFormValues) {
  return apiFetchInternal<Curriculum>(academicPath('kurikulum'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateCurriculum(id: string, data: CurriculumFormValues) {
  return apiFetchInternal<Curriculum>(academicPath(`kurikulum/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteCurriculum(id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(`kurikulum/${id}`), { method: 'DELETE' });
}

export function getSubjects() {
  return apiFetchInternal<Subject[]>(academicPath('mapel'), { method: 'GET' });
}

export function createSubject(data: SubjectFormValues) {
  return apiFetchInternal<Subject>(academicPath('mapel'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateSubject(id: string, data: SubjectFormValues) {
  return apiFetchInternal<Subject>(academicPath(`mapel/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteSubject(id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(`mapel/${id}`), { method: 'DELETE' });
}

export function getAcademicClasses() {
  return apiFetchInternal<AcademicClass[]>(academicPath('kelas'), { method: 'GET' });
}

export function createAcademicClass(data: AcademicClassFormValues) {
  return apiFetchInternal<AcademicClass>(academicPath('kelas'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateAcademicClass(id: string, data: AcademicClassFormValues) {
  return apiFetchInternal<AcademicClass>(academicPath(`kelas/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteAcademicClass(id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(`kelas/${id}`), { method: 'DELETE' });
}

export function getClassGroups() {
  return apiFetchInternal<ClassGroup[]>(academicPath('rombel'), { method: 'GET' });
}

export function createClassGroup(data: ClassGroupFormValues) {
  const payload = {
    ...data,
    waliKelasId: data.waliKelasId?.trim() && data.waliKelasId !== 'NONE' ? data.waliKelasId : null,
  };

  return apiFetchInternal<ClassGroup>(academicPath('rombel'), {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateClassGroup(id: string, data: ClassGroupFormValues) {
  const payload = {
    ...data,
    waliKelasId: data.waliKelasId?.trim() && data.waliKelasId !== 'NONE' ? data.waliKelasId : null,
  };

  return apiFetchInternal<ClassGroup>(academicPath(`rombel/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteClassGroup(id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(`rombel/${id}`), { method: 'DELETE' });
}

export function getClassGroupCourses() {
  return apiFetchInternal<ClassGroupCourse[]>(academicPath('rombel-mapel'), { method: 'GET' });
}

export function getClassGroupStudents() {
  return apiFetchInternal<ClassGroupStudent[]>(academicPath('rombel-murid'), { method: 'GET' });
}

export function createClassGroupCourse(data: ClassGroupCourseFormValues) {
  return apiFetchInternal<ClassGroupCourse>(academicPath('rombel-mapel'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateClassGroupCourse(id: string, data: ClassGroupCourseFormValues) {
  return apiFetchInternal<ClassGroupCourse>(academicPath(`rombel-mapel/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteClassGroupCourse(id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(`rombel-mapel/${id}`), { method: 'DELETE' });
}

export function createClassGroupStudent(data: ClassGroupStudentFormValues) {
  return apiFetchInternal<ClassGroupStudent>(academicPath('rombel-murid'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateClassGroupStudent(id: string, data: ClassGroupStudentFormValues) {
  return apiFetchInternal<ClassGroupStudent>(academicPath(`rombel-murid/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteClassGroupStudent(id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(`rombel-murid/${id}`), { method: 'DELETE' });
}

export function getMyClasses(query?: { academicYearId?: string; semesterId?: string }) {
  return apiFetchInternal<Array<ClassGroupCourse | ClassGroupStudent>>(withQuery(academicPath('kelas-saya'), query), { method: 'GET' });
}

export function getMySubjects(query?: { academicYearId?: string; semesterId?: string }) {
  return apiFetchInternal<Subject[]>(withQuery(academicPath('mapel-saya'), query), { method: 'GET' });
}
