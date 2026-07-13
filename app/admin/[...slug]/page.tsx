import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PublicFallbackPage() {
  return (
    <main className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">Halaman tidak ditemukan.</p>

      <Button variant={'insidia'} asChild className="mt-6">
        <Link href="/admin">Kembali ke Dasboard</Link>
      </Button>
    </main>
  );
}
