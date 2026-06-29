'use client';

import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type AcademicFeaturePageShellProps = {
  slug: string;
  children: ReactNode;
};

export function AcademicFeaturePageShell({ slug, children }: AcademicFeaturePageShellProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(15,23,42,0.04),rgba(15,23,42,0)_40%),radial-gradient(120%_80%_at_0%_0%,rgba(14,165,233,0.08),transparent)] px-4 py-8">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/mitra/admin/${slug}/academic`}>
              <ArrowLeft className="mr-2 size-4" />
              Kembali
            </Link>
          </Button>
        </div>

        {children}
      </section>
    </main>
  );
}
