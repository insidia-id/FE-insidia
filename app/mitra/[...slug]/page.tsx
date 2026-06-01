import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PublicFallbackPage() {
  return (
    <main className="min-h-[70vh] bg-[linear-gradient(180deg,rgba(15,23,42,0.04),rgba(15,23,42,0)_35%)] px-4 py-10">
      <section className="mx-auto flex w-full max-w-xl flex-col items-center">
        <Card className="w-full border-border/70 bg-white/90 text-center shadow-sm">
          <CardHeader className="gap-2">
            <CardTitle className="text-4xl font-semibold text-slate-900">404</CardTitle>
            <CardDescription>Halaman tidak ditemukan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">Cek kembali tautan yang kamu buka atau kembali ke dashboard utama.</p>
            <Button variant="insidia" asChild className="w-full">
              <Link href="/admin">Kembali ke Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
