import type { ClassGroupCourse, ClassGroupStudent } from '@/features/mitra-academic/types/mitra-academic.types';
import type { MitraDashboardRoleCode, MyAcademicClass } from '../types/mitra-dashboard.types';

export function shouldLoadAcademicOverview(roleCode: MitraDashboardRoleCode) {
  return roleCode === 'GURU' || roleCode === 'MURID';
}

export function getClassesDescription(roleCode: MitraDashboardRoleCode) {
  if (roleCode === 'GURU') {
    return 'Rombel dan mata pelajaran yang sedang kamu ampu pada periode aktif.';
  }

  if (roleCode === 'MURID') {
    return 'Rombel tempat kamu terdaftar pada periode aktif.';
  }

  return 'Ringkasan kelas berdasarkan role mitra aktif.';
}

export function isTeacherClass(item: MyAcademicClass): item is ClassGroupCourse {
  return 'teacherId' in item;
}

export function isStudentClass(item: MyAcademicClass): item is ClassGroupStudent {
  return 'studentId' in item;
}

export function getAcademicErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Ringkasan akademik belum bisa dimuat saat ini.';
}

export function getMitraName(mitraName?: string | null) {
  return mitraName?.trim() || 'Mitra';
}
