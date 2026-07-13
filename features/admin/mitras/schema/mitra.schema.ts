import { z } from 'zod';
import type { MitraType, StatusMitra } from '../types/mitras.types';
import { optionalUrlStringSchema } from '@/lib/schema/zod.schemas';
export const mitraProfileSchema = z.object({
  npsn: z.string().trim().min(1, 'npsn wajib diisi'),
  address: optionalUrlStringSchema,
});

export const BaseMitraSchema = z.object({
  name: z.string().trim().min(1, 'Nama mitra wajib diisi'),
  type: z.enum(['SEKOLAH', 'KAMPUS']).default('SEKOLAH'),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  mitraProfile: mitraProfileSchema.optional(),
});

export type CreateMitraInput = z.input<typeof BaseMitraSchema>;
export type mitraProfileInput = z.input<typeof mitraProfileSchema>;

export type UpdateMitraInput = z.input<typeof BaseMitraSchema>;
