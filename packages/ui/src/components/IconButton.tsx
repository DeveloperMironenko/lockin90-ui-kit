import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../cn';
import { Icon, type IconName } from './Icon';

const ICON_SIZES = { sm: 16, md: 18 } as const;

export interface IconButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'aria-label' | 'aria-labelledby' | 'role'
  > {
  /** The spoken name (`aria-label`): the button shows no text, so it is required. */
  label: string;
  /** The kit icon it shows, sized for the button and coloured `--text`. */
  icon: IconName;
  /** 36 / 44 px square (CONVENTIONS "Control sizes"; `sm` reaches a 44 target). @default 'md' */
  size?: 'sm' | 'md';
}

/** A square button with one kit icon and no text (IconButton.md), on Button's surface (the field fill) and with a
 *  control's corners: for an action whose icon says it in a tight spot, like the camera on a profile
 *  picture. The touch target reaches 44px around `sm`. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, size = 'md', className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      {...rest}
      aria-label={label}
      className={cn('lk-icon-btn', size === 'sm' && 'lk-icon-btn-sm', className)}
    >
      <Icon name={icon} size={ICON_SIZES[size]} aria-hidden />
    </button>
  );
});
