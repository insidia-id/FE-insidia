import { z } from 'zod';
import { MITRA_ROLE_VALUES, USER_ROLE_VALUES, USER_STATUS_VALUES } from '../types/user.normalizer';

import type { UserMitraAssignment } from '../types/user.types';
const optionalNullableStringSchema = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => (value === '' ? null : value));

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
const roleProfileSchema = z.object({
  nip: optionalNullableStringSchema,
  subject: optionalNullableStringSchema,
  bio: optionalNullableStringSchema,
  nis: optionalNullableStringSchema,
  kelas: optionalNullableStringSchema,
  jurusan: optionalNullableStringSchema,
  waliId: optionalNullableStringSchema,
  pekerjaan: optionalNullableStringSchema,
  alamat: optionalNullableStringSchema,
  position: optionalNullableStringSchema,
  division: optionalNullableStringSchema,
  note: optionalNullableStringSchema,
});

export const mitraRoleItemSchema = z.object({
  mitraId: z.string().trim().min(1),
  mitraName: z.string().optional().default(''),
  mitraSlug: z.string().optional().default(''),
  roleCode: z.enum(MITRA_ROLE_VALUES),

  profile: roleProfileSchema.optional(),
});
const baseUserSchema = z.object({
  email: z.string().trim().email('Email tidak valid'),
  name: optionalNullableStringSchema,
  phone: optionalNullableStringSchema,
  role: z.enum(USER_ROLE_VALUES),
  scope: z.enum(['INSIDIA', 'MITRA']).default('INSIDIA'),
  status: z.enum(USER_STATUS_VALUES).default('ACTIVE'),
  mitraRoles: z.array(mitraRoleItemSchema).optional().default([]),
});

function validateMitraSelection(
  data: {
    mitraRoles?: UserMitraAssignment[];
  },
  ctx: z.RefinementCtx,
) {
  const isMitraScoped = data.mitraRoles && data.mitraRoles.length > 0;
  const resolvedMitraRole = data.mitraRoles?.find((assignment) => assignment.roleCode && assignment.mitraId);
  const resolvedMitraId = data.mitraRoles?.find((assignment) => assignment.mitraId);

  if (isMitraScoped && !resolvedMitraRole) {
    ctx.addIssue({
      code: 'custom',
      path: ['mitraRoles'],
      message: 'Role mitra wajib dipilih',
    });
  }

  if (isMitraScoped && !resolvedMitraId) {
    ctx.addIssue({
      code: 'custom',
      path: ['mitraRoles'],
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
    mitraRoles: z.array(mitraRoleItemSchema).optional().default([]),
    bio: optionalNullableStringSchema,
    websiteUrl: optionalNullableStringSchema,
    socialLinks: socialLinksSchema,
  })
  .superRefine(validateMitraSelection);

export const SwitchUserMitraSchema = z.object({
  mitraId: z.string(),
});
export type SwitchUserMitraInput = z.input<typeof SwitchUserMitraSchema>;
export type CreateUserInput = z.input<typeof createUserSchema>;

export type UpdateUserSocialLinksInput = {
  instagram?: string;
  linkedin?: string;
  github?: string;
};
export type UpdateUserInput = z.input<typeof updateUserSchema>;

export type UpdateUserPayload = Partial<Omit<UpdateUserInput, 'id'>>;
