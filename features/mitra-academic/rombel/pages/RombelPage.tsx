'use client';

import { ConfirmDeleteDialog } from '@/components/dialog/DialogDelete';
import { FormDialog } from '@/components/dialog/DialogForm';
import { AcademicFeaturePageShell } from '../../shared/components/page/AcademicFeaturePageShell';
import { RombelTableCard } from '../components/RombelTableCard';
import { RombelForm } from '../form/RombelForm';
import { useRombel } from '../hooks/useRombel';

type RombelPageProps = {
  slug: string;
};

export function RombelPage({ slug }: RombelPageProps) {
  const controller = useRombel();

  return (
    <>
      <AcademicFeaturePageShell slug={slug}>
        <RombelTableCard controller={controller} />
      </AcademicFeaturePageShell>

      <FormDialog title={controller.state.editingItem ? 'Edit Kelas' : 'Tambah Kelas'} open={controller.state.isFormOpen} onOpenChange={controller.state.setIsFormOpen}>
        <RombelForm
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
