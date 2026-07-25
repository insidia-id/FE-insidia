import type { MitraDashboardData } from '../types/mitra-dashboard.types';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { getActiveMitraContext } from '@/features/admin/user/HelperUser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, Building2, ArrowUpRight, UserCheck, BookOpen, DoorOpen, CalendarRange } from 'lucide-react';
import { DashboardAnalytics } from '@/components/common/DashboardAnalytics';
import { MiniSparkline } from '@/components/common/MiniSparkLine';

type MitraDashboardPageProps = {
  data: MitraDashboardData;
  currentProfile: AuthProfileResponse;
};

// Data Dummy Tren
const ruanganTrends = [{ value: 28 }, { value: 29 }, { value: 30 }, { value: 30 }, { value: 32 }];
const muridTrends = [{ value: 180 }, { value: 210 }, { value: 195 }, { value: 230 }, { value: 250 }];
const guruTrends = [{ value: 42 }, { value: 45 }, { value: 44 }, { value: 46 }, { value: 48 }];

// Data Dummy Tren Guru & Murid (Metrik)
const kehadiranTrends = [{ value: 92 }, { value: 95 }, { value: 94 }, { value: 98 }, { value: 98 }];
const kelasTrends = [{ value: 2 }, { value: 3 }, { value: 3 }, { value: 4 }, { value: 4 }];

// Import komponen client grafik

