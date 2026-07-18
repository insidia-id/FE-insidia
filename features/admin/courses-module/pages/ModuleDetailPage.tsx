'use client';

import { ModuleDetailHeader } from '../components/ModuleDetailHeader';
import { ModuleDetailStats } from '../components/ModuleDetailStats';
import { LearningItemsSection } from '../../learning-items/components/LearningItemsSection';
import { FormDialog } from '@/components/dialog/DialogForm';
import { ModuleFormDialog } from '../components/ModuleFormDialog';
import { useCourseModuleDetail } from '../hooks/useCourses-moduleDetail';
import { useCourseModules } from '../hooks/useCourses-module';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { getActiveMitraContext } from '../../user/HelperUser';
import { ModuleDeleteDialog } from '../components/ModuleDeleteDialog';
import { useMyDetailCourses } from '@/features/my-courses/hooks/useMyDetailCourses';
import { useModuleLearningItems } from '../../learning-items/hooks/useModuleLearningItems';
import { BookOpen } from 'lucide-react';

type ModuleDetailPageProps = {
  slug: string;
  id: string;
  moduleId: string;
  currentProfile: AuthProfileResponse;
};

export function ModuleDetailPage({ slug, id, moduleId, currentProfile }: ModuleDetailPageProps) {
  const { module, isLoading: isModuleLoading } = useCourseModuleDetail(moduleId);
  const { activeMitraId, activeMitraRole, activeInsidiaRole } = getActiveMitraContext(currentProfile);
  const { classGroupOptions } = useMyDetailCourses(id);

  const { form, editingModule, moduleToDelete, onEdit, isFormOpen, isSubmitting, isDeleting, onSubmit, onDelete, onDeleteTargetChange, onFormOpenChange } = useCourseModules({
    courseId: id,
    classGroupCourseId: null,
    activeMitraId: activeMitraId,
  });

  const { learningItems, handleOpenItem, handleTogglePublish, handleDeleteItem } = useModuleLearningItems({
    moduleId,
    courseId: id,
    slug,
  });

  const userRole = activeMitraRole || activeInsidiaRole;
  console.log('ModuleDetailPage userRole:', userRole);
  if (isModuleLoading) {
    return (
      <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 w-96 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <span className="text-2xl">
            <BookOpen />
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Module tidak ditemukan</h3>
        <p className="mt-1 text-sm text-gray-500">Modul yang Anda cari tidak ditemukan atau telah dihapus.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <ModuleDetailHeader userRole={userRole} module={module} mitraSlug={slug} courseId={id} onEdit={() => onEdit(module)} onDelete={() => onDeleteTargetChange(module)} />

      <ModuleDetailStats module={module} />

      <LearningItemsSection userRole={userRole} items={learningItems as any} onTogglePublish={handleTogglePublish} onDelete={handleDeleteItem} onOpen={handleOpenItem} slug={slug} courseId={id} moduleId={moduleId} />

      <FormDialog open={isFormOpen} onOpenChange={onFormOpenChange} title={editingModule ? 'Edit Modul' : 'Tambah Modul'} description={editingModule ? 'Ubah informasi modul' : 'Tambahkan modul baru'}>
        <ModuleFormDialog activeMitraId={activeMitraId} classGroupOptions={classGroupOptions} form={form} onSubmit={onSubmit} onOpenChange={onFormOpenChange} isSubmitting={isSubmitting} isEditing={Boolean(editingModule)} />
      </FormDialog>

      <ModuleDeleteDialog
        module={moduleToDelete}
        onOpenChange={(open) => {
          if (!open) {
            onDeleteTargetChange(null);
          }
        }}
        onConfirm={onDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
