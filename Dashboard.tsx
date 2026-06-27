import {
  Pill,
  Clock,
  CheckCircle2,
  Activity,
  ShieldCheck,
  CalendarClock,
  ArrowRight,
  ScanLine,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MedicineStatusBadge, VerificationBadge } from '../components/ui/StatusBadge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ReminderModule } from '../components/reminder/ReminderModule';
import { quickStats } from '../lib/mockData';
import { cn, relativeTimeFromNow } from '../lib/utils';

export function Dashboard() {
  const { medicines, setPage, setActiveMedicine } = useApp();

  const taken = medicines.filter((m) => m.status === 'taken').length;
  const remaining = medicines.filter((m) => m.status === 'pending').length;
  const next = medicines.find((m) => m.status === 'pending') ?? null;

  const handleScan = (id: string) => {
    const med = medicines.find((m) => m.id === id);
    if (med) {
      setActiveMedicine(med);
      setPage('scan');
    }
  };

  return (
    <div className="space-y-6">
      {/* Greeting + reminder */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-ink-500 dark:text-ink-400">
                Good afternoon, Eleanor
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-ink-900 dark:text-white">
                You have {remaining} medicines remaining today
              </h2>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                {taken} verified · {remaining} pending · 0 missed today
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setPage('scan')} leftIcon={<ScanLine className="h-4 w-4" />}>
                Scan now
              </Button>
              <Button variant="outline" onClick={() => setPage('schedule')}>
                Schedule
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Weekly compliance
            </p>
            <Badge tone="success" dot>
              On track
            </Badge>
          </div>
          <p className="mt-3 font-display text-4xl font-bold text-ink-900 dark:text-white">
            {quickStats.weeklyCompliance}%
          </p>
          <div className="mt-3">
            <ProgressBar value={quickStats.weeklyCompliance} tone="success" size="md" />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-success-600">
            <TrendingUp className="h-3.5 w-3.5" /> +4% vs last week
          </div>
        </Card>
      </div>

      {/* Active reminder */}
      {next && (
        <ReminderModule medicine={next} />
      )}

      {/* Stat cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Today's Medicines"
          value={medicines.length}
          hint={`${taken} taken · ${remaining} remaining`}
          icon={<Pill className="h-6 w-6" />}
          tone="primary"
          progress={(taken / medicines.length) * 100}
        />
        <StatCard
          label="Next Medicine"
          value={next?.name ?? '—'}
          hint={next ? `${next.scheduledTime} · ${relativeTimeFromNow(next.scheduledTime)}` : 'All done'}
          icon={<Clock className="h-6 w-6" />}
          tone="warning"
        />
        <StatCard
          label="Upcoming Reminder"
          value={next ? next.scheduledTime : 'None'}
          hint={next ? next.dosage : 'No pending reminders'}
          icon={<CalendarClock className="h-6 w-6" />}
          tone="primary"
        />
        <StatCard
          label="Verification Success"
          value={`${quickStats.verificationSuccessRate}%`}
          hint={`${quickStats.totalScans} total scans`}
          icon={<ShieldCheck className="h-6 w-6" />}
          tone="success"
          progress={quickStats.verificationSuccessRate}
        />
      </div>

      {/* Quick stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat
          label="Medicines Taken Today"
          value={taken}
          icon={<CheckCircle2 className="h-5 w-5" />}
          tone="success"
        />
        <MiniStat
          label="Medicines Remaining"
          value={remaining}
          icon={<Pill className="h-5 w-5" />}
          tone="primary"
        />
        <MiniStat
          label="Missed Medicines"
          value={quickStats.missedThisWeek}
          icon={<AlertTriangle className="h-5 w-5" />}
          tone="danger"
        />
        <MiniStat
          label="Verification Success Rate"
          value={`${quickStats.verificationSuccessRate}%`}
          icon={<Activity className="h-5 w-5" />}
          tone="success"
        />
      </div>

      {/* Schedule table */}
      <Card>
        <CardHeader
          title="Today's Medicine Schedule"
          subtitle="Verify each medicine by scanning before intake"
          icon={<Pill className="h-5 w-5" />}
          action={
            <Button variant="outline" size="sm" onClick={() => setPage('schedule')}>
              View all
            </Button>
          }
        />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-xs uppercase tracking-wider text-ink-500 dark:border-ink-800">
                <th className="px-5 py-3 font-semibold">Medicine</th>
                <th className="px-5 py-3 font-semibold">Time</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Verification</th>
                <th className="px-5 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50 dark:divide-ink-800/60">
              {medicines.map((m) => (
                <tr
                  key={m.id}
                  className="group transition-colors hover:bg-ink-50/60 dark:hover:bg-ink-800/40"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-xl',
                          m.color === 'primary' && 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300',
                          m.color === 'success' && 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-300',
                          m.color === 'warning' && 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-300',
                          m.color === 'danger' && 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-300',
                        )}
                      >
                        <Pill className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-ink-900 dark:text-white">{m.name}</p>
                        <p className="text-xs text-ink-500">{m.dosage} · {m.form}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-mono font-semibold text-ink-800 dark:text-ink-100">
                      {m.scheduledTime}
                    </p>
                    <p className="text-xs text-ink-500">{relativeTimeFromNow(m.scheduledTime)}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <MedicineStatusBadge status={m.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <VerificationBadge status={m.verification} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {m.status === 'taken' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-600">
                        <CheckCircle2 className="h-4 w-4" /> Done
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleScan(m.id)}
                        rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                      >
                        Scan
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

interface MiniStatProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  tone: 'primary' | 'success' | 'danger';
}

function MiniStat({ label, value, icon, tone }: MiniStatProps) {
  const toneBg = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300',
    success: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-300',
    danger: 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-300',
  }[tone];
  return (
    <Card hover className="flex items-center gap-3 p-4">
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', toneBg)}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-ink-500 dark:text-ink-400">{label}</p>
        <p className="font-display text-xl font-bold text-ink-900 dark:text-white">{value}</p>
      </div>
    </Card>
  );
}
