'use client';

import { BookOpen, FileQuestion, ClipboardList, LayoutList } from 'lucide-react';
import { CourseModule } from '../types/courses-module.types';

type ModuleDetailStatsProps = {
  module: CourseModule;
};

const colorMap = {
  purple: 'bg-purple-50 border-purple-100',
  blue: 'bg-blue-50 border-blue-100',
  amber: 'bg-amber-50 border-amber-100',
  green: 'bg-green-50 border-green-100',
};

type StatsCardProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: keyof typeof colorMap;
};

function StatsCard({ label, value, icon, color }: StatsCardProps) {
  return (
    <div className={`rounded-xl border p-4 flex items-center gap-4 ${colorMap[color]}`}>
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-600">{label}</p>
      </div>
    </div>
  );
}

export function ModuleDetailStats({ module }: ModuleDetailStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard label="Total Items" value={module.totalLearningItems ?? 0} icon={<LayoutList className="h-5 w-5 text-purple-600" />} color="purple" />
      <StatsCard label="Lessons" value={module.totalLessons ?? 0} icon={<BookOpen className="h-5 w-5 text-blue-600" />} color="blue" />
      <StatsCard label="Quizzes" value={module.totalQuizzes ?? 0} icon={<FileQuestion className="h-5 w-5 text-amber-600" />} color="amber" />
      <StatsCard label="Assignments" value={module.totalAssignments ?? 0} icon={<ClipboardList className="h-5 w-5 text-green-600" />} color="green" />
    </div>
  );
}
