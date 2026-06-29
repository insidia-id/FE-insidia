'use client';

import { ConfirmDeleteDialog } from '@/components/dialog/DialogDelete';
import { FormDialog } from '@/components/dialog/DialogForm';
import { AcademicFeaturePageShell } from '../../shared/components/page/AcademicFeaturePageShell';
import { RombelStudentTableCard } from '../components/RombelStudentTableCard';
import { RombelStudentForm } from '../form/RombelStudentForm';
import { useRombelStudent } from '../hooks/useRombelStudent';

type RombelStudentPageProps = {
  slug: string;
};

export function RombelStudentPage({ slug }: RombelStudentPageProps) {
  const controller = useRombelStudent();

  return (
    <>
      <AcademicFeaturePageShell slug={slug}>
        <RombelStudentTableCard controller={controller} />
      </AcademicFeaturePageShell>

      <FormDialog title={controller.state.editingItem ? 'Edit Kelas Siswa' : 'Tambah Kelas Siswa'} open={controller.state.isFormOpen} onOpenChange={controller.state.setIsFormOpen}>
        <RombelStudentForm
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
        description={`Relasi "${controller.state.deletingItem?.classGroup.name} - ${controller.state.deletingItem?.student.name ?? controller.state.deletingItem?.student.email}" akan dihapus dari sistem.`}
        isLoading={controller.queries.isDeleting}
        onConfirm={controller.actions.handleDelete}
      />
    </>
  );
}
