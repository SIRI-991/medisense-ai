import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Pill,
  CalendarClock,
  Gauge,
  Volume2,
  BellRing,
  RotateCw,
  ArrowRight,
  BrainCircuit,
  ScanText,
  ScanLine,
  History,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { cn, formatDate } from '../lib/utils';
import { speakVerification } from '../lib/api';
import type { VerificationOutcome } from '../lib/types';

const outcomeConfig: Record<
  VerificationOutcome,
  {
    title: string;
    headline: string;
    subline: string;
    bg: string;
    ring: string;
    icon: typeof CheckCircle2;
    iconBg: string;
    accent: string;
    badgeTone: 'success' | 'danger' | 'warning';
    reminderLabel: string;
    reminderTone: 'success' | 'danger' | 'warning';
  }
> = {
  verified: {
    title: 'Medicine Verified',
    headline: 'Medicine Verified. Safe to Take.',
    subline: 'The AI confirmed the correct medicine and a valid expiry date. Reminders have been stopped.',
    bg: 'from-success-500 to-success-700',
    ring: 'ring-success-300',
    icon: CheckCircle2,
    iconBg: 'bg-success-600',
    accent: 'text-success-700 dark:text-success-300',
    badgeTone: 'success',
    reminderLabel: 'Reminders stopped · Dose logged as taken',
    reminderTone: 'success',
  },
  wrong: {
    title: 'Wrong Medicine Detected',
    headline: 'Wrong Medicine Detected.',
    subline: 'The scanned medicine does not match the expected prescription. Do not take it. Reminders will continue every 10 minutes.',
    bg: 'from-danger-500 to-danger-700',
    ring: 'ring-danger-300',
    icon: XCircle,
    iconBg: 'bg-danger-600',
    accent: 'text-danger-700 dark:text-danger-300',
    badgeTone: 'danger',
    reminderLabel: 'Reminder continues every 10 min until verified',
    reminderTone: 'danger',
  },
  expired: {
    title: 'Expired Medicine',
    headline: 'Expired Medicine. Do Not Consume.',
    subline: 'The medicine matches the prescription but the expiry date has passed. Dispose of it safely. Reminders will continue.',
    bg: 'from-warning-500 to-warning-600',
    ring: 'ring-warning-300',
    icon: AlertTriangle,
    iconBg: 'bg-warning-600',
    accent: 'text-warning-700 dark:text-warning-300',
    badgeTone: 'warning',
    reminderLabel: 'Reminder continues until a valid medicine is scanned',
    reminderTone: 'warning',
  },
};

