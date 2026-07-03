import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type ViewProps,
  type DimensionValue,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '@lockin90/tokens';

/**
 * Catalog variants (design catalog `progress-charts.html`, PL-01…PL-16).
 * Omit `variant` for the classic determinate/indeterminate bar.
 */
export type ProgressBarVariant =
  | 'progress' // PL-01
  | 'zone-progress' // PL-04
  | 'step-cells' // PL-08
  | 'milestone-line' // PL-09
  | 'ghost-compare' // PL-11
  | 'overflow-badge' // PL-13
  | 'head-pill' // PL-14
  | 'countdown-drain'; // PL-16

export interface ProgressBarProps extends ViewProps {
  /**
   * Progress fraction 0..1. When `undefined` the bar is **indeterminate** — a
   * gradient band sweeps continuously (use while a duration is unknown).
   * `overflow-badge` accepts values > 1 (the fill caps, the badge shows the over).
   */
  value?: number;
  /** Bar height in px (default 8 — the PL-01 SELECT: 3 hairline / 8 default / 18 thick). */
  height?: number;
  /** Fill gradient stops — accepts any number of colors; defaults to a
   *  2-stop accent→cyan. Pass the full `gradients.flux.stops` for the
   *  multi-color energy spectrum used by the onboarding tracker.
   *  (Catalog variants default solid mint when unset.) */
  gradient?: readonly string[];
  /** The unfilled track color (default a faint glass rail). */
  track?: string;
  /** Optional label rendered above the bar (the variant title row). */
  label?: string;
  /** Render the percentage (classic default false; variants default true). */
  showValue?: boolean;
  /** Fully-rounded ends (default true). */
  rounded?: boolean;
  /** Render one of the catalog progress forms; omit → the classic bar. */
  variant?: ProgressBarVariant;
  /** Variant solid fill — any token hex (alternative to `gradient`). */
  color?: string;
  /** Mono sub-copy under the bar (e.g. `94 g logged · 36 g to go`). */
  sub?: string;
  /** `step-cells`: number of cells (default 10); filled = `round(value · steps)`. */
  steps?: number;
  /** Milestone fractions 0..1 — ticks + dots, lit when passed (`milestone-line` defaults 25/50/75). */
  milestones?: number[];
  /** `ghost-compare`: previous-period fraction 0..1 — white-16% layer under the fill. */
  ghost?: number;
  /** GOAL tick + pill at this fraction 0..1 (zone-mid). */
  target?: number;
  /** Glow underlay behind the fill (wider faint duplicate — no blur on native). */
  shine?: boolean;
}

const DEFAULT_GRADIENT: readonly string[] = [colors.accent, colors.cyan];
/** Width of the sweeping band, as a fraction of the track. */
const BAND_FRACTION = 0.38;

/** catalog zone thresholds: ≥0.62 high · ≥0.38 mid · else low */
const zoneOf = (f: number) => (f >= 0.62 ? colors.zoneHigh : f >= 0.38 ? colors.zoneMid : colors.zoneLow);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** tint a #rrggbb token to ~35% alpha (chip-pill hairline) */
const tint35 = (c: string) => (c.startsWith('#') && c.length === 7 ? `${c}59` : c);

/** chip-pill (catalog C.tag): dark rounded rect + tinted hairline + mono text */
function Pill({ color, children }: { color: string; children: string }) {
  return (
    <View style={[styles.pill, { borderColor: tint35(color) }]}>
      <Text style={[styles.pillText, { color }]}>{children}</Text>
    </View>
  );
}

