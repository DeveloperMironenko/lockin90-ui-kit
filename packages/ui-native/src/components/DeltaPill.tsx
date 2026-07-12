import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

export type DeltaDirection = 'up' | 'down' | 'flat';
/** `energy` — the training design's energy-affect chip: gain mint, cost AMBER
 *  (never red — red is reserved for PRs/danger), neutral gray. Derives from
 *  the direction like `auto` but maps `down` → amber instead of coral. */
export type DeltaTone = 'auto' | 'up' | 'down' | 'neutral' | 'energy';
export type DeltaSize = 'sm' | 'md';

export interface DeltaPillProps {
  /** The signed change to show, e.g. '+12%', '-3', or 12. */
  value: string | number;
  /** Arrow direction. Omit to infer from the numeric sign of `value`. */
  direction?: DeltaDirection;
  /** Color tone. 'auto' (default) derives from `direction`. */
  tone?: DeltaTone;
  size?: DeltaSize;
  /** Render only the arrow glyph, no value text. */
  iconOnly?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Infer up/down/flat from the numeric sign of a value (string or number).
 *  Normalizes the TRUE MINUS sign U+2212 ('−4', the design's negative glyph)
 *  to ASCII '-' before parsing so it doesn't lose the sign. */
function inferDirection(value: string | number): DeltaDirection {
  const n =
    typeof value === 'number'
      ? value
      : parseFloat(String(value).replace(/−/g, '-').replace(/[^0-9.+-]/g, ''));
  if (Number.isNaN(n) || n === 0) return 'flat';
  return n > 0 ? 'up' : 'down';
}

const TONE_FROM_DIR: Record<DeltaDirection, 'up' | 'down' | 'neutral'> = {
  up: 'up',
  down: 'down',
  flat: 'neutral',
};

// Native has no `currentColor`; resolve each tone to fg + tinted bg/border.
// `downAmber` backs the `energy` tone's negative side (amber, never red).
const TONE: Record<'up' | 'down' | 'neutral' | 'downAmber', { color: string; border: string; bg: string }> = {
  up: { color: colors.zoneHigh, border: 'rgba(52,245,197,0.32)', bg: 'rgba(52,245,197,0.10)' },
  down: { color: colors.zoneLow, border: 'rgba(255,77,109,0.32)', bg: 'rgba(255,77,109,0.10)' },
  downAmber: { color: colors.zoneMid, border: 'rgba(255,176,32,0.35)', bg: 'rgba(255,176,32,0.08)' },
  neutral: { color: colors.textDim, border: colors.border, bg: colors.glass },
};

/** Arrow glyph drawn on a 24-unit viewBox; flat = dash, down = vertically flipped up arrow. */
function ArrowGlyph({ direction, size, color }: { direction: DeltaDirection; size: number; color: string }) {
  const stroke = { stroke: color, strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {direction === 'flat' ? (
        <Line x1={5} y1={12} x2={19} y2={12} {...stroke} />
      ) : (
        // Up arrow path; flip vertically (around y=12) for 'down' via matrix transform.
        <Path
          d="M12 19V5M5 12l7-7 7 7"
          {...stroke}
          {...(direction === 'down' ? { transform: 'matrix(1,0,0,-1,0,24)' } : null)}
        />
      )}
    </Svg>
  );
}

/** Compact directional pill: arrow + signed value, tinted by direction. */
export function DeltaPill({ value, direction, tone = 'auto', size = 'md', iconOnly = false, style }: DeltaPillProps) {
  const dir = direction ?? inferDirection(value);
  const resolvedTone =
    tone === 'auto'
      ? TONE_FROM_DIR[dir]
      : tone === 'energy'
        ? dir === 'down'
          ? 'downAmber'
          : TONE_FROM_DIR[dir]
        : tone;
  const t = TONE[resolvedTone];
  const sm = size === 'sm';
  const glyphSize = sm ? 10 : 12;

  return (
    <View
      style={[styles.pill, sm ? styles.pillSm : styles.pillMd, { borderColor: t.border, backgroundColor: t.bg }, style]}
    >
      <ArrowGlyph direction={dir} size={glyphSize} color={t.color} />
      {!iconOnly && (
        <Text style={[styles.val, sm ? styles.valSm : styles.valMd, { color: t.color }]}>{String(value)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  pillMd: { gap: 5, paddingVertical: 4, paddingHorizontal: 11 },
  pillSm: { gap: 4, paddingVertical: 3, paddingHorizontal: 8 },
  val: { fontFamily: fonts.mono, fontWeight: '600' },
  valMd: { fontSize: 13 },
  valSm: { fontSize: 10 },
});
