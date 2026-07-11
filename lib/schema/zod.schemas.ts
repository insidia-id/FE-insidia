import { z } from 'zod';
export const optionalUrlStringSchema = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || z.string().safeParse(value).success, {
    message: 'URL tidak valid',
  })
  .transform((value) => (value ? value : undefined));

export const toTrimmedNullableString = z.preprocess((value) => (value === '' ? null : value), z.string().trim().min(1).nullable().optional());

export const toLineArray = z.preprocess(
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

export const optionalNullableNumberSchema = z.preprocess((value) => {
  if (value === '' || value === undefined || value === null) {
    return null;
  }

  return value;
}, z.coerce.number().min(0).nullable().optional());

export const booleanSchema = z.preprocess((value) => {
  if (typeof value === 'string') {
    return value === 'true';
  }

  return value;
}, z.boolean());
