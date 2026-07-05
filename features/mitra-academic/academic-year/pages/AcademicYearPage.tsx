'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ConfirmDeleteDialog } from '@/components/dialog/DialogDelete';
import { useAcademicYearController } from '../hooks/AcademicYearController';
import { AcademicYearForm } from '../form/AcademicYearForm';
import { FormDialog } from '@/components/dialog/DialogForm';
import { AcademicYearTableCard } from '../components/AcademicYearTableCard';
type AcademicYearPageProps = {
  slug: string;
  mitraId: string | null;
};

export function AcademicYearPage({ slug, mitraId }: AcademicYearPageProps) {
  const controller = useAcademicYearController(mitraId ?? '');

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

        <AcademicYearTableCard controller={controller} />
      </section>

      <FormDialog title={controller.state.editingItem ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'} open={controller.state.isFormOpen} onOpenChange={(open) => controller.state.setIsFormOpen(open)}>
        <AcademicYearForm
          form={controller.form}
          isSubmitting={controller.queries.isSubmitting}
          handleSubmit={controller.actions.handleSubmit}
          editingItem={controller.state.editingItem}
          handleCloseForm={controller.actions.handleCloseForm}
        />
      </FormDialog>

      <ConfirmDeleteDialog
        open={Boolean(controller.state.deletingItem)}
        onOpenChange={(open) => {
          if (!open) controller.state.setDeletingItem(null);
        }}
        description={`Tahun ajaran "${controller.state.deletingItem?.name}" akan dihapus dari sistem.`}
        isLoading={controller.queries.isSubmitting}
        onConfirm={controller.actions.handleDelete}
      />
    </main>
  );
}
