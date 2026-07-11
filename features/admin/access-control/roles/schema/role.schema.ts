import { z } from 'zod';
import { nullableTrimmedStringSchema } from '../../schema/access-control.schema';
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
