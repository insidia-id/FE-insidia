'use client';

import { ConfirmDeleteDialog } from '@/components/dialog/DialogDelete';
import { FormDialog } from '@/components/dialog/DialogForm';
import { AcademicFeaturePageShell } from '../../shared/components/page/AcademicFeaturePageShell';
import { ClassBatchTableCard } from '../components/ClassBatchTableCard';
import { ClassBatchForm } from '../form/ClassBatchForm';
import { useClassBatch } from '../hooks/useClassBatch';

type ClassBatchPageProps = {
  slug: string;
  mitraId: string | null;
};

export function ClassBatchPage({ slug, mitraId }: ClassBatchPageProps) {
  const controller = useClassBatch(mitraId ?? '');

  return (
    <>
      <AcademicFeaturePageShell slug={slug}>
        <ClassBatchTableCard controller={controller} />
      </AcademicFeaturePageShell>

      <FormDialog title={controller.state.editingItem ? 'Edit Kelas Angkatan' : 'Tambah Kelas Angkatan'} open={controller.state.isFormOpen} onOpenChange={controller.state.setIsFormOpen}>
        <ClassBatchForm
          form={controller.form}
          queries={controller.queries}
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
        description={`Kelas "${controller.state.deletingItem?.name}" akan dihapus dari sistem.`}
        isLoading={controller.queries.isDeleting}
        onConfirm={controller.actions.handleDelete}
      />
    </>
  );
}
