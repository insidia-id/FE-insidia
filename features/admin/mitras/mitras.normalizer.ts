import { asNullableString, asRecord, asString, normalizeEnum, unwrapDataPayload } from '@/lib/helper/normalizer.helper';
import type { Mitra, MitraType, StatusMitra } from './types/mitras.types';

const MITRA_STATUS_VALUES = ['ACTIVE', 'INACTIVE'] as const;
const MITRA_TYPE_VALUES = ['SEKOLAH', 'KAMPUS'] as const;

function normalizeStatus(value: unknown): StatusMitra {
  return normalizeEnum(value, MITRA_STATUS_VALUES, 'ACTIVE');
}

function normalizeType(value: unknown): MitraType {
  return normalizeEnum(value, MITRA_TYPE_VALUES, 'SEKOLAH');
}

export function normalizeMitra(value: unknown): Mitra {
  const record = asRecord(unwrapDataPayload(value));

  if (!record) {
    throw new Error('Invalid mitra data');
  }

  return {
    id: asString(record.id),
    name: asString(record.name),
    slug: asNullableString(record.slug),
    type: normalizeType(record.type),
    status: normalizeStatus(record.status),
    createdAt: asString(record.createdAt),
    updatedAt: asString(record.updatedAt),
    deletedAt: asNullableString(record.deletedAt),
  };
}

export function normalizeMitras(value: unknown): Mitra[] {
  const payload = unwrapDataPayload(value);

  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map(normalizeMitra);
}
