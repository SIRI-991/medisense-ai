import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'success' | 'danger' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'btn-primary',
  success: 'btn-success',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
  outline: 'btn-outline',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
