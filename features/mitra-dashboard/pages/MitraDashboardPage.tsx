import { AccessSummaryCard } from '../components/AccessSummaryCard';
import { AcademicSummaryCard } from '../components/AcademicSummaryCard';
import { MitraDashboardHero } from '../components/MitraDashboardHero';
import { MyClassesCard } from '../components/MyClassesCard';
import { MySubjectsCard } from '../components/MySubjectsCard';
import type { MitraDashboardData } from '../types/mitra-dashboard.types';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { getActiveMitraContext } from '@/features/admin/user/HelperUser';

type MitraDashboardPageProps = {
  data: MitraDashboardData;
  currentProfile: AuthProfileResponse;
};

export function MitraDashboardPage({ data, currentProfile }: MitraDashboardPageProps) {
  const { activeInsidiaRole, activeMitraRole } = getActiveMitraContext(currentProfile);
  const userRole = activeMitraRole ?? activeInsidiaRole;
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(15,23,42,0.04),rgba(15,23,42,0)_32%),linear-gradient(135deg,rgba(249,115,22,0.08),rgba(14,165,233,0.08))] px-4 py-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <MitraDashboardHero slug={data.slug} activeMitraRole={data.activeMitraRole} roleCode={data.roleCode} isAcademicAdmin={data.isAcademicAdmin} />

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <AccessSummaryCard userLabel={data.userLabel} activeMitraRole={data.activeMitraRole} roleCode={data.roleCode} accountStatus={data.accountStatus} />
          <AcademicSummaryCard roleCode={data.roleCode} overview={data.academicOverview} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <MyClassesCard roleCode={data.roleCode} overview={data.academicOverview} />
          <MySubjectsCard overview={data.academicOverview} slug={data.slug} userRole={userRole} />
        </div>
      </section>
    </main>
  );
}
