'use client';

import { ConfirmDeleteDialog } from '@/components/dialog/DialogDelete';
import { FormDialog } from '@/components/dialog/DialogForm';
import { AcademicFeaturePageShell } from '../../shared/components/page/AcademicFeaturePageShell';
import { CurriculumTableCard } from '../components/CurriculumTableCard';
import { CurriculumForm } from '../form/CurriculumForm';
import { useCurriculum } from '../hooks/useCurriculum';

type CurriculumPageProps = {
  slug: string;
};

export function CurriculumPage({ slug }: CurriculumPageProps) {
  const controller = useCurriculum();

  return (
    <>
      <AcademicFeaturePageShell slug={slug}>
        <CurriculumTableCard controller={controller} />
      </AcademicFeaturePageShell>

      <FormDialog title={controller.state.editingItem ? 'Edit Kurikulum' : 'Tambah Kurikulum'} open={controller.state.isFormOpen} onOpenChange={controller.state.setIsFormOpen}>
        <CurriculumForm
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
        description={`Kurikulum "${controller.state.deletingItem?.name}" akan dihapus dari sistem.`}
        isLoading={controller.queries.isDeleting}
        onConfirm={controller.actions.handleDelete}
      />
    </>
  );
}
