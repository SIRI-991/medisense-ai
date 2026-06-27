import { useEffect, useState } from 'react';
import { BellRing, Volume2, X, Pill, RotateCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { cn, formatTime, minutesUntil, relativeTimeFromNow } from '../../lib/utils';
import type { Medicine } from '../../lib/types';

interface ReminderModuleProps {
  medicine: Medicine;
  onClose?: () => void;
  compact?: boolean;
}

export function ReminderModule({ medicine, onClose, compact = false }: ReminderModuleProps) {
  const { settings, setPage, setActiveMedicine } = useApp();
  const [, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const mins = minutesUntil(medicine.scheduledTime);
  const overdue = mins < 0;
  const overdueMins = Math.abs(mins);
  const countdownSec = overdue ? 0 : Math.max(0, mins * 60);

  const handleScan = () => {
    setActiveMedicine(medicine);
    setPage('scan');
  };

  const overdueLabel =
    overdueMins === 0
      ? 'Due now'
      : overdueMins < 60
        ? `Overdue by ${overdueMins} min`
        : `Overdue by ${Math.floor(overdueMins / 60)} hr ${overdueMins % 60} min`;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 text-white shadow-card',
        overdue
          ? 'bg-gradient-to-br from-danger-600 to-danger-700'
          : 'bg-gradient-to-br from-primary-600 to-primary-700',
      )}
    >
      {/* Decorative pulse rings */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <BellRing className="h-6 w-6 animate-alarm-pulse" />
            <span className="absolute inset-0 rounded-2xl ring-2 ring-white/40 animate-pulse-ring" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
              {overdue ? 'Active Reminder · Overdue' : 'Active Reminder'}
            </p>
            <p className="font-display text-lg font-bold">{medicine.name} · {medicine.dosage}</p>
            <p className="text-sm text-white/80">
              Scheduled for {medicine.scheduledTime} · {relativeTimeFromNow(medicine.scheduledTime)}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/10"
            aria-label="Dismiss reminder"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Countdown / overdue banner */}
      <div className="relative mt-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
        {overdue ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <RotateCw className="h-5 w-5 animate-spin-slow" />
            </div>
            <div>
              <p className="font-display text-xl font-bold">{overdueLabel}</p>
              <p className="text-sm text-white/80">
                Reminder repeats every {settings.reminderInterval} min until verified.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                Time remaining
              </p>
              <p className="font-mono text-2xl font-bold tabular-nums">
                {formatTime(countdownSec)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                Alarm
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <Volume2 className="h-4 w-4" />
                <span>{settings.alarmVolume}%</span>
                <span className="flex h-2 w-2 rounded-full bg-success-300 animate-pulse" />
              </div>
            </div>
          </div>
        )}
      </div>

      {!compact && (
        <div className="relative mt-4 flex flex-wrap items-center gap-2">
          <Button
            className="bg-white text-primary-700 hover:bg-white/90"
            onClick={handleScan}
            leftIcon={<Pill className="h-4 w-4" />}
          >
            Scan to verify
          </Button>
          <Button
            className="bg-white/10 text-white hover:bg-white/20"
            onClick={() => setPage('schedule')}
          >
            View schedule
          </Button>
        </div>
      )}
    </div>
  );
}
