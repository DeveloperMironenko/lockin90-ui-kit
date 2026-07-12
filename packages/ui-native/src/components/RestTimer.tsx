import { useId, type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, FeGaussianBlur, Filter, G } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';
import { Button } from './Button';

export interface RestTimerProps {
  /** Seconds left (drives the arc + the centered readout). */
  remainingSec: number;
  /** Full rest duration in seconds (the 100% arc). */
  totalSec: number;
  /** Small mono caption inside the ring, above the time (default `'Rest'`). */
  label?: string;
  /** Dim line next to the ring (e.g. `'Next: Bench Press · set 3 of 5'`). */
  sublabel?: string;
  /** Trailing slot on the far right (e.g. a live HR readout). */
  trailing?: ReactNode;
  /** When given, renders the ghost `Skip` button. */
  onSkip?: () => void;
  /** Dims the arc + readout while the countdown is held. */
  paused?: boolean;
  /**
   * Compact bar layout — the design's Active rest bar (`.rb`/`.rg`): a 42px
   * ring (r 18, stroke 4) with ONLY the mint time inside; `label` moves OUT
   * of the ring into a text column above `sublabel` (mono caption over bold
   * display line, e.g. "Rest" / "Next 1:05"); Skip + `trailing` sit inline on
   * the right. No card chrome — the consumer wraps it in a Card. Default
   * `false` keeps the 116px hero ring.
   */
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

/* ring geometry — 116px viewBox, r 50 (matches the web twin exactly) */
const SIZE = 116;
const R = 50;
const C = 2 * Math.PI * R;
/* compact ring geometry — the design's Active rest bar `.rg` (42px, r 18) */
const SIZE_COMPACT = 42;
const R_COMPACT = 18;

/** `95 → '1:35'` — minutes:seconds, mono-friendly. */
export function formatRestTime(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

/** Remaining fraction, clamped 0–1. */
export function restFraction(remainingSec: number, totalSec: number): number {
  if (!(totalSec > 0)) return 0;
  return Math.max(0, Math.min(1, remainingSec / totalSec));
}

/**
 * RestTimer — the between-sets countdown: a mint arc draining on a faint
 * track with the remaining time centered in mono, plus an optional sublabel,
 * a ghost Skip transport, and a `trailing` slot. `compact` swaps the 116px
 * hero ring for the design's Active rest bar (`.rb`/`.rg`): a 42px ring
 * holding only the mint time, label + sublabel stacked beside it. Native twin
 * of the web `RestTimer` (same prop API + geometry). Purely prop-driven — the
 * caller ticks `remainingSec`; the arc re-renders per tick (the web's
 * dashoffset transition has no native precedent — same rule as Ring's static
 * pulse). The mint glow is a real Gaussian-blurred duplicate arc.
 */
export function RestTimer({
  remainingSec,
  totalSec,
  label = 'Rest',
  sublabel,
  trailing,
  onSkip,
  paused = false,
  compact = false,
  style,
}: RestTimerProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const blurId = `lk-resttimer-blur-${uid}`;
  const frac = restFraction(remainingSec, totalSec);
  const time = formatRestTime(remainingSec);
  /* same dasharray math on both scales — only the geometry changes */
  const size = compact ? SIZE_COMPACT : SIZE;
  const r = compact ? R_COMPACT : R;
  const strokeWidth = compact ? 4 : 8;
  const c = compact ? 2 * Math.PI * R_COMPACT : C;
  const offset = c * (1 - frac);
  const hasSide = sublabel != null || onSkip != null;
  const half = size / 2;
  const skip = onSkip ? <Button variant="ghost" size="sm" title="Skip" onPress={onSkip} /> : null;

  const arcProps = {
    cx: half,
    cy: half,
    r,
    strokeWidth,
    stroke: colors.mint,
    fill: 'none' as const,
    strokeLinecap: 'round' as const,
    strokeDasharray: `${c.toFixed(2)}`,
    strokeDashoffset: offset,
  };

  return (
    <View
      accessibilityLabel={`${label}: ${time} remaining${paused ? ', paused' : ''}`}
      style={[styles.row, compact && styles.rowCompact, style]}
    >
      <View style={compact ? styles.ringCompact : styles.ring}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {!paused ? (
            <Defs>
              <Filter id={blurId} filterUnits="userSpaceOnUse" x={-12} y={-12} width={size + 24} height={size + 24}>
                <FeGaussianBlur stdDeviation={3} />
              </Filter>
            </Defs>
          ) : null}
          <Circle cx={half} cy={half} r={r} strokeWidth={strokeWidth} stroke="rgba(255,255,255,0.07)" fill="none" />
          <G rotation={-90} originX={half} originY={half} opacity={paused ? 0.4 : 1}>
            {/* glow — a Gaussian-blurred duplicate arc (the web drop-shadow) */}
            {!paused ? <Circle {...arcProps} opacity={0.45} filter={`url(#${blurId})`} /> : null}
            <Circle {...arcProps} />
          </G>
        </Svg>
        <View style={styles.center} pointerEvents="none">
          {/* compact: ONLY the mint time inside the ring (design `.rg .num`) */}
          {!compact && <Text style={styles.label}>{label.toUpperCase()}</Text>}
          <Text
            style={[compact ? styles.timeCompact : styles.time, paused && styles.timePaused]}
          >
            {time}
          </Text>
        </View>
      </View>
      {compact ? (
        <>
          {/* compact: the label moves OUT of the ring into the text column
              (design `.rb .rl` over `.rb .rt`) */}
          <View style={styles.mainCompact}>
            <Text style={styles.labelCompact}>{label.toUpperCase()}</Text>
            {sublabel != null && <Text style={styles.subCompact}>{sublabel}</Text>}
          </View>
          {skip}
        </>
      ) : hasSide ? (
        <View style={styles.main}>
          {sublabel != null && <Text style={styles.sub}>{sublabel}</Text>}
          {skip}
        </View>
      ) : null}
      {trailing != null && <View style={styles.trailing}>{trailing}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  rowCompact: { gap: 10 },
  ring: { width: SIZE, height: SIZE },
  ringCompact: { width: SIZE_COMPACT, height: SIZE_COMPACT },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1.3, color: colors.textFaint },
  time: {
    fontFamily: fonts.mono,
    fontSize: 22,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: colors.text,
    lineHeight: 24,
  },
  // compact centered readout — MINT mono 11 bold (design `.rg .num`)
  timeCompact: {
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: colors.mint,
    lineHeight: 13,
  },
  timePaused: { color: colors.textDim },
  main: { flex: 1, alignItems: 'flex-start', gap: 9, minWidth: 0 },
  sub: { fontSize: 12.5, color: colors.textDim },
  // compact text column — mono caption over bold display line (design `.rl`/`.rt`)
  mainCompact: { flex: 1, alignItems: 'flex-start', gap: 1, minWidth: 0 },
  labelCompact: { fontFamily: fonts.mono, fontSize: 7, letterSpacing: 1, color: colors.textFaint },
  subCompact: { fontFamily: fonts.display, fontSize: 12, fontWeight: '700', color: colors.text },
  trailing: { marginLeft: 'auto' },
});
