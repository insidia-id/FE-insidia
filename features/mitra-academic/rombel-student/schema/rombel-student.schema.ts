import { z } from 'zod';
import { academicStatusSchema } from '../../shared/schema/common.schema';

export const rombelStudentFormSchema = z.object({
  classGroupId: z.string().min(1, 'Kelas wajib dipilih'),
  studentId: z.string().min(1, 'Siswa wajib dipilih'),
  academicYearId: z.string().min(1, 'Tahun ajaran wajib dipilih'),
  semesterId: z.string().min(1, 'Semester wajib dipilih'),
  status: academicStatusSchema,
});

export type RombelStudentFormValues = z.infer<typeof rombelStudentFormSchema>;
