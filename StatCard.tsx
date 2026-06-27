import type { ReactNode } from 'react';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon: ReactNode;
  tone?: 'primary' | 'success' | 'warning' | 'danger';
  progress?: number;
  trend?: { value: string; up: boolean };
}

const toneBg: Record<string, string> = {
  primary: 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300',
  success: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-300',
  warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-300',
  danger: 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-300',
};

const progressTone: Record<string, 'primary' | 'success' | 'warning' | 'danger'> = {
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = 'primary',
  progress,
  trend,
}: StatCardProps) {
  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-500 dark:text-ink-400">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-ink-900 dark:text-white">
            {value}
          </p>
          {hint && <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{hint}</p>}
          {trend && (
            <p
              className={cn(
                'mt-2 inline-flex items-center gap-1 text-xs font-semibold',
                trend.up ? 'text-success-600' : 'text-danger-600',
              )}
            >
              {trend.up ? '▲' : '▼'} {trend.value}
            </p>
          )}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
            toneBg[tone],
          )}
        >
          {icon}
        </div>
      </div>
      {typeof progress === 'number' && (
        <div className="mt-4">
          <ProgressBar value={progress} tone={progressTone[tone]} size="sm" />
        </div>
      )}
    </Card>
  );
}
