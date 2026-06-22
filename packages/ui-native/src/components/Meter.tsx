import { View, Text, StyleSheet, type ViewProps, type DimensionValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, fonts } from '@lockin90/tokens';

/** Zone tone — colors the fill (and segments). 'accent' is the gradient default. */
export type MeterTone = 'high' | 'mid' | 'low' | 'accent';

export interface MeterProps extends ViewProps {
  /** the scalar value to read out, in [min, max] */
  value: number;
  /** range floor (default 0) */
  min?: number;
  /** range ceiling (default 100) */
  max?: number;
  /** mono uppercase caption shown above the track */
  label?: string;
  /** show the numeric value (+ unit) on the label row */
  showValue?: boolean;
  /** suffix after the value readout (e.g. '%', 'pts') */
  unit?: string;
  /** zone color of the fill / filled segments (default 'accent' gradient) */
  tone?: MeterTone;
  /** target marker — renders a tick at this value on the track (continuous mode) */
  threshold?: number;
  /** segmented mode: render N discrete cells, filled by the value fraction */
  segments?: number;
}

/** Solid color for zone tones (accent renders as a gradient instead). */
const TONE_COLOR: Record<Exclude<MeterTone, 'accent'>, string> = {
  high: colors.zoneHigh,
  mid: colors.zoneMid,
  low: colors.zoneLow,
};

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

/**
 * Meter — a labelled horizontal fill meter for a scalar value within a range.
 *
 * A semantic value-in-range readout (distinct from the raw BarFill fraction bar
 * and the loading ProgressBar): an optional mono label + value readout, an
 * optional target/threshold marker tick, a zone tone, and an optional SEGMENTED
 * mode (N discrete cells filled by the value fraction — e.g. password-strength
 * or confidence meters).
 */
export function Meter({
  value,
  min = 0,
  max = 100,
  label,
  showValue = false,
  unit,
  tone = 'accent',
  threshold,
  segments,
  style,
  ...rest
}: MeterProps) {
  const span = max - min || 1;
  const frac = clamp((value - min) / span, 0, 1);
  const segmented = typeof segments === 'number' && segments > 0;

  // accent → gradient; zone tones → solid glow color
  const segColor = tone === 'accent' ? colors.accent : TONE_COLOR[tone];
  const glow = tone === 'accent' ? colors.accent : TONE_COLOR[tone];

  const hasHeader = label != null || showValue;
  const fillWidth = `${frac * 100}%` as DimensionValue;

  return (
    <View style={[styles.root, style]} {...rest}>
      {hasHeader && (
        <View style={styles.head}>
          {label != null && <Text style={styles.label}>{label}</Text>}
          {showValue && (
            <Text style={styles.value}>
              {value}
              {unit != null && <Text style={styles.unit}>{unit}</Text>}
            </Text>
          )}
        </View>
      )}

      {segmented ? (
        <View style={styles.segs}>
          {Array.from({ length: segments }, (_, i) => {
            const on = frac > 0 && frac >= (i + 1) / segments - 1e-9;
            return (
              <View
                key={i}
                style={[
                  styles.seg,
                  on && {
                    backgroundColor: segColor,
                    shadowColor: glow,
                    shadowOpacity: 0.8,
                    shadowRadius: 6,
                  },
                ]}
              />
            );
          })}
        </View>
      ) : (
        <View style={styles.track}>
          {tone === 'accent' ? (
            <LinearGradient
              colors={[...gradients.cta.stops] as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.fill, { width: fillWidth }]}
            />
          ) : (
            <View style={[styles.fill, { width: fillWidth, backgroundColor: segColor }]} />
          )}
          {typeof threshold === 'number' && (
            <View
              style={[
                styles.tick,
                { left: `${clamp((threshold - min) / span, 0, 1) * 100}%` as DimensionValue },
              ]}
            />
          )}
        </View>
      )}
    </View>
  );
}

const TRACK_H = 8;

const styles = StyleSheet.create({
  root: { width: '100%', gap: 8 },
  head: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.68,
    color: colors.textFaint,
  },
  value: {
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: '500',
    color: colors.textDim,
  },
  unit: { color: colors.textFaint },
  /* continuous track + fill */
  track: {
    position: 'relative',
    height: TRACK_H,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  /* threshold tick — overlaid on the track */
  tick: {
    position: 'absolute',
    top: -2,
    bottom: -2,
    width: 2,
    marginLeft: -1,
    borderRadius: 999,
    backgroundColor: colors.textDim,
  },
  /* segmented mode */
  segs: { flexDirection: 'row', gap: 5 },
  seg: {
    flex: 1,
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
