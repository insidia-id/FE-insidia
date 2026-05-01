import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen bg-[#F6F6F8] px-4 py-12">
      <div className="mx-auto max-w-xl">
        <Card className="border-[#E8D8DE] bg-white text-center">
          <CardHeader className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8C0E28]">403</p>
            <CardTitle className="text-3xl text-[#31111A]">Akses tidak diizinkan</CardTitle>
            <CardDescription className="text-base text-[#6B4C55]">Halaman ini tidak tersedia untuk role akun yang sedang Anda gunakan.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
