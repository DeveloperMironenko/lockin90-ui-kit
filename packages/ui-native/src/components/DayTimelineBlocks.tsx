import {
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type DimensionValue,
} from 'react-native';
import { colors, fonts, radii } from '@lockin90/tokens';

/** One time block on the day rail. */
export interface DayBlock {
  /** block start, in hours on the [startHour, endHour] rail (e.g. 9, 12.5) */
  start: number;
  /** block end, in hours on the [startHour, endHour] rail */
  end: number;
  /** optional label shown inside the block if it fits */
  label?: string;
  /** fill color (any color string); defaults to the accent */
  color?: string;
}

export interface DayTimelineBlocksProps {
  /** the colored time blocks laid across the rail */
  blocks?: DayBlock[];
  /** current hour → a bright vertical "now" marker line + dot; omit to hide */
  now?: number;
  /** rail start hour (default 0) */
  startHour?: number;
  /** rail end hour (default 24) */
  endHour?: number;
  /** rail height in px (default 44) */
  height?: number;
  /** faint hour gridlines + mono labels (every 6h labeled); default true */
  hourTicks?: boolean;
  /** optional container style */
  style?: StyleProp<ViewStyle>;
}

/** default block fill when a block has no `color` */
const DEFAULT_COLOR = colors.accent;

/** A sample work-day so `<DayTimelineBlocks />` renders something on its own. */
const DEFAULT_BLOCKS: DayBlock[] = [
  { start: 7.75, end: 8.6, label: 'Commute', color: colors.indigo },
  { start: 9, end: 10.5, label: 'Deep work', color: colors.mint },
  { start: 10.5, end: 12, label: 'Meetings', color: colors.violet },
  { start: 12, end: 12.75, label: 'Break', color: colors.warn },
  { start: 13.25, end: 15, label: 'Deep work', color: colors.mint },
];

/** Clamp x into [lo, hi]. */
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

/** Format an hour (0..24) as a short clock label, e.g. 0→12am, 13→1pm, 18→6pm. */
function hourLabel(h: number): string {
  const hh = ((Math.round(h) % 24) + 24) % 24;
  if (hh === 0) return '12am';
  if (hh === 12) return '12pm';
  return hh < 12 ? `${hh}am` : `${hh - 12}pm`;
}

/** The hour tick stops: every 6h across the span, always including the end. */
function tickHours(startHour: number, endHour: number): number[] {
  const out: number[] = [];
  for (let h = Math.ceil(startHour / 6) * 6; h < endHour; h += 6) out.push(h);
  if (out[0] !== startHour) out.unshift(startHour);
  if (out[out.length - 1] !== endHour) out.push(endHour);
  return out;
}

/**
 * DayTimelineBlocks — a horizontal 24-hour activity rail.
 *
 * A glass track spanning `startHour..endHour` carrying absolutely-positioned
 * rounded color blocks (each placed by its start/end hour as left% + width% of
 * the rail span), optional faint hour gridlines with mono clock labels (every
 * 6h), and an optional bright "now" marker line + dot. Mirrors the web
 * DayTimelineBlocks (same export + prop API + visuals); positions are pure
 * percentages so the layout matches the web 1:1.
 */
export function DayTimelineBlocks({
  blocks = DEFAULT_BLOCKS,
  now,
  startHour = 0,
  endHour = 24,
  height = 44,
  hourTicks = true,
  style,
}: DayTimelineBlocksProps) {
  const span = endHour - startHour || 1;
  const pct = (h: number) => (clamp(h, startHour, endHour) - startHour) / span;

  const ticks = hourTicks ? tickHours(startHour, endHour) : [];
  const nowFrac = now != null ? pct(now) : null;

  return (
    <View style={[styles.root, style]}>
      {/* wrapper lets the now-pointer overflow the clipping track */}
      <View style={styles.wrap}>
        <View style={[styles.track, { height }]}>
          {/* faint hour gridlines */}
          {ticks.map((h) =>
            h > startHour && h < endHour ? (
              <View
                key={`g${h}`}
                pointerEvents="none"
                style={[styles.grid, { left: `${pct(h) * 100}%` as DimensionValue }]}
              />
            ) : null,
          )}

          {/* the colored time blocks */}
          {blocks.map((b, i) => {
            const left = pct(b.start);
            const width = Math.max(0, pct(b.end) - left);
            if (width <= 0) return null;
            return (
              <View
                key={i}
                style={[
                  styles.block,
                  {
                    left: `${left * 100}%` as DimensionValue,
                    width: `${width * 100}%` as DimensionValue,
                    backgroundColor: b.color ?? DEFAULT_COLOR,
                  },
                ]}
              >
                {b.label != null && (
                  <Text numberOfLines={1} style={styles.blockLabel}>
                    {b.label}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        {/* now-pointer is a sibling of the track, not inside it — escapes overflow:hidden */}
        {nowFrac != null && (
          <View
            pointerEvents="none"
            style={[styles.now, { left: `${nowFrac * 100}%` as DimensionValue, top: -6, bottom: 0 }]}
          >
            <View style={styles.nowDot} />
          </View>
        )}
      </View>

      {/* hour axis labels (every 6h) under the rail */}
      {hourTicks && (
        <View style={styles.axis}>
          {ticks.map((h, i) => {
            // align edge labels to the rail (left flush / right flush), center the rest
            const isFirst = i === 0;
            const isLast = i === ticks.length - 1;
            const tickStyle: ViewStyle = isFirst
              ? { left: 0, alignItems: 'flex-start' }
              : isLast
                ? { right: 0, alignItems: 'flex-end' }
                : {
                    left: `${pct(h) * 100}%` as DimensionValue,
                    marginLeft: -20,
                    width: 40,
                    alignItems: 'center',
                  };
            return (
              <View key={`a${h}`} style={[styles.tickWrap, tickStyle]}>
                <Text style={styles.tick}>{hourLabel(h)}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    gap: 8,
  },
  /* wrapper lets the now-pointer overflow the clipping track */
  wrap: {
    position: 'relative',
  },
  /* the rail track — faint glass, hairline border, clips the blocks */
  track: {
    position: 'relative',
    borderRadius: radii.sm,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  /* faint vertical hour gridline */
  grid: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.border,
  },
  /* a colored time block — positioned by left% / width% */
  block: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    borderRadius: 6,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
  },
  /* in-block label — small, dark-on-color */
  blockLabel: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 11,
    color: 'rgba(8,10,18,0.92)',
  },
  /* the bright "now" marker line — kept inside track bounds to avoid overflow:hidden clip */
  now: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    marginLeft: -1,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.7,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
    zIndex: 8,
  },
  /* glowing circle at the top of the now-line */
  nowDot: {
    position: 'absolute',
    top: -1,
    left: 1,
    marginLeft: -5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  /* hour axis row under the rail */
  axis: {
    position: 'relative',
    height: 12,
  },
  tickWrap: {
    position: 'absolute',
    top: 0,
  },
  tick: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    lineHeight: 12,
    color: colors.textFaint,
  },
});