/** The catalog-variant renderer (internal). */
function VariantBar({
  variant,
  value,
  height = 8,
  gradient,
  track = 'rgba(255,255,255,0.07)',
  label,
  showValue,
  rounded = true,
  color,
  sub,
  steps = 10,
  milestones,
  ghost,
  target,
  shine,
  style,
  ...rest
}: ProgressBarProps & { variant: ProgressBarVariant }) {
  const raw = Math.max(0, value ?? 0);
  const vc = clamp01(raw); // clamped fraction (fill width, zone color)
  const overflowMode = variant === 'overflow-badge';
  // the readout is NOT capped in overflow mode (catalog shows e.g. 112%)
  const pct = Math.round((overflowMode ? raw : vc) * 100);
  const showPct = showValue ?? true;
  const radius = rounded ? height : 0;

  const zoneFill = variant === 'zone-progress';
  const solidFill = zoneFill
    ? zoneOf(vc)
    : color ?? (variant === 'countdown-drain' ? colors.zoneLow : colors.mint);
  const useGradient = !zoneFill && !!gradient;
  const pctColor = zoneFill ? zoneOf(vc) : colors.text;
  // pill riding the fill head — cyan stand-in when the fill is a gradient (catalog rule)
  const headColor = useGradient ? colors.cyan : solidFill;

  const marks = variant === 'milestone-line' ? milestones ?? [0.25, 0.5, 0.75] : milestones;
  const hasMarks = !!marks && marks.length > 0 && variant !== 'step-cells';
  const hasPills = variant === 'head-pill' || target != null;

  const done = Math.round(vc * steps);
  const showFoot = sub != null || (overflowMode && raw > 1);

  const fillWidth = `${vc * 100}%` as DimensionValue;

  const fill = useGradient ? (
    <LinearGradient
      colors={gradient as unknown as readonly [string, string, ...string[]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.vfill,
        variant === 'countdown-drain' ? styles.vfillDrain : null,
        { width: fillWidth, borderRadius: radius },
      ]}
    />
  ) : (
    <View
      style={[
        styles.vfill,
        variant === 'countdown-drain' ? styles.vfillDrain : null,
        { width: fillWidth, borderRadius: radius, backgroundColor: solidFill },
      ]}
    />
  );

  return (
    <View style={[styles.root, style]} {...rest}>
      {(label || showPct) && (
        <View style={styles.vhead}>
          {label ? <Text style={styles.vtitle}>{label}</Text> : <View />}
          {showPct && <Text style={[styles.vpct, { color: pctColor }]}>{pct}%</Text>}
        </View>
      )}

      {variant === 'step-cells' ? (
        /* ---- PL-08: discrete cells + counter ---- */
        <>
          <View style={styles.cells}>
            {Array.from({ length: Math.max(1, steps) }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.cell,
                  { height },
                  i < done ? { backgroundColor: useGradient ? gradient![0] : solidFill } : null,
                ]}
              />
            ))}
          </View>
          <Text style={styles.vsub}>{sub ?? `${done} / ${steps} STEPS`}</Text>
        </>
      ) : (
        <View
          style={[
            styles.vrail,
            hasMarks ? styles.vrailMarks : null,
            hasPills ? styles.vrailPills : null,
          ]}
        >
          {shine && (
            /* glow = a wider faint duplicate behind the track (no blur on native) */
            <View
              style={[
                styles.vshine,
                { width: fillWidth, height: height + 5, borderRadius: radius, backgroundColor: useGradient ? gradient![0] : solidFill },
              ]}
            />
          )}
          <View style={[styles.vtrack, { height, borderRadius: radius, backgroundColor: track }]}>
            {ghost != null && (
              <View
                style={[
                  styles.vghost,
                  { width: `${clamp01(ghost) * 100}%` as DimensionValue, borderRadius: radius },
                ]}
              />
            )}
            {fill}
          </View>
          {hasMarks &&
            marks!.map((m) => (
              <View key={m} pointerEvents="none" style={StyleSheet.absoluteFill}>
                <View style={[styles.tick, { left: `${clamp01(m) * 100}%` as DimensionValue, top: -3, height: height + 6 }]} />
                <View
                  style={[
                    styles.dot,
                    {
                      left: `${clamp01(m) * 100}%` as DimensionValue,
                      backgroundColor: vc >= m ? (useGradient ? gradient![0] : solidFill) : 'rgba(255,255,255,0.2)',
                    },
                  ]}
                />
              </View>
            ))}
          {target != null && (
            <>
              <View
                style={[
                  styles.goalTick,
                  { left: `${clamp01(target) * 100}%` as DimensionValue, top: -5, height: height + 10 },
                ]}
              />
              <View style={[styles.pillAnchor, { left: `${clamp01(target) * 100}%` as DimensionValue, bottom: height + 7 }]}>
                <Pill color={colors.zoneMid}>{`GOAL ${Math.round(clamp01(target) * 100)}`}</Pill>
              </View>
            </>
          )}
          {variant === 'head-pill' && (
            <View style={[styles.pillAnchor, { left: fillWidth, bottom: height + 7 }]}>
              <Pill color={headColor}>{`${pct}%`}</Pill>
            </View>
          )}
        </View>
      )}

      {showFoot && variant !== 'step-cells' && (
        <View style={styles.vfoot}>
          {sub != null ? <Text style={[styles.vsub, styles.vsubFoot]}>{sub}</Text> : <View />}
          {overflowMode && raw > 1 && (
            <Pill color={colors.lime}>{`+${Math.round((raw - 1) * 100)} OVER`}</Pill>
          )}
        </View>
      )}
    </View>
  );
}

/**
 * Aurora-Flux linear progress bar with a gradient fill. Supports both a
 * **determinate** mode (a known `value` 0..1 → a sized gradient fill) and an
 * **indeterminate** mode (omit `value` → an Animated sweeping band) — plus
 * the catalog `variant` forms (PL-01…PL-16): title+%+sub rows, zone coloring,
 * step cells, milestone ticks, a ghost compare layer, an overflow badge, a
 * head pill riding the fill, and a right→left countdown drain.
 *
 * Distinct from `BarFill`, which is a static fraction fill only — `ProgressBar`
 * adds the indeterminate animation, an optional label / percentage, and tone.
 * Same prop API as web (native `gradient` is a `[from, to]` tuple).
 */
