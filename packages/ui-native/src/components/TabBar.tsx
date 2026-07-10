import { type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients, nativeShadows } from '@lockin90/tokens';
import { Icon, type IconName } from './Icon';
import { OptionalBlurView } from '../internal/optionalBlur';

/* ============================================================================
   Mobile atoms — TabBar (bottom navigation) + FAB (floating action button).
   Mirrors the web `@lockin90/ui` `TabBar` + `FAB`.
   ========================================================================== */

/** One tab: a glyph over a short label. */
export interface TabBarItem {
  /** Glyph. Pass a node, or an `IconName` to draw the shared icon set tinted
   *  to the tab's active/inactive color automatically. */
  icon: ReactNode | IconName;
  label: string;
}

export interface TabBarProps {
  /** Tabs, left→right. Defaults to a 5-tab Home/Log/Coach/Stats/More set. */
  items?: TabBarItem[];
  /** Index of the active tab. */
  active?: number;
  /** Fires with the pressed tab index. */
  onChange?: (index: number) => void;
  /** Index of the item rendered as an elevated center FAB — a gradient tile that
   *  overhangs the bar top, label beneath. Omit for a flat bar. */
  fabIndex?: number;
  /** Press handler for the FAB item (falls back to `onChange(fabIndex)`). */
  onFabPress?: () => void;
  /** Floating rounded glass-pill bar (the mockups' `.tabbar`) instead of the
   *  default solid pinned bar with a top border. Position it yourself with
   *  `style` (e.g. `position:'absolute', left/right/bottom`). */
  floating?: boolean;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_ITEMS: TabBarItem[] = [
  { icon: 'star', label: 'Home' },
  { icon: 'plus', label: 'Log' },
  { icon: 'info', label: 'Coach' },
  { icon: 'timer', label: 'Stats' },
  { icon: 'more', label: 'More' },
];

function renderIcon(icon: ReactNode | IconName, tint: string): ReactNode {
  // By the prop type, a string IS an `IconName` — resolve any string against the
  // full shared glyph set, tinted to the tab's active/inactive color. Custom
  // nodes (the `ReactNode` slot) pass straight through.
  if (typeof icon === 'string') {
    return <Icon name={icon as IconName} size={22} color={tint} />;
  }
  return icon as ReactNode;
}

/**
 * Bottom navigation bar — a glass row of icon-over-label tab buttons; the active
 * tab glows in the accent color, the rest sit faint. Glass bar with a top
 * border, meant to sit pinned to the bottom of a screen.
 */
export function TabBar({
  items = DEFAULT_ITEMS,
  active = 0,
  onChange,
  fabIndex,
  onFabPress,
  floating = false,
  style,
}: TabBarProps) {
  const tabs = items.map((item, i) => {
    const isActive = i === active;
    const isFab = i === fabIndex;
    const tint = isActive ? colors.accent : colors.textFaint;
    return (
      <Pressable
        key={i}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        onPress={() => (isFab && onFabPress ? onFabPress() : onChange?.(i))}
        style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
      >
        {isFab ? (
          <LinearGradient
            colors={gradients.cta.stops as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabTile}
          >
            {renderIcon(item.icon, '#08090F')}
          </LinearGradient>
        ) : (
          <View style={styles.iconWrap}>{renderIcon(item.icon, tint)}</View>
        )}
        <Text style={[styles.label, { color: isFab ? colors.textDim : tint }]}>{item.label}</Text>
      </Pressable>
    );
  });

  // Floating bars are FROSTED when the app ships expo-blur (the design's
  // `backdrop-filter: blur(20px) saturate(120%)`); without it the translucent
  // fill approximates. The web twin uses the real backdrop-filter.
  if (floating && OptionalBlurView) {
    return (
      <OptionalBlurView
        intensity={40}
        tint="dark"
        style={[styles.bar, styles.barFloating, style]}
        accessibilityRole="tablist"
      >
        {tabs}
      </OptionalBlurView>
    );
  }

  return (
    <View style={[styles.bar, floating && styles.barFloating, style]} accessibilityRole="tablist">
      {tabs}
    </View>
  );
}

export interface FABProps {
  /** Glyph rendered inside the button. Defaults to a plus. */
  icon?: ReactNode;
  /** Optional text — renders an extended (pill) FAB instead of a circle. */
  label?: string;
  /** Fires on press. */
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

/**
 * Floating action button — a circular energy-gradient button with a strong glow
 * and a press lift. With a `label` it grows into an extended pill FAB.
 * Positioning is left to the consumer.
 */
export function FAB({
  icon,
  label,
  onPress,
  disabled,
  style,
  accessibilityLabel,
}: FABProps) {
  const extended = label != null;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (extended ? label : 'Add')}
      style={({ pressed }) => [
        styles.fabShadow,
        disabled && styles.fabDisabled,
        pressed && !disabled && styles.fabPressed,
        style,
      ]}
    >
      <LinearGradient
        colors={gradients.cta.stops as unknown as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.fab, extended && styles.fabExtended]}
      >
        {icon ?? <Icon name="plus" size={22} color="#0A0A12" />}
        {extended && <Text style={styles.fabLabel}>{label}</Text>}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // ---- TabBar ----
  bar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    gap: 2,
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: colors.bg1,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  // floating glass pill (the mockups' `.tabbar`): rounded, hairline all round, a
  // semi-opaque dark fill (= bg1 @ 82%; tokens have no alpha-bg), and an upward
  // ambient float shadow (no token — nativeShadows are elev/glow, not floats).
  // owner pick (2026-07-10): full CAPSULE, not the design's 26px — the bar's
  // curve follows the iPhone screen corner; equal 8px padding inside; hosts
  // give it EQUAL 12px side + bottom insets (don't let the safe area inflate
  // the bottom gap). `overflow: hidden` clips the blur to the capsule.
  barFloating: {
    width: undefined,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(12,15,26,0.82)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -6 },
    elevation: 16,
  },
  item: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  itemPressed: { opacity: 0.7 },
  // Active tab is signalled by the accent tint (matches web). Web layers a subtle
  // icon-shaped drop-shadow glow on top; RN StyleSheet can't do an icon-shaped
  // shadow (a raw shadow on the transparent wrap renders as a boxy square glow in
  // RN-web), so native uses the accent color alone — clean on both platforms.
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  // elevated center-FAB tile (fabIndex): a rounded-square grad-cta tile that
  // overhangs the bar top, matching home.html `.tab.fab .fab-ic`.
  fabTile: {
    width: 44,
    height: 44,
    marginTop: -24,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.bg0,
    ...nativeShadows.glowAccent,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.6,
    lineHeight: 10,
  },
  // ---- FAB ----
  fabShadow: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    ...nativeShadows.glowAccent,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    width: 56,
    height: 56,
    borderRadius: radii.pill,
  },
  fabExtended: {
    width: 'auto',
    height: 52,
    paddingLeft: 18,
    paddingRight: 22,
  },
  fabLabel: {
    fontFamily: fonts.ui,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.07,
    color: '#0A0A12',
  },
  fabPressed: { transform: [{ scale: 0.96 }] },
  fabDisabled: { opacity: 0.5 },
});
