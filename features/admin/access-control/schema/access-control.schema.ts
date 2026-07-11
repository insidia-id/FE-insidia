import { z } from 'zod';

export const nullableTrimmedStringSchema = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value ?? null;
  }

  const trimmedValue = value.trim();
  return trimmedValue === '' ? null : trimmedValue;
}, z.string().trim().min(1).nullable());

export const assignRolePermissionsSchema = z.object({
  permissionIds: z.array(z.string().trim().min(1)).default([]),
});

export type AssignRolePermissionsInput = z.infer<typeof assignRolePermissionsSchema>;
