import { Badge } from './Badge';
import type { MedicineStatus, VerificationStatus } from '../../lib/types';

const medicineStatusMap: Record<MedicineStatus, { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }> = {
  taken: { label: 'Taken', tone: 'success' },
  pending: { label: 'Pending', tone: 'neutral' },
  missed: { label: 'Missed', tone: 'danger' },
  overdue: { label: 'Overdue', tone: 'warning' },
};

const verificationStatusMap: Record<VerificationStatus, { label: string; tone: 'success' | 'danger' | 'warning' | 'neutral' | 'info' }> = {
  verified: { label: 'Verified', tone: 'success' },
  wrong: { label: 'Wrong Medicine', tone: 'danger' },
  expired: { label: 'Expired', tone: 'warning' },
  pending: { label: 'Awaiting Scan', tone: 'neutral' },
  skipped: { label: 'Skipped', tone: 'info' },
};

export function MedicineStatusBadge({ status }: { status: MedicineStatus }) {
  const s = medicineStatusMap[status];
  return (
    <Badge tone={s.tone} dot>
      {s.label}
    </Badge>
  );
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const s = verificationStatusMap[status];
  return (
    <Badge tone={s.tone} dot>
      {s.label}
    </Badge>
  );
}
