import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full rounded-2xl bg-white dark:bg-ink-900 shadow-card border border-ink-200 dark:border-ink-700 animate-fade-in-scale',
          sizeClasses[size],
        )}
      >
        {(title || subtitle) && (
          <div className="flex items-start justify-between gap-3 p-5 pb-3">
            <div>
              {title && (
                <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-ink-800"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="px-5 py-3">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-ink-100 dark:border-ink-800 p-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
