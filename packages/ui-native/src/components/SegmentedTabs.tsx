import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients, nativeShadows } from '@lockin90/tokens';
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
  /**
   * Color of the SELECTED segment. `'accent'` (default) keeps the standard
   * raised glass pill; `'mint'` paints the active segment with the mint
   * gradient (`gradients.mint`) + mint glow + dark label — the onboarding
   * Activity-level control (mirrors web `tone="mint"` / design `.seg.on.mint`).
   */
  tone?: 'accent' | 'mint';
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
  tone = 'accent',
}: SegmentedTabsProps) {
  return (
    <View style={styles.track} accessibilityRole="tablist">
      {tabs.map((label, i) => {
        const isActive = i === active;
        const isLocked = locked?.includes(i) ?? false;
        const isMintActive = isActive && tone === 'mint';
        return (
          <Pressable
            key={i}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive, disabled: isLocked }}
            disabled={isLocked}
            onPress={isLocked ? undefined : () => onChange?.(i)}
            style={({ pressed }) => [
              styles.tab,
              isActive && tone === 'accent' && styles.tabActive,
              pressed && !isActive && !isLocked && styles.tabPressed,
              isLocked && styles.tabLocked,
            ]}
          >
            {isMintActive && (
              <LinearGradient
                colors={gradients.mint.stops as unknown as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tabActiveMint}
              />
            )}
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                { color: isActive ? (isMintActive ? '#0A0A12' : colors.text) : colors.textDim },
              ]}
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
  // mint-tone active segment: a mint-gradient fill (the LinearGradient is
  // absolutely positioned behind the label) + mint glow, mirroring web
  // `[data-tone='mint'] .is-active`. The label paints dark-on-bright.
  tabActiveMint: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.pill,
    ...nativeShadows.glowMint,
  },
  label: {
    fontFamily: fonts.ui,
    fontSize: 13.5,
    fontWeight: '600',
    letterSpacing: -0.07,
    textAlign: 'center',
  },
});
