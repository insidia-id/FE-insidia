import { z } from 'zod';

export const nullableString = z.preprocess((value) => (value === '' ? null : value), z.string().trim().min(1).nullable().optional());

export const academicStatusSchema = z.enum(['ACTIVE', 'INACTIVE']);
