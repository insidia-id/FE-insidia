import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Calendar, Clock } from 'lucide-react';
import { LearningItem } from '@/features/admin/learning-items/types/learnig-items.type';
import { Lesson } from '../types/lessons.types';
import { getLessonTypeIcon, formatDate } from '../utils/lesson.utils';

type LessonHeaderProps = {
  learningItem?: LearningItem;
  lesson?: Lesson;
};

export function LessonHeader({ learningItem, lesson }: LessonHeaderProps) {
  if (!learningItem) return null;

  const TypeIcon = getLessonTypeIcon(lesson?.typeLesson || 'ARTICLE');

  return (
    <div className="bg-white rounded-md  border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-[#8557E5]/10 flex items-center justify-center flex-shrink-0">
          <TypeIcon className="h-5 w-5 text-[#8557E5]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{learningItem.title}</h1>
            {lesson?.typeLesson && <Badge className="bg-[#8557E5]/10 text-[#8557E5] border-0">{lesson.typeLesson}</Badge>}
            {learningItem.published ? (
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <Eye className="h-3 w-3 mr-1" />
                Published
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-50 text-gray-500 border-gray-200">
                <EyeOff className="h-3 w-3 mr-1" />
                Draft
              </Badge>
            )}
          </div>
          {learningItem.description && <p className="text-gray-600 text-sm">{learningItem.description}</p>}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Diperbarui {formatDate(learningItem.updatedAt)}
            </span>
            {learningItem.availableFrom && (
              <span className="flex items-center gap-1 text-amber-600">
                <Clock className="h-3.5 w-3.5" />
                Tersedia {formatDate(learningItem.availableFrom)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
