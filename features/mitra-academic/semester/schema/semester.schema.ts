import { z } from 'zod';

import { academicStatusSchema } from '../../shared/schema/common.schema';

export const semesterFormSchema = z.object({
  academicYearId: z.string().min(1, 'Tahun ajaran wajib dipilih'),
  name: z.string().trim().min(1, 'Nama semester wajib diisi'),
  startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  endDate: z.string().min(1, 'Tanggal selesai wajib diisi'),
  status: academicStatusSchema,
});

export type SemesterFormValues = z.infer<typeof semesterFormSchema>;
