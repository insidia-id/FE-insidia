'use client';

import { ConfirmDeleteDialog } from '@/components/dialog/DialogDelete';
import { FormDialog } from '@/components/dialog/DialogForm';
import { AcademicFeaturePageShell } from '../../shared/components/page/AcademicFeaturePageShell';
import { SubjectTableCard } from '../components/SubjectTableCard';
import { SubjectForm } from '../form/SubjectForm';
import { useSubject } from '../hooks/useSubject';

type SubjectPageProps = {
  slug: string;
};

export function SubjectPage({ slug }: SubjectPageProps) {
  const controller = useSubject();

  return (
    <>
      <AcademicFeaturePageShell slug={slug}>
        <SubjectTableCard controller={controller} />
      </AcademicFeaturePageShell>

      <FormDialog title={controller.state.editingItem ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'} open={controller.state.isFormOpen} onOpenChange={controller.state.setIsFormOpen}>
        <SubjectForm
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
        description={`Mata pelajaran "${controller.state.deletingItem?.name}" akan dihapus dari sistem.`}
        isLoading={controller.queries.isDeleting}
        onConfirm={controller.actions.handleDelete}
      />
    </>
  );
}
