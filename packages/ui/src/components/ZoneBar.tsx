import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** One HR training zone — its `value` (time-in-zone) drives the segment width. */
export interface ZoneBarZone {
  /** zone label shown under the bar; defaults to `Z1`..`Zn` by index */
  label?: string;
  /** time-in-zone (seconds) or share — sizes this segment relative to the others */
  value: number;
  /** override the segment color (a token `var()`, e.g. `'var(--lime)'`); defaults to the Z1→Z5 ramp */
  color?: string;
}

export interface ZoneBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** the HR zones left→right (cool/recovery → hot/max), typically 5 (Z1..Z5); width ∝ value */
  zones: ZoneBarZone[];
  /** index 0..n-1 of the active zone → lit segment + marker tick (omit for none) */
  current?: number;
  /** render the zone labels (Z1..Z5) under the bar */
  showLabels?: boolean;
  /** bar thickness in px (default 8) */
  height?: number;
}

/**
 * Default Z1→Z5 color ramp — cool recovery → hot max, lifted verbatim from the
 * design's HR gauge (`.z1`..`.z5`): cyan → mint/teal → lime → amber → red.
 */
const ZONE_RAMP = [
  'var(--cyan)', // Z1 — recovery
  'var(--zone-high)', // Z2 — easy (mint/teal)
  'var(--lime)', // Z3 — aerobic
  'var(--zone-mid)', // Z4 — threshold (amber)
  'var(--zone-low)', // Z5 — max (red)
] as const;

/**
 * ZoneBar — a horizontal heart-rate training-zone bar.
 *
 * Renders the 5 HR zones (Z1..Z5) as a row of token-colored pill segments whose
 * widths are proportional to time-in-zone, with the cool→hot Z1→Z5 ramp from the
 * design. The `current` zone is lit (the rest dim) and carries a bright marker
 * tick showing where the athlete is right now. The purpose-built counterpart to
 * the watch + mobile training screens' hand-rolled `.zonebar` — apps use this,
 * never re-create it (see SDD §9). Distinct from StackedBar (no per-zone current
 * highlight / marker / Z-labels) and Meter (single scalar).
 *
 * Per-segment var: `--seg` (the zone color, reused for the lit-segment glow).
 */
export function ZoneBar({
  zones,
  current,
  showLabels = false,
  height = 8,
  className,
  style,
  ...rest
}: ZoneBarProps) {
  const sum = zones.reduce((acc, z) => acc + (z.value > 0 ? z.value : 0), 0);
  const hasCurrent = typeof current === 'number' && current >= 0 && current < zones.length;

  const zoneName = (z: ZoneBarZone, i: number) => z.label ?? `Z${i + 1}`;
  const zoneColor = (z: ZoneBarZone, i: number) => z.color ?? ZONE_RAMP[i] ?? 'var(--accent)';

  const ariaLabel = `Heart-rate zones: ${zones
    .map((z, i) => `${zoneName(z, i)}${hasCurrent && current === i ? ' (current)' : ''}`)
    .join(', ')}.`;

  return (
    <div className={cn('lk-zonebar', hasCurrent && 'has-current', className)} style={style} {...rest}>
      <div className="lk-zonebar-track" style={{ height } as CSSProperties} role="img" aria-label={ariaLabel}>
        {zones.map((z, i) => {
          const v = z.value > 0 ? z.value : 0;
          // weight by share; if every zone is empty, fall back to equal widths
          const grow = sum > 0 ? v : 1;
          const isCurrent = hasCurrent && current === i;
          const color = zoneColor(z, i);
          return (
            <span
              key={`${zoneName(z, i)}-${i}`}
              className={cn('lk-zonebar-seg', isCurrent && 'is-current')}
              style={{ flexGrow: grow, flexBasis: 0, background: color, ['--seg']: color } as CSSProperties}
            >
              {isCurrent && <span className="lk-zonebar-mark" aria-hidden="true" />}
            </span>
          );
        })}
      </div>

      {showLabels && (
        <div className="lk-zonebar-labels" aria-hidden="true">
          {zones.map((z, i) => (
            <span
              key={`lab-${zoneName(z, i)}-${i}`}
              className={cn('lk-zonebar-lab', hasCurrent && current === i && 'is-current')}
            >
              {zoneName(z, i)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
