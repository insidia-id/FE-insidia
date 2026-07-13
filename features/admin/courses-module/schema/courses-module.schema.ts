import { z } from 'zod';
import { toTrimmedNullableString } from '@/lib/schema/zod.schemas';
export const courseModuleFormSchema = z.object({
  title: z.string().trim().min(1, 'Judul modul wajib diisi'),
  summary: toTrimmedNullableString,
  sortOrder: z.coerce.number().int().min(0, 'Urutan minimal 0'),
  mitraId: z.string().trim().nullable(),
  classGroupCourseId: z.string().trim().nullish(),
  courseInsidiaId: z.string().trim().nullish(),
});

export type CourseModuleFormValues = z.infer<typeof courseModuleFormSchema>;
