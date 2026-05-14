import { z } from 'zod';
export const userRoleValues = ['SUPER_ADMIN', 'ADMIN', 'MENTOR', 'USER', 'AKADEMIK'] as const;

export const userStatusValues = ['ACTIVE', 'SUSPENDED', 'BANNED'] as const;

const optionalNullableStringSchema = z
  .string()
  .trim()
  .transform((value) => (value === '' ? null : value))
  .nullable();

const optionalUrlStringSchema = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || z.string().url().safeParse(value).success, {
    message: 'URL tidak valid',
  })
  .transform((value) => (value ? value : undefined));

const socialLinksSchema = z
  .object({
    instagram: optionalUrlStringSchema,
    linkedin: optionalUrlStringSchema,
    github: optionalUrlStringSchema,
  })
  .optional()
  .transform((value) => {
    if (!value) {
      return undefined;
    }

    const hasValue = Object.values(value).some((item) => typeof item === 'string' && item.trim() !== '');
    return hasValue ? value : undefined;
  });

export const createUserSchema = z.object({
  email: z.string().trim().email('Email tidak valid'),
  name: optionalNullableStringSchema,
  phone: optionalNullableStringSchema,
  role: z.enum(userRoleValues),
  scope: z.enum(['PLATFORM', 'MITRA']).default('PLATFORM'),
  status: z.enum(userStatusValues),
});

export type CreateUserInput = z.input<typeof createUserSchema>;
export type UpdateUserSocialLinksInput = {
  instagram?: string;
  linkedin?: string;
  github?: string;
};

export const updateUserSchema = createUserSchema.partial().extend({
  id: z.string(),
  scope: z.enum(['PLATFORM', 'MITRA']).default('PLATFORM'),
  bio: optionalNullableStringSchema,
  websiteUrl: optionalNullableStringSchema,
  socialLinks: socialLinksSchema,
});
export type UpdateUserInput = {
  id: string;
  email?: string;
  name?: string | null;
  phone?: string | null;
  role?: (typeof userRoleValues)[number];
  scope: 'PLATFORM' | 'MITRA';
  status?: (typeof userStatusValues)[number];
  bio: string | null;
  websiteUrl: string | null;
  socialLinks?: UpdateUserSocialLinksInput;
};
export type UpdateUserPayload = Partial<Omit<UpdateUserInput, 'id'>>;
