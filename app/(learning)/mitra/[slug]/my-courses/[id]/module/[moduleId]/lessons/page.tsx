'use client';

import { LessonsPage } from '@/features/admin/lessons/pages/LessonsPage';

type PageProps = {
  params: Promise<{
    slug: string;
    id: string;
    moduleId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { slug, id, moduleId } = await params;
  return <LessonsPage params={params} />;
}
