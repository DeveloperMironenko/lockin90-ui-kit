export interface UserAvatarProps {
  /** Pre-computed initials to render (the old admin API passes initials directly). */
  initials: string;
  /** Diameter in px. */
  size?: number;
  className?: string;
}
