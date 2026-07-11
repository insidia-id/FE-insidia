import { cn } from '@/lib/utils';

type EmptyStateProps = {
  message: string;
  tone?: 'default' | 'error';
};

export function EmptyState({ message, tone = 'default' }: EmptyStateProps) {
  return (
    <div className={cn('rounded-lg border p-4 text-sm leading-6', tone === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-slate-200 bg-slate-50 text-slate-600')}>
      {message}
    </div>
  );
}
