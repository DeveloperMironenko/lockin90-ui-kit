import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, gradients, fonts, nativeShadows } from '@lockin90/tokens';
import { hapticSelection } from '../internal/optionalHaptics';
import { absoluteFill } from '../internal/absoluteFill';
import { Spinner } from './Spinner';
import { FitText } from './FitText';
import { sizedIcon } from '../internal/iconSlot';

// the web's body line height (1.55); md is 44 tall at least, sm 36 (CONVENTIONS "Control sizes")
const LINE = 1.55;

export type ButtonVariant = 'default' | 'primary' | 'ghost' | 'text';
export type ButtonTone = 'danger' | 'muted';

// `--bad` (#FF4D6D) as alpha tints — the sanctioned paired literal for the web
// `color-mix(in srgb, var(--bad) x%, transparent)` (matches Alert/Badge danger).
const DANGER_TINT = 'rgba(255,77,109,0.10)';
const DANGER_BORDER = 'rgba(255,77,109,0.42)';
// (44 − 17) / 2 above and below the text variant's line
const TEXT_SLOP = { top: 14, bottom: 14, left: 8, right: 8 };
const SPIN_SIZE = { sm: 14, md: 16, lg: 18 } as const;
// the icon slot's size (CONVENTIONS "Type"): a `leading` / `trailing` icon without its own size gets it
const ICON_SIZE = { sm: 14, md: 16, lg: 19 } as const;
// sm's 36pt box reaches the 44pt target
const SM_SLOP = { top: 4, bottom: 4 };
// the dark label on a bright surface (primary's gradient, solid danger), as web: label and spinner
const INK_ON_BRIGHT = colors.inkOnBright;

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
  /** `lg`: the closing CTA of a flow ("Enter LockIn90"), as the web's */
  size?: 'sm' | 'md' | 'lg';
  title: string;
  /** optional icon/node rendered before the label (e.g. an SSO brand logo) */
  leading?: ReactNode;
  /** optional icon/node rendered after the label (e.g. a trailing arrow) */
  trailing?: ReactNode;
  /** busy: the kit Spinner over the kept (invisible) label, so the width never changes;
   *  `accessibilityState.busy`, and presses are ignored until it ends. Mirrors web `loading`. */
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Pill button. `primary` paints the energy-gradient CTA. `text` is a bare mono
 *  accent action inside a line of text ("Resend code"), with no surface. `tone="danger"` composes
 *  with `variant` for destructive actions (solid red on `default`, red-tinted on
 *  `ghost`). `leading`/`trailing` render an icon before/after the label (the row is
 *  `gap: 9`-spaced). */
