import { z } from 'zod';
import { nullableTrimmedStringSchema } from '../../schema/access-control.schema';

const permissionCodeSchema = z
  .string()
  .trim()
  .min(1, 'Kode permission wajib diisi')
  .regex(/^[a-z][a-z0-9]*\.[a-z][a-z0-9]*\.[a-z][a-z0-9]*$/, 'kode permission harus mengikuti format resource.action.scope, contoh: user.update.insidia');

type PermissionSchemaOptions = {
  requireModule?: boolean;
};

export const createPermissionSchema = (options: PermissionSchemaOptions = {}) =>
  z.object({
    moduleId: options.requireModule ? z.string().trim().min(1, 'Module permission wajib dipilih') : z.string().trim().optional(),
    name: z.string().trim().min(1, 'Nama permission wajib diisi'),
    scope: z.enum(['INSIDIA', 'MITRA']),
    code: permissionCodeSchema,
    description: nullableTrimmedStringSchema.default(null),
  });
