      'use client';

import { Badge } from '@/components/ui/badge';

import { getAcademicStatusVariant } from '../lib/formatters';
import type { AcademicStatus } from '../types/common.types';

export function StatusBadge({ status }: { status: AcademicStatus }) {
  return <Badge variant={getAcademicStatusVariant(status)}>{status}</Badge>;
}
