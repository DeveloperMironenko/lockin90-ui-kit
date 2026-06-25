import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts, radii } from '@lockin90/tokens';

/** One cell in the heatmap. */
export interface HeatmapCell {
  /** the cell's intensity — color scales with `value / max` (0..1 after normalization) */
  value: number;
  /** optional label (e.g. a day-of-month number) shown inside the cell */
  label?: string;
  /** mark this cell — draws a low-zone ring + dot (e.g. a flagged low-energy day) */
  flag?: boolean;
  /** mark this cell as "today"/"now" — draws an accent border */
  today?: boolean;
}

export interface HeatmapProps {
  /** the cells, laid out left → right, top → bottom */
  cells?: HeatmapCell[];
  /** number of columns; 7 reads as a calendar week, ~30 as a wrapping contribution strip */
  columns?: number;
  /** cell edge length in px (square cells in `grid`, fixed-height in `strip`) */
  cellSize?: number;
  /** gap between cells in px */
  gap?: number;
  /** cell corner radius in px */
  radius?: number;
  /** low-intensity end of the color ramp (hex) */
  colorFrom?: string;
  /** high-intensity end of the color ramp (hex) */
  colorTo?: string;
  /** override the ramp entirely: map a normalized value (0..1) → any color string */
  colorScale?: (value: number) => string;
  /** `grid` = square calendar cells; `strip` = a denser contribution strip */
  variant?: 'grid' | 'strip';
  /** the value that maps to full intensity (1.0); values normalize as `value / max` */
  max?: number;
  /** optional container style */
  style?: StyleProp<ViewStyle>;
}

/** low-intensity ramp end — dark violet so low cells stay distinct from high */
const DEFAULT_FROM = '#2B1F5C';
/** high-intensity ramp end — mint (the brand "high" zone) */
const DEFAULT_TO = '#34F5C5';

/** A small calendar-week sample spanning the FULL intensity range so the ramp
 *  is legible at a glance (mirrors the web Heatmap defaults). */
const DEFAULT_CELLS: HeatmapCell[] = [
  { value: 0.15, label: '1' },
  { value: 0.3, label: '2' },
  { value: 0.85, label: '3' },
  { value: 0.55, label: '4' },
  { value: 0.08, label: '5', flag: true },
  { value: 0.72, label: '6' },
  { value: 0.92, label: '7' },
  { value: 0.38, label: '8' },
  { value: 0.61, label: '9' },
  { value: 0.78, label: '10' },
  { value: 0.95, label: '11', today: true },
];

/** Clamp to [0, 1]. */
function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** Parse `#rgb` / `#rrggbb` into an [r, g, b] triplet (0..255). */
function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h[0]! + h[0]! + h[1]! + h[1]! + h[2]! + h[2]!;
  const int = parseInt(h, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

/** Linearly interpolate between two hex colors by `t` (0..1) → an `rgb(...)` string. */
export function lerpColor(from: string, to: string, t: number): string {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const k = clamp01(t);
  const r = Math.round(a[0] + (b[0] - a[0]) * k);
  const g = Math.round(a[1] + (b[1] - a[1]) * k);
  const bl = Math.round(a[2] + (b[2] - a[2]) * k);
  return `rgb(${r}, ${g}, ${bl})`;
}

/**
 * Heatmap — a compact grid/strip of small intensity-colored cells. One primitive
 * covers both a calendar-month grid (`columns=7`, optional per-day `label` +
 * `today`/`flag`) and a linear contribution/compliance strip (`variant="strip"`,
 * e.g. `columns=30`). Each cell's background interpolates the `colorFrom →
 * colorTo` ramp by its normalized `value / max` (or a custom `colorScale`).
 * Flagged cells get a low-zone ring + dot; `today` gets an accent border.
 * Tokens-driven. A flex-wrap row whose cell width is computed from `columns`.
 */
export function Heatmap({
  cells = DEFAULT_CELLS,
  columns = 7,
  cellSize = 28,
  gap = 4,
  radius,
  colorFrom = DEFAULT_FROM,
  colorTo = DEFAULT_TO,
  colorScale,
  variant = 'grid',
  max = 1,
  style,
}: HeatmapProps) {
  const denom = max > 0 ? max : 1;
  const borderRadius = radius ?? (variant === 'strip' ? 4 : radii.sm);
  const isStrip = variant === 'strip';
  // grid wraps at exactly `columns` square cells → pin the row to that width.
  const gridWidth = columns * cellSize + Math.max(0, columns - 1) * gap;

  return (
    <View
      style={[
        styles.root,
        { gap },
        !isStrip && [styles.rootWrap, { width: gridWidth }],
        style,
      ]}
    >
      {cells.map((c, i) => {
        const t = clamp01(c.value / denom);
        const bg = colorScale ? colorScale(t) : lerpColor(colorFrom, colorTo, t);
        // grid cells are fixed squares (wrap every `columns`); strip cells flex to
        // share one row equally (mirrors the web's `repeat(columns, 1fr)`).
        const cellStyle: ViewStyle = isStrip
          ? { height: cellSize, flex: 1, minWidth: 0, borderRadius, backgroundColor: bg }
          : { height: cellSize, width: cellSize, borderRadius, backgroundColor: bg };
        return (
          <View
            key={i}
            style={[
              styles.cell,
              cellStyle,
              c.flag && styles.cellFlag,
              c.today && styles.cellToday,
            ]}
          >
            {c.flag && <View style={styles.flag} />}
            {!isStrip && c.label != null && (
              <Text style={styles.label}>{c.label}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  // grid variant wraps every `columns` cells (width is pinned inline)
  rootWrap: {
    flexWrap: 'wrap',
  },
  cell: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  // today / now — accent border (matches calendar's today highlight)
  cellToday: {
    borderColor: colors.accent,
  },
  // flagged cell — low-zone ring
  cellFlag: {
    borderColor: colors.zoneLow,
  },
  // the flag dot — top-right, glowing low-zone
  flag: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.zoneLow,
    shadowColor: colors.zoneLow,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  // in-cell label (grid variant) — small mono day number
  label: {
    fontFamily: fonts.mono,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.75)',
  },
});
