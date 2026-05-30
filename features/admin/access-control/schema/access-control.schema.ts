import { z } from 'zod';

const permissionCodeSchema = z
  .string()
  .trim()
  .min(1, 'Kode permission wajib diisi')
  .regex(/^[a-z][a-z0-9]*\.[a-z][a-z0-9]*\.[a-z][a-z0-9]*$/, 'kode permission harus mengikuti format resource.action.scope, contoh: user.update.insidia');

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
  scope: z.enum(['INSIDIA', 'MITRA']),
  description: nullableTrimmedStringSchema.default(null),
  isSystem: z.boolean().default(false),
});

export const createPermissionSchema = z.object({
  name: z.string().trim().min(1, 'Nama permission wajib diisi'),
  scope: z.enum(['INSIDIA', 'MITRA']),
  code: permissionCodeSchema,
  description: nullableTrimmedStringSchema.default(null),
});

export const assignRolePermissionsSchema = z.object({
  permissionIds: z.array(z.string().trim().min(1)).default([]),
});

export type RoleFormValues = {
  name: string;
  code: string;
  scope: 'INSIDIA' | 'MITRA';
  description: string;
  isSystem: boolean;
};

export type PermissionFormValues = {
  name: string;
  scope: 'INSIDIA' | 'MITRA';
  code: string;
  description: string;
};

export type AssignRolePermissionsInput = z.infer<typeof assignRolePermissionsSchema>;
