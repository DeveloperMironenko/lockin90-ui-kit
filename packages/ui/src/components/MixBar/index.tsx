import { cn } from '../../cn';

export interface MixBarSegment {
  /** Proportional weight (used as flex-grow). */
  value: number;
  /** CSS color/gradient for the segment fill. */
  color: string;
  /** Optional tooltip / accessible label. */
  label?: string;
}

export interface MixBarProps {
  segments: MixBarSegment[];
  className?: string;
}

/** Stacked proportional segments — the tracker status mix bar. */
export default function MixBar({ segments, className }: MixBarProps) {
  return (
    <div
      className={cn('lk-mixbar', className)}
      role="img"
      aria-label={segments.map((s) => s.label).filter(Boolean).join(', ') || undefined}
    >
      {segments.map((seg, i) => (
        <i key={i} style={{ flex: seg.value, background: seg.color }} title={seg.label} />
      ))}
    </div>
  );
}
