import type { MitraRole } from '@/features/auth/types/auth.types';
import type { ClassGroupCourse, ClassGroupStudent, Subject } from '@/features/mitra-academic/types/mitra-academic.types';

export type MitraDashboardRoleCode = MitraRole['roleCode'];

export type MyAcademicClass = ClassGroupCourse | ClassGroupStudent;

export type MitraAcademicOverview = {
  classes: MyAcademicClass[];
  subjects: Subject[];
  error: string | null;
  shouldLoad: boolean;
};

export type MitraDashboardData = {
  slug: string;
  userLabel: string;
  activeMitraRole: MitraRole;
  roleCode: MitraDashboardRoleCode;
  accountStatus: string;
  isAcademicAdmin: boolean;
  academicOverview: MitraAcademicOverview;
};
