import { z } from 'zod';
import type { MitraType, StatusMitra } from '../types/mitras.types';

export const createMitraSchema = z.object({
  name: z.string().trim().min(1, 'Nama mitra wajib diisi'),
  type: z.enum(['SEKOLAH', 'KAMPUS']).default('SEKOLAH'),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateMitraSchema = createMitraSchema.extend({
  id: z.string(),
});

export type CreateMitraInput = z.input<typeof createMitraSchema>;
export type UpdateMitraInput = {
  id: string;
  name: string;
  type: MitraType;
  status: StatusMitra;
};
export type UpdateMitraPayload = Partial<Omit<UpdateMitraInput, 'id'>>;
