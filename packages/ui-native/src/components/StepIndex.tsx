import { StyleSheet, Text, View, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradients, nativeShadows, radii } from '@lockin90/tokens';
import { Icon } from './Icon';

export interface StepIndexProps extends Omit<ViewProps, 'children'> {
  /** the step's number, shown while it isn't done */
  step: number;
  /** done: a mint check in place of the number (the onboarding Finish head) */
  done?: boolean;
}

/** The step number beside a step's title (design onboarding `.ob-index`, the phone size): a
 *  CTA-gradient tile with the number, or a mint-tinted tile with a check once done. Hidden from
 *  screen readers: the title beside it says the step. Web twin: `StepIndex` in `@lockin90/ui`. */
export function StepIndex({ step, done, style, ...rest }: StepIndexProps) {
  if (done)
    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.tile, styles.done, style]}
        {...rest}
      >
        <Icon name="check" size={20} color={colors.zoneHigh} />
      </View>
    );
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.glow, style]}
      {...rest}
    >
      <LinearGradient
        colors={gradients.cta.stops as unknown as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tile}
      >
        <Text style={styles.number}>{step}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  // web ≤ 540px: 38; a box holding text, the control radius
  tile: {
    width: 38,
    height: 38,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: { borderRadius: radii.sm, ...nativeShadows.glowAccent },
  done: { backgroundColor: 'rgba(52,245,197,0.12)', borderColor: 'rgba(52,245,197,0.35)' },
  number: { fontFamily: fonts.display, fontWeight: '700', fontSize: 16, color: '#0A0A12' },
});
