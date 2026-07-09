import { type ReactNode } from 'react';
import { Pressable, Text, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, gradients, fonts, nativeShadows } from '@lockin90/tokens';

export type ButtonVariant = 'default' | 'primary' | 'ghost';
export type ButtonTone = 'danger';

// `--bad` (#FF4D6D) as alpha tints — the sanctioned paired literal for the web
// `color-mix(in srgb, var(--bad) x%, transparent)` (matches Alert/Badge danger).
const DANGER_TINT = 'rgba(255,77,109,0.10)';
const DANGER_BORDER = 'rgba(255,77,109,0.42)';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  variant?: ButtonVariant;
  /**
   * Destructive tone — composes with `variant`. On the `default` variant it
   * paints a solid `colors.bad` fill (the primary destructive action); on
   * `ghost` it becomes a red-tinted transparent button (the account "danger
   * zone" delete). Mirrors the web `tone="danger"`.
   */
  tone?: ButtonTone;
  size?: 'sm' | 'md';
  title: string;
  /** optional icon/node rendered before the label (e.g. an SSO brand logo) */
  leading?: ReactNode;
  /** optional icon/node rendered after the label (e.g. a trailing arrow) */
  trailing?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Pill button. `primary` paints the energy-gradient CTA. `tone="danger"` composes
 *  with `variant` for destructive actions (solid red on `default`, red-tinted on
 *  `ghost`). `leading`/`trailing` render an icon before/after the label (the row is
 *  `gap: 9`-spaced). */
export function Button({ variant = 'default', tone, size = 'md', title, leading, trailing, style, ...rest }: ButtonProps) {
  const pad = size === 'sm' ? styles.padSm : styles.padMd;
  const labelSize = size === 'sm' ? 13 : 14;
  const danger = tone === 'danger';

  if (variant === 'primary' && !danger) {
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
            {trailing}
          </LinearGradient>
        )}
      </Pressable>
    );
  }

  const ghost = variant === 'ghost';

  // resolve surface + label per variant × tone
  let backgroundColor: string;
  let borderColor: string;
  let borderWidth = 1;
  let textColor: string;
  let surfaceShadow: ViewStyle | undefined;

  if (danger && !ghost) {
    // solid destructive — bright `--bad` fill, dark label (like `primary`)
    backgroundColor = colors.bad;
    borderColor = colors.bad;
    borderWidth = 0;
    textColor = '#0A0A12';
    surfaceShadow = styles.dangerGlow;
  } else if (danger) {
    // ghost danger — red-tinted transparent
    backgroundColor = DANGER_TINT;
    borderColor = DANGER_BORDER;
    textColor = colors.bad;
  } else {
    backgroundColor = ghost ? 'transparent' : colors.glass2;
    borderColor = ghost ? colors.border : colors.border2;
    textColor = ghost ? colors.textDim : colors.text;
  }

  return (
    <Pressable {...rest}>
      {({ pressed }) => (
        <View
          style={[
            styles.base,
            pad,
            { backgroundColor, borderWidth, borderColor },
            surfaceShadow,
            pressed && styles.pressed,
            style,
          ]}
        >
          {leading}
          <Text style={[styles.label, { fontSize: labelSize, color: textColor }]}>{title}</Text>
          {trailing}
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
  dangerGlow: { shadowColor: colors.bad, shadowOpacity: 0.4, shadowRadius: 24, shadowOffset: { width: 0, height: 0 }, elevation: 8 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  label: { fontFamily: fonts.ui, fontWeight: '600' },
});
