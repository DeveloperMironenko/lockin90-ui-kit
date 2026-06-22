import { type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

/* ============================================================================
   Toolbar — a rich-text formatting bar: a horizontal group of ~30px icon
   Pressables in a glass strip, with thin vertical divider Views between groups.
   Active buttons take an accent (violet) tint. Mirrors the web `Toolbar`.
   ========================================================================== */

export interface ToolbarItem {
  /** glyph rendered inside the button (an svg element or shared Icon) */
  icon: ReactNode;
  /** accessible label */
  label?: string;
  /** pressed/active state — accent tint */
  active?: boolean;
  onPress?: () => void;
  /** render a thin vertical separator instead of a button */
  divider?: boolean;
}

export interface ToolbarProps {
  /** the buttons (and dividers) to render; defaults to a sample formatting set */
  items?: ToolbarItem[];
  style?: StyleProp<ViewStyle>;
}

/** Shared stroke props for the inline default-set glyphs. */
const stroke = {
  fill: 'none',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** Default sample set: bold, italic | list, link, image — mirrors the web set. */
const DEFAULT_ITEMS: ToolbarItem[] = [
  {
    label: 'Bold',
    active: true,
    icon: (
      <Text style={{ fontSize: 14, color: colors.textDim, fontFamily: fonts.display, fontWeight: '700' }}>
        B
      </Text>
    ),
  },
  {
    label: 'Italic',
    icon: (
      <Text style={{ fontSize: 14, color: colors.textDim, fontFamily: fonts.display, fontStyle: 'italic' }}>
        I
      </Text>
    ),
  },
  { divider: true, icon: null },
  {
    label: 'Bulleted list',
    icon: (
      <Svg width={15} height={15} viewBox="0 0 24 24" stroke="currentColor" {...stroke}>
        <Path d="M8 6h12M8 12h12M8 18h12" />
        <Circle cx={4} cy={6} r={1.4} fill="currentColor" stroke="none" />
        <Circle cx={4} cy={12} r={1.4} fill="currentColor" stroke="none" />
        <Circle cx={4} cy={18} r={1.4} fill="currentColor" stroke="none" />
      </Svg>
    ),
  },
  {
    label: 'Link',
    icon: (
      <Svg width={15} height={15} viewBox="0 0 24 24" stroke="currentColor" {...stroke}>
        <Path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
        <Path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
      </Svg>
    ),
  },
  {
    label: 'Image',
    icon: (
      <Svg width={15} height={15} viewBox="0 0 24 24" stroke="currentColor" {...stroke}>
        <Rect x={3} y={4} width={18} height={16} rx={2} />
        <Circle cx={8.5} cy={9.5} r={1.6} />
        <Path d="m4 18 5-5 4 4 3-3 4 4" />
      </Svg>
    ),
  },
];

/**
 * Horizontal icon-button group for rich-text formatting.
 *
 * Native has no `currentColor` inheritance, so each item glyph should set its
 * own color; the default-set svgs use `stroke="currentColor"` purely as a
 * neutral placeholder (react-native-svg resolves it to black) — pass an
 * already-colored glyph (or the shared `Icon`) for production use.
 */
export function Toolbar({ items = DEFAULT_ITEMS, style }: ToolbarProps) {
  return (
    <View style={[styles.bar, style]} accessibilityRole="toolbar">
      {items.map((item, i) =>
        item.divider ? (
          <View key={i} style={styles.divider} />
        ) : (
          <Pressable
            key={i}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: item.active }}
            onPress={item.onPress}
            style={({ pressed }) => [
              styles.btn,
              item.active && styles.btnOn,
              pressed && !item.active && styles.btnPressed,
            ]}
          >
            {item.icon}
          </Pressable>
        ),
      )}
    </View>
  );
}

/* ============================================================================
   Dropzone — a large dashed-border file-drop area: centered round icon badge +
   label + hint. Native can't receive OS file drops, so the box is a Pressable
   that calls `onPress` (best-effort `onFiles`); the dashed visual is preserved.
   Mirrors the web `Dropzone`.
   ========================================================================== */

export interface DropzoneProps {
  /** primary prompt line */
  label?: string;
  /** secondary hint line (formats / size) */
  hint?: string;
  /** glyph rendered in the round badge; defaults to an upload icon */
  icon?: ReactNode;
  /**
   * Tap handler. RN has no file-drop, so wire this to your own picker
   * (e.g. expo-document-picker) and forward results via `onFiles`.
   */
  onPress?: () => void;
  /** best-effort: forwarded an array of picked-file descriptors, if any */
  onFiles?: (files: unknown[]) => void;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_DZ_ICON: ReactNode = (
  <Svg width={22} height={22} viewBox="0 0 24 24" stroke={colors.accent2} {...stroke}>
    <Path d="M12 16V4M8 8l4-4 4 4" />
    <Path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
  </Svg>
);

/** Dashed-border drop area — tap to trigger a picker (no native file drop). */
export function Dropzone({
  label = 'Drop files here or click to upload',
  hint = 'PNG, JPG up to 10MB',
  icon = DEFAULT_DZ_ICON,
  onPress,
  onFiles,
  style,
}: DropzoneProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        onPress?.();
        onFiles?.([]);
      }}
      style={({ pressed }) => [styles.dropzone, pressed && styles.dropzoneActive, style]}
    >
      <View style={styles.dzIco}>{icon}</View>
      <Text style={styles.dzLabel}>{label}</Text>
      <Text style={styles.dzHint}>{hint}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Toolbar
  bar: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 3,
    padding: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.glass2,
  },
  btn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  btnPressed: {
    backgroundColor: colors.glass2,
  },
  btnOn: {
    backgroundColor: 'rgba(124, 92, 255, 0.16)',
    borderColor: 'rgba(124, 92, 255, 0.4)',
  },
  divider: {
    width: 1,
    height: 22,
    marginHorizontal: 4,
    marginVertical: 2,
    backgroundColor: colors.border2,
  },

  // Dropzone
  dropzone: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 168,
    padding: 28,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border2,
    backgroundColor: 'rgba(124, 92, 255, 0.04)',
  },
  dropzoneActive: {
    borderColor: colors.accent2,
    backgroundColor: 'rgba(34, 211, 238, 0.06)',
  },
  dzIco: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 23,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.glass,
  },
  dzLabel: {
    fontFamily: fonts.ui,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  dzHint: {
    fontFamily: fonts.ui,
    fontSize: 12,
    color: colors.textFaint,
    textAlign: 'center',
  },
});
