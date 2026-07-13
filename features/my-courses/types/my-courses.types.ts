import { AccessScope } from '@/features/admin/access-control/types/access-control.types';

export type MyAcademicQueryDto = {
  academicYearId?: string;
  semesterId?: string;
  classGroupId?: string;
  courseId?: string;
  teacherId?: string;
};

export type MyCourseTeacher = {
  id: string;
  name: string;
} | null;

export type BaseMyCourse = {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  description: string | null;
  scope: AccessScope;
  totalModules: number;
  createdAt: string;
  updatedAt: Date;
};

export type MyCourseTeacherResponse = BaseMyCourse & {
  mitraId: string | null;
  mitraName: string | null;
  curriculumId: string | null;
  curriculum: string | null;
  totalClassGroupCourses: number;
  teacher: MyCourseTeacher;
  totalLearningItems: number;
  totalModules: number;
  classGroupCourses: {
    classGroupName: string;
    classGroupCourseId: string;
    academicYearId: string;
    semesterId: string;
  }[];
};

export type MyCourseStudentResponse = BaseMyCourse & {
  mitraId: string | null;
  mitraName: string | null;
  curriculumId: string | null;
  curriculum: string | null;
  totalClassGroupCourses: number;
  teacher: MyCourseTeacher;
  totalLearningItems: number;
  totalModules: number;
  classGroupCourses: {
    classGroupName: string;
    classGroupCourseId: string;
    academicYearId: string;
    semesterId: string;
  }[];
};

export type MyCourseResponse = MyCourseTeacherResponse | MyCourseStudentResponse;
