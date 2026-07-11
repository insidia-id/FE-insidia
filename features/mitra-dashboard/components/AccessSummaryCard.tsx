import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getMitraName } from '../lib/mitra-dashboard.helper';
import { SummaryRow } from './SummaryRow';
import type { MitraDashboardData } from '../types/mitra-dashboard.types';

type AccessSummaryCardProps = Pick<MitraDashboardData, 'userLabel' | 'activeMitraRole' | 'roleCode' | 'accountStatus'>;

export function AccessSummaryCard({ userLabel, activeMitraRole, roleCode, accountStatus }: AccessSummaryCardProps) {
  return (
    <Card className="border-border/70 bg-white/90 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Ringkasan Akses</CardTitle>
        <CardDescription>Identitas akun dan konteks mitra aktif.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <SummaryRow label="User" value={userLabel} />
        <SummaryRow label="Role Aktif" value={roleCode.replace('_', ' ')} />
        <SummaryRow label="Mitra" value={getMitraName(activeMitraRole.mitraName)} />
        <SummaryRow label="Status Akun" value={accountStatus} />
      </CardContent>
    </Card>
  );
}
