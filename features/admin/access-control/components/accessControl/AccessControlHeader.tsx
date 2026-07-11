'use client';

import { Button } from '@/components/ui/button';
import { getAssignableRoleOptions } from '../../lib/access-control.helper';
import type { AccessScope } from '../../types/access-control.types';

type AccessControlHeaderProps = {
  userRole: string | null;
  scope: AccessScope;
  scopeLocked: boolean;
  includeDeleted: boolean;
  onScopeChange: (scope: AccessScope) => void;
  onIncludeDeletedChange: (value: boolean) => void;
  // 1. TAMBAHKAN PROPS INI AGAR TYPESCRIPT TIDAK ERROR
  actionButtons?: React.ReactNode; 
};

export function AccessControlHeader({ 
  userRole, 
  scope, 
  scopeLocked, 
  includeDeleted, 
  onScopeChange, 
  onIncludeDeletedChange,
  actionButtons // 2. PANGGIL DI SINI
}: AccessControlHeaderProps) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between mb-4">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Role & Permission</h1>
        <p className="max-w-2xl text-sm font-medium text-slate-500">
          Control access levels and assign roles to your team.
        </p>
      </div>

      <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
        {/* 3. TEMPATKAN TOMBOL AKSI DI ATAS */}
        {actionButtons && (
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            {actionButtons}
          </div>
        )}

        {/* FILTER SCOPE & TOGGLE DELETED */}
        <div className="flex flex-wrap items-center gap-3 justify-end w-full lg:w-auto">
          {userRole === 'SUPER_ADMIN' && (
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              {getAssignableRoleOptions(userRole).map((option) => (
                <Button 
                  key={option.value} 
                  type="button" 
                  variant={scope === option.value ? 'default' : 'ghost'} 
                  size="sm" 
                  className={`rounded-lg px-4 ${scope === option.value ? 'bg-slate-900 text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900'}`}
                  onClick={() => onScopeChange(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          )}

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
            <input 
              type="checkbox" 
              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              checked={includeDeleted} 
              onChange={(event) => onIncludeDeletedChange(event.target.checked)} 
            />
            Tampilkan role terhapus
          </label>
        </div>
      </div>
    </div>
  );
}