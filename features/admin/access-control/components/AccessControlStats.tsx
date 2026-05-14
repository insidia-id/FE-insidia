import { KeyRound, Shield, Users } from 'lucide-react';
import type { Permission, Role } from '../types/access-control.types';

type AccessControlStatsProps = {
  roles: Role[];
  permissions: Permission[];
  selectedRole: Role | null;
};

export function AccessControlStats({ roles, permissions, selectedRole }: AccessControlStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg border bg-background p-5">
        <Shield className="size-5 text-[#2F99B2]" />
        <p className="mt-3 text-sm text-muted-foreground">Role aktif</p>
        <p className="mt-1 text-2xl font-semibold text-foreground">{roles.filter((role) => !role.deletedAt).length}</p>
      </div>

      <div className="rounded-lg border bg-background p-5">
        <KeyRound className="size-5 text-[#2F99B2]" />
        <p className="mt-3 text-sm text-muted-foreground">Permission tersedia</p>
        <p className="mt-1 text-2xl font-semibold text-foreground">{permissions.length}</p>
      </div>

      <div className="rounded-lg border bg-background p-5">
        <Users className="size-5 text-[#2F99B2]" />
        <p className="mt-3 text-sm text-muted-foreground">User pada role terpilih</p>
        <p className="mt-1 text-2xl font-semibold text-foreground">{selectedRole ? selectedRole._count.platformUsers + selectedRole._count.mitraUsers : 0}</p>
      </div>
    </div>
  );
}
