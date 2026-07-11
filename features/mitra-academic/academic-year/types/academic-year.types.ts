import type { AcademicStatus } from '../../shared/types/common.types';

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
