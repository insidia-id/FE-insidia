'use client';

import { Button } from '@/components/ui/button';
import { CourseModule } from '@/features/admin/courses-module/types/courses-module.types';
import { Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { UserRoleCode } from '../../user/types/user.types';

interface ModuleCardProps {
  module: CourseModule;
  index: number;
  onEdit: (module: CourseModule) => void;
  onDelete: (module: CourseModule) => void;
  courseId?: string;
  userRole: UserRoleCode | null;
}

export function ModuleCard({ module, index, onEdit, onDelete, courseId, userRole }: ModuleCardProps) {
  const itemCount = module.totalLearningItems || 0;
  const canManageModule = userRole !== 'MURID' && userRole !== 'USER';

  return (
    <div className="group">
      <div className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8557E5]/10 text-[#8557E5] flex items-center justify-center text-sm font-semibold">{index + 1}</div>
          <div className="text-left flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 group-hover:text-[#8557E5] transition-colors truncate">{module.title}</h3>
            <p className="text-xs text-gray-500">{itemCount} item pembelajaran</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`${courseId}/module/${module.id}`}>
            <Button variant="outline" size="sm" className="gap-1">
              <span className="hidden sm:inline">Detail</span>
            </Button>
          </Link>
          {canManageModule && (
            <>
              <Button variant="ghost" size="sm" onClick={() => onEdit(module)}>
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(module)} className="text-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
