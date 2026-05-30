import { z } from 'zod';

const toTrimmedNullableString = z.preprocess((value) => (value === '' ? null : value), z.string().trim().min(1).nullable().optional());

const toLineArray = z.preprocess(
  (value) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value !== 'string') {
      return [];
    }

    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  },
  z.array(z.string().trim().min(1)),
);

const optionalNullableNumberSchema = z.preprocess((value) => {
  if (value === '' || value === undefined || value === null) {
    return null;
  }

  return value;
}, z.coerce.number().min(0).nullable().optional());

const booleanSchema = z.preprocess((value) => {
  if (typeof value === 'string') {
    return value === 'true';
  }

  return value;
}, z.boolean());

export const courseFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Judul course wajib diisi'),
    code: toTrimmedNullableString,
    slug: z.string().trim().optional().or(z.literal('')),
    subtitle: toTrimmedNullableString,
    description: toTrimmedNullableString,
    status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'REJECTED', 'ARCHIVED']),
    academicStatus: z.enum(['ACTIVE', 'INACTIVE']),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVEL']),
    language: z.string().trim().min(1, 'Bahasa wajib diisi'),
    price: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
    salePrice: optionalNullableNumberSchema,
    isFree: booleanSchema,
    requirements: toLineArray,
    outcomes: toLineArray,
    targetUsers: toLineArray,
    rejectReason: toTrimmedNullableString,
    scope: z.enum(['INSIDIA', 'MITRA']),
    mitraId: z.string().trim().optional(),
    curriculumId: z.string().trim().optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.isFree && value.salePrice !== null && value.salePrice !== undefined && value.salePrice > value.price) {
      ctx.addIssue({
        code: 'custom',
        path: ['salePrice'],
        message: 'Harga promo tidak boleh lebih besar dari harga normal',
      });
    }

    if (value.status === 'REJECTED' && !value.rejectReason) {
      ctx.addIssue({
        code: 'custom',
        path: ['rejectReason'],
        message: 'Alasan penolakan wajib diisi saat status rejected',
      });
    }

    if (value.scope === 'MITRA') {
      if (!value.code) {
        ctx.addIssue({
          code: 'custom',
          path: ['code'],
          message: 'Kode mapel wajib diisi untuk scope mitra',
        });
      }

      if (!value.curriculumId) {
        ctx.addIssue({
          code: 'custom',
          path: ['curriculumId'],
          message: 'Kurikulum wajib dipilih untuk scope mitra',
        });
      }
    }
  });

export const courseModuleFormSchema = z.object({
  title: z.string().trim().min(1, 'Judul modul wajib diisi'),
  summary: toTrimmedNullableString,
  sortOrder: z.coerce.number().int().min(0, 'Urutan minimal 0'),
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
export type CourseModuleFormValues = z.infer<typeof courseModuleFormSchema>;
export type MediaUploadFormValues = z.infer<typeof mediaUploadFormSchema>;
export type MediaMetadataFormValues = z.infer<typeof mediaMetadataFormSchema>;
