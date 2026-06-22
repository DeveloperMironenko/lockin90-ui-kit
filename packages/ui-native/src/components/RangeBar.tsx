import {
  View,
  Text,
  StyleSheet,
  type ViewProps,
  type DimensionValue,
} from 'react-native';
import { colors, fonts } from '@lockin90/tokens';

/**
 * Marker tone — colors the value marker dot.
 * 'auto' = colored by which zone the value lands in (low→warn, optimal→ok, high→bad).
 */
export type RangeBarMarkerTone = 'auto' | 'ok' | 'warn' | 'bad';

export interface RangeBarProps extends ViewProps {
  /** the current value, in [min, max] */
  value: number;
  /** range floor (default 0) */
  min?: number;
  /** range ceiling (default 100) */
  max?: number;
  /** lower optimal boundary — [min, low] is the low (amber) zone */
  low: number;
  /** upper optimal boundary — [high, max] is the high (red) zone */
  high: number;
  /** mono uppercase caption shown above the track */
  label?: string;
  /** suffix after the value readout (e.g. 'mg/dL', 'ng/dL') */
  unit?: string;
  /** show the numeric value (+ unit) on the label row */
  showValue?: boolean;
  /** marker color — 'auto' picks by zone (default), or force ok/warn/bad */
  markerTone?: RangeBarMarkerTone;
}

/** Clamp x into [lo, hi]. */
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

/** Marker tone → its color. */
const MARKER_COLOR: Record<Exclude<RangeBarMarkerTone, 'auto'>, string> = {
  ok: colors.zoneHigh,
  warn: colors.zoneMid,
  bad: colors.zoneLow,
};

// zone fills (mirror the web track's tinted gradient stops)
const LOW_FILL = 'rgba(255,77,109,0.30)';
const HIGH_FILL = 'rgba(255,77,109,0.30)';

/**
 * RangeBar — a reference-range bar for biomarkers / labs.
 *
 * A horizontal track split into low / optimal / high colored zones, with a
 * marker dot showing where the current value falls (e.g. fasting glucose vs its
 * healthy range). The three zones are [min,low] low (amber/red-tinted),
 * [low,high] optimal (green band), [high,max] high (red-tinted); the marker
 * auto-colors by the zone it lands in unless `markerTone` forces it. Mirrors the
 * web RangeBar (same export + prop API).
 */
export function RangeBar({
  value,
  min = 0,
  max = 100,
  low,
  high,
  label,
  unit,
  showValue = false,
  markerTone = 'auto',
  style,
  ...rest
}: RangeBarProps) {
  const span = max - min || 1;
  const lowFrac = clamp((low - min) / span, 0, 1);
  const highFrac = clamp((high - min) / span, 0, 1);
  const posFrac = clamp((value - min) / span, 0, 1);

  // auto tone reflects which zone the value lands in
  const autoTone: Exclude<RangeBarMarkerTone, 'auto'> =
    value < low ? 'warn' : value > high ? 'bad' : 'ok';
  const tone = markerTone === 'auto' ? autoTone : markerTone;
  const markerColor = MARKER_COLOR[tone];

  const hasHeader = label != null || showValue;

  const lowW = `${lowFrac * 100}%` as DimensionValue;
  const optW = `${Math.max(0, highFrac - lowFrac) * 100}%` as DimensionValue;
  const highW = `${Math.max(0, 1 - highFrac) * 100}%` as DimensionValue;
  const bandLeft = `${lowFrac * 100}%` as DimensionValue;
  const markerLeft = `${posFrac * 100}%` as DimensionValue;

  const valueColor =
    tone === 'warn' ? colors.zoneMid : tone === 'bad' ? colors.zoneLow : colors.textDim;

  return (
    <View style={[styles.root, style]} {...rest}>
      {hasHeader && (
        <View style={styles.head}>
          {label != null && <Text style={styles.label}>{label}</Text>}
          {showValue && (
            <Text style={[styles.value, { color: valueColor }]}>
              {value}
              {unit != null && <Text style={styles.unit}>{unit}</Text>}
            </Text>
          )}
        </View>
      )}

      <View style={styles.track}>
        {/* 3 tinted zone segments sized by their fractions */}
        <View style={[styles.zone, { width: lowW, backgroundColor: LOW_FILL }]} />
        <View style={[styles.zone, { width: optW, backgroundColor: 'rgba(52,245,197,0.28)' }]} />
        <View style={[styles.zone, { width: highW, backgroundColor: HIGH_FILL }]} />

        {/* the in-range (green) optimal band, drawn over the optimal segment */}
        <View
          style={[styles.band, { left: bandLeft, width: optW }]}
          pointerEvents="none"
        />

        {/* the value marker dot, tone-colored, at the value's fraction */}
        <View
          style={[
            styles.marker,
            {
              left: markerLeft,
              backgroundColor: markerColor,
              shadowColor: markerColor,
            },
          ]}
          pointerEvents="none"
        />
      </View>
    </View>
  );
}

const TRACK_H = 10;
const MARKER = 14;

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

  /* the 3-zone track */
  track: {
    position: 'relative',
    flexDirection: 'row',
    height: TRACK_H,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'visible',
  },
  zone: {
    height: '100%',
  },

  /* the in-range green optimal band */
  band: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: 'rgba(52,245,197,0.45)',
  },

  /* the value marker dot */
  marker: {
    position: 'absolute',
    top: '50%',
    width: MARKER,
    height: MARKER,
    borderRadius: MARKER / 2,
    marginLeft: -MARKER / 2,
    marginTop: -MARKER / 2,
    borderWidth: 2.5,
    borderColor: colors.bg0,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
    zIndex: 3,
  },
});
