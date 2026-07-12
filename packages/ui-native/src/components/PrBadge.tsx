import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { fonts } from '@lockin90/tokens';

export type PrBadgeSize = 'sm' | 'md';

/** PR red — the deliberate off-spectrum signal color of the training design
 *  (matched literal on web, `.lk-prbadge`). Not a spectrum/zone token: a PR
 *  must scream. */
export const PR_RED = '#FF4757';

export interface PrBadgeProps {
  /** Badge text (default `'PR'` — also `'NEW'`, `'AT PEAK'`, …). */
  label?: string;
  /** `md` (default) on cards/callouts; `sm` inside dense set rows. */
  size?: PrBadgeSize;
  style?: StyleProp<ViewStyle>;
}

/**
 * PrBadge — the solid RED personal-record flag. Native twin of the web
 * `PrBadge` (`.lk-prbadge`): tight 4px-radius tab, white bold mono uppercase
 * text, soft red glow. `SetTable` stamps it on PR'd done sets; `PrCard` uses
 * it as the `new` / `atPeak` state tag.
 */
export function PrBadge({ label = 'PR', size = 'md', style }: PrBadgeProps) {
  const sm = size === 'sm';
  return (
    <View style={[styles.badge, sm ? styles.badgeSm : styles.badgeMd, style]}>
      <Text style={[styles.text, sm ? styles.textSm : styles.textMd]}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PR_RED,
    borderRadius: 4,
    shadowColor: PR_RED,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  badgeMd: { paddingVertical: 3, paddingHorizontal: 7 },
  badgeSm: { paddingVertical: 2, paddingHorizontal: 5 },
  text: { fontFamily: fonts.mono, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.8 },
  textMd: { fontSize: 10 },
  textSm: { fontSize: 8.5 },
});
