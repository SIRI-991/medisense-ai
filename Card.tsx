import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  className?: string;
}

export function Card({ children, hover = false, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'card',
        hover && 'card-hover',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, icon, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-3 p-5 pb-0', className)}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}
