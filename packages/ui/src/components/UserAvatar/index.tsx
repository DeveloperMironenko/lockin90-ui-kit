import type { UserAvatarProps } from './types';

export default function UserAvatar({ initials, size = 32 }: UserAvatarProps) {
  const isLarge = size >= 48;
  return (
    <div
      className={`relative overflow-hidden rounded shrink-0 bg-elevated border border-border-strong flex items-center justify-center font-display italic font-extrabold text-white ${isLarge ? 'text-[26px]' : 'text-[13px]'}`}
      style={{ width: size, height: size }}
    >
      {initials}
      <div className={`absolute bottom-0 inset-x-0 bg-accent ${isLarge ? 'h-[3px]' : 'h-0.5'}`} />
    </div>
  );
}
