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
  onPress?: () => void;
}

export interface TabBarProps {
  items: TabBarItem[];
  style?: StyleProp<ViewStyle>;
}

/**
 * Bottom navigation row — icon over a tiny mono label per item. The native
 * counterpart of the web @lockin90/ui TabBar: active item uses the accent color,
 * disabled ("coming soon") items are dimmed and non-interactive. The app is
 * responsible for the safe-area bottom inset; this primitive is a plain row.
 */
export function TabBar({ items, style }: TabBarProps) {
  return (
    <View style={[styles.bar, style]} accessibilityRole="tablist">
      {items.map((it) => {
        const tone = it.disabled
          ? colors.textGhost
          : it.active
            ? colors.accent
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
