import { z } from 'zod';

const nullableTrimmedStringSchema = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value ?? null;
  }

  const trimmedValue = value.trim();
  return trimmedValue === '' ? null : trimmedValue;
}, z.string().trim().min(1).nullable());

const roleCodeSchema = z
  .string()
  .trim()
  .min(1, 'Kode role wajib diisi')
  .transform((value) => value.toUpperCase().replace(/\s+/g, '_'));

export const createRoleSchema = z.object({
  name: z.string().trim().min(1, 'Nama role wajib diisi'),
  code: roleCodeSchema,
  scope: z.enum(['PLATFORM', 'MITRA']),
  description: nullableTrimmedStringSchema.default(null),
  isSystem: z.boolean().default(false),
});

export const createPermissionSchema = z.object({
  name: z.string().trim().min(1, 'Nama permission wajib diisi'),
  scope: z.enum(['PLATFORM', 'MITRA']),
  description: nullableTrimmedStringSchema.default(null),
});

export const assignRolePermissionsSchema = z.object({
  permissionIds: z.array(z.string().trim().min(1)).default([]),
});

export type RoleFormValues = {
  name: string;
  code: string;
  scope: 'PLATFORM' | 'MITRA';
  description: string;
  isSystem: boolean;
};

export type PermissionFormValues = {
  name: string;
  scope: 'PLATFORM' | 'MITRA';
  description: string;
};

export type AssignRolePermissionsInput = z.infer<typeof assignRolePermissionsSchema>;
