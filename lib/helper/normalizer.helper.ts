export function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

export function unwrapDataPayload(value: unknown): unknown {
  const record = asRecord(value);

  if (!record || !('data' in record)) {
    return value;
  }

  return unwrapDataPayload(record.data);
}

export function asString(value: unknown) {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return '';
}

export function asNullableString(value: unknown) {
  const normalized = asString(value);

  return normalized || null;
}

export function asNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

export function asNumberOrDefault(value: unknown, fallback = 0) {
  return asNumber(value) ?? fallback;
}

export function asBoolean(value: unknown, fallback = false) {
  if (typeof value === 'boolean') {
    return value;
  }

  return fallback;
}
export function normalizeEnum<TValue extends string>(value: unknown, allowedValues: readonly TValue[], fallback: TValue): TValue {
  const normalizedValue = asString(value) as TValue;

  return allowedValues.includes(normalizedValue) ? normalizedValue : fallback;
}
