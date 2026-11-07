import { type ReactNode } from 'react';
import { Pressable, Text, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, gradients, fonts, nativeShadows } from '@lockin90/tokens';
import { hapticSelection } from '../internal/optionalHaptics';

// the web's body line height (1.55): the md button is 12 + 14 × 1.55 + 12 = 45.7, as on web
const LINE = 1.55;

export type ButtonVariant = 'default' | 'primary' | 'ghost' | 'text';
export type ButtonTone = 'danger' | 'muted';

// `--bad` (#FF4D6D) as alpha tints — the sanctioned paired literal for the web
// `color-mix(in srgb, var(--bad) x%, transparent)` (matches Alert/Badge danger).
const DANGER_TINT = 'rgba(255,77,109,0.10)';
const DANGER_BORDER = 'rgba(255,77,109,0.42)';
// (44 − 17) / 2 above and below the text variant's line
const TEXT_SLOP = { top: 14, bottom: 14, left: 8, right: 8 };

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  variant?: ButtonVariant;
  /**
   * Destructive tone — composes with `variant`. On the `default` variant it
   * paints a solid `colors.bad` fill (the primary destructive action); on
   * `ghost` it becomes a red-tinted transparent button (the account "danger
   * zone" delete). Mirrors the web `tone="danger"`. `muted` is for the `text` variant only: the
   * faint mono way out ("Skip setup"), as the web's.
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

/** Pill button. `primary` paints the energy-gradient CTA. `text` is a bare mono
 *  accent action inside a line of text ("Resend code"), with no surface. `tone="danger"` composes
 *  with `variant` for destructive actions (solid red on `default`, red-tinted on
 *  `ghost`). `leading`/`trailing` render an icon before/after the label (the row is
 *  `gap: 9`-spaced). */
export function Button({ variant = 'default', tone, size = 'md', title, leading, trailing, style, onPress, ...rest }: ButtonProps) {
  const pad = size === 'sm' ? styles.padSm : styles.padMd;
  const labelSize = size === 'sm' ? 13 : 14;
  const danger = tone === 'danger';

  // selection tick on every press (no-op without expo-haptics) — a real button
  // press should feel like one, same as the tab bar
  const press = onPress
    ? (e: Parameters<NonNullable<ButtonProps['onPress']>>[0]) => {
        hapticSelection();
        onPress(e);
      }
    : undefined;

  if (variant === 'text') {
    // no surface: the label is the button (web `.lk-btn-text`); faint when disabled. The
    // 17-tall line gets a slop to the 44pt touch target.
    return (
      <Pressable accessibilityRole="button" onPress={press} hitSlop={TEXT_SLOP} {...rest}>
        {({ pressed }) => (
          <View style={[styles.textRow, pressed && styles.textPressed, style]}>
            {leading}
            <Text style={[styles.textLabel, tone === 'muted' && styles.textMuted, rest.disabled && styles.textDisabled]}>
              {title}
            </Text>
            {trailing}
          </View>
        )}
      </Pressable>
    );
  }

  if (variant === 'primary' && !danger) {
    return (
      <Pressable accessibilityRole="button" onPress={press} {...rest}>
        {({ pressed }) => (
          <LinearGradient
            colors={gradients.cta.stops as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.base, pad, styles.primary, pressed && styles.pressed, style]}
          >
            {leading}
            <Text style={[styles.label, { fontSize: labelSize, lineHeight: labelSize * LINE, color: '#0A0A12' }]}>{title}</Text>
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
    borderColor = colors.border2;
    textColor = ghost ? colors.textDim : colors.text;
  }

  return (
    <Pressable accessibilityRole="button" onPress={press} {...rest}>
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
          <Text style={[styles.label, { fontSize: labelSize, lineHeight: labelSize * LINE, color: textColor }]}>{title}</Text>
          {trailing}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, borderRadius: radii.sm },
  padMd: { paddingVertical: 12, paddingHorizontal: 20 },
  padSm: { paddingVertical: 8, paddingHorizontal: 14 },
  primary: { ...nativeShadows.glowAccent },
  dangerGlow: { shadowColor: colors.bad, shadowOpacity: 0.4, shadowRadius: 24, shadowOffset: { width: 0, height: 0 }, elevation: 8 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  label: { fontFamily: fonts.ui, fontWeight: '600' },
  textRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  textPressed: { opacity: 0.85 },
  // never shrinks to wrap or cut: one line, as web's nowrap
  textLabel: { flexShrink: 0, fontFamily: fonts.mono, fontSize: 11.5, lineHeight: 17, color: colors.accent2 },
  textDisabled: { color: colors.textFaint },
  // web `.lk-btn--tone-muted` (design onboarding .step-skip): faint, 12.5, padding 8
  textMuted: { fontSize: 12.5, lineHeight: 17, color: colors.textFaint, padding: 8 },
});
