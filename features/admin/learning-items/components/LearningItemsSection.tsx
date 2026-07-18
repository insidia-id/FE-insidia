'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, BookOpen, FileQuestion, ClipboardList } from 'lucide-react';
import { LearningItem, LearningItemType } from '../types/learnig-items.type';
import { LearningItemRow } from './LearningItemRow';
import Link from 'next/link';
import { UserRoleCode } from '@/features/admin/user/types/user.types';
import { toast } from 'sonner';
type LearningItemsSectionProps = {
  items: LearningItem[];
  onTogglePublish: (itemId: string, isPublished: boolean) => void;
  onDelete: (LearningItemId: string, itemId: string) => void;
  onOpen: (itemId: string, type: LearningItemType) => void;
  slug: string;
  courseId: string;
  moduleId: string;
  userRole: UserRoleCode | null;
};

export function LearningItemsSection({ items, onTogglePublish, onDelete, onOpen, slug, courseId, moduleId, userRole }: LearningItemsSectionProps) {
  const sortedItems = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Item Pembelajaran</h2>
        {userRole !== 'MURID' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="insidia" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Item
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/mitra/${slug}/my-courses/${courseId}/module/${moduleId}/lessons/create`} className="cursor-pointer">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Materi
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/mitra/${slug}/my-courses/${courseId}/module/${moduleId}/quiz/create`} className="cursor-pointer">
                  <FileQuestion className="mr-2 h-4 w-4" />
                  Kuis
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/mitra/${slug}/my-courses/${courseId}/module/${moduleId}/assignment/create`} className="cursor-pointer">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Tugas
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="p-4">
        {sortedItems.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Tidak ada Item Pembelajaran</h3>
            <p className="text-sm text-gray-500 mb-4">Belum ada item pembelajaran yang ditambahkan.</p>
            {userRole !== 'MURID' && (
              <div className="flex flex-col sm:flex-row justify-center gap-2">
                <Link href={`/mitra/${slug}/my-courses/${courseId}/module/${moduleId}/lessons/create`}>
                  <Button variant="outline" size="sm">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Tambah Materi
                  </Button>
                </Link>
                <Button onClick={() => toast.warning('Fitur Kuis sedang dalam pengembangan')} variant="outline" size="sm">
                  <FileQuestion className="mr-2 h-4 w-4" />
                  Tambah Kuis
                </Button>
                <Button onClick={() => toast.warning('Fitur Tugas sedang dalam pengembangan')} variant="outline" size="sm">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Tambah Tugas
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedItems.map((item) => (
              <LearningItemRow key={item.id} item={item} onTogglePublish={onTogglePublish} onDelete={onDelete} onOpen={onOpen} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
