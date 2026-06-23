import { Icon, type IconName } from '../Icon';
import { cn } from '../../cn';

export interface IconBadgeProps {
  name: IconName;
  /** Accent (violet glass) treatment vs. the neutral glass default. */
  accent?: boolean;
  className?: string;
}

/** Aurora glass square that frames a single marketing Icon. */
export function IconBadge({ name, accent = false, className }: IconBadgeProps) {
  return (
    <span className={cn('lk-icon-badge', accent && 'lk-accent', className)}>
      <Icon name={name} size={22} />
    </span>
  );
}
