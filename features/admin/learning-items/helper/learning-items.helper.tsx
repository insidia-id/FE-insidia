import { intervalToDuration } from 'date-fns';
import { Clock } from 'lucide-react';
import { formatDate } from '@/lib/helper/normalizer.helper';
export function formatLearningItemDuration(availableFrom: Date | string | null | undefined, availableUntil: Date | string | null | undefined): string {
  if (!availableFrom || !availableUntil) {
    return '-';
  }

  const start = new Date(availableFrom);
  const end = new Date(availableUntil);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return '-';
  }

  if (end <= start) {
    return '0 menit';
  }

  const duration = intervalToDuration({
    start,
    end,
  });

  const parts: string[] = [];

  if (duration.years) parts.push(`${duration.years} tahun`);
  if (duration.months) parts.push(`${duration.months} bulan`);
  if (duration.days) parts.push(`${duration.days} hari`);
  if (duration.hours) parts.push(`${duration.hours} jam`);
  if (duration.minutes) parts.push(`${duration.minutes} menit`);

  return parts.length > 0 ? parts.join(' ') : 'Kurang dari 1 menit';
}
export function getAvailabilityStatus(availableFrom: Date | string | null | undefined, availableUntil: Date | string | null | undefined) {
  const now = new Date();

  const from = availableFrom ? new Date(availableFrom) : null;
  const until = availableUntil ? new Date(availableUntil) : null;

  const willBeAvailable = !!from && from > now;
  const expired = !!until && until < now;
  const available = (!from || from <= now) && (!until || until >= now);

  return {
    willBeAvailable,
    expired,
    available,
  };
}

export const getAvailabilityBadge = (willBeAvailable: boolean, expired: boolean, available: boolean, availableFrom: Date | string | null | undefined) => {
  if (willBeAvailable) {
    return (
      <span className="flex items-center gap-1 text-xs text-amber-600">
        <Clock className="h-3 w-3" />
        Akan tersedia {formatDate(availableFrom)}
      </span>
    );
  }

  if (expired) {
    return (
      <span className="flex items-center gap-1 text-xs text-red-500">
        <Clock className="h-3 w-3" />
        Kedaluwarsa
      </span>
    );
  }

  if (available) {
    return (
      <span className="flex items-center gap-1 text-xs text-green-600">
        <Clock className="h-3 w-3" />
        Tersedia
      </span>
    );
  }
  return null;
};
