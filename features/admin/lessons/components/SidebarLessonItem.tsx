import { CheckCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LearningItem } from '@/features/admin/learning-items/types/learnig-items.type';

type SidebarLessonItemProps = {
  lesson: LearningItem;
  currentLessonId: string | null;
  moduleIndex: number;
  lessonIndex: number;
  onSelect: (lessonId: string) => void;
};

export function SidebarLessonItem({ lesson, currentLessonId, moduleIndex, lessonIndex, onSelect }: SidebarLessonItemProps) {
  const isActive = lesson.id === currentLessonId;
  const isCompleted = false;
  const isLocked = lesson.locked || false;

  return (
    <button
      onClick={() => !isLocked && onSelect(lesson.id)}
      className={cn(
        'w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8557E5]',
        isActive ? 'bg-[#8557E5]/10 text-[#8557E5] shadow-sm' : 'hover:bg-gray-50 text-gray-700',
        isLocked && 'opacity-60 cursor-not-allowed hover:bg-transparent',
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn('flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mt-0.5 transition-all', isActive ? 'bg-[#8557E5] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200')}>
          {isCompleted ? <CheckCircle className="h-3.5 w-3.5" /> : `${moduleIndex + 1}.${lessonIndex + 1}`}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium truncate', isActive ? 'text-[#8557E5]' : 'text-gray-700 group-hover:text-gray-900')}>{lesson.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={cn('text-xs', isActive ? 'text-[#8557E5]/70' : 'text-gray-400')}>LESSON</span>
            {isLocked && <Lock className="h-3 w-3 text-gray-400" />}
          </div>
        </div>
        {isActive && <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#8557E5]" />}
      </div>
    </button>
  );
}
