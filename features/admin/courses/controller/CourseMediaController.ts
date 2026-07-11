import { useEffect, useMemo, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDeleteMedia, useGetCourseMedia, useGetCourseModules, useUpdateMedia, useUploadCourseMedia, useUploadModuleMedia } from '../hooks/useCourses';
import { mediaMetadataFormSchema, mediaUploadFormSchema, type MediaMetadataFormValues, type MediaUploadFormValues } from '../schema/course.schema';
import type { CourseMedia } from '../types/course.types';

const metadataDefaults: MediaMetadataFormValues = {
  alt: null,
  caption: null,
  sortOrder: 0,
  isPrimary: false,
};

function toMetadataFormValues(media?: CourseMedia | null): MediaMetadataFormValues {
  if (!media) {
    return metadataDefaults;
  }

  return {
    alt: media.alt,
    caption: media.caption,
    sortOrder: media.sortOrder,
    isPrimary: media.isPrimary,
  };
}

export function CourseMediaController(courseId: string) {
  const { data: media = [], isLoading, isError, error } = useGetCourseMedia(courseId);
  const { data: modules = [] } = useGetCourseModules(courseId);
  const uploadCourseMutation = useUploadCourseMedia(courseId);
  const uploadModuleMutation = useUploadModuleMedia(courseId);
  const updateMediaMutation = useUpdateMedia(courseId);
  const deleteMediaMutation = useDeleteMedia(courseId);
  const [editingMedia, setEditingMedia] = useState<CourseMedia | null>(null);
  const [mediaToDelete, setMediaToDelete] = useState<CourseMedia | null>(null);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<'COURSE' | 'MODULE'>('COURSE');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');

  const uploadForm = useForm<MediaUploadFormValues, unknown, MediaUploadFormValues>({
    resolver: zodResolver(mediaUploadFormSchema) as Resolver<MediaUploadFormValues>,
    defaultValues: {
      file: undefined as unknown as File,
      type: undefined,
      alt: null,
      caption: null,
      sortOrder: 0,
      isPrimary: false,
    },
  });

  const metadataForm = useForm<MediaMetadataFormValues, unknown, MediaMetadataFormValues>({
    resolver: zodResolver(mediaMetadataFormSchema) as Resolver<MediaMetadataFormValues>,
    defaultValues: metadataDefaults,
  });

  useEffect(() => {
    metadataForm.reset(toMetadataFormValues(editingMedia));
  }, [editingMedia, metadataForm]);

  const groupedMedia = useMemo(
    () => ({
      course: media.filter((item) => item.ownerType === 'COURSE'),
      module: media.filter((item) => item.ownerType === 'MODULE'),
    }),
    [media],
  );

  const onUploadSubmit = (data: MediaUploadFormValues) => {
    if (uploadTarget === 'MODULE') {
      uploadModuleMutation.mutate(
        {
          moduleId: selectedModuleId,
          data,
        },
        {
          onSuccess: () => {
            uploadForm.reset({
              file: undefined as unknown as File,
              type: undefined,
              alt: null,
              caption: null,
              sortOrder: 0,
              isPrimary: false,
            });
          },
        },
      );

      return;
    }

    uploadCourseMutation.mutate(data, {
      onSuccess: () => {
        uploadForm.reset({
          file: undefined as unknown as File,
          type: undefined,
          alt: null,
          caption: null,
          sortOrder: 0,
          isPrimary: false,
        });
      },
    });
  };

  const onEdit = (mediaItem: CourseMedia) => {
    setEditingMedia(mediaItem);
    setIsMetadataOpen(true);
  };

  const onMetadataSubmit = (data: MediaMetadataFormValues) => {
    if (!editingMedia) {
      return;
    }

    updateMediaMutation.mutate(
      { mediaId: editingMedia.id, data },
      {
        onSuccess: () => {
          setIsMetadataOpen(false);
          setEditingMedia(null);
        },
      },
    );
  };

  const onDelete = () => {
    if (!mediaToDelete) {
      return;
    }

    deleteMediaMutation.mutate(mediaToDelete.id, {
      onSuccess: () => {
        setMediaToDelete(null);
      },
    });
  };

  return {
    media,
    modules,
    groupedMedia,
    uploadForm,
    metadataForm,
    uploadTarget,
    selectedModuleId,
    editingMedia,
    mediaToDelete,
    isLoading,
    isError,
    error,
    isMetadataOpen,
    isUploading: uploadCourseMutation.isPending || uploadModuleMutation.isPending,
    isUpdating: updateMediaMutation.isPending,
    isDeleting: deleteMediaMutation.isPending,
    onUploadSubmit,
    onEdit,
    onDelete,
    onUploadTargetChange: setUploadTarget,
    onSelectedModuleChange: setSelectedModuleId,
    onMetadataSubmit,
    onMetadataOpenChange: setIsMetadataOpen,
    onDeleteTargetChange: setMediaToDelete,
  };
}
