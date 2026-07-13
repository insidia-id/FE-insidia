'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Plus, ChevronLeft, ChevronRight, Clock, MapPin, BookOpen } from 'lucide-react';

interface DashboardAnalyticsProps {
  // Mengubah nama prop agar lebih relevan untuk Guru & Murid
  showSchedule?: boolean; 
}

const chartData = [
  { year: "2021", students: 70 },
  { year: "2022", students: 145 },
  { year: "2023", students: 180 },
  { year: "2024", students: 120 },
  { year: "2025", students: 250 },
];

const chartConfig = {
  students: { label: "Jumlah Murid", color: "#7527D6" },
};

const filterTypes = [
  { id: 'ujian', label: 'Ujian', bg: 'bg-[#FFEDED]', text: 'text-[#FF5B5B]', border: 'border-[#FF5B5B]', badgeBg: 'bg-[#FF5B5B]' },
  { id: 'tugas', label: 'Tugas', bg: 'bg-[#E6F8F0]', text: 'text-[#00C473]', border: 'border-[#00C473]', badgeBg: 'bg-[#00C473]' },
  { id: 'kegiatan', label: 'Kegiatan Sekolah', bg: 'bg-[#EFECF8]', text: 'text-[#6C4CE1]', border: 'border-[#6C4CE1]', badgeBg: 'bg-[#6C4CE1]' },
  { id: 'pengumuman', label: 'Pengumuman', bg: 'bg-[#FFF3E5]', text: 'text-[#FF9933]', border: 'border-[#FF9933]', badgeBg: 'bg-[#FF9933]' },
];

const dummyEvents: Record<number, { title: string; type: string; count?: number }[]> = {
  3: [{ title: 'Ujian Harian', type: 'ujian', count: 4 }, { title: 'Tugas Matematika', type: 'tugas', count: 7 }, { title: 'Rapat OSIS', type: 'kegiatan' }],
  10: [{ title: 'Penilaian Tengah Semester', type: 'ujian', count: 5 }, { title: 'Pengumpulan Tugas IPA', type: 'tugas', count: 3 }, { title: 'Lomba Kebersihan Kelas', type: 'kegiatan' }],
  17: [{ title: 'Libur Semester', type: 'pengumuman' }, { title: 'Pembagian Rapor', type: 'pengumuman' }],
  22: [{ title: 'Presentasi Kelompok B. Indo', type: 'tugas' }, { title: 'Ekskul Pramuka', type: 'kegiatan' }],
  28: [{ title: 'Ujian Akhir Semester', type: 'ujian', count: 6 }, { title: 'Pengumpulan Proyek P5', type: 'tugas' }, { title: 'Upacara Bendera', type: 'kegiatan' }]
};

const upcomingClasses = [
  { id: 1, mapel: "Matematika Lanjut", time: "08:00 - 09:30 WIB", room: "Kelas 12-IPA 1", status: "Sedang Berlangsung" },
  { id: 2, mapel: "Fisika Dasar", time: "10:00 - 11:30 WIB", room: "Laboratorium IPA", status: "Mendatang" },
  { id: 3, mapel: "Matematika Dasar", time: "13:00 - 14:30 WIB", room: "Kelas 10-A", status: "Mendatang" },
];

