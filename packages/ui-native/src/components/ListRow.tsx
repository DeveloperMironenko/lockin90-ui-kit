import { type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, type ViewProps } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { hapticSelection } from "../internal/optionalHaptics";

export interface ListRowProps extends ViewProps {
  /** Leading slot — an icon, avatar, badge, or letter chip. */
  leading?: ReactNode;
  /** Primary line. */
  title: ReactNode;
  /** Optional dimmer second line under the title. */
  subtitle?: ReactNode;
  /** Trailing slot — a chevron, value, or icon (pinned to the right). */
  trailing?: ReactNode;
  /**
   * When set, the row becomes a `Pressable` (mirrors the web's `onClick`).
   * Native uses `onPress`; the web uses `onClick` — otherwise the same API.
   */
  onPress?: () => void;
  /** Shown but unavailable (e.g. "coming soon"): dimmed, announced disabled, not pressable. */
  disabled?: boolean;
  /** Accent-tinted selected state (used in pickers). */
  active?: boolean;
  /** Overrides the ACTIVE-state background — a translucent color string
   *  (e.g. the change-exercise cyan `'rgba(34,211,238,0.09)'`, design
   *  `.exl.on`). Default keeps the accent tint. */
  activeTint?: string;
  /** Danger tone — tints the title `--zone-low`. */
  danger?: boolean;
  /**
   * Draw a hairline top border (separates adjacent rows). Defaults to `true`;
   * set `divider={false}` on the FIRST row of a stack so it has no top border.
   * (Web draws this between rows via `.lk-listrow + .lk-listrow`; native has no
   * sibling selectors, so the divider is opt-out per row instead.)
   */
  divider?: boolean;
  /** A row of its own: bordered glass box, no divider (a summary list, design onboarding
   *  `.recap li`); stack boxed rows with a gap. */
  boxed?: boolean;
  /** A settings row, as web: `pref` (padding 15 × 4, a setting's name + its line, the control on the
   *  right: design settings `.pref-row` / mobile `.setrow`) or `action` (padding 16 × 0, an icon tile,
   *  a button on the right: `.acct-row`); not with `boxed`. Both: gap 16, title 600 on 22 (pref 14), title and subtitle wrap (19). */
  variant?: 'pref' | 'action';
}

/** Title/subtitle helpers: render strings as <Text>, pass nodes through. */
function asText(node: ReactNode, textStyle: object, oneLine = true): ReactNode {
  return typeof node === 'string' || typeof node === 'number' ? (
    <Text style={textStyle} numberOfLines={oneLine ? 1 : undefined}>
      {node}
    </Text>
  ) : (
    node
  );
}

/** Generic tappable list item — leading + title/subtitle + trailing. Mirrors
 *  the web `@lockin90/ui` `ListRow`. With `onPress` it renders a `Pressable`
 *  that highlights while pressed; otherwise a static `View`. */
export function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  onPress,
  disabled = false,
  active,
  activeTint,
  danger,
  divider = true,
  boxed,
  variant,
  style,
  ...rest
}: ListRowProps) {
  const titleStyle = [
    styles.title,
    boxed && styles.titleBoxed,
    variant && styles.titleSetting,
    variant === 'pref' && styles.titlePref,
    danger && styles.titleDanger,
  ];
  // a boxed or settings row's line wraps, as on web (a settings row's title too: a long setting's
  // name in another language)
  const wraps = boxed || variant != null;

  const body = (
    <>
      {leading != null && <View style={styles.leading}>{leading}</View>}
      <View style={styles.main}>
        {asText(title, titleStyle, variant == null)}
        {subtitle != null &&
          asText(
            subtitle,
            [styles.subtitle, boxed && styles.subtitleBoxed, variant && styles.subtitleSetting],
            !wraps,
          )}
      </View>
      {trailing != null && <View style={styles.trailing}>{trailing}</View>}
    </>
  );

  const rowStyle = [
    styles.row,
    // a boxed row keeps its box (the two don't combine)
    !boxed && variant === 'pref' && styles.pref,
    !boxed && variant === 'action' && styles.action,
    boxed ? styles.boxed : divider && styles.divider,
    active && (activeTint != null ? { backgroundColor: activeTint } : styles.active),
    disabled && styles.disabled,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        disabled={disabled}
        onPress={onPress ? () => { hapticSelection(); onPress(); } : undefined}
        style={({ pressed }) => [...rowStyle, pressed && (boxed ? styles.pressedBoxed : styles.pressed)]}
        {...rest}
        accessibilityState={{ ...rest.accessibilityState, disabled }}
      >
        {body}
      </Pressable>
    );
  }

  return (
    <View
      style={rowStyle}
      {...rest}
      // disabled: one accessibility element announced unavailable (a plain View isn't one)
      {...(disabled
        ? {
            accessible: true,
            'aria-disabled': true,
            accessibilityState: { ...rest.accessibilityState, disabled: true },
          }
        : {})}
    >
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    // minHeight keeps single-line and subtitle rows the SAME height (content is
    // centered) so a mixed list doesn't look ragged; padding fits within it.
    minHeight: 60,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
  },
  // shown but unavailable
  disabled: { opacity: 0.5 },
  // settings rows (web .lk-listrow--pref / --action)
  pref: { minHeight: 0, gap: 16, paddingVertical: 15, paddingHorizontal: 4, borderRadius: 0 },
  action: { minHeight: 0, gap: 16, paddingVertical: 16, paddingHorizontal: 0, borderRadius: 0 },
  titleSetting: { fontWeight: '600', lineHeight: 22 },
  titlePref: { fontSize: 14 },
  subtitleSetting: { marginTop: 2, lineHeight: 19 },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  // web `.lk-listrow-boxed`: a container (radius md, the border2 line); stack boxed rows with a 12 gap
  boxed: {
    minHeight: 0,
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.glass,
  },
  titleBoxed: {
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 19,
  },
  subtitleBoxed: {
    fontSize: 13,
    lineHeight: 17,
  },
  pressed: {
    backgroundColor: colors.glass,
  },
  // a boxed row is glass already: pressing lifts it to glass2 (web hover)
  pressedBoxed: {
    backgroundColor: colors.glass2,
  },
  active: {
    // accent tint ~12% — RN has no color-mix; use a translucent accent fill.
    backgroundColor: 'rgba(124,92,255,0.14)',
  },
  leading: {
    flexShrink: 0,
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fonts.ui,
    fontSize: 14.5,
    lineHeight: 18,
    color: colors.text,
  },
  titleDanger: {
    color: colors.zoneLow,
  },
  subtitle: {
    marginTop: 1,
    fontFamily: fonts.ui,
    fontSize: 12.5,
    lineHeight: 16,
    color: colors.textDim,
  },
  trailing: {
    flexShrink: 0,
    marginLeft: 'auto',
  },
});