export function Button({
  variant = 'default',
  tone,
  size = 'md',
  title,
  leading,
  trailing,
  loading = false,
  style,
  onPress,
  accessibilityState,
  accessibilityLabel,
  hitSlop,
  ...rest
}: ButtonProps) {
  const lead = sizedIcon(leading, ICON_SIZE[size]);
  const trail = sizedIcon(trailing, ICON_SIZE[size]);
  const slop = hitSlop ?? (size === 'sm' && variant !== 'text' ? SM_SLOP : undefined);
  const pad = size === 'sm' ? styles.padSm : size === 'lg' ? styles.padLg : styles.padMd;
  const labelSize = size === 'sm' ? 13 : size === 'lg' ? 17 : 14;
  const danger = tone === 'danger';
  // only `disabled` stops Pressable's presses (`aria-disabled` / `accessibilityState` just announce it)
  const disabled = rest.disabled === true;

  // selection tick on every press (no-op without expo-haptics) — a real button
  // press should feel like one, same as the tab bar
  const press = onPress
    ? (e: Parameters<NonNullable<ButtonProps['onPress']>>[0]) => {
        if (loading) return;
        hapticSelection();
        onPress(e);
      }
    : undefined;
  const a11yState = { ...accessibilityState, disabled, busy: loading || undefined };
  // while loading the row keeps its content (and width) but hides it under the spinner
  const hide = loading ? styles.hidden : undefined;
  const spinner = (color: string) =>
    loading ? (
      // hidden from screen readers: the button is named by its title and announced busy
      <View style={styles.spin} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Spinner size={variant === 'text' ? 12 : SPIN_SIZE[size]} thickness={2} color={color} />
      </View>
    ) : null;

  if (variant === 'text') {
    // no surface: the label is the button (web `.lk-btn-text`); faint when disabled. The
    // 17-tall line gets a slop to the 44pt touch target.
    return (
      <Pressable
        accessibilityRole="button"
        onPress={press}
        hitSlop={hitSlop ?? TEXT_SLOP}
        accessibilityState={a11yState}
        accessibilityLabel={accessibilityLabel ?? title}
        {...rest}
      >
        {({ pressed }) => (
          <View style={[styles.textRow, tone === 'muted' && styles.textRowMuted, pressed && styles.textPressed, style]}>
            <View style={[styles.textRow, hide]}>
              {lead}
              <FitText style={[styles.textLabel, tone === 'muted' && styles.textMuted, disabled && styles.textDisabled]}>
                {title}
              </FitText>
              {trail}
            </View>
            {spinner(colors.accent2)}
          </View>
        )}
      </Pressable>
    );
  }

  if (variant === 'primary' && !danger) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={press}
        hitSlop={slop}
        accessibilityState={a11yState}
        accessibilityLabel={accessibilityLabel ?? title}
        {...rest}
      >
        {({ pressed }) => (
          // the glow is drawn by a plain View around the gradient: a boxShadow on the gradient view itself
          // never rendered on device (V15)
          <View style={[styles.glowBox, styles.primary, pressed && styles.pressed, disabled && styles.disabled, style]}>
            <LinearGradient
              colors={gradients.cta.stops as unknown as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.base, pad, styles.fill]}
            >
              <View style={[styles.base, styles.inner, hide]}>
                {lead}
                <FitText style={[styles.label, { fontSize: labelSize, lineHeight: labelSize * LINE, color: INK_ON_BRIGHT }]}>{title}</FitText>
                {trail}
              </View>
              {spinner(INK_ON_BRIGHT)}
            </LinearGradient>
          </View>
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
    textColor = INK_ON_BRIGHT;
    surfaceShadow = styles.dangerGlow;
  } else if (danger) {
    // ghost danger — red-tinted transparent
    backgroundColor = DANGER_TINT;
    borderColor = DANGER_BORDER;
    textColor = colors.bad;
  } else {
    // a control's fill (V19): the opaque field colour, not glass
    backgroundColor = ghost ? 'transparent' : colors.field;
    borderColor = colors.border2;
    textColor = ghost ? colors.textDim : colors.text;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={press}
      hitSlop={slop}
      accessibilityState={a11yState}
      accessibilityLabel={accessibilityLabel ?? title}
      {...rest}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.base,
            pad,
            { backgroundColor, borderWidth, borderColor },
            surfaceShadow,
            pressed && styles.pressed,
            disabled && styles.disabled,
            style,
          ]}
        >
          <View style={[styles.base, styles.inner, hide]}>
            {lead}
            <FitText style={[styles.label, { fontSize: labelSize, lineHeight: labelSize * LINE, color: textColor }]}>{title}</FitText>
            {trail}
          </View>
          {spinner(textColor)}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, borderRadius: radii.sm },
  padMd: { minHeight: 44, paddingVertical: 10, paddingHorizontal: 20 },
  // web `.lk-btn-lg`: 16 / 28
  padLg: { paddingVertical: 16, paddingHorizontal: 28 },
  // sm: 36 tall, its target 44 (SM_SLOP), as web (CONVENTIONS "Control sizes")
  padSm: { minHeight: 36, paddingVertical: 6, paddingHorizontal: 14 },
  primary: { ...nativeShadows.glowAccent },
  // the primary's outer box: its corners carry the glow; the gradient fills it
  glowBox: { borderRadius: radii.sm },
  fill: { flexGrow: 1, borderRadius: radii.sm, overflow: 'hidden' },
  dangerGlow: { shadowColor: colors.bad, shadowOpacity: 0.4, shadowRadius: 24, shadowOffset: { width: 0, height: 0 }, elevation: 8 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  // web `.lk-btn:disabled`: the whole surface at half strength
  disabled: { opacity: 0.5 },
  // the label and the row that holds it can shrink, so a label's room is the button's, not its own
  // content's (FitText fits a word to it)
  inner: { flexShrink: 1, minWidth: 0 },
  label: { flexShrink: 1, minWidth: 0, fontFamily: fonts.ui, fontWeight: '600' },
  // shrinks with its line, so a long label wraps (a long translation) instead of overflowing, as web
  textRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, flexShrink: 1 },
  textPressed: { opacity: 0.85 },
  // wraps when its line is too narrow (never cut), as web
  textLabel: { flexShrink: 1, minWidth: 0, fontFamily: fonts.mono, fontSize: 11.5, lineHeight: 17, color: colors.accent2 },
  textDisabled: { color: colors.textFaint },
  // web `.lk-btn--tone-muted` (design onboarding .step-skip): faint, 12.5, padding 8
  textMuted: { fontSize: 12.5, lineHeight: 17, color: colors.textFaint },
  textRowMuted: { padding: 8 },
  // loading: the content keeps its place (the width) under the centred spinner
  hidden: { opacity: 0 },
  spin: { ...absoluteFill, alignItems: 'center', justifyContent: 'center' },
});