export function DashboardAnalytics({ showSchedule }: DashboardAnalyticsProps) {
  const daysOfWeek = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 items-start">
      
      {/* KONDISIONAL BERDASARKAN PROPS showSchedule */}
      {showSchedule ? (
        <Card className="flex flex-col h-[480px] rounded-2xl border-border/40 shadow-sm transition-all duration-300 hover:shadow-md bg-white">
          <CardHeader className="shrink-0 pb-4 border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">Jadwal Kelas Hari Ini</CardTitle>
            <CardDescription>Daftar mata pelajaran yang ada pada jadwal Anda hari ini.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-200">
            {upcomingClasses.map((cls) => (
              <div key={cls.id} className="flex items-start justify-between p-4 rounded-xl border border-gray-100 hover:border-[#7527D6]/30 bg-gray-50/50 hover:bg-[#F9F7FF] transition-all group">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-white shadow-sm border border-gray-100 group-hover:text-[#7527D6]">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-gray-900">{cls.mapel}</h4>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {cls.time}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {cls.room}
                    </div>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                    cls.status === 'Sedang Berlangsung' 
                      ? 'bg-green-50 text-green-600 border-green-200' 
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {cls.status}
                  </span>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2 text-sm text-[#7527D6] border-[#7527D6]/20 hover:bg-[#7527D6]/5">
              Lihat Semua Jadwal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="flex flex-col h-[480px] rounded-2xl border-border/40 shadow-sm transition-all duration-300 hover:shadow-md">
          <CardHeader className="shrink-0 pb-2">
            <CardTitle className="text-lg font-semibold">Analitik Jumlah Murid</CardTitle>
            <CardDescription>Perbandingan akumulasi pertumbuhan jumlah murid dari tahun ke tahun.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 pb-6">
            <ChartContainer config={chartConfig} className="h-full w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7527D6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#11DCCE" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: 'currentColor', opacity: 0.6, fontSize: 12 }} dy={10} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: 'currentColor', opacity: 0.6, fontSize: 12 }} />
                  <ChartTooltip cursor={{ stroke: '#7527D6', strokeWidth: 1, strokeDasharray: '4 4' }} content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="students" stroke="#7527D6" strokeWidth={2.5} fill="url(#chartGradient)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* 2. Card Kalender Akademik (Tampil untuk Semua) */}
      <Card className="flex flex-col h-[480px] rounded-2xl border-border/40 shadow-sm transition-all duration-300 hover:shadow-md bg-white overflow-hidden">
        
        {/* Top Header Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-100 bg-[#FAFAFA]/50 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Kalender Akademik</h2>
          
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            <div className="hidden sm:flex bg-gray-100/80 p-1 rounded-lg border border-gray-200/60">
              <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 rounded-md transition-colors">Day</button>
              <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 rounded-md transition-colors">Week</button>
              <button className="px-3 py-1 text-xs font-medium bg-[#18CBC1] text-white rounded-md shadow-sm">Month</button>
            </div>
            
            <Button className="bg-[#721EF1] hover:bg-[#721EF1]/90 text-white rounded-lg shadow-sm border-0 h-8 px-3 text-xs">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Event
            </Button>
          </div>
        </div>

        {/* Calendar Grid Area */}
        <CardContent className="flex-1 p-3 bg-white flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-2 shrink-0 px-1">
            <h3 className="text-base font-bold text-gray-900">August 2026</h3>
            <div className="flex gap-1.5">
              <Button variant="outline" size="icon" className="h-7 w-7 rounded-md border-gray-200 hover:bg-gray-50 text-gray-600">
                <ChevronLeft className="h-3.5 w-3.5"/>
              </Button>
              <Button variant="outline" size="icon" className="h-7 w-7 rounded-md border-gray-200 hover:bg-gray-50 text-gray-600">
                <ChevronRight className="h-3.5 w-3.5"/>
              </Button>
            </div>
          </div>

          <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden bg-white min-w-[500px] xl:min-w-0">
            <div className="grid grid-cols-7 grid-rows-5 gap-px bg-gray-200 h-full">
              {Array.from({ length: 35 }).map((_, idx) => {
                const day = idx + 1;
                const isCurrentMonth = day <= 31;
                const displayDay = isCurrentMonth ? day : day - 31;
                
                const dayEvents = isCurrentMonth ? (dummyEvents[displayDay] || []) : [];
                const isToday = displayDay === 10 && isCurrentMonth;
                const dayName = idx < 7 ? daysOfWeek[idx] : null;

                return (
                  <div key={idx} className="min-h-[50px] p-1.5 flex flex-col gap-0.5 transition-colors bg-white hover:bg-gray-50/50 overflow-hidden">
                    <div className="flex justify-between items-start mb-0.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                          isToday ? 'bg-black text-white' : isCurrentMonth ? 'text-gray-900' : 'text-gray-300 font-medium'
                        }`}>
                          {displayDay}
                        </span>
                      </div>
                      {dayName && <span className="text-[9px] font-medium text-gray-400 mt-0.5 hidden sm:block">{dayName}</span>}
                    </div>

                    <div className="flex flex-col gap-0.5 overflow-y-auto scrollbar-none pb-1">
                      {dayEvents.slice(0, 2).map((evt, i) => {
                        const style = filterTypes.find(f => f.id === evt.type) || filterTypes[0];
                        return (
                          <div key={i} className={`flex items-center justify-between px-1.5 py-0.5 rounded text-[9px] font-medium border-l-2 ${style.bg} ${style.border} ${style.text}`} title={evt.title}>
                            <span className="truncate pr-1 leading-tight">{evt.title}</span>
                            {evt.count && <span className={`flex-shrink-0 px-1 rounded text-white text-[8px] font-bold ${style.badgeBg}`}>{evt.count}</span>}
                          </div>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <div className="text-[8px] text-muted-foreground font-semibold pl-1">
                          +{dayEvents.length - 2} lagi
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
      
    </section>
  );
}