import { type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

/** A single video tile in the strip — either a gradient `bg` or an image `src`,
 *  with an optional duration badge and accessible label. */
export interface VideoThumb {
  /** Image source — rendered object-fit cover. Takes precedence over `bg`. */
  src?: string;
  /** CSS background (e.g. a gradient) used when no `src` is provided. */
  bg?: string;
  /** Duration badge text, e.g. "0:42". Hidden when empty. */
  duration?: string;
  /** Accessible label for the tile (aria-label on the button). */
  label?: string;
}

export interface VideoStripProps extends HTMLAttributes<HTMLElement> {
  /** Video tiles to render in the horizontal scroll row. */
  videos?: VideoThumb[];
  /** Mono uppercase eyebrow above the row. Hidden when empty. */
  eyebrow?: string;
  className?: string;
}

/** Default tiles use gradient backgrounds (no real images). */
const DEFAULT_VIDEOS: VideoThumb[] = [
  { bg: 'linear-gradient(135deg,#3a3f55,#1b2030)', duration: '0:42' },
  { bg: 'linear-gradient(135deg,#2b3348,#171c2b)', duration: '1:08' },
  { bg: 'linear-gradient(135deg,#33415c,#1a2030)', duration: '0:55' },
];

/** Horizontal strip of video thumbnails — each tile is a play-to-watch button
 *  with a centered translucent circular play overlay and an optional duration
 *  badge, preceded by an optional mono-uppercase eyebrow. */
export function VideoStrip({
  videos = DEFAULT_VIDEOS,
  eyebrow = 'Videos',
  className,
  ...rest
}: VideoStripProps) {
  return (
    <section className={cn('lk-vid', className)} {...rest}>
      {eyebrow ? <div className="lk-vid-eyebrow">{eyebrow}</div> : null}
      <div className="lk-vid-row">
        {videos.map((v, i) => (
          <button
            key={i}
            type="button"
            className="lk-vid-tile"
            aria-label={v.label ?? `Play video ${i + 1}`}
            style={v.src ? undefined : { background: v.bg }}
          >
            {v.src ? (
              <img className="lk-vid-img" src={v.src} alt={v.label ?? ''} />
            ) : null}
            <span className="lk-vid-play" aria-hidden="true">
              <Icon name="play" size={18} />
            </span>
            {v.duration ? <span className="lk-vid-dur">{v.duration}</span> : null}
          </button>
        ))}
      </div>
    </section>
  );
}
