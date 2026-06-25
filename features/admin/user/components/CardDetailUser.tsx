import { LinkIcon, LucideIcon, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { formatBooleanLabel, formatDateTime, formatRole, getUserRole } from '../HelperUser';
import { Badge } from '@/components/ui/badge';
import { UserMitraRoleRelation } from '../types/user.types';
import { CardMitraProfile } from './CardMitraProfile';

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
}

interface InfoSectionProps {
  title: string;
  items: {
    label: string;
    value: React.ReactNode;
  }[];
}

interface MitraRoleCardProps {
  mitraRole: UserMitraRoleRelation;
}

export const userInfo = (user: any) => {
  return [
    {
      icon: Mail,
      label: 'Email',
      value: user.email,
      subtitle: `Normalized: ${user.normalizedEmail}`,
    },
    {
      icon: Phone,
      label: 'Telepon',
      value: user.phone || '-',
      subtitle: `Verified at: ${formatDateTime(user.phoneVerifiedAt)}`,
    },
    {
      icon: ShieldCheck,
      label: 'Role',
      value: formatRole(getUserRole(user)),
    },
    {
      icon: UserRound,
      label: 'Dibuat Pada',
      value: formatDateTime(user.createdAt),
      subtitle: `Waktu lengkap: ${formatDateTime(user.createdAt, {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
    },
  ];
};

export const userSections = (user: any) => {
  return [
    {
      title: 'Profil',
      items: [
        {
          label: 'Bio',
          value: user.bio || '-',
        },
        {
          label: 'Website',
          value: user.websiteUrl ? (
            <a className="inline-flex items-center gap-2 text-primary hover:underline" href={user.websiteUrl} target="_blank" rel="noreferrer">
              <LinkIcon className="size-4" />
              {user.websiteUrl}
            </a>
          ) : (
            '-'
          ),
        },
        {
          label: 'Image URL',
          value: <span className="break-all">{user.image || '-'}</span>,
        },
      ],
    },
    {
      title: 'Audit',
      items: [
        {
          label: 'Email Verified',
          value: formatBooleanLabel(user.emailVerified),
        },
        {
          label: 'Created By',
          value: <span className="break-all">{user.createdById || '-'}</span>,
        },
        {
          label: 'Deleted At',
          value: formatDateTime(user.deletedAt),
        },
      ],
    },
  ];
};

export function CardInfoUser({ icon: Icon, label, value, subtitle }: InfoCardProps) {
  return (
    <div className="rounded-xl border p-5">
      <div className="mb-3 flex items-center gap-2 text-foreground">
        <Icon className="size-4" />
        <p className="font-medium">{label}</p>
      </div>

      <p className="text-sm text-muted-foreground">{value}</p>

      {subtitle && <p className="mt-2 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function CardInfoSection({ title, items }: InfoSectionProps) {
  return (
    <div className="rounded-xl border p-5">
      <p className="mb-3 font-medium text-foreground">{title}</p>

      <div className="space-y-3 text-sm text-muted-foreground">
        {items.map((item) => (
          <div key={item.label}>
            <p className="font-medium text-foreground">{item.label}</p>
            <div>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MitraRoleCard({ mitraRole }: MitraRoleCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-md">
      <div className="border-b bg-muted/40 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="font-semibold">{mitraRole.mitraName || mitraRole.mitraSlug || mitraRole.mitraId}</h4>

            <p className="mt-1 text-xs text-muted-foreground">{mitraRole.mitraId}</p>
          </div>

          <Badge>{formatRole(mitraRole.roleCode)}</Badge>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Mitra ID</p>
            <p className="mt-1 font-medium">{mitraRole.mitraId}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Slug</p>
            <p className="mt-1 font-medium">{mitraRole.mitraSlug || '-'}</p>
          </div>
        </div>

        <CardMitraProfile roleCode={mitraRole.roleCode} profile={mitraRole.profile || {}} />
      </div>
    </div>
  );
}
