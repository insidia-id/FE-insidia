import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/features/mitra-academic/shared/lib/formatters';
import { isTeacherClass } from '../lib/mitra-dashboard.helper';
import type { MyAcademicClass } from '../types/mitra-dashboard.types';

type ClassItemCardProps = {
  item: MyAcademicClass;
};

export function ClassItemCard({ item }: ClassItemCardProps) {
  if (isTeacherClass(item)) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-slate-900">
              {item.classGroup?.name} / {item.course?.title}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {item.academicClass?.name ?? 'N/A'} / {item.academicYear?.name} / {item.semester?.name}
            </p>
          </div>
          <Badge variant={item.status === 'ACTIVE' ? 'success' : 'outline'}>{item.status}</Badge>
        </div>
        <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <span>Guru: {item.teacher?.name ?? item.teacher?.email}</span>
          <span>Diperbarui: {formatDate(item.updatedAt)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-slate-900">{item.classGroup.name}</p>
          <p className="mt-1 text-sm text-slate-600">
            {item.academicClass?.name ?? 'N/A'} / {item.academicYear?.name} / {item.semester?.name}
          </p>
        </div>
        <Badge variant={item.status === 'ACTIVE' ? 'success' : 'outline'}>{item.status}</Badge>
      </div>
      <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <span>Murid: {item.student?.name ?? item.student?.email}</span>
        <span>Diperbarui: {formatDate(item.updatedAt)}</span>
      </div>
    </div>
  );
}
