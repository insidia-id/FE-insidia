'use client';

import { ConfirmDeleteDialog } from '@/components/dialog/DialogDelete';
import { FormDialog } from '@/components/dialog/DialogForm';
import { AcademicFeaturePageShell } from '../../shared/components/page/AcademicFeaturePageShell';
import { RombelSubjectTableCard } from '../components/RombelSubjectTableCard';
import { RombelSubjectForm } from '../form/RombelSubjectForm';
import { useRombelSubject } from '../hooks/useRombelSubject';

type RombelSubjectPageProps = {
  slug: string;
  mitraId: string | null;
};

export function RombelSubjectPage({ slug, mitraId }: RombelSubjectPageProps) {
  const controller = useRombelSubject(mitraId ?? '');

  return (
    <>
      <AcademicFeaturePageShell slug={slug}>
        <RombelSubjectTableCard controller={controller} />
      </AcademicFeaturePageShell>

      <FormDialog title={controller.state.editingItem ? 'Edit Kelas Mata Pelajaran' : 'Tambah Kelas Mata Pelajaran'} open={controller.state.isFormOpen} onOpenChange={controller.state.setIsFormOpen}>
        <RombelSubjectForm
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
        description={`Relasi "${controller.state.deletingItem?.classGroup.name} - ${controller.state.deletingItem?.course.title}" akan dihapus dari sistem.`}
        isLoading={controller.queries.isDeleting}
        onConfirm={controller.actions.handleDelete}
      />
    </>
  );
}
