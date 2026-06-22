import { type ReactNode } from 'react';
import { Pressable, Text, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';

export type ChoiceChipSize = 'sm' | 'md';

export interface ChoiceChipProps {
  /** Selected (`.on`) state — accent border + tint + brighter text. */
  selected?: boolean;
  /** Pill size. */
  size?: ChoiceChipSize;
  /** Leading glow dot (ignored when `icon` is set). */
  leadingDot?: boolean;
  /** Leading glyph (overrides `leadingDot`). */
  icon?: ReactNode;
  /** Disable the pill. */
  disabled?: boolean;
  /** Fired on press. */
  onPress?: () => void;
  /** Label. */
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * ChoiceChip — a pressable, selectable filter pill (multi-select). The native
 * twin of the web `ChoiceChip`: a `Pressable` pill whose `selected` state tints
 * to the accent token. Distinct from the display-only `Chip` and the
 * single-select `SegmentedTabs`.
 */
export function ChoiceChip({
  selected = false,
  size = 'md',
  leadingDot,
  icon,
  disabled = false,
  onPress,
  children,
  style,
}: ChoiceChipProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      style={({ pressed }) => [
        styles.chip,
        size === 'sm' && styles.chipSm,
        selected ? styles.chipOn : styles.chipOff,
        pressed && !disabled && styles.chipPressed,
        disabled && styles.chipDisabled,
        style,
      ]}
    >
      {icon != null ? (
        <View style={styles.icon}>{icon}</View>
      ) : leadingDot ? (
        <View style={[styles.dot, selected ? styles.dotOn : styles.dotOff]} />
      ) : null}
      <Text
        style={[styles.label, size === 'sm' && styles.labelSm, selected ? styles.labelOn : styles.labelOff]}
        numberOfLines={1}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  chipSm: { paddingVertical: 5, paddingHorizontal: 10 },
  chipOff: { borderColor: colors.border, backgroundColor: colors.glass },
  chipOn: { borderColor: 'rgba(124,92,255,0.5)', backgroundColor: 'rgba(124,92,255,0.12)' },
  chipPressed: { opacity: 0.85 },
  chipDisabled: { opacity: 0.5 },
  icon: { alignItems: 'center', justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, shadowOpacity: 0.9, shadowRadius: 6 },
  dotOff: { backgroundColor: colors.textDim, shadowColor: colors.textDim },
  dotOn: { backgroundColor: colors.accent, shadowColor: colors.accent },
  label: { fontFamily: fonts.ui, fontSize: 13, lineHeight: 16 },
  labelSm: { fontSize: 12 },
  labelOff: { color: colors.textDim },
  labelOn: { color: colors.text },
});
