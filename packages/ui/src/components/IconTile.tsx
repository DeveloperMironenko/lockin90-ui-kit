import { type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Icon, type IconName } from './Icon';

export interface IconTileProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** the kit icon inside */
  icon: IconName;
  /** the glyph's colour, a token (`var(--accent)`); the text colour by default */
  color?: string;
}

/** A kit icon on a small bordered tile (design onboarding `.recap .rico`): the leading mark of a
 *  summary row. 38px, decorative (the row's title names it). */
export function IconTile({ icon, color, className, style, ...rest }: IconTileProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('lk-icontile', className)}
      style={color ? { ...style, color } : style}
      {...rest}
    >
      <Icon name={icon} size={18} />
    </span>
  );
}
