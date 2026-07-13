import { z } from 'zod';

import { academicStatusSchema } from '../../shared/schema/common.schema';

export const academicYearFormSchema = z.object({
  name: z.string().trim().min(1, 'Nama tahun ajaran wajib diisi'),
  startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  endDate: z.string().min(1, 'Tanggal selesai wajib diisi'),
  status: academicStatusSchema,
});

export type AcademicYearFormValues = z.infer<typeof academicYearFormSchema>;
