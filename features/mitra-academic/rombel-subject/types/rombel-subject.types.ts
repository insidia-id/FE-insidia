import { AcademicStatus } from '../../types/mitra-academic.types';

export type { ClassGroupCourse } from '../../types/mitra-academic.types';
export type ClassGroupCourseResponse = {
  id: string;
  mitraId: string;
  classGroupId: string;
  courseMitraId: string;
  teacherId: string;
  academicYearId: string;
  semesterId: string;
  status: AcademicStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  classGroup: {
    id: string;
    name: string;
  };
  course: {
    course: {
      id: string;
      title: string;
    };
  };
  teacher: {
    id: string;
    name: string;
    email: string;
  };
  academicYear: {
    id: string;
    name: string;
  };
  semester: {
    id: string;
    name: string;
    status: AcademicStatus;
  };
};
