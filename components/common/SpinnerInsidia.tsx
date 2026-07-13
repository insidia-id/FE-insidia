import { Spinner } from '@/components/ui/spinner';
export function SpinnerInsidia() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-md">
      <div className="flex min-w-52 flex-col items-center gap-4 rounded-2xl border bg-background/95 px-8 py-6 shadow-lg">
        <div className="rounded-full border p-3">
          <Spinner className="h-8 w-8 text-[#8643E9]" />
        </div>

        <div className="space-y-1 text-center">
          <p className="text-sm font-medium">Memuat halaman</p>

          <p className="text-xs text-muted-foreground">Mohon tunggu sebentar...</p>
        </div>
      </div>
    </div>
  );
}
