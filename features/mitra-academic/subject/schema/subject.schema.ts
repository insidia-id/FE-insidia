import { z } from 'zod';
import { academicStatusSchema } from '../../shared/schema/common.schema';

export const subjectFormSchema = z.object({
  curriculumId: z.string().min(1, 'Kurikulum wajib dipilih'),
  name: z.string().trim().min(1, 'Nama mata pelajaran wajib diisi'),
  code: z.string().trim().min(1, 'Kode mata pelajaran wajib diisi'),
  description: z.string().trim().nullable().optional(),
  status: academicStatusSchema,
});

export type SubjectFormValues = z.infer<typeof subjectFormSchema>;
