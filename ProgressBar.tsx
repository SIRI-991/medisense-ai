import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  tone?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const toneBg: Record<string, string> = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
};

const sizeH: Record<string, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5',
};

export function ProgressBar({
  value,
  tone = 'primary',
  className,
  showLabel = false,
  size = 'md',
}: ProgressBarProps) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800', sizeH[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', toneBg[tone])}
          style={{ width: `${v}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-right text-xs font-medium text-ink-500">{Math.round(v)}%</div>
      )}
    </div>
  );
}