export function VerificationResult() {
  const { lastScan, activeMedicine, medicines, setMedicines, addHistoryEntry, setPage, settings, pushNotification } = useApp();
  const [spoken, setSpoken] = useState(false);
  const [alarmActive, setAlarmActive] = useState(true);

  const result = lastScan;
  const config = result ? outcomeConfig[result.outcome] : outcomeConfig.verified;

  // Voice confirmation + side effects on first render
  useEffect(() => {
    if (!result || spoken) return;
    speakVerification(config.headline, settings.alarmVolume / 100);
    setSpoken(true);

    if (result.outcome === 'verified') {
      // Mark medicine as taken
      setMedicines((prev) =>
        prev.map((m) =>
          m.id === activeMedicine?.id
            ? { ...m, status: 'taken', verification: 'verified' }
            : m,
        ),
      );
      addHistoryEntry({
        id: `h-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        medicine: result.expectedName,
        dosage: activeMedicine?.dosage ?? '—',
        scheduledTime: activeMedicine?.scheduledTime ?? '—',
        verificationTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'verified',
        remarks: 'Medicine verified. Safe to take.',
        confidence: result.confidence,
        detectedName: result.detectedName,
        expiryDate: result.expiryDate,
      });
      pushNotification({
        title: 'Verification successful',
        body: `${result.expectedName} verified. Safe to take.`,
        tone: 'success',
      });
      setAlarmActive(false);
    } else {
      addHistoryEntry({
        id: `h-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        medicine: result.expectedName,
        dosage: activeMedicine?.dosage ?? '—',
        scheduledTime: activeMedicine?.scheduledTime ?? '—',
        verificationTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: result.outcome === 'wrong' ? 'wrong' : 'expired',
        remarks:
          result.outcome === 'wrong'
            ? 'Wrong medicine detected. Reminder continued.'
            : 'Expired medicine. Do not consume.',
        confidence: result.confidence,
        detectedName: result.detectedName,
        expiryDate: result.expiryDate,
      });
      pushNotification({
        title: result.outcome === 'wrong' ? 'Wrong medicine detected' : 'Expired medicine detected',
        body:
          result.outcome === 'wrong'
            ? `Scanned ${result.detectedName} instead of ${result.expectedName}. Reminder continues.`
            : `${result.expectedName} is expired. Do not consume.`,
        tone: result.outcome === 'wrong' ? 'danger' : 'warning',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const nextPending = useMemo(
    () => medicines.find((m) => m.status === 'pending'),
    [medicines],
  );

  if (!result) {
    return (
      <Card className="p-10 text-center">
        <p className="text-ink-500">No verification result yet. Run a scan first.</p>
        <div className="mt-4">
          <Button onClick={() => setPage('scan')} leftIcon={<BrainCircuit className="h-4 w-4" />}>
            Go to Scan
          </Button>
        </div>
      </Card>
    );
  }

  const Icon = config.icon;
  const nameMatches = result.detectedName.toLowerCase() === result.expectedName.toLowerCase();
  const expired = new Date(result.expiryDate).getTime() < Date.now();

  return (
    <div className="space-y-6">
      {/* Big result card */}
      <div
        className={cn(
          'relative overflow-hidden rounded-3xl bg-gradient-to-br p-8 text-white shadow-card animate-fade-in-scale sm:p-12',
          config.bg,
        )}
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          <div className="relative">
            <div className={cn('flex h-24 w-24 items-center justify-center rounded-full bg-white/15 ring-8 ring-white/20', config.ring)}>
              <Icon className="h-12 w-12" />
            </div>
            <span className="absolute inset-0 rounded-full ring-4 ring-white/30 animate-pulse-ring" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {config.headline}
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/85">{config.subline}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Badge tone="neutral" className="bg-white/15 text-white">
              <ShieldCheck className="h-3.5 w-3.5" /> AI Decision Engine
            </Badge>
            <Badge tone="neutral" className="bg-white/15 text-white">
              <Gauge className="h-3.5 w-3.5" /> {result.confidence.toFixed(1)}% confidence
            </Badge>
          </div>
        </div>
      </div>

      {/* Detail cards */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Detected vs expected */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Verification Details"
            subtitle="AI vision + OCR comparison"
            icon={<Pill className="h-5 w-5" />}
          />
          <div className="grid gap-4 p-5 pt-3 sm:grid-cols-2">
            <DetailRow
              icon={<Pill className="h-4 w-4" />}
              label="Expected medicine"
              value={result.expectedName}
              tone={nameMatches ? 'success' : 'neutral'}
            />
            <DetailRow
              icon={<ScanLine className="h-4 w-4" />}
              label="Detected medicine"
              value={result.detectedName}
              tone={nameMatches ? 'success' : 'danger'}
            />
            <DetailRow
              icon={<CalendarClock className="h-4 w-4" />}
              label="Expiry date"
              value={formatDate(result.expiryDate)}
              tone={expired ? 'warning' : 'success'}
              hint={expired ? 'Past expiry — do not consume' : 'Within valid period'}
            />
            <DetailRow
              icon={<Gauge className="h-4 w-4" />}
              label="Verification confidence"
              value={`${result.confidence.toFixed(1)}%`}
              tone="primary"
            />
          </div>
          <div className="px-5 pb-5">
            <div className="flex items-center justify-between text-xs font-semibold text-ink-500">
              <span>Confidence score</span>
              <span>{result.confidence.toFixed(1)}%</span>
            </div>
            <ProgressBar
              value={result.confidence}
              tone={result.outcome === 'verified' ? 'success' : result.outcome === 'wrong' ? 'danger' : 'warning'}
              size="md"
              className="mt-2"
            />
          </div>
        </Card>

        {/* Voice + alarm + reminder status */}
        <Card>
          <CardHeader
            title="Status"
            subtitle="Voice, alarm & reminders"
            icon={<BellRing className="h-5 w-5" />}
          />
          <div className="space-y-3 p-5 pt-3">
            <StatusRow
              icon={<Volume2 className="h-4 w-4" />}
              label="Voice confirmation"
              value={spoken ? 'Spoken' : 'Pending'}
              tone={spoken ? 'success' : 'neutral'}
            />
            <StatusRow
              icon={<BellRing className="h-4 w-4" />}
              label="Alarm status"
              value={result.outcome === 'verified' ? 'Stopped' : alarmActive ? 'Active' : 'Stopped'}
              tone={result.outcome === 'verified' ? 'success' : 'danger'}
            />
            <StatusRow
              icon={<RotateCw className="h-4 w-4" />}
              label="Reminder status"
              value={config.reminderLabel}
              tone={config.reminderTone}
              wrap
            />

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => speakVerification(config.headline, settings.alarmVolume / 100)}
                leftIcon={<Volume2 className="h-4 w-4" />}
              >
                Replay voice
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Pipeline recap */}
      <Card>
        <CardHeader
          title="AI Pipeline Recap"
          subtitle="How the decision was reached"
          icon={<BrainCircuit className="h-5 w-5" />}
        />
        <div className="grid gap-3 p-5 pt-3 sm:grid-cols-4">
          {[
            { icon: ScanLine, label: 'Frame captured', detail: 'Webcam / upload' },
            { icon: BrainCircuit, label: 'Afferens Vision', detail: result.detectedName },
            { icon: ScanText, label: 'OCR expiry', detail: formatDate(result.expiryDate) },
            { icon: ShieldCheck, label: 'AI decision', detail: config.title },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-2xl border border-ink-100 p-4 dark:border-ink-800"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                    Step {i + 1}
                  </span>
                </div>
                <p className="mt-2 font-display text-sm font-bold text-ink-900 dark:text-white">
                  {s.label}
                </p>
                <p className="text-xs text-ink-500 dark:text-ink-400">{s.detail}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {result.outcome === 'verified' ? (
          <>
            <Button onClick={() => setPage('dashboard')} leftIcon={<CheckCircle2 className="h-4 w-4" />}>
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={() => setPage('history')} leftIcon={<History className="h-4 w-4" />}>
              View History
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setPage('scan')} leftIcon={<RotateCw className="h-4 w-4" />}>
              Scan Again
            </Button>
            <Button variant="outline" onClick={() => setPage('dashboard')}>
              Back to Dashboard
            </Button>
          </>
        )}
        {nextPending && result.outcome === 'verified' && (
          <Button
            variant="success"
            onClick={() => setPage('scan')}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="ml-auto"
          >
            Next: {nextPending.name}
          </Button>
        )}
      </div>
    </div>
  );
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: 'success' | 'danger' | 'warning' | 'primary' | 'neutral';
  hint?: string;
}

function DetailRow({ icon, label, value, tone, hint }: DetailRowProps) {
  const toneText = {
    success: 'text-success-700 dark:text-success-300',
    danger: 'text-danger-700 dark:text-danger-300',
    warning: 'text-warning-700 dark:text-warning-300',
    primary: 'text-primary-700 dark:text-primary-300',
    neutral: 'text-ink-800 dark:text-ink-100',
  }[tone];
  const toneBg = {
    success: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-300',
    danger: 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-300',
    warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-300',
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300',
    neutral: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300',
  }[tone];
  return (
    <div className="rounded-2xl border border-ink-100 p-4 dark:border-ink-800">
      <div className="flex items-center gap-2">
        <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', toneBg)}>
          {icon}
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</p>
      </div>
      <p className={cn('mt-2 font-display text-lg font-bold', toneText)}>{value}</p>
      {hint && <p className="text-xs text-ink-500">{hint}</p>}
    </div>
  );
}

function StatusRow({
  icon,
  label,
  value,
  tone,
  wrap = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: 'success' | 'danger' | 'warning' | 'neutral';
  wrap?: boolean;
}) {
  const toneBg = {
    success: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-300',
    danger: 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-300',
    warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-300',
    neutral: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300',
  }[tone];
  return (
    <div className="flex items-start gap-3 rounded-xl border border-ink-100 p-3 dark:border-ink-800">
      <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', toneBg)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</p>
        <p className={cn('text-sm font-semibold text-ink-900 dark:text-white', wrap && 'leading-snug')}>
          {value}
        </p>
      </div>
    </div>
  );
}
