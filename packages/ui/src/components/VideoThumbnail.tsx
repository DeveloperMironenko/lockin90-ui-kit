import { type HTMLAttributes, type MouseEventHandler } from 'react';
import { cn } from '../cn';

export interface VideoThumbnailProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  /** Poster image URL. When absent, a glass/gradient placeholder is shown. */
  src?: string;
  /** Alt text for the poster image. @default '' */
  alt?: string;
  /** Runtime label (e.g. `'0:45'`) — rendered as a mono pill bottom-right. */
  duration?: string;
  /** Pixel width of the thumbnail. @default 150 */
  width?: number;
  /** Aspect ratio (width / height). @default 1.4 */
  aspect?: number;
  /** Click handler — when set the thumbnail becomes an interactive button. */
  onClick?: () => void;
}

/**
 * VideoThumbnail — a media tile with a centered glass play disc and an optional
 * duration badge, as used by the Guide "Videos" strip. Sized by `width` + the
 * `aspect` ratio (height = width / aspect). Renders the poster `<img>` (object-fit
 * cover) when `src` is given, else a subtle flux-gradient placeholder. With
 * `onClick` the tile is a `<button>` (hover lift + brighter overlay); otherwise a
 * static `<div>`.
 */
export function VideoThumbnail({
  src,
  alt = '',
  duration,
  width = 150,
  aspect = 1.4,
  onClick,
  className,
  ...rest
}: VideoThumbnailProps) {
  const height = Math.round(width / aspect);
  const interactive = typeof onClick === 'function';

  const inner = (
    <>
      {src ? (
        <img className="lk-vthumb-img" src={src} alt={alt} />
      ) : (
        <span className="lk-vthumb-ph" aria-hidden="true" />
      )}
      <span className="lk-vthumb-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true">
          <path d="M9 6.5v11l9-5.5z" fill="currentColor" />
        </svg>
      </span>
      {duration ? <span className="lk-vthumb-dur">{duration}</span> : null}
    </>
  );

  const style = { width, height };

  if (interactive) {
    const handleClick: MouseEventHandler<HTMLButtonElement> = () => onClick();
    return (
      <button
        type="button"
        className={cn('lk-vthumb', 'lk-vthumb-btn', className)}
        style={style}
        onClick={handleClick}
        {...(rest as HTMLAttributes<HTMLButtonElement>)}
      >
        {inner}
      </button>
    );
  }

  return (
    <div className={cn('lk-vthumb', className)} style={style} {...(rest as HTMLAttributes<HTMLDivElement>)}>
      {inner}
    </div>
  );
}
