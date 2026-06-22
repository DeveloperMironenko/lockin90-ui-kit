import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradients } from '@lockin90/tokens';

export interface TabsProps {
  /** Tab labels, one button each. */
  tabs?: string[];
  /** Index of the active tab. */
  active?: number;
  /** Fires with the pressed tab index. */
  onChange?: (index: number) => void;
}

/**
 * Underline tab bar — a horizontal row of text tabs along a 1px bottom rail; the
 * active tab is brighter and carries a 2px accent-gradient underline sitting on
 * the rail. Distinct from the pill-track `SegmentedTabs`. Mirrors the web
 * `@lockin90/ui` `Tabs`.
 */
export function Tabs({
  tabs = ['Overview', 'Activity', 'Settings'],
  active = 0,
  onChange,
}: TabsProps) {
  return (
    <View style={styles.rail} accessibilityRole="tablist">
      {tabs.map((label, i) => {
        const isActive = i === active;
        return (
          <Pressable
            key={i}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange?.(i)}
            style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
          >
            <Text
              numberOfLines={1}
              style={[styles.label, { color: isActive ? colors.text : colors.textDim }]}
            >
              {label}
            </Text>
            {isActive && (
              <LinearGradient
                colors={gradients.cta.stops as unknown as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.underline}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    marginRight: 22,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  tabPressed: { opacity: 0.7 },
  label: {
    fontFamily: fonts.ui,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.07,
  },
  underline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -1,
    height: 2,
    borderRadius: 2,
  },
});
