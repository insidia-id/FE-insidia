import { z } from 'zod';
export const optionalUrlStringSchema = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || z.string().safeParse(value).success, {
    message: 'URL tidak valid',
  })
  .transform((value) => (value ? value : undefined));
