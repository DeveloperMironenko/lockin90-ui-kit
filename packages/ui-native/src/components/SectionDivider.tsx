import { type ReactNode } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@lockin90/tokens';
import { Eyebrow } from './Eyebrow';

export interface SectionDividerProps {
  /** Section label (rendered as a mono, uppercase eyebrow) before the rule. */
  label: ReactNode;
  /** Optional container style (margins/spacing — the consumer owns spacing). */
  style?: StyleProp<ViewStyle>;
}

/**
 * SectionDivider — an eyebrow label followed by a hairline that fades to the
 * right, for separating page sections (e.g. "EXPLAINABILITY ————————"). The
 * native twin of the web `@lockin90/ui` `SectionDivider`; composes `Eyebrow`
 * and draws the fading rule with `expo-linear-gradient`
 * (`colors.border2 → transparent`, mirroring web `linear-gradient(90deg,
 * var(--border-2), transparent)`).
 */
export function SectionDivider({ label, style }: SectionDividerProps) {
  return (
    <View style={[styles.root, style]}>
      <Eyebrow style={styles.label}>{label}</Eyebrow>
      <LinearGradient
        colors={[colors.border2, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.line}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    // eyebrow — no wrap so the rule stays on one line
    flexShrink: 0,
  },
  line: {
    flex: 1,
    height: 1,
    minWidth: 24,
  },
});
