import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../cn';

export type ButtonVariant = 'default' | 'primary' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
}

/** Pill button. `primary` = animated energy-gradient CTA. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'default', size = 'md', className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'lk-btn',
        variant === 'primary' && 'lk-btn-primary',
        variant === 'ghost' && 'lk-btn-ghost',
        size === 'sm' && 'lk-btn-sm',
        className,
      )}
      {...rest}
    />
  );
});
