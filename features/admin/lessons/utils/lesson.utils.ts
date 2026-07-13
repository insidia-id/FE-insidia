import { LessonTypes } from '../types/lessons.types';
import { Video, FileText, Presentation, FileQuestion, ClipboardList } from 'lucide-react';

export function getLessonTypeIcon(type: LessonTypes) {
  switch (type) {
    case 'VIDEO':
      return Video;
    case 'ARTICLE':
      return FileText;
    case 'QUIZ':
      return FileQuestion;
    case 'ASSIGNMENT':
      return ClipboardList;
    case 'LIVE_SESSION':
      return Presentation;
    default:
      return FileText;
  }
}

export function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  return `${minutes}m`;
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
