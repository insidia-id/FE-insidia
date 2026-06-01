import { Button } from '@/components/ui/button';
import { getAssignableRoleOptions } from '../../lib/access-control.helper';
import type { AccessScope } from '../../types/access-control.types';

type AccessControlHeaderProps = {
  userRole: string;
  scope: AccessScope;
  scopeLocked: boolean;
  includeDeleted: boolean;
  onScopeChange: (scope: AccessScope) => void;
  onIncludeDeletedChange: (value: boolean) => void;
};

export function AccessControlHeader({ userRole, scope, scopeLocked, includeDeleted, onScopeChange, onIncludeDeletedChange }: AccessControlHeaderProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">{scope === 'INSIDIA' ? 'Akses Insidia' : 'Akses Mitra'}</p>
        <h1 className="text-3xl font-semibold text-foreground">Role & Permission</h1>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">Kelola daftar role, library permission, dan relasi keduanya dari satu permukaan kerja yang konsisten dengan API backend.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {!scopeLocked && (
          <div className="inline-flex rounded-lg border bg-background p-1">
            {getAssignableRoleOptions(userRole).map((option) => (
              <Button key={option.value} type="button" variant={scope === option.value ? 'default' : 'ghost'} size="sm" onClick={() => onScopeChange(option.value)}>
                {option.label}
              </Button>
            ))}
          </div>
        )}

        <label className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={includeDeleted} onChange={(event) => onIncludeDeletedChange(event.target.checked)} />
          Tampilkan role terhapus
        </label>
      </div>
    </div>
  );
}
