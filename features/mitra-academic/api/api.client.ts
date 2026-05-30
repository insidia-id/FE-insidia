import { apiFetchInternal } from '@/lib/api/express.client';
import type {
  AcademicClass,
  AcademicYear,
  ClassGroup,
  ClassGroupCourse,
  ClassGroupStudent,
  Curriculum,
  Semester,
  Subject,
} from '../types/mitra-academic.types';
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

function academicPath(mitraId: string, path: string) {
  return `/api/mitras/${mitraId}/academic/${path}`;
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

export function getAcademicYears(mitraId: string) {
  return apiFetchInternal<AcademicYear[]>(academicPath(mitraId, 'tahun-ajaran'), { method: 'GET' });
}

export function createAcademicYear(mitraId: string, data: AcademicYearFormValues) {
  return apiFetchInternal<AcademicYear>(academicPath(mitraId, 'tahun-ajaran'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateAcademicYear(mitraId: string, id: string, data: AcademicYearFormValues) {
  return apiFetchInternal<AcademicYear>(academicPath(mitraId, `tahun-ajaran/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteAcademicYear(mitraId: string, id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(mitraId, `tahun-ajaran/${id}`), { method: 'DELETE' });
}

export function getSemesters(mitraId: string) {
  return apiFetchInternal<Semester[]>(academicPath(mitraId, 'semester'), { method: 'GET' });
}

export function createSemester(mitraId: string, data: SemesterFormValues) {
  return apiFetchInternal<Semester>(academicPath(mitraId, 'semester'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateSemester(mitraId: string, id: string, data: SemesterFormValues) {
  return apiFetchInternal<Semester>(academicPath(mitraId, `semester/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteSemester(mitraId: string, id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(mitraId, `semester/${id}`), { method: 'DELETE' });
}

export function getCurricula(mitraId: string) {
  return apiFetchInternal<Curriculum[]>(academicPath(mitraId, 'kurikulum'), { method: 'GET' });
}

export function createCurriculum(mitraId: string, data: CurriculumFormValues) {
  return apiFetchInternal<Curriculum>(academicPath(mitraId, 'kurikulum'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateCurriculum(mitraId: string, id: string, data: CurriculumFormValues) {
  return apiFetchInternal<Curriculum>(academicPath(mitraId, `kurikulum/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteCurriculum(mitraId: string, id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(mitraId, `kurikulum/${id}`), { method: 'DELETE' });
}

export function getSubjects(mitraId: string) {
  return apiFetchInternal<Subject[]>(academicPath(mitraId, 'mapel'), { method: 'GET' });
}

export function createSubject(mitraId: string, data: SubjectFormValues) {
  return apiFetchInternal<Subject>(academicPath(mitraId, 'mapel'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateSubject(mitraId: string, id: string, data: SubjectFormValues) {
  return apiFetchInternal<Subject>(academicPath(mitraId, `mapel/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteSubject(mitraId: string, id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(mitraId, `mapel/${id}`), { method: 'DELETE' });
}

export function getAcademicClasses(mitraId: string) {
  return apiFetchInternal<AcademicClass[]>(academicPath(mitraId, 'kelas'), { method: 'GET' });
}

export function createAcademicClass(mitraId: string, data: AcademicClassFormValues) {
  return apiFetchInternal<AcademicClass>(academicPath(mitraId, 'kelas'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateAcademicClass(mitraId: string, id: string, data: AcademicClassFormValues) {
  return apiFetchInternal<AcademicClass>(academicPath(mitraId, `kelas/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteAcademicClass(mitraId: string, id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(mitraId, `kelas/${id}`), { method: 'DELETE' });
}

export function getClassGroups(mitraId: string) {
  return apiFetchInternal<ClassGroup[]>(academicPath(mitraId, 'rombel'), { method: 'GET' });
}

export function createClassGroup(mitraId: string, data: ClassGroupFormValues) {
  const payload = {
    ...data,
    waliKelasId: data.waliKelasId?.trim() && data.waliKelasId !== 'NONE' ? data.waliKelasId : null,
  };

  return apiFetchInternal<ClassGroup>(academicPath(mitraId, 'rombel'), {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateClassGroup(mitraId: string, id: string, data: ClassGroupFormValues) {
  const payload = {
    ...data,
    waliKelasId: data.waliKelasId?.trim() && data.waliKelasId !== 'NONE' ? data.waliKelasId : null,
  };

  return apiFetchInternal<ClassGroup>(academicPath(mitraId, `rombel/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteClassGroup(mitraId: string, id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(mitraId, `rombel/${id}`), { method: 'DELETE' });
}

export function getClassGroupCourses(mitraId: string) {
  return apiFetchInternal<ClassGroupCourse[]>(academicPath(mitraId, 'rombel-mapel'), { method: 'GET' });
}

export function getClassGroupStudents(mitraId: string) {
  return apiFetchInternal<ClassGroupStudent[]>(academicPath(mitraId, 'rombel-murid'), { method: 'GET' });
}

export function createClassGroupCourse(mitraId: string, data: ClassGroupCourseFormValues) {
  return apiFetchInternal<ClassGroupCourse>(academicPath(mitraId, 'rombel-mapel'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateClassGroupCourse(mitraId: string, id: string, data: ClassGroupCourseFormValues) {
  return apiFetchInternal<ClassGroupCourse>(academicPath(mitraId, `rombel-mapel/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteClassGroupCourse(mitraId: string, id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(mitraId, `rombel-mapel/${id}`), { method: 'DELETE' });
}

export function createClassGroupStudent(mitraId: string, data: ClassGroupStudentFormValues) {
  return apiFetchInternal<ClassGroupStudent>(academicPath(mitraId, 'rombel-murid'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateClassGroupStudent(mitraId: string, id: string, data: ClassGroupStudentFormValues) {
  return apiFetchInternal<ClassGroupStudent>(academicPath(mitraId, `rombel-murid/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteClassGroupStudent(mitraId: string, id: string) {
  return apiFetchInternal<{ message: string }>(academicPath(mitraId, `rombel-murid/${id}`), { method: 'DELETE' });
}

export function getMyClasses(mitraId: string, query?: { academicYearId?: string; semesterId?: string }) {
  return apiFetchInternal<Array<ClassGroupCourse | ClassGroupStudent>>(
    withQuery(academicPath(mitraId, 'kelas-saya'), query),
    { method: 'GET' },
  );
}

export function getMySubjects(mitraId: string, query?: { academicYearId?: string; semesterId?: string }) {
  return apiFetchInternal<Subject[]>(withQuery(academicPath(mitraId, 'mapel-saya'), query), { method: 'GET' });
}
