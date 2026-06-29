import { z } from 'zod';
import { academicStatusSchema } from '../../shared/schema/common.schema';

export const classBatchFormSchema = z.object({
  academicYearId: z.string().min(1, 'Tahun ajaran wajib dipilih'),
  semesterId: z.string().min(1, 'Semester wajib dipilih'),
  curriculumId: z.string().min(1, 'Kurikulum wajib dipilih'),
  name: z.string().trim().min(1, 'Nama kelas wajib diisi'),
  level: z.string().trim().min(1, 'Level kelas wajib diisi'),
  status: academicStatusSchema,
});

export type ClassBatchFormValues = z.infer<typeof classBatchFormSchema>;
