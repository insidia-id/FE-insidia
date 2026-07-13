import { Video } from 'lucide-react';
import { LessonTypes } from '../types/lessons.types';

type LessonContentProps = {
  contentHtml?: string;
  typeLesson: LessonTypes;
};

export function LessonContent({ contentHtml, typeLesson }: LessonContentProps) {
  if (typeLesson === 'VIDEO') {
    return (
      <div className="space-y-4">
        <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
          <Video className="h-16 w-16 text-gray-600" />
        </div>
        {contentHtml && <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />}
      </div>
    );
  }

  if (!contentHtml) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Konten belum tersedia</p>
      </div>
    );
  }

  return <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />;
}
