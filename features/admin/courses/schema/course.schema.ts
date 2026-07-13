import { z } from 'zod';
import { toTrimmedNullableString, toLineArray, optionalNullableNumberSchema, booleanSchema } from '@/lib/schema/zod.schemas';

const baseCourseFormSchema = z.object({
  title: z.string().trim().min(1, 'Judul wajib diisi'),
  code: z.string().trim().nullable(),
  subtitle: z.string().trim().nullable(),
  description: z.string().trim().nullable(),
});

export const insidiaCourseFormSchema = baseCourseFormSchema.extend({
  scope: z.literal('INSIDIA'),
  slug: z.string().trim().min(1),

  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVEL']),

  price: z.coerce.number().min(0),
  salePrice: optionalNullableNumberSchema,
  isFree: booleanSchema,

  requirements: toLineArray,
  outcomes: toLineArray,
  targetUsers: toLineArray,
});

export const mitraCourseFormSchema = baseCourseFormSchema.extend({
  scope: z.literal('MITRA'),

  academicStatus: z.enum(['ACTIVE', 'INACTIVE']),

  mitraId: z.string().trim().min(1, 'Mitra wajib dipilih'),

  curriculumId: z.string().trim().min(1, 'Kurikulum wajib dipilih'),
});

export const courseFormSchema = z.discriminatedUnion('scope', [mitraCourseFormSchema, insidiaCourseFormSchema]).superRefine((value, ctx) => {
  if (value.scope === 'INSIDIA' && !value.isFree && value.salePrice != null && value.salePrice > value.price) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['salePrice'],
      message: 'Harga promo tidak boleh lebih besar dari harga normal',
    });
  }
});

export const mediaUploadFormSchema = z.object({
  file: z.instanceof(File, { message: 'File media wajib dipilih' }).refine((file) => file.size > 0, 'File media wajib dipilih'),
  type: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO']).optional(),
  alt: toTrimmedNullableString,
  caption: toTrimmedNullableString,
  sortOrder: z.coerce.number().int().min(0, 'Urutan minimal 0'),
  isPrimary: booleanSchema,
});

export const mediaMetadataFormSchema = z.object({
  alt: toTrimmedNullableString,
  caption: toTrimmedNullableString,
  sortOrder: z.coerce.number().int().min(0, 'Urutan minimal 0'),
  isPrimary: booleanSchema,
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;
export type CreateCourseDto = z.infer<typeof insidiaCourseFormSchema> | z.infer<typeof mitraCourseFormSchema>;
export type CreateCourseInsidiaFormValues = z.infer<typeof insidiaCourseFormSchema>;
export type CreateCourseMitraFormValues = z.infer<typeof mitraCourseFormSchema>;
export type MediaUploadFormValues = z.infer<typeof mediaUploadFormSchema>;
export type MediaMetadataFormValues = z.infer<typeof mediaMetadataFormSchema>;
