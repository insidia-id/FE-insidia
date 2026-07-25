import { BookOpen, Clock, Users } from 'lucide-react';
import { formatDuration } from '../lib/MyCourses.helper';
import { cn } from '@/lib/utils';
interface CourseStatsProps {
  stats: {
    totalClassGroupCourses: number;
  };
}

export function CourseStats({ stats }: CourseStatsProps) {
  const statItems = [
    {
      label: 'Total Mata Pelajaran',
      value: stats.totalClassGroupCourses,
      icon: BookOpen,
      color: 'text-[#8557E5] bg-[#8557E5]/10',
    },
    {
      label: 'Total Pelajaran',
      value: '0',
      icon: Users,
      color: 'text-blue-500 bg-blue-50',
    },
    {
      label: 'Total Durasi',
      value: '0',
      icon: Clock,
      color: 'text-green-500 bg-green-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white rounded-2xl border border-gray-300 p-4 sm:p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
            </div>
            <div className={cn('p-2.5 rounded-xl', item.color)}>
              <item.icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
