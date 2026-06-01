import { z } from 'zod';
import { nullableTrimmedStringSchema } from '../../schema/access-control.schema';

export const createModulePermissionSchema = z.object({
  module: z.string().trim().min(1, 'Nama module wajib diisi'),
  description: nullableTrimmedStringSchema.default(null),
});
