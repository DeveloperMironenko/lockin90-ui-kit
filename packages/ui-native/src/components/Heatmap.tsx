import { View, Text, StyleSheet, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import { colors, fonts, radii } from '@lockin90/tokens';

/** One cell in the heatmap. */
export interface HeatmapCell {
  /** the cell's intensity — color scales with `value / max` (0..1 after normalization) */
  value: number;
  /** optional label (e.g. a day-of-month number) shown inside the cell */
  label?: string;
  /** mark this cell — draws a low-zone ring + dot (e.g. a flagged low-energy day) */
  flag?: boolean;
  /** mark this cell as "today"/"now" — draws an accent (or `todayColor`) ring */
  today?: boolean;
  /** missing-data slot — renders as a dashed empty cell, never a fake zero (HM-08) */
  missing?: boolean;
  /** explicit in-cell text when `showValues` is on (overrides the computed value) */
  display?: string;
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
  /** low-intensity end of the color ramp (hex) — legacy ramp, ignored when `scale` is set */
  colorFrom?: string;
  /** high-intensity end of the color ramp (hex) — legacy ramp, ignored when `scale` is set */
  colorTo?: string;
  /** override the ramp entirely: map a normalized value (0..1) → any color string */
  colorScale?: (value: number) => string;
  /** `grid` = square calendar cells; `strip` = a denser contribution strip */
  variant?: 'grid' | 'strip';
  /** the value that maps to full intensity (1.0); values normalize as `value / max` */
  max?: number;
  /** Catalog color scale — token color + value-driven opacity (HM-01 SELECT):
   *  - `'zone'` — zone verdict tokens (≥0.62 high · ≥0.38 mid · low)
   *  - `'spectrum'` — indigo → violet → cyan → mint by quartile (HM-09)
   *  - `'diverge'` — above 0.5 mint / below coral, opacity = |Δ| (HM-11/12)
   *  - any **hex** color string — single hue, opacity = value (e.g. `colors.mint`, HM-03)
   *  When set, the legacy `colorFrom/To` ramp is ignored. */
  scale?: 'zone' | 'spectrum' | 'diverge' | (string & {});
  /** row captions at the left, one per row (e.g. MON…SUN) */
  rowLabels?: string[];
  /** column captions above the grid at specific column indices (HM-09 hour marks) */
  colLabels?: { at: number; label: string }[];
  /** weekday letters under the columns — `true` = 'MTWTFSS', or a custom string */
  dayLetters?: boolean | string;
  /** HM-06 dot-matrix — circles sized AND opacified by value (double encoding) */
  dots?: boolean;
  /** HM-07 glass-grid — glass cells; the border's color opacity carries the value */
  glass?: boolean;
  /** HM-13 focus-row — this row index at full strength, others dimmed to 22% */
  focusRow?: number;
  /** in-cell mono values (HM-11/14): `'pct'` → `round(t·100)`; `true` → diverging
   *  scales show a signed `(t−0.5)·2` coefficient, others `t` to 1 decimal;
   *  per-cell `display` overrides */
  showValues?: boolean | 'pct';
  /** glow on hot cells (t > 0.78) — a soft shadow in the cell color (no blur on RN) */
  shine?: boolean;
  /** the `today` ring color (default `colors.accent`; HM-15 uses `colors.text`) */
  todayColor?: string;
  /** HM-15 today-ring — adds a glowing dot above the `today` cell (static on native) */
  todayPulse?: boolean;
  /** in-cell label placement: `center` (legacy) or `corner` (HM-04 month-cal numerals) */
  labelPosition?: 'center' | 'corner';
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

/** A hex token color at a value-driven opacity → `rgba(...)` string. */
function mix(hex: string, op: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${clamp01(op).toFixed(3)})`;
}

/** The catalog `heatFill` scales: color token + opacity per normalized value. */
function heatFill(scale: string, t: number): { color: string; op: number } {
  if (scale === 'zone') {
    const color = t >= 0.62 ? colors.zoneHigh : t >= 0.38 ? colors.zoneMid : colors.zoneLow;
    return { color, op: 0.25 + t * 0.75 };
  }
  if (scale === 'spectrum') {
    const color = t < 0.25 ? colors.indigo : t < 0.5 ? colors.violet : t < 0.75 ? colors.cyan : colors.mint;
    return { color, op: 0.35 + t * 0.65 };
  }
  if (scale === 'diverge') {
    const d = t - 0.5;
    return { color: d >= 0 ? colors.mint : colors.zoneLow, op: Math.min(1, 0.1 + Math.abs(d) * 1.7) };
  }
  return { color: scale, op: 0.08 + t * 0.92 }; /* single hue (hex) */
}

/** fixed width of the row-labels column (mirrors the web CSS) */
const ROW_LABELS_W = 40;

/**
 * Heatmap — a compact grid/strip of small intensity-colored cells. One primitive
 * covers the calendar-month grid, the contribution strip, and the catalog
 * heatmap family (HM-01…HM-15): token `scale`s (zone / spectrum / diverge /
 * single-hue), row/column captions + day letters, dot-matrix and glass cells,
 * gap-aware missing slots, a focus row, in-cell mono values, and the
 * today-ring + dot. Legacy behavior (colorFrom→colorTo ramp) is unchanged
 * when `scale` is not set. Tokens-driven.
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
  scale,
  rowLabels,
  colLabels,
  dayLetters,
  dots = false,
  glass = false,
  focusRow,
  showValues,
  shine = false,
  todayColor,
  todayPulse = false,
  labelPosition = 'center',
  style,
}: HeatmapProps) {
  const denom = max > 0 ? max : 1;
  const borderRadius = radius ?? (variant === 'strip' ? 4 : radii.sm);
  const isStrip = variant === 'strip';
  const rows = Math.max(1, Math.ceil(cells.length / columns));
  const letters = dayLetters === true ? 'MTWTFSS' : dayLetters || '';
  const hasFrame = Boolean(rowLabels?.length || colLabels?.length || letters);
  // grid wraps at exactly `columns` square cells → pin the row to that width.
  const gridWidth = columns * cellSize + Math.max(0, columns - 1) * gap;

  const cellNodes = cells.map((c, i) => {
    const t = clamp01(c.value / denom);
    const row = Math.floor(i / columns);
    // grid cells are fixed squares (wrap every `columns`); strip cells flex to
    // share one row equally (mirrors the web's `repeat(columns, 1fr)`).
    const baseStyle: ViewStyle = isStrip
      ? { height: cellSize, flex: 1, minWidth: 0, borderRadius }
      : { height: cellSize, width: cellSize, borderRadius };

    if (c.missing) {
      return <View key={i} style={[styles.cell, baseStyle, styles.cellMissing]} />;
    }

    // resolve the fill: catalog scale (token + opacity) or legacy ramp
    let color: string;
    let op = 1;
    if (scale != null) {
      const hf = heatFill(scale, t);
      color = hf.color;
      op = hf.op;
    } else {
      color = colorScale ? colorScale(t) : lerpColor(colorFrom, colorTo, t);
    }
    if (focusRow != null) op = row === focusRow ? op : op * 0.22;
    const dimmedLegacy = scale == null && focusRow != null && row !== focusRow;

    const cellStyle: ViewStyle = dots
      ? {}
      : glass
        ? { backgroundColor: colors.glass, borderColor: mix(color, 0.25 + t * 0.75) }
        : {
            backgroundColor: scale != null ? mix(color, op) : color,
            ...(dimmedLegacy ? { opacity: 0.22 } : {}),
          };
    const shineStyle: ViewStyle | null =
      shine && t > 0.78 && !dots && !glass
        ? {
            shadowColor: color,
            shadowOpacity: 0.6,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 0 },
            elevation: 4,
          }
        : null;

    // in-cell text: computed value (HM-11/14) or the day label
    const valueText = showValues
      ? (c.display ??
        (scale === 'diverge'
          ? `${t >= 0.5 ? '+' : '−'}${Math.abs((t - 0.5) * 2).toFixed(1)}`
          : showValues === 'pct'
            ? String(Math.round(t * 100))
            : String(Math.round(t * 10) / 10)))
      : undefined;
    const text = !isStrip && !dots ? (valueText ?? c.label) : undefined;
    const darkText = scale != null && t > 0.55;

    const labelStyle: TextStyle[] = [styles.label];
    if (labelPosition === 'corner') labelStyle.push(styles.labelCorner);
    if (darkText) labelStyle.push(styles.labelDark);

    return (
      <View
        key={i}
        style={[
          styles.cell,
          baseStyle,
          cellStyle,
          shineStyle,
          c.flag && styles.cellFlag,
          c.today && [styles.cellToday, todayColor ? { borderColor: todayColor } : null],
        ]}
      >
        {dots && (
          <View
            style={{
              width: cellSize * (0.35 + t * 0.65),
              height: cellSize * (0.35 + t * 0.65),
              borderRadius: cellSize,
              backgroundColor: scale != null ? mix(color, op) : color,
            }}
          />
        )}
        {c.flag && <View style={styles.flag} />}
        {c.today && todayPulse && <View style={styles.pulse} />}
        {text != null && <Text style={labelStyle}>{text}</Text>}
      </View>
    );
  });

  const grid = (
    <View
      style={[
        styles.root,
        { gap },
        !isStrip && [styles.rootWrap, { width: gridWidth }],
        hasFrame ? null : style,
      ]}
    >
      {cellNodes}
    </View>
  );

  if (!hasFrame) return grid;

  const leftPad = rowLabels?.length ? ROW_LABELS_W : 0;

  return (
    <View style={style}>
      {colLabels?.length ? (
        <View style={[styles.axisRow, { marginLeft: leftPad, width: gridWidth }]}>
          {colLabels.map((cl, i) => (
            <Text
              key={i}
              style={[
                styles.axisText,
                { position: 'absolute', top: 0, left: cl.at * (cellSize + gap) + cellSize / 2 - 20 },
              ]}
            >
              {cl.label}
            </Text>
          ))}
        </View>
      ) : null}
      <View style={styles.frameRow}>
        {rowLabels?.length ? (
          <View style={[styles.rowLabels, { gap }]}>
            {rowLabels.slice(0, rows).map((t, i) => (
              <View key={i} style={[styles.rowLabelSlot, { height: cellSize }]}>
                <Text style={styles.rowLabelText} numberOfLines={1}>
                  {t}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
        {grid}
      </View>
      {letters ? (
        <View style={[styles.axisRow, { marginLeft: leftPad, width: gridWidth }]}>
          {Array.from(letters.slice(0, columns)).map((ch, i) => (
            <Text
              key={i}
              style={[
                styles.axisText,
                { position: 'absolute', bottom: 0, left: i * (cellSize + gap) + cellSize / 2 - 20 },
              ]}
            >
              {ch}
            </Text>
          ))}
        </View>
      ) : null}
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
  // today / now — accent ring by default (HM-15 overrides via todayColor)
  cellToday: {
    borderColor: colors.accent,
  },
  // flagged cell — low-zone ring
  cellFlag: {
    borderColor: colors.zoneLow,
  },
  // HM-08 gap-aware — missing slot: dashed empty cell
  cellMissing: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    borderColor: colors.border2,
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
  // HM-15 today-ring — glowing dot above the today cell (static on native)
  pulse: {
    position: 'absolute',
    top: -10,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.mint,
    shadowColor: colors.mint,
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
  // HM-04 month-cal — tiny numeral pinned to the cell's top-left corner
  labelCorner: {
    position: 'absolute',
    top: 2,
    left: 3,
    fontSize: 8,
    lineHeight: 9,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.55)',
  },
  // dark text on hot cells (scale modes, t > 0.55)
  labelDark: {
    color: colors.void,
  },
  frameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowLabels: {
    width: ROW_LABELS_W,
    paddingRight: 6,
  },
  rowLabelSlot: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  axisRow: {
    position: 'relative',
    height: 14,
  },
  axisText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 0.5,
    color: colors.textFaint,
    width: 40,
    textAlign: 'center',
  },
  rowLabelText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 0.5,
    color: colors.textFaint,
    textAlign: 'right',
  },
});
