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
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg0,
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
    shadowColor: colors.accent,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
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
});
