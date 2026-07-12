import { View, Text, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts, radii } from '@lockin90/tokens';
import { hapticSelection } from '../internal/optionalHaptics';
import { PrBadge, PR_RED } from './PrBadge';

/** PR state — `new`/`atPeak` get the red-tinted border/glow + red tag;
 *  `offPeak` a quiet amber text tag. */
export type PrCardState = 'new' | 'atPeak' | 'offPeak';

export interface PrCardProps {
  /** Lift name (e.g. `'Back Squat'`). */
  name: string;
  /** Record kind, mono overline (e.g. `'Estimated 1RM'`). */
  kind: string;
  /** The record value (e.g. `'130 kg'`). */
  value: string;
  /** Dim mono detail (e.g. `'today · +2kg'`). */
  detail?: string;
  /** Record state — omit for a plain card with no tag. */
  state?: PrCardState;
  /** When set, the card becomes a `Pressable`. */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const STATE_TAG: Record<Exclude<PrCardState, 'offPeak'>, string> = {
  new: 'NEW',
  atPeak: 'AT PEAK',
};

/**
 * PrCard — a personal-record card. Native twin of the web `PrCard` (same
 * prop API): lift name + mono record kind, the record value big in the
 * display font, and a dim detail line. `new`/`atPeak` records get the
 * red-PR treatment — red-tinted border + soft red glow and a red `PrBadge`
 * tag (`NEW` / `AT PEAK`); `offPeak` keeps the plain glass surface with a
 * quiet amber `OFF PEAK` text tag.
 */
export function PrCard({ name, kind, value, detail, state, onPress, style }: PrCardProps) {
  const hot = state === 'new' || state === 'atPeak';

  const body = (
    <>
      <View style={styles.top}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {hot ? (
          <PrBadge size="sm" label={STATE_TAG[state as 'new' | 'atPeak']} />
        ) : state === 'offPeak' ? (
          <Text style={styles.off}>OFF PEAK</Text>
        ) : null}
      </View>
      <Text style={styles.kind}>{kind.toUpperCase()}</Text>
      <Text style={styles.value}>{value}</Text>
      {detail != null && <Text style={styles.detail}>{detail}</Text>}
    </>
  );

  const surface = [styles.card, hot && styles.hot, style];

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          hapticSelection();
          onPress();
        }}
        style={({ pressed }) => [surface, pressed && styles.pressed]}
      >
        {body}
      </Pressable>
    );
  }
  return <View style={surface}>{body}</View>;
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    gap: 3,
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  hot: {
    borderColor: 'rgba(255,71,87,0.38)',
    shadowColor: PR_RED,
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  pressed: { backgroundColor: colors.glass2 },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    alignSelf: 'stretch',
  },
  name: {
    flexShrink: 1,
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: -0.14,
    color: colors.text,
  },
  off: {
    flexShrink: 0,
    fontFamily: fonts.mono,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.7,
    color: colors.zoneMid,
  },
  kind: { fontFamily: fonts.mono, fontSize: 9.5, letterSpacing: 1.1, color: colors.textFaint },
  value: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 22,
    letterSpacing: -0.44,
    lineHeight: 25,
    color: colors.text,
    marginTop: 3,
  },
  detail: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textDim },
});