export function MitraDashboardPage({ data, currentProfile }: MitraDashboardPageProps) {
  const profile = currentProfile;
  const { activeInsidiaRole, activeMitraRole } = getActiveMitraContext(profile);
  const userRole = activeMitraRole ?? activeInsidiaRole;

  function getGreeting() {
    const currentHour = new Date().getUTCHours() + 7;
    const hourWIB = currentHour >= 24 ? currentHour - 24 : currentHour;
    if (hourWIB >= 4 && hourWIB < 11) return 'Pagi';
    if (hourWIB >= 11 && hourWIB < 15) return 'Siang';
    if (hourWIB >= 15 && hourWIB < 18) return 'Sore';
    return 'Malam';
  }

  const isGuru = activeMitraRole === 'GURU';
  const isMurid = activeMitraRole === 'MURID';

  const firstName = profile.name ? profile.name.split(' ')[0] : 'Pengguna';
  const greeting = getGreeting();

  return (
    <main className="min-h-screen w-full px-4 py-8 font-sans">
      <div className="mx-auto w-full px-4 space-y-8">
        <section className="flex flex-col pb-2">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
            Halo, Selamat {greeting} {firstName} 👋
          </h1>
          <p className="text-muted-foreground text-[10px] md:text-sm max-w-2xl">
            {isGuru
              ? 'Pantau jadwal mengajar, kehadiran, dan aktivitas akademik Anda hari ini.'
              : isMurid
                ? 'Pantau jadwal pelajaran, kehadiran, dan kalender akademik kamu hari ini.'
                : 'Kelola data akademik, akses pengguna, dan struktur akademik dari satu tempat.'}
          </p>
        </section>

        <section className={`grid gap-4 lg:gap-6 ${isGuru ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
          {isGuru ? (
            <>
              <Card className="rounded-2xl border border-gray-100/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.08)] transition-all duration-300">
                <CardHeader className="p-0 space-y-0">
                  <CardTitle className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Total Kehadiran</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#E6F8F0] flex items-center justify-center text-[#00C473] shrink-0">
                      <UserCheck className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-2xl font-bold text-gray-900 tracking-tight leading-none">98%</div>
                      <p className="text-[11px] font-semibold text-[#00C473] mt-1.5 flex items-center gap-0.5">
                        <ArrowUpRight className="h-3.5 w-3.5 stroke-[3]" /> Baik <span className="text-gray-400 font-medium ml-1">bulan ini</span>
                      </p>
                    </div>
                  </div>
                  <MiniSparkline data={kehadiranTrends} strokeColor="#00C473" type="line" id="kehadiran-guru" />
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-gray-100/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.08)] transition-all duration-300">
                <CardHeader className="p-0 space-y-0">
                  <CardTitle className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Total Kelas (Diampu)</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FFF3E5] flex items-center justify-center text-[#FF9933] shrink-0">
                      <BookOpen className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-2xl font-bold text-gray-900 tracking-tight leading-none">4</div>
                      <p className="text-[11px] font-semibold text-gray-500 mt-1.5 flex items-center gap-0.5">
                        <span className="font-medium ml-1">Kelas Aktif Semester ini</span>
                      </p>
                    </div>
                  </div>
                  <MiniSparkline data={kelasTrends} strokeColor="#FF9933" type="bar" id="kelas-guru" />
                </CardContent>
              </Card>
            </>
          ) : isMurid ? (
            /* =========================================
               CARD STATS KHUSUS MURID (3 Card)
               ========================================= */
            <>
              <Card className="col-span-2 md:col-span-1 rounded-2xl border border-gray-100/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.08)] transition-all duration-300">
                <CardHeader className="p-0 space-y-0">
                  <CardTitle className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Persentase Kehadiran</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#E6F8F0] flex items-center justify-center text-[#00C473] shrink-0">
                      <UserCheck className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-2xl font-bold text-gray-900 tracking-tight leading-none">95%</div>
                      <p className="text-[11px] font-semibold text-[#00C473] mt-1.5 flex items-center gap-0.5">
                        <span className="text-gray-400 font-medium">Bulan ini</span>
                      </p>
                    </div>
                  </div>
                  <MiniSparkline data={kehadiranTrends} strokeColor="#00C473" type="line" id="kehadiran-murid" />
                </CardContent>
              </Card>

              <Card className="col-span-1 rounded-2xl border border-gray-100/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.08)] transition-all duration-300">
                <CardHeader className="p-0 space-y-0">
                  <CardTitle className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Kelas Saat Ini</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#E5F1FD] flex items-center justify-center text-[#1A73E8] shrink-0">
                      <DoorOpen className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-2xl font-bold text-gray-900 tracking-tight leading-none">12-IPA 1</div>
                      <p className="text-[11px] font-semibold text-gray-400 mt-1.5 flex items-center gap-0.5">Tahun Ajaran 2026/2027</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1 rounded-2xl border border-gray-100/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.08)] transition-all duration-300">
                <CardHeader className="p-0 space-y-0">
                  <CardTitle className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Semester Aktif</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#ECE7FC] flex items-center justify-center text-[#7527D6] shrink-0">
                      <CalendarRange className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-2xl font-bold text-gray-900 tracking-tight leading-none">Semester 5</div>
                      <p className="text-[11px] font-semibold text-gray-400 mt-1.5 flex items-center gap-0.5">Periode Ganjil</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* =========================================
               CARD STATS ADMIN (3 Card Default)
               ========================================= */
            <>
              <Card className="col-span-2 md:col-span-1 rounded-2xl border border-gray-100/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.08)] transition-all duration-300">
                <CardHeader className="p-0 space-y-0">
                  <CardTitle className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Ruangan Kelas</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#ECE7FC] flex items-center justify-center text-[#7527D6] shrink-0">
                      <Building2 className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-2xl font-bold text-gray-900 tracking-tight leading-none">32</div>
                      <p className="text-[11px] font-semibold text-[#00C473] mt-1.5 flex items-center gap-0.5">
                        <ArrowUpRight className="h-3.5 w-3.5 stroke-[3]" /> +2
                        <span className="text-gray-400 font-medium ml-1">dari semester lalu</span>
                      </p>
                    </div>
                  </div>
                  <MiniSparkline data={ruanganTrends} strokeColor="#7527D6" type="line" id="ruangan-admin" />
                </CardContent>
              </Card>

              <Card className="col-span-1 rounded-2xl border border-gray-100/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.08)] transition-all duration-300">
                <CardHeader className="p-0 space-y-0">
                  <CardTitle className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Total Murid</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#E5F1FD] flex items-center justify-center text-[#1A73E8] shrink-0">
                      <GraduationCap className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-2xl font-bold text-gray-900 tracking-tight leading-none">250</div>
                      <p className="text-[11px] font-semibold text-[#00C473] mt-1.5 flex items-center gap-0.5">
                        <ArrowUpRight className="h-3.5 w-3.5 stroke-[3]" /> +8%
                        <span className="hidden sm:inline text-gray-400 font-medium ml-1">dari tahun lalu</span>
                      </p>
                    </div>
                  </div>
                  <MiniSparkline data={muridTrends} strokeColor="#1A73E8" type="bar" id="murid-admin" />
                </CardContent>
              </Card>

              <Card className="col-span-1 rounded-2xl border border-gray-100/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.08)] transition-all duration-300">
                <CardHeader className="p-0 space-y-0">
                  <CardTitle className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Total Guru</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#E8EBF9] flex items-center justify-center text-[#3B52D4] shrink-0">
                      <Users className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-2xl font-bold text-gray-900 tracking-tight leading-none">48</div>
                      <p className="text-[11px] font-semibold text-[#00C473] mt-1.5 flex items-center gap-0.5">
                        <ArrowUpRight className="h-3.5 w-3.5 stroke-[3]" /> +2%
                        <span className="hidden sm:inline text-gray-400 font-medium ml-1">dari tahun lalu</span>
                      </p>
                    </div>
                  </div>
                  <MiniSparkline data={guruTrends} strokeColor="#3B52D4" type="area" id="guru-admin" />
                </CardContent>
              </Card>
            </>
          )}
        </section>

        <DashboardAnalytics showSchedule={isGuru || isMurid} />
      </div>
    </main>
  );
}
