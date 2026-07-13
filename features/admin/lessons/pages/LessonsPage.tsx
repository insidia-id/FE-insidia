'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Menu, X, Maximize2, Minimize2, Share2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLessonsPage } from '../hooks/useLessonsPage';
import { SidebarLessonItem } from '../components/SidebarLessonItem';
import { LessonHeader } from '../components/LessonHeader';
import { LessonContent } from '../components/LessonContent';
import { LessonAttachments } from '../components/LessonAttachments';
import { LoadingState } from '../components/LoadingState';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, useSidebar } from '@/components/ui/sidebar';
type LessonsPageProps = {
  params: Promise<{
    slug: string;
    id: string;
    moduleId: string;
  }>;
};

export function LessonsPage({ params }: LessonsPageProps) {
  const resolvedParams = use(params);
  const { slug, id: courseId, moduleId } = resolvedParams;

  const { lessons, currentLesson, currentLearningItem, prevLesson, nextLesson, isLoading, isError, handleLessonSelect, toggleSidebar } = useLessonsPage({ courseId, moduleId, slug });

  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  const { openMobile, setOpenMobile } = useSidebar();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100 max-w-md w-full">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gagal Memuat Pelajaran</h3>
          <p className="text-gray-500 mb-6">Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-200 max-w-md w-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Pelajaran</h3>
          <p className="text-gray-500 mb-6">Modul ini belum memiliki pelajaran yang tersedia.</p>
          <Link href={`/mitra/${slug}/courses/${courseId}`}>
            <Button className="bg-[#8557E5] hover:bg-[#6f44c9] w-full">Kembali ke Course</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center md:ml-[250px] justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpenMobile(!openMobile)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Link href={`/mitra/${slug}/courses/${courseId}/module/${moduleId}`} className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-[#8557E5]">
                <ChevronLeft className="h-4 w-4" />
                <span>Kembali</span>
              </Button>
            </Link>
            <div>
              <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{currentLearningItem?.title || 'Memuat...'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 ">
            <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={handleToggleFullscreen}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)] z-50">
        <Sidebar side="left" variant="sidebar" collapsible="offcanvas" className="border-r">
          <SidebarHeader className="border-b">
            <div className="flex items-center justify-between p-4">
              <div>
                <h2 className="text-sm font-semibold">Daftar Pelajaran</h2>
                <p className="text-xs text-muted-foreground">{lessons.length} pelajaran</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Materi</SidebarGroupLabel>

              <SidebarGroupContent className="space-y-1">
                {lessons.map((lesson, lessonIdx) => (
                  <SidebarLessonItem key={lesson.id} lesson={lesson} currentLessonId={currentLearningItem?.id ?? null} moduleIndex={0} lessonIndex={lessonIdx} onSelect={handleLessonSelect} />
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t">
            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">0%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-0 bg-emerald-500" />
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto  py-6 space-y-6">
            <LessonHeader learningItem={currentLearningItem} lesson={currentLesson} />

            <div className="bg-white rounded-md  border border-gray-200 overflow-hidden">
              <div className="p-6">
                <LessonContent contentHtml={currentLesson?.contentHtml} typeLesson={currentLesson?.typeLesson || 'ARTICLE'} />
              </div>
            </div>

            <LessonAttachments />

            <div className="flex items-center justify-between gap-4 pt-4 pb-8">
              {prevLesson ? (
                <Button variant="outline" onClick={() => handleLessonSelect(prevLesson.id)} className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Pelajaran Sebelumnya</span>
                  <span className="sm:hidden">Sebelumnya</span>
                </Button>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Button onClick={() => handleLessonSelect(nextLesson.id)} className="bg-[#8557E5] hover:bg-[#6f44c9] gap-2">
                  <span className="hidden sm:inline">Pelajaran Selanjutnya</span>
                  <span className="sm:hidden">Selanjutnya</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Link href={`/mitra/${slug}/courses/${courseId}`}>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Selesai
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
