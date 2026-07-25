'use client';

import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';
import { UserRoleCode } from '@/features/admin/user/types/user.types';

interface ModuleToolbarProps {
  moduleCount: number;
  onAddModule: () => void;
  disabled?: boolean;
  userRole: UserRoleCode | null;
}

export function ModuleToolbar({ moduleCount, onAddModule, disabled, userRole }: ModuleToolbarProps) {
  const canManageModule = userRole !== 'MURID' && userRole !== 'USER';

  return (
    /* PERBAIKAN: Tambahkan 'w-full' */
    <div className="w-full p-6 sm:p-6 flex items-center gap-8 justify-between border-b border-gray-300 bg-gray-50/50">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#8557E5]" />
          Daftar Modul
        </h2>
        <p className="text-sm text-gray-500 mt-1">{moduleCount} modul tersedia</p>
      </div>

      {canManageModule && (
        <Button onClick={onAddModule} disabled={disabled} className="bg-[#8557E5] hover:bg-[#6f44c9] gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Tambah Modul</span>
        </Button>
      )}
    </div>
  );
}