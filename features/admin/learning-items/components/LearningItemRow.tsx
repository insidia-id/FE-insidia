'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BookOpen, FileQuestion, ClipboardList, MoreHorizontal, Eye, EyeOff, Trash2, ArrowUpRight, Clock, Lock, Unlock, Calendar } from 'lucide-react';
import { LearningItem, LearningItemType } from '../types/learnig-items.type';
import { formatDate } from '@/lib/helper/normalizer.helper';
import { cn } from '@/lib/utils';
import { formatLearningItemDuration, getAvailabilityBadge, getAvailabilityStatus } from '../helper/learning-items.helper';
import { useRouter } from 'next/navigation';

type LearningItemRowProps = {
  item: LearningItem;
  onTogglePublish: (itemId: string, isPublished: boolean) => void;
  onDelete: (learningItemId: string, itemId: string) => void;
  onOpen: (itemId: string, type: LearningItemType) => void;
  index?: number;
  duration?: number;
};

const typeIcons = {
  LESSON: <BookOpen className="h-4 w-4" />,
  QUIZ: <FileQuestion className="h-4 w-4" />,
  ASSIGNMENT: <ClipboardList className="h-4 w-4" />,
};

const typeColors = {
  LESSON: 'bg-blue-50 text-blue-600 border-blue-100',
  QUIZ: 'bg-amber-50 text-amber-600 border-amber-100',
  ASSIGNMENT: 'bg-green-50 text-green-600 border-green-100',
};

const typeBadgeColors = {
  LESSON: 'bg-blue-50 text-blue-700 border-blue-200',
  QUIZ: 'bg-amber-50 text-amber-700 border-amber-200',
  ASSIGNMENT: 'bg-green-50 text-green-700 border-green-200',
};

const typeLabels = {
  LESSON: 'Materi',
  QUIZ: 'Kuis',
  ASSIGNMENT: 'Tugas',
};

export function LearningItemRow({ item, onTogglePublish, onDelete, onOpen }: LearningItemRowProps) {
  const isLocked = item.locked || false;
  const duration = formatLearningItemDuration(item.availableFrom, item.availableUntil);
  const availableFrom = item.availableFrom ? new Date(item.availableFrom) : null;
  const availableUntil = item.availableUntil ? new Date(item.availableUntil) : null;
  const { willBeAvailable, expired, available } = getAvailabilityStatus(availableFrom, availableUntil);
  const availabilityBadge = getAvailabilityBadge(willBeAvailable, expired, available, availableFrom);

  return (
    <div
      className={cn(
        'group relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all duration-200 bg-white',
        isLocked ? 'border-gray-100 opacity-60 hover:border-gray-200' : 'border-gray-100 hover:border-[#8557E5]/30 hover:shadow-md hover:bg-gray-50/50',
      )}
    >
      <div className="hidden sm:flex flex-shrink-0">
        <div
          className={cn(
            'h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
            isLocked ? 'bg-gray-100 text-gray-400' : 'bg-[#8557E5]/10 text-[#8557E5] group-hover:bg-[#8557E5] group-hover:text-white',
          )}
        >
          {item.order}
        </div>
      </div>

      <div className={cn('flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center transition-all', typeColors[item.type], isLocked && 'opacity-50')}>{typeIcons[item.type]}</div>

      <div className="flex-1 min-w-0 w-full sm:w-auto">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-0.5">
          <h4 className={cn('text-sm font-medium truncate transition-colors flex-1 min-w-[120px]', isLocked ? 'text-gray-500' : 'text-gray-900 group-hover:text-[#8557E5]')}>{item.title}</h4>
          <Badge variant="outline" className={cn('text-xs font-normal shrink-0', typeBadgeColors[item.type])}>
            {typeLabels[item.type]}
          </Badge>
          {isLocked ? (
            <Badge variant="outline" className="text-xs text-gray-400 border-gray-200 bg-gray-50 shrink-0">
              <Lock className="h-3 w-3 mr-1" />
              <span className="hidden xs:inline">Terkunci</span>
            </Badge>
          ) : (
            <Badge
              variant={item.published ? 'default' : 'secondary'}
              className={cn('text-xs shrink-0', item.published ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-50')}
            >
              {item.published ? (
                <>
                  <Eye className="h-3 w-3 mr-1" />
                  <span className="hidden xs:inline">Published</span>
                  <span className="xs:hidden">Published</span>
                </>
              ) : (
                <>
                  <EyeOff className="h-3 w-3 mr-1" />
                  <span className="hidden xs:inline">Draft</span>
                  <span className="xs:hidden">Draft</span>
                </>
              )}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1 shrink-0">
            <Calendar className="h-3 w-3" />
            <span className="hidden xs:inline">update</span>
            {formatDate(item.updatedAt)}
          </span>
          {duration !== '-' && available && (
            <span className="flex items-center gap-1 shrink-0">
              <Clock className="h-3 w-3" />
              {duration}
            </span>
          )}
          <span className="shrink-0">{availabilityBadge}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0 w-full sm:w-auto justify-end sm:justify-start mt-2 sm:mt-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpen(item.id, item.type)}
          className={cn(
            'gap-1.5 rounded-xl px-2 sm:px-3 transition-all flex-1 sm:flex-none justify-center',
            isLocked ? 'text-gray-400 hover:text-gray-400 hover:bg-gray-50 cursor-not-allowed' : 'text-[#8557E5] hover:text-[#6f44c9] hover:bg-[#8557E5]/10',
          )}
          disabled={isLocked}
        >
          <ArrowUpRight className="h-4 w-4" />
          <span className="sm:inline">Buka</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 shrink-0" disabled={isLocked}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl border-gray-100 shadow-lg">
            <DropdownMenuItem onClick={() => onTogglePublish(item.id, item.published)} disabled={isLocked} className="gap-2 cursor-pointer">
              {item.published ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span>Unpublish</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>Publish</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(item.id, item.lessonsId ?? item.quizId ?? item.assignmentId ?? '')} className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer" disabled={isLocked}>
              <Trash2 className="h-4 w-4" />
              <span>Hapus</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
