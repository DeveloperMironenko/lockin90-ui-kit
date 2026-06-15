import type { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import { colors, fonts, spacing } from '@lockin90/tokens';

export interface TabBarItem {
  key: string;
  label: ReactNode;
  icon: ReactNode;
  active?: boolean;
  /** Inert "coming soon" tab — dimmed and non-interactive. */
  disabled?: boolean;
  /** Emphasised quick-action tab — rendered as a raised accent circle (FAB). */
  primary?: boolean;
  onPress?: () => void;
}

export interface TabBarProps {
  items: TabBarItem[];
  style?: StyleProp<ViewStyle>;
}

/**
 * Bottom navigation row — icon over a tiny mono label per item. The native
 * counterpart of the web @lockin90/ui TabBar. Active item uses the bright text
 * colour (matching web); disabled ("coming soon") items are dimmed and inert; a
 * `primary` item is the accent quick-action FAB (raised accent circle). The app
 * owns the safe-area bottom inset; this primitive is a plain row.
 */
export function TabBar({ items, style }: TabBarProps) {
  return (
    <View style={[styles.bar, style]} accessibilityRole="tablist">
      {items.map((it) => {
        if (it.primary) {
          return (
            <Pressable
              key={it.key}
              onPress={it.disabled ? undefined : it.onPress}
              disabled={it.disabled}
              accessibilityRole="tab"
              accessibilityState={{ selected: !!it.active, disabled: !!it.disabled }}
              style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            >
              <View style={styles.fab}>{it.icon}</View>
              <Text style={[styles.label, { color: colors.accent }]}>{it.label}</Text>
            </Pressable>
          );
        }
        const tone = it.disabled
          ? colors.textGhost
          : it.active
            ? colors.text
            : colors.textFaint;
        return (
          <Pressable
            key={it.key}
            onPress={it.disabled ? undefined : it.onPress}
            disabled={it.disabled}
            accessibilityRole="tab"
            accessibilityState={{ selected: !!it.active, disabled: !!it.disabled }}
            style={({ pressed }) => [styles.item, pressed && !it.disabled && styles.pressed]}
          >
            {it.icon}
            <Text style={[styles.label, { color: tone }]}>{it.label}</Text>
            <View style={[styles.dot, it.active && styles.dotActive]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Floating glass pill (Aurora Flux mockup). RN has no backdrop blur, so a
  // near-opaque dark fill stands in for the web's blur.
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: spacing.xs,
    height: 62,
    paddingHorizontal: 10,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(12,15,26,0.95)',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -8 },
    elevation: 16,
  },
  item: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  // Raised accent circle for the `primary` quick-action (Log) tab.
  fab: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginTop: -20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    // Accent (indigo-violet) glow.
    shadowColor: colors.accent,
    shadowOpacity: 0.8,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    elevation: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  // Cyan dot beneath the active tab (web parity).
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent2,
    opacity: 0,
  },
  dotActive: {
    opacity: 1,
    shadowColor: colors.accent2,
    shadowOpacity: 0.9,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
});
