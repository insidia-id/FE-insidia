import { z } from 'zod';
export const userRoleValues = ['SUPER_ADMIN', 'ADMIN', 'MENTOR', 'USER', 'AKADEMIK', 'MURID', 'GURU', 'WALI_MURID'] as const;
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
const baseUserSchema = z.object({
  email: z.string().trim().email('Email tidak valid'),
  name: optionalNullableStringSchema,
  phone: optionalNullableStringSchema,
  role: z.enum(userRoleValues),
  mitraRole: z.enum(['AKADEMIK', 'MURID', 'GURU', 'WALI_MURID']).optional(),
  scope: z.enum(['INSIDIA', 'MITRA']).default('INSIDIA'),
  status: z.enum(userStatusValues),
  mitraId: z.string().optional(),
});

function validateMitraSelection(
  data: {
    role?: (typeof userRoleValues)[number];
    mitraRole?: 'AKADEMIK' | 'MURID' | 'GURU' | 'WALI_MURID';
    mitraId?: string;
    scope?: 'INSIDIA' | 'MITRA';
  },
  ctx: z.RefinementCtx,
) {
  const isMitraScoped = data.scope === 'MITRA' || Boolean(data.mitraRole);

  if (isMitraScoped && !data.mitraRole) {
    ctx.addIssue({
      code: 'custom',
      path: ['mitraRole'],
      message: 'Role mitra wajib dipilih',
    });
  }

  if (isMitraScoped && !data.mitraId) {
    ctx.addIssue({
      code: 'custom',
      path: ['mitraId'],
      message: 'Mitra wajib dipilih untuk user scope mitra',
    });
  }
}

export const createUserSchema = baseUserSchema.superRefine(validateMitraSelection);

export const updateUserSchema = baseUserSchema
  .partial()
  .extend({
    id: z.string(),
    scope: z.enum(['INSIDIA', 'MITRA']).default('INSIDIA'),
    bio: optionalNullableStringSchema,
    websiteUrl: optionalNullableStringSchema,
    socialLinks: socialLinksSchema,
  })
  .superRefine(validateMitraSelection);

export type CreateUserInput = z.input<typeof createUserSchema>;
export type UpdateUserSocialLinksInput = {
  instagram?: string;
  linkedin?: string;
  github?: string;
};

export type UpdateUserInput = {
  id: string;
  email?: string;
  name?: string | null;
  phone?: string | null;
  role?: (typeof userRoleValues)[number];
  mitraRole?: 'AKADEMIK' | 'MURID' | 'GURU' | 'WALI_MURID';
  mitraId?: string;
  scope: 'INSIDIA' | 'MITRA';
  status?: (typeof userStatusValues)[number];
  bio: string | null;
  websiteUrl: string | null;
  socialLinks?: UpdateUserSocialLinksInput;
};
export type UpdateUserPayload = Partial<Omit<UpdateUserInput, 'id'>>;
