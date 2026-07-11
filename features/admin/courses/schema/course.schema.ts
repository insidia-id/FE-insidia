import { z } from 'zod';
import { toTrimmedNullableString, toLineArray, optionalNullableNumberSchema, booleanSchema } from '@/lib/schema/zod.schemas';

export const baseCourseFormSchema = z.object({
  title: z.string().trim().min(1, 'Judul course wajib diisi'),
  code: toTrimmedNullableString,
  slug: z.string().trim().optional().or(z.literal('')),
  subtitle: toTrimmedNullableString,
  description: toTrimmedNullableString,
  scope: z.enum(['INSIDIA', 'MITRA']),
});

export const createCourseInsidiaFormSchema = baseCourseFormSchema
  .extend({
    scope: z.literal('INSIDIA'),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVEL']),
    price: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
    salePrice: optionalNullableNumberSchema,
    isFree: booleanSchema,
    requirements: toLineArray,
    outcomes: toLineArray,
    targetUsers: toLineArray,
  })
  .superRefine((value, ctx) => {
    if (!value.isFree && value.salePrice !== null && value.salePrice !== undefined && value.salePrice > value.price) {
      ctx.addIssue({
        code: 'custom',
        path: ['salePrice'],
        message: 'Harga promo tidak boleh lebih besar dari harga normal',
      });
    }
  });

export const createCourseMitraFormSchema = baseCourseFormSchema.extend({
  scope: z.literal('MITRA'),
  academicStatus: z.enum(['ACTIVE', 'INACTIVE']),
  mitraId: z.string().trim().min(1, 'Mitra wajib dipilih'),
  curriculumId: z.string().trim().min(1, 'Kurikulum wajib dipilih'),
});

export const courseModuleFormSchema = z.object({
  title: z.string().trim().min(1, 'Judul modul wajib diisi'),
  summary: toTrimmedNullableString,
  sortOrder: z.coerce.number().int().min(0, 'Urutan minimal 0'),
});

export const courseFormSchema = baseCourseFormSchema
  .extend({
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVEL']),
    price: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
    salePrice: optionalNullableNumberSchema,
    isFree: booleanSchema,
    requirements: toLineArray,
    outcomes: toLineArray,
    targetUsers: toLineArray,

    academicStatus: z.enum(['ACTIVE', 'INACTIVE']),
    mitraId: z.string().trim().min(1, 'Mitra wajib dipilih'),
    curriculumId: z.string().trim().min(1, 'Kurikulum wajib dipilih'),
  })
  .superRefine((value, ctx) => {
    if (!value.isFree && value.salePrice !== null && value.salePrice !== undefined && value.salePrice > value.price) {
      ctx.addIssue({
        code: 'custom',
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
export type CreateCourseDto = z.infer<typeof createCourseInsidiaFormSchema> | z.infer<typeof createCourseMitraFormSchema>;
export type CreateCourseInsidiaFormValues = z.infer<typeof createCourseInsidiaFormSchema>;
export type CreateCourseMitraFormValues = z.infer<typeof createCourseMitraFormSchema>;
export type CourseModuleFormValues = z.infer<typeof courseModuleFormSchema>;
export type MediaUploadFormValues = z.infer<typeof mediaUploadFormSchema>;
export type MediaMetadataFormValues = z.infer<typeof mediaMetadataFormSchema>;
