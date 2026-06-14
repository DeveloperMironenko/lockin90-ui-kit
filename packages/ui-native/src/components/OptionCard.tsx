import type { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import { colors, fonts, fontSizes, radius, spacing } from '@lockin90/tokens';

export interface OptionCardProps {
  /** Primary label (display/ui font). */
  title: string;
  /** Optional supporting line under the title (muted). */
  description?: string;
  /** Selected state — accent border + glow + a check affordance. */
  selected?: boolean;
  /** Dims the tile and blocks interaction. */
  disabled?: boolean;
  /** Leading slot — an icon or small visual. */
  icon?: ReactNode;
  /** Trailing slot — a status badge, connect button, etc. */
  trailing?: ReactNode;
  /** Tap handler (Pressable). */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Aurora selectable / actionable glass tile. Two uses:
 *  (a) a selectable choice — tap toggles `selected` (device pick);
 *  (b) an actionable row — `trailing` holds a connect button / status.
 * Mirrors the web `OptionCard` 1:1. `selected` adds the accent border + glow +
 * check; `disabled` dims and blocks interaction.
 */
export function OptionCard({
  title,
  description,
  selected = false,
  disabled = false,
  icon,
  trailing,
  onPress,
  style,
}: OptionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.card,
        selected && styles.selected,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon != null ? <View style={styles.icon}>{icon}</View> : null}
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {description != null ? <Text style={styles.desc}>{description}</Text> : null}
      </View>
      {trailing != null ? <View style={styles.trailing}>{trailing}</View> : null}
      {selected ? (
        <View style={styles.check}>
          <Text style={styles.checkMark}>{'✓'}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  selected: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(124,92,255,0.10)',
    shadowColor: colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontFamily: fonts.displaySemibold,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  desc: {
    fontFamily: fonts.ui,
    fontSize: fontSizes.sm,
    color: colors.textDim,
  },
  trailing: {
    flexShrink: 0,
  },
  check: {
    flexShrink: 0,
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  checkMark: {
    color: '#0A0A12',
    fontFamily: fonts.uiBold,
    fontSize: 13,
    lineHeight: 15,
  },
});
