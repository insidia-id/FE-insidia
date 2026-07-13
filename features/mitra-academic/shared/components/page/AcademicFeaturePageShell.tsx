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
    <main className="min-h-screen px-4 py-8">
      <section className="mx-auto w-full px-4 space-y-6">
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
