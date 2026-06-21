import { useId, type ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

export interface RestTimerProps {
  /** Eyebrow label, top-left. */
  label?: string;
  /** Target chip text, top-right (e.g. "target 2:00"). Defaults from `total`. */
  target?: string;
  /** Seconds remaining in the rest period. */
  remaining?: number;
  /** Total seconds of the rest period (drives the arc + target chip). */
  total?: number;
  /** Small caption under the clock (e.g. "until set 3"). */
  subtitle?: string;
  /** Next-set name (bold part of the footer, e.g. "Set 3"). */
  nextLabel?: ReactNode;
  /** Plain detail after the bold next-set name (e.g. " · Bench Press · 5 × 80kg"). */
  nextDetail?: ReactNode;
  /** Whether the timer is paused (toggles the pause/resume control glyph + label). */
  paused?: boolean;
  /** Pause / resume tap. */
  onTogglePause?: () => void;
  /** Subtract 15s. */
  onMinus?: () => void;
  /** Add 15s. */
  onPlus?: () => void;
  /** Skip the rest period. */
  onSkip?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** mm:ss from a non-negative seconds count. */
function fmt(secs: number): string {
  const s = Math.max(0, Math.round(secs));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

const SIZE = 150;
const R = 66;
const C = 2 * Math.PI * R; // 414.69
const STROKE = 11;

/** One pill control — mono label + small stroked glyph (matches web `lk-rest-ctl`). */
function Control({ glyph, label, onPress, ariaLabel }: { glyph: ReactNode; label: string; onPress?: () => void; ariaLabel: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={ariaLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.ctlBtn, pressed && styles.ctlBtnPressed]}
    >
      <Svg width={13} height={13} viewBox="0 0 24 24">
        {glyph}
      </Svg>
      <Text style={styles.ctlLabel}>{label}</Text>
    </Pressable>
  );
}

/**
 * Rest timer — between-sets countdown with a gradient SVG arc (filled = time
 * remaining), an mm:ss readout, ±15s / pause / skip controls and a next-set
 * hint. Defaults to the design example ("01:12 until set 3", target 2:00).
 * Mirrors the web `RestTimer` prop API.
 */
export function RestTimer({
  label = 'Rest timer',
  target,
  remaining = 72,
  total = 120,
  subtitle = 'until set 3',
  nextLabel = 'Set 3',
  nextDetail = ' · Bench Press · 5 × 80kg',
  paused = false,
  onTogglePause,
  onMinus,
  onPlus,
  onSkip,
  style,
}: RestTimerProps) {
  const gradId = `lk-rest-grad-${useId()}`;
  const safeTotal = total > 0 ? total : 1;
  const frac = Math.max(0, Math.min(1, remaining / safeTotal));
  // Arc shows time remaining: fully drawn when remaining === total.
  const offset = C * (1 - frac);
  const cx = SIZE / 2;
  const targetText = target ?? `target ${fmt(safeTotal)}`;

  return (
    <View style={[styles.card, style]} accessibilityLabel="Rest timer between sets">
      <View style={styles.head}>
        <Text style={styles.headLabel}>{label}</Text>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{targetText}</Text>
        </View>
      </View>

      <View style={styles.wrap}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <Defs>
            <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#22D3EE" />
              <Stop offset="0.5" stopColor="#34F5C5" />
              <Stop offset="1" stopColor="#7C5CFF" />
            </LinearGradient>
          </Defs>
          <Circle cx={cx} cy={cx} r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={STROKE} />
          <Circle
            cx={cx}
            cy={cx}
            r={R}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cx})`}
          />
        </Svg>
        <View style={styles.center} pointerEvents="none">
          <Text style={styles.clock}>{fmt(remaining)}</Text>
          {subtitle != null && <Text style={styles.sub}>{subtitle}</Text>}
        </View>
      </View>

      <View style={styles.ctl}>
        <Control
          ariaLabel={paused ? 'Resume' : 'Pause'}
          label={paused ? 'Resume' : 'Pause'}
          onPress={onTogglePause}
          glyph={
            paused ? (
              <Path d="M6 4l14 8-14 8z" fill="none" stroke={colors.textDim} strokeWidth={1.9} strokeLinejoin="round" />
            ) : (
              <Path d="M8 5v14M16 5v14" fill="none" stroke={colors.textDim} strokeWidth={1.9} strokeLinecap="round" />
            )
          }
        />
        <Control
          ariaLabel="Minus 15 seconds"
          label="15s"
          onPress={onMinus}
          glyph={<Path d="M5 12h14" fill="none" stroke={colors.textDim} strokeWidth={1.9} strokeLinecap="round" />}
        />
        <Control
          ariaLabel="Plus 15 seconds"
          label="15s"
          onPress={onPlus}
          glyph={<Path d="M12 5v14M5 12h14" fill="none" stroke={colors.textDim} strokeWidth={1.9} strokeLinecap="round" />}
        />
        <Control
          ariaLabel="Skip rest"
          label="Skip"
          onPress={onSkip}
          glyph={<Path d="M5 4l10 8-10 8zM19 5v14" fill="none" stroke={colors.textDim} strokeWidth={1.9} strokeLinejoin="round" strokeLinecap="round" />}
        />
      </View>

      {nextLabel != null && (
        <View style={styles.next}>
          <Text style={styles.nextText}>
            Next: <Text style={styles.nextStrong}>{nextLabel}</Text>
            {nextDetail}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.35)',
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  headLabel: { fontFamily: fonts.mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.4, color: colors.textFaint },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  chipText: { fontFamily: fonts.mono, fontSize: 11, fontWeight: '500', letterSpacing: 0.44, color: colors.textDim },
  wrap: { width: SIZE, height: SIZE, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 2, marginBottom: 8 },
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  clock: { fontFamily: fonts.display, fontWeight: '700', fontSize: 34, letterSpacing: -1.02, lineHeight: 34, color: colors.text },
  sub: { fontFamily: fonts.mono, fontSize: 9, textTransform: 'uppercase', letterSpacing: 1.26, color: colors.textFaint, marginTop: 5 },
  ctl: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 9, marginTop: 4 },
  ctlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  ctlBtnPressed: { borderColor: colors.border2, opacity: 0.85 },
  ctlLabel: { fontFamily: fonts.mono, fontSize: 11, color: colors.textDim },
  next: {
    marginTop: 14,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  nextText: { fontFamily: fonts.mono, fontSize: 11, color: colors.textDim, textAlign: 'center' },
  nextStrong: { color: colors.text, fontWeight: '600' },
});
