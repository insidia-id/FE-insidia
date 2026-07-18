import { Search, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectField } from '@/components/common/form';
import { AccessScope } from '@/features/admin/access-control/types/access-control.types';
import { ScopeOptions } from '@/lib/constants/options';
import { getUsersHref } from '@/features/admin/user/HelperUser';

type HeaderTableProps = {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  scope: AccessScope;
  onScopeChange: (value: AccessScope) => void;
  canChangeScope?: boolean;
  mitraSlug: string | null;
};

export function HeaderTable({ globalFilter, onGlobalFilterChange, scope, onScopeChange, canChangeScope, mitraSlug }: HeaderTableProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center ">
        <div className="relative w-full sm:max-w-sm ">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input value={globalFilter} onChange={(event) => onGlobalFilterChange(event.target.value)} placeholder="Cari Mata Pelajaran..." className="pl-9" />
        </div>
        {canChangeScope && (
          <div className="w-full sm:w-52">
            <SelectField value={scope} onChange={(value) => onScopeChange(value as AccessScope)} options={ScopeOptions} placeholder="Pilih scope" />
          </div>
        )}
      </div>

      <Button asChild variant="insidia" className="w-full sm:w-auto">
        <Link href={getUsersHref(mitraSlug, `courses/create`)}>
          <Plus className="mr-2 size-4" />
          Tambah Mata Pelajaran
        </Link>
      </Button>
    </div>
  );
}
