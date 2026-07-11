import { z } from 'zod';
import { academicStatusSchema } from '../../shared/schema/common.schema';

export const curriculumFormSchema = z.object({
  name: z.string().trim().min(1, 'Nama kurikulum wajib diisi'),
  code: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  status: academicStatusSchema,
});

export type CurriculumFormValues = z.infer<typeof curriculumFormSchema>;
