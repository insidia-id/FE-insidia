import { z } from 'zod';
import { academicStatusSchema } from '../../shared/schema/common.schema';

export const rombelSubjectFormSchema = z.object({
  classGroupId: z.string().min(1, 'Kelas wajib dipilih'),
  courseId: z.string().min(1, 'Mata pelajaran wajib dipilih'),
  teacherId: z.string().min(1, 'Guru wajib dipilih'),
  academicYearId: z.string().min(1, 'Tahun ajaran wajib dipilih'),
  semesterId: z.string().min(1, 'Semester wajib dipilih'),
  status: academicStatusSchema,
});

export type RombelSubjectFormValues = z.infer<typeof rombelSubjectFormSchema>;
