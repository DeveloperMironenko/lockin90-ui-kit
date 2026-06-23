import { type ReactNode } from 'react';
import { Pressable, Text, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, gradients, fonts, nativeShadows } from '@lockin90/tokens';

export type ButtonVariant = 'default' | 'primary' | 'ghost';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  title: string;
  /** optional icon/node rendered before the label (e.g. an SSO brand logo) */
  leading?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Pill button. `primary` paints the energy-gradient CTA. `leading` renders an
 *  icon before the label (the row is `gap: 9`-spaced). */
export function Button({ variant = 'default', size = 'md', title, leading, style, ...rest }: ButtonProps) {
  const pad = size === 'sm' ? styles.padSm : styles.padMd;
  const labelSize = size === 'sm' ? 13 : 14;

  if (variant === 'primary') {
    return (
      <Pressable {...rest}>
        {({ pressed }) => (
          <LinearGradient
            colors={gradients.cta.stops as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.base, pad, styles.primary, pressed && styles.pressed, style]}
          >
            {leading}
            <Text style={[styles.label, { fontSize: labelSize, color: '#0A0A12' }]}>{title}</Text>
          </LinearGradient>
        )}
      </Pressable>
    );
  }

  const ghost = variant === 'ghost';
  return (
    <Pressable {...rest}>
      {({ pressed }) => (
        <View
          style={[
            styles.base,
            pad,
            { backgroundColor: ghost ? 'transparent' : colors.glass2, borderWidth: 1, borderColor: ghost ? colors.border : colors.border2 },
            pressed && styles.pressed,
            style,
          ]}
        >
          {leading}
          <Text style={[styles.label, { fontSize: labelSize, color: ghost ? colors.textDim : colors.text }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, borderRadius: radii.pill },
  padMd: { paddingVertical: 12, paddingHorizontal: 20 },
  padSm: { paddingVertical: 8, paddingHorizontal: 14 },
  primary: { ...nativeShadows.glowAccent },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  label: { fontFamily: fonts.ui, fontWeight: '600' },
});
