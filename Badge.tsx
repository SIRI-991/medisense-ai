import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type Tone = 'primary' | 'success' | 'danger' | 'warning' | 'neutral' | 'info';

const toneClasses: Record<Tone, string> = {
  primary: 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300',
  success: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-300',
  danger: 'bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-300',
  warning: 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-300',
  neutral: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300',
  info: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
};

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ tone = 'neutral', children, className, dot = false }: BadgeProps) {
  return (
    <span className={cn('badge', toneClasses[tone], className)}>
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            tone === 'success' && 'bg-success-500',
            tone === 'danger' && 'bg-danger-500',
            tone === 'warning' && 'bg-warning-500',
            tone === 'primary' && 'bg-primary-500',
            tone === 'info' && 'bg-sky-500',
            tone === 'neutral' && 'bg-ink-400',
          )}
        />
      )}
      {children}
    </span>
  );
}
