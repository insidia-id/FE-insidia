import { z } from 'zod';
import { LearningItemTypes } from '../types/learnig-items.type';

export const learningItemsSchema = z.object({
  title: z.string().min(1, 'title wajib diisi').max(255, 'title maksimal 255 karakter'),
  type: z.enum(LearningItemTypes),
  slug: z.string().min(1, 'slug wajib diisi').max(255, 'slug maksimal 255 karakter'),
  order: z.number().int().min(1, 'order harus lebih besar dari 0'),
  description: z.string().max(500, 'description maksimal 500 karakter').optional(),
  published: z.boolean().optional(),
  availableFrom: z.date().optional().nullable(),
  availableUntil: z.date().optional().nullable(),
  isPreview: z.boolean().optional(),
});

export type LearningItemsSchema = z.infer<typeof learningItemsSchema>;
