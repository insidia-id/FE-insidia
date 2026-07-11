import { Building2, CalendarDays, Hash, MapPinHouse, ShieldCheck, University } from 'lucide-react';
import { formatMitraDate, formatMitraType } from '../lib/mitra.helper';
import type { LucideIcon } from 'lucide-react';
import { Mitra } from '../types/mitras.types';

type InfoCardProps = {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
};

export const infoMitraItems = (mitra: Mitra) => {
  return [
    {
      icon: Building2,
      label: 'Nama Mitra',
      value: mitra.name,
    },
    {
      icon: ShieldCheck,
      label: 'Tipe Mitra',
      value: formatMitraType(mitra.type),
    },
    {
      icon: Hash,
      label: 'Slug',
      value: mitra.slug,
    },
    {
      icon: University,
      label: 'NPSN',
      value: mitra.mitraProfile?.npsn ?? '-',
    },
    {
      icon: MapPinHouse,
      label: 'Alamat',
      value: mitra.mitraProfile?.address ?? '-',
    },
    {
      icon: CalendarDays,
      label: 'Dibuat Pada',
      value: formatMitraDate(mitra.createdAt),
    },
    {
      icon: CalendarDays,
      label: 'Diupdate Pada',
      value: formatMitraDate(mitra.updatedAt),
    },
    {
      icon: CalendarDays,
      label: 'Deleted At',
      value: formatMitraDate(mitra.deletedAt),
    },
  ];
};

export function InfoMitraCard({ icon: Icon, label, value }: InfoCardProps) {
  return (
    <div className="rounded-xl border p-5">
      <div className="mb-3 flex items-center gap-2 text-foreground">
        <Icon className="size-4" />
        <p className="font-medium">{label}</p>
      </div>

      <p className="text-sm text-muted-foreground">{value ?? '-'}</p>
    </div>
  );
}
