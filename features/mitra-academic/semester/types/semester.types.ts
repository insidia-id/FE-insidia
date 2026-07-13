import type { AcademicYear } from '../../academic-year/types/academic-year.types';
import type { AcademicStatus } from '../../shared/types/common.types';

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
