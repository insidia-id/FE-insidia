'use client';

import { Grid3x3, List, Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type MyCoursesSearchProps = {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
};

export function MyCoursesSearch({ globalFilter, onGlobalFilterChange, viewMode, setViewMode }: MyCoursesSearchProps) {
  return (
    <div className="flex bg-white border border-gray-300 my-4 p-4 rounded-xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

        <Input
          value={globalFilter}
          onChange={(e) => onGlobalFilterChange(e.target.value)}
          placeholder="Cari mata pelajaran..."
          className="h-11 rounded-xl border-gray-300 bg-white pl-10 pr-10 transition-colors focus:border-[#8557E5]"
        />

        {globalFilter && (
          <Button variant="ghost" size="icon" onClick={() => onGlobalFilterChange('')} className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full">
            <X className="h-4 w-4 text-gray-500" />
          </Button>
        )}
      </div>

      <div className="hidden sm:flex items-center justify-end">
        <div className="inline-flex rounded-xl border bg-gray-50 p-1">
          <Button variant="ghost" size="icon" onClick={() => setViewMode('grid')} className={cn('h-9 w-9 rounded-lg transition-all', viewMode === 'grid' ? 'bg-white text-[#8557E5] shadow-sm' : 'text-gray-500 hover:text-gray-900')}>
            <Grid3x3 className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setViewMode('list')} className={cn('h-9 w-9 rounded-lg transition-all', viewMode === 'list' ? 'bg-white text-[#8557E5] shadow-sm' : 'text-gray-500 hover:text-gray-900')}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