export function ProgressBar(props: ProgressBarProps) {
  if (props.variant) {
    return <VariantBar {...props} variant={props.variant} />;
  }

  const {
    value,
    height = 8,
    gradient = DEFAULT_GRADIENT,
    track = colors.glass,
    label,
    showValue = false,
    rounded = true,
    style,
    // consume variant-only props so they don't reach the root View
    variant: _variant,
    color: _color,
    sub: _sub,
    steps: _steps,
    milestones: _milestones,
    ghost: _ghost,
    target: _target,
    shine: _shine,
    ...rest
  } = props;

  const indeterminate = value == null;
  const v = indeterminate ? 0 : Math.max(0, Math.min(1, value));
  const pct = Math.round(v * 100);
  const radius = rounded ? height : 0;
  const colorStops = gradient ?? DEFAULT_GRADIENT;

  // measure the track so the sweeping band can translate across its real width
  const [trackW, setTrackW] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setTrackW(e.nativeEvent.layout.width);

  const sweep = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!indeterminate || trackW <= 0) return;
    sweep.setValue(0);
    const loop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 1500,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [indeterminate, trackW, sweep]);

  const bandW = Math.max(0, trackW * BAND_FRACTION);
  const translateX = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: [-bandW, trackW],
  });

  return (
    <View style={[styles.root, style]} {...rest}>
      {(label || (showValue && !indeterminate)) && (
        <View style={styles.meta}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {showValue && !indeterminate && <Text style={styles.value}>{pct}%</Text>}
        </View>
      )}

      <View
        onLayout={onLayout}
        style={[styles.track, { height, borderRadius: radius, backgroundColor: track }]}
      >
        {indeterminate ? (
          <Animated.View
            style={[
              styles.band,
              { width: bandW, height: '100%', borderRadius: radius, transform: [{ translateX }] },
            ]}
          >
            <LinearGradient
              colors={colorStops as unknown as readonly [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1, borderRadius: radius }}
            />
          </Animated.View>
        ) : (
          <LinearGradient
            colors={colorStops as unknown as readonly [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: '100%', width: `${pct}%` as DimensionValue, borderRadius: radius }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '100%' },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 },
  label: { fontFamily: 'JetBrains Mono', fontSize: 10.5, letterSpacing: 0.2, color: colors.textDim },
  value: { fontFamily: 'JetBrains Mono', fontSize: 10.5, color: colors.accent2 },
  track: { width: '100%', overflow: 'hidden' },
  band: { position: 'absolute', top: 0, left: 0, overflow: 'hidden' },

  /* ---- catalog variants ---- */
  // header row: mono title left, bold display % right (catalog header)
  vhead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 9 },
  vtitle: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  vpct: { fontFamily: fonts.display, fontSize: 15, fontWeight: '700' },
  // the rail wraps the track so ticks / dots / pills can overflow it
  vrail: { position: 'relative' },
  vrailMarks: { marginTop: 12 },
  vrailPills: { marginTop: 20 },
  vtrack: { width: '100%', overflow: 'hidden' },
  vfill: { position: 'absolute', top: 0, bottom: 0, left: 0 },
  vfillDrain: { left: undefined, right: 0 },
  vghost: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  // glow = wider faint duplicate behind the track (no blur filters on native)
  vshine: { position: 'absolute', left: 0, top: -2.5, opacity: 0.35 },
  // PL-08 step cells
  cells: { flexDirection: 'row', gap: 3 },
  cell: { flex: 1, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.07)' },
  // PL-09 milestone ticks + dots
  tick: { position: 'absolute', width: 1, marginLeft: -0.5, backgroundColor: 'rgba(255,255,255,0.3)' },
  dot: { position: 'absolute', top: -9, width: 4.8, height: 4.8, marginLeft: -2.4, borderRadius: 2.4 },
  // GOAL tick (target) — amber rule through the bar
  goalTick: { position: 'absolute', width: 1.6, marginLeft: -0.8, backgroundColor: colors.zoneMid },
  // zero-width anchor that centers a pill on a % position (translateX(-50%))
  pillAnchor: { position: 'absolute', width: 0, alignItems: 'center' },
  // chip-pill (catalog C.tag)
  pill: {
    height: 13,
    paddingHorizontal: 6,
    borderRadius: 6.5,
    borderWidth: 1,
    backgroundColor: 'rgba(8,10,18,0.78)',
    justifyContent: 'center',
  },
  pillText: { fontFamily: fonts.mono, fontSize: 8, letterSpacing: 0.4, lineHeight: 9 },
  // sub-copy + foot row (sub left · overflow pill right)
  vsub: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 0.4, color: colors.textFaint, marginTop: 7 },
  vsubFoot: { marginTop: 0 },
  vfoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 7 },
});
