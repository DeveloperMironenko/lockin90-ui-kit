import { type ReactNode } from 'react';
import { Pressable, Text, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { sizedIcon } from '../internal/iconSlot';

export type ChoiceChipSize = 'sm' | 'md';

export interface ChoiceChipProps {
  /** Selected (`.on`) state — accent border + tint + brighter text. */
  selected?: boolean;
  /** Control size (CONVENTIONS "Control sizes"): `md` 44 tall, `sm` 36 with a 44 target (a header row's
   *  "Scan", the same height as a `sm` Select beside it). As web. @default 'md' */
  size?: ChoiceChipSize;
  /** Leading glow dot (ignored when `icon` is set). */
  leadingDot?: boolean;
  /** Leading glyph (overrides `leadingDot`). */
  icon?: ReactNode;
  /** Stacked grid-cell layout — icon ABOVE a small centred label, rounded-rect,
   *  fills its flex cell (vs the default inline pill). For quick-action grids. */
  stacked?: boolean;
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
  stacked = false,
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
      // md is 44 tall; sm 36: the slop reaches the 44pt touch target, same look
      hitSlop={stacked || size !== 'sm' ? undefined : { top: 4, bottom: 4 }}
      style={({ pressed }) => [
        styles.chip,
        size === 'sm' && styles.chipSm,
        stacked && styles.chipStacked,
        selected ? styles.chipOn : styles.chipOff,
        pressed && !disabled && styles.chipPressed,
        disabled && styles.chipDisabled,
        style,
      ]}
    >
      {icon != null ? (
        <View style={styles.icon}>{sizedIcon(icon, 16)}</View>
      ) : leadingDot ? (
        <View style={[styles.dot, selected ? styles.dotOn : styles.dotOff]} />
      ) : null}
      <Text
        style={[
          styles.label,
          size === 'sm' && styles.labelSm,
          stacked && styles.labelStacked,
          selected ? styles.labelOn : styles.labelOff,
        ]}
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
    justifyContent: 'center',
    gap: 7,
    // md 44 tall, sm 36 (CONVENTIONS "Control sizes"), as web
    minHeight: 44,
    paddingHorizontal: 14,
    // a control's corners (CONVENTIONS "Corner radii"), stacked too
    borderRadius: radii.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  // a sm Select's padding and line (Select fieldSm / valueSm), so the two stay one height at every
  // text size (the header's language picker beside Scan)
  chipSm: { minHeight: 36, paddingHorizontal: 12, paddingVertical: 6 },
  // stacked grid cell — icon over label, the control's corners, fills the flex column.
  // alignItems:'center' overrides the base row alignment so the icon+label centre
  // horizontally; extra vertical padding keeps the top icon off the rounded edge.
  chipStacked: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    minHeight: 0,
    paddingVertical: 13,
    paddingHorizontal: 4,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  // a button's edge and a control's fill (V19)
  chipOff: { borderColor: colors.border2, backgroundColor: colors.field },
  chipOn: { borderColor: 'rgba(124,92,255,0.5)', backgroundColor: 'rgba(124,92,255,0.12)' },
  chipPressed: { opacity: 0.85 },
  chipDisabled: { opacity: 0.5 },
  icon: { alignItems: 'center', justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, shadowOpacity: 0.9, shadowRadius: 6 },
  dotOff: { backgroundColor: colors.textDim, shadowColor: colors.textDim },
  dotOn: { backgroundColor: colors.accent, shadowColor: colors.accent },
  label: { fontFamily: fonts.ui, fontSize: 14, lineHeight: 17.5 },
  labelSm: { fontSize: 14, lineHeight: 18 },
  labelStacked: { fontFamily: fonts.mono, fontSize: 11, lineHeight: 13, letterSpacing: 0.3, textAlign: 'center' },
  labelOff: { color: colors.textDim },
  labelOn: { color: colors.text },
});
