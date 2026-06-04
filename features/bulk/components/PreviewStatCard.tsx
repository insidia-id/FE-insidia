type PreviewStatCardProps = {
  label: string;
  value: number | string;
  tone?: 'default' | 'success' | 'danger';
};

export function PreviewStatCard({ label, value, tone = 'default' }: PreviewStatCardProps) {
  const toneClassName = tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : tone === 'danger' ? 'border-destructive/20 bg-destructive/5 text-destructive' : 'border-border bg-background text-foreground';

  return (
    <div className={`rounded-xl border p-4 ${toneClassName}`}>
      <p className="text-xs uppercase tracking-[0.14em] opacity-80">{label}</p>

      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
