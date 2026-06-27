import { useMemo, useState } from 'react';
import {
  History as HistoryIcon,
  Search,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  SkipForward,
  Pill,
  CalendarDays,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn, downloadCsv, formatDate } from '../lib/utils';
import type { VerificationStatus } from '../lib/types';

const statusConfig: Record<
  VerificationStatus,
  { label: string; tone: 'success' | 'danger' | 'warning' | 'info' | 'neutral'; icon: typeof CheckCircle2 }
> = {
  verified: { label: 'Verified', tone: 'success', icon: CheckCircle2 },
  wrong: { label: 'Wrong Medicine', tone: 'danger', icon: XCircle },
  expired: { label: 'Expired', tone: 'warning', icon: AlertTriangle },
  skipped: { label: 'Skipped', tone: 'info', icon: SkipForward },
  pending: { label: 'Pending', tone: 'neutral', icon: Clock },
};

export function History() {
  const { history } = useApp();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | VerificationStatus>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all');

  const filtered = useMemo(() => {
    return history.filter((h) => {
      if (statusFilter !== 'all' && h.status !== statusFilter) return false;
      if (dateFilter !== 'all') {
        const entryDate = new Date(h.date);
        const now = new Date();
        const diffDays = (now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
        if (dateFilter === 'today' && diffDays > 1) return false;
        if (dateFilter === 'week' && diffDays > 7) return false;
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          h.medicine.toLowerCase().includes(q) ||
          h.remarks.toLowerCase().includes(q) ||
          (h.detectedName ?? '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [history, query, statusFilter, dateFilter]);

  const counts = useMemo(() => {
    return {
      verified: history.filter((h) => h.status === 'verified').length,
      wrong: history.filter((h) => h.status === 'wrong').length,
      expired: history.filter((h) => h.status === 'expired').length,
      skipped: history.filter((h) => h.status === 'skipped').length,
    };
  }, [history]);

  const handleExport = () => {
    const rows = filtered.map((h) => ({
      Date: h.date,
      Medicine: h.medicine,
      Dosage: h.dosage,
      ScheduledTime: h.scheduledTime,
      VerificationTime: h.verificationTime,
      Status: h.status,
      Detected: h.detectedName ?? '',
      Expiry: h.expiryDate ?? '',
      Confidence: h.confidence ?? '',
      Remarks: h.remarks,
    }));
    downloadCsv('medisense-history.csv', rows);
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Verified" value={counts.verified} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <SummaryCard label="Wrong Medicine" value={counts.wrong} icon={<XCircle className="h-5 w-5" />} tone="danger" />
        <SummaryCard label="Expired" value={counts.expired} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
        <SummaryCard label="Skipped" value={counts.skipped} icon={<SkipForward className="h-5 w-5" />} tone="neutral" />
      </div>

      <Card>
        <CardHeader
          title="Verification History"
          subtitle={`${filtered.length} of ${history.length} records`}
          icon={<HistoryIcon className="h-5 w-5" />}
          action={
            <Button variant="outline" size="sm" onClick={handleExport} leftIcon={<Download className="h-4 w-4" />}>
              Export CSV
            </Button>
          }
        />

        {/* Filters */}
        <div className="flex flex-col gap-3 px-5 pt-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-2 dark:bg-ink-900 dark:border-ink-700">
            <Search className="h-4 w-4 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search medicine, remarks, detected name…"
              className="w-full bg-transparent text-sm text-ink-700 placeholder-ink-400 focus:outline-none dark:text-ink-200"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-500">
              <Filter className="h-4 w-4" /> Status:
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | VerificationStatus)}
              className="rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-ink-900 dark:border-ink-700 dark:text-ink-200"
            >
              <option value="all">All statuses</option>
              <option value="verified">Verified</option>
              <option value="wrong">Wrong</option>
              <option value="expired">Expired</option>
              <option value="skipped">Skipped</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week')}
              className="rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-ink-900 dark:border-ink-700 dark:text-ink-200"
            >
              <option value="all">All time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 days</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-xs uppercase tracking-wider text-ink-500 dark:border-ink-800">
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Medicine</th>
                <th className="px-5 py-3 font-semibold">Scheduled</th>
                <th className="px-5 py-3 font-semibold">Verified</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50 dark:divide-ink-800/60">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-ink-500">
                    No records match your filters.
                  </td>
                </tr>
              )}
              {filtered.map((h) => {
                const cfg = statusConfig[h.status];
                const StatusIcon = cfg.icon;
                return (
                  <tr
                    key={h.id}
                    className="group transition-colors hover:bg-ink-50/60 dark:hover:bg-ink-800/40"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-ink-400" />
                        <span className="font-medium text-ink-700 dark:text-ink-200">
                          {formatDate(h.date)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
                          <Pill className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-ink-900 dark:text-white">{h.medicine}</p>
                          <p className="text-xs text-ink-500">{h.dosage}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-mono font-semibold text-ink-800 dark:text-ink-100">
                        {h.scheduledTime}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-mono font-semibold text-ink-800 dark:text-ink-100">
                        {h.verificationTime}
                      </p>
                      {h.confidence !== undefined && (
                        <p className="text-xs text-ink-500">{h.confidence.toFixed(1)}% conf.</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge tone={cfg.tone} dot>
                        <StatusIcon className="h-3 w-3" />
                        {cfg.label}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="max-w-xs text-xs text-ink-500 dark:text-ink-400">{h.remarks}</p>
                      {h.detectedName && h.detectedName !== h.medicine && (
                        <p className="mt-0.5 text-xs font-semibold text-danger-600">
                          Detected: {h.detectedName}
                        </p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: 'success' | 'danger' | 'warning' | 'neutral';
}

function SummaryCard({ label, value, icon, tone }: SummaryCardProps) {
  const toneBg = {
    success: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-300',
    danger: 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-300',
    warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-300',
    neutral: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300',
  }[tone];
  return (
    <Card hover className="flex items-center gap-3 p-4">
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', toneBg)}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-ink-500 dark:text-ink-400">{label}</p>
        <p className="font-display text-2xl font-bold text-ink-900 dark:text-white">{value}</p>
      </div>
    </Card>
  );
}
