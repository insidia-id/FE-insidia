'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ConfirmDeleteDialog } from '@/components/dialog/DialogDelete';
import { useSemester } from '../hooks/useSemester';
import { SemesterForm } from '../form/SemesterForm';
import { FormDialog } from '@/components/dialog/DialogForm';
import { SemesterTableCard } from '../components/SemesterTableCard';
type SemesterPageProps = {
  slug: string;
  mitraId: string | null;
};

export function SemesterPage({ slug, mitraId }: SemesterPageProps) {
  const controller = useSemester(mitraId ?? '');

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

        <SemesterTableCard controller={controller} />
      </section>

      <FormDialog title={controller.state.editingItem ? 'Edit Semester' : 'Tambah Semester'} open={controller.state.isFormOpen} onOpenChange={(open) => controller.state.setIsFormOpen(open)}>
        <SemesterForm
          form={controller.form}
          isSubmitting={controller.queries.isSubmitting}
          handleSubmit={controller.actions.handleSubmit}
          editingItem={controller.state.editingItem}
          handleCloseForm={controller.actions.handleCloseForm}
          mitraId={mitraId}
        />
      </FormDialog>

      <ConfirmDeleteDialog
        open={Boolean(controller.state.deletingItem)}
        onOpenChange={(open) => {
          if (!open) controller.state.setDeletingItem(null);
        }}
        description={`Semester "${controller.state.deletingItem?.name}" akan dihapus dari sistem.`}
        isLoading={controller.queries.isSubmitting}
        onConfirm={controller.actions.handleDelete}
      />
    </main>
  );
}
