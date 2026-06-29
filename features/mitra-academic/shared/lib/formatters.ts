import type { AcademicStatus } from '../types/common.types';

export function getAcademicStatusVariant(status: AcademicStatus): 'success' | 'outline' {
  return status === 'ACTIVE' ? 'success' : 'outline';
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}
