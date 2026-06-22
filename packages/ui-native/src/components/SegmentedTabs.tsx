import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';

export interface SegmentedTabsProps {
  /** Segment labels, one button each. */
  tabs?: string[];
  /** Index of the active segment. */
  active?: number;
  /** Fires with the pressed segment index. */
  onChange?: (index: number) => void;
}

/**
 * iOS-style segmented control — a glass pill track of equal-width segments; the
 * active one is a raised lighter pill (glass-2 + soft shadow). Mirrors the web
 * `@lockin90/ui` `SegmentedTabs`.
 */
export function SegmentedTabs({
  tabs = ['Stats', 'History', 'Guide', 'Ranks'],
  active = 0,
  onChange,
}: SegmentedTabsProps) {
  return (
    <View style={styles.track} accessibilityRole="tablist">
      {tabs.map((label, i) => {
        const isActive = i === active;
        return (
          <Pressable
            key={i}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange?.(i)}
            style={({ pressed }) => [
              styles.tab,
              isActive && styles.tabActive,
              pressed && !isActive && styles.tabPressed,
            ]}
          >
            <Text
              numberOfLines={1}
              style={[styles.label, { color: isActive ? colors.text : colors.textDim }]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.bg1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: colors.glass2,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  tabPressed: { opacity: 0.7 },
  label: {
    fontFamily: fonts.ui,
    fontSize: 13.5,
    fontWeight: '600',
    letterSpacing: -0.07,
    textAlign: 'center',
  },
});
