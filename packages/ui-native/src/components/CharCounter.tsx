import { View, Text, StyleSheet, type ViewProps, type DimensionValue } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';

/** Length status — drives the fill + count color. */
export type CharCounterStatus = 'ok' | 'warn' | 'over';

export interface CharCounterProps extends ViewProps {
  /** current input length */
  value: number;
  /** the length limit */
  max: number;
  /** fraction (0..1) of max at which to flip to the warn state (default 0.85) */
  warnAt?: number;
  /** render the thin fill bar (default true) */
  showBar?: boolean;
  /** render the "value / max" mono readout (default true) */
  showCount?: boolean;
  /** override the readout text (default `${value} / ${max}`) */
  format?: (value: number, max: number) => string;
}

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

/** Resolve the length status from value/max and the warn threshold. */
const statusOf = (value: number, max: number, warnAt: number): CharCounterStatus => {
  if (value > max) return 'over';
  if (value >= warnAt * max) return 'warn';
  return 'ok';
};

const defaultFormat = (value: number, max: number) => `${value} / ${max}`;

/** Fill color per status: ok → mint, warn → zone-mid (amber), over → bad (red). */
const FILL_COLOR: Record<CharCounterStatus, string> = {
  ok: colors.mint,
  warn: colors.zoneMid,
  over: colors.bad,
};

/** Count text color per status: ok → faint, warn → amber, over → red. */
const COUNT_COLOR: Record<CharCounterStatus, string> = {
  ok: colors.textFaint,
  warn: colors.warn,
  over: colors.bad,
};

/**
 * CharCounter — an input-aware character-count feedback row.
 *
 * A thin fill bar (fraction = value/max) + a "value / max" mono readout that
 * turns warn (approaching max) then over (exceeds max). For SEO meta fields,
 * post titles, bio fields — any length-limited input.
 *
 * Distinct from Meter (generic value-in-range) and BarFill (raw fraction): this
 * is specifically the count/limit form-field adornment with an over-limit state
 * and an "x / max" readout. Mirrors the .charbar from the CMS editors.
 */
export function CharCounter({
  value,
  max,
  warnAt = 0.85,
  showBar = true,
  showCount = true,
  format = defaultFormat,
  style,
  ...rest
}: CharCounterProps) {
  const safeMax = max || 1;
  const frac = clamp(value / safeMax, 0, 1);
  const status = statusOf(value, max, warnAt);
  const fillWidth = `${frac * 100}%` as DimensionValue;

  return (
    <View style={[styles.root, style]} {...rest}>
      {showBar && (
        <View style={styles.track}>
          <View style={[styles.fill, { width: fillWidth, backgroundColor: FILL_COLOR[status] }]} />
        </View>
      )}
      {showCount && (
        <Text style={[styles.ct, { color: COUNT_COLOR[status] }]} numberOfLines={1}>
          {format(value, max)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 6,
  },
  track: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  ct: {
    flexShrink: 0,
    fontFamily: fonts.mono,
    fontSize: 9.5,
    color: colors.textFaint,
  },
});
