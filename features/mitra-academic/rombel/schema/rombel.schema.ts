import { z } from 'zod';
import { academicStatusSchema } from '../../shared/schema/common.schema';

export const rombelFormSchema = z.object({
  classId: z.string().min(1, 'Kelas wajib dipilih'),
  name: z.string().trim().min(1, 'Nama rombel wajib diisi'),
  waliKelasId: z.string().optional().or(z.literal('')),
  status: academicStatusSchema,
});

export type RombelFormValues = z.infer<typeof rombelFormSchema>;
