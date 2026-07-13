import { CourseDetail, CourseMitraDetail, CourseSummary } from '@/features/admin/courses/types/course.types';
import type { ReactNode } from 'react';

export type AcademicStatus = 'ACTIVE' | 'INACTIVE';

export type SelectOption = {
  label: string;
  value: string;
};

export type AcademicYear = {
  id: string;
  mitraId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: AcademicStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type Semester = {
  id: string;
  mitraId: string;
  academicYearId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: AcademicStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  academicYear: AcademicYear;
};

export type Curriculum = {
  id: string;
  mitraId: string;
  name: string;
  code: string | null;
  description: string | null;
  status: AcademicStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type Subject = {
  id: string;
  mitraId: string;
  curriculumId: string | null;
  name: string;
  slug: string;
  code: string | null;
  description: string | null;
  status: AcademicStatus;
  courseStatus: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  curriculum: Curriculum | null;
};

export type AcademicClass = {
  id: string;
  mitraId: string;
  academicYearId: string;
  semesterId: string;
  curriculumId: string;
  name: string;
  level: string;
  status: AcademicStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  academicYear: AcademicYear;
  semester: {
    id: string;
    name: string;
    status: AcademicStatus;
  };
  curriculum: {
    id: string;
    name: string;
    code: string | null;
    status: AcademicStatus;
  };
};

export type TeacherSummary = {
  id: string;
  name: string | null;
  email?: string;
};

export type AcademicYearSummary = {
  id: string;
  name: string;
};

export type SemesterSummary = {
  id: string;
  name: string;
};
export type StudentSummary = TeacherSummary;

export type ClassGroupSummary = {
  id: string;
  name: string;
};
export type AcademicClassSummary = {
  id: string;
  name: string;
};
export type ClassGroup = {
  id: string;
  mitraId: string;
  classId: string;
  name: string;
  waliKelasId: string | null;
  status: AcademicStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  academicClass: AcademicClass;
  waliKelas: TeacherSummary | null;
};

export type ClassGroupCourse = {
  id: string;
  mitraId: string;
  classGroupId: string;
  teacherId: string;
  academicYearId: string;
  semesterId: string;
  status: AcademicStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  classGroup: ClassGroupSummary;
  course: CourseSummary;
  teacher: TeacherSummary;
  academicYear: AcademicYearSummary;
  semester: SemesterSummary;
  academicClass?: AcademicClassSummary;
};

export type ClassGroupStudent = {
  id: string;
  mitraId: string;
  classGroupId: string;
  studentId: string;
  academicYearId: string;
  semesterId: string;
  status: AcademicStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  classGroup: ClassGroupSummary;
  student: StudentSummary;
  academicYear: AcademicYearSummary;
  semester: SemesterSummary;
  academicClass?: AcademicClassSummary;
};

export type AcademicFieldConfig<TFormValues> = {
  name: keyof TFormValues & string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select';
  placeholder?: string;
  options?: SelectOption[];
};

export type AcademicColumn<TItem> = {
  header: string;
  render: (item: TItem) => ReactNode;
};
