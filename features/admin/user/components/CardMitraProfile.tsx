import { UserProfileForm } from '../types/user.types';
interface CardMitraProfileProps {
  roleCode: string;
  profile: UserProfileForm;
}

const PROFILE_FIELDS = {
  MURID: [
    { key: 'nis', label: 'NIS' },
    { key: 'kelas', label: 'Kelas' },
    { key: 'jurusan', label: 'Jurusan' },
    { key: 'waliId', label: 'Wali ID' },
  ],

  GURU: [
    { key: 'nip', label: 'NIP' },
    { key: 'subject', label: 'Mata Pelajaran' },
  ],

  AKADEMIK: [
    { key: 'position', label: 'Jabatan' },
    { key: 'division', label: 'Divisi' },
  ],

  WALI_MURID: [
    { key: 'pekerjaan', label: 'Pekerjaan' },
    { key: 'alamat', label: 'Alamat' },
  ],
} as const;

export function CardMitraProfile({ roleCode, profile }: CardMitraProfileProps) {
  const fields = PROFILE_FIELDS[roleCode as keyof typeof PROFILE_FIELDS] || [];

  if (!fields.length) {
    return null;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h5 className="font-medium">Profil Akademik</h5>

        <span className="text-xs text-muted-foreground">{fields.length} data</span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className="rounded-xl bg-muted/40 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{field.label}</p>

            <p className="mt-2 text-sm font-medium break-words">{profile[field.key] || '-'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
