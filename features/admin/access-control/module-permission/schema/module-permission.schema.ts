import { z } from 'zod';
import { nullableTrimmedStringSchema } from '../../schema/access-control.schema';
import { ACCESS_SCOPE } from '@/lib/types/types';

export const createModulePermissionSchema = z.object({
  module: z.string().trim().min(1, 'Nama module wajib diisi'),
  scope: z.enum(ACCESS_SCOPE, 'Scope harus salah satu dari INSIDIA atau MITRA'),
  description: nullableTrimmedStringSchema.default(null),
});
