import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Icon } from './Icon';

export interface SegmentedTabsProps {
  /** Segment labels, one button each. */
  tabs?: string[];
  /** Index of the active segment. */
  active?: number;
  /** Fires with the pressed segment index. */
  onChange?: (index: number) => void;
  /**
   * Indices of segments that are locked — dimmed, non-interactive (never fire
   * `onChange`), and rendered with a small lock glyph (e.g. the `1Y🔒 / All🔒`
   * upsell pattern on a time-range control).
   */
  locked?: number[];
}

/**
 * iOS-style segmented control — a glass pill track of equal-width segments; the
 * active one is a raised lighter pill (glass-2 + soft shadow). Locked segments
 * are dimmed, non-interactive, and show a lock glyph. Mirrors the web
 * `@lockin90/ui` `SegmentedTabs`.
 */
export function SegmentedTabs({
  tabs = ['Stats', 'History', 'Guide', 'Ranks'],
  active = 0,
  onChange,
  locked,
}: SegmentedTabsProps) {
  return (
    <View style={styles.track} accessibilityRole="tablist">
      {tabs.map((label, i) => {
        const isActive = i === active;
        const isLocked = locked?.includes(i) ?? false;
        return (
          <Pressable
            key={i}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive, disabled: isLocked }}
            disabled={isLocked}
            onPress={isLocked ? undefined : () => onChange?.(i)}
            style={({ pressed }) => [
              styles.tab,
              isActive && styles.tabActive,
              pressed && !isActive && !isLocked && styles.tabPressed,
              isLocked && styles.tabLocked,
            ]}
          >
            <Text
              numberOfLines={1}
              style={[styles.label, { color: isActive ? colors.text : colors.textDim }]}
            >
              {label}
            </Text>
            {isLocked && <Icon name="lock" size={12} color={colors.textDim} />}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    backgroundColor: 'transparent',
  },
  tabLocked: { opacity: 0.5 },
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
