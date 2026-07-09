import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients, nativeShadows } from '@lockin90/tokens';
import { Icon } from './Icon';

/**
 * Semantic tone for a rich segment's active state + leading dot — mirrors the
 * web `SegmentedTone`. `canary` paints amber for staged/partial rollouts, `ok`
 * mint, `danger` red. Do not confuse with the control-level `tone`
 * (`'accent' | 'mint'`) prop, which colors the SELECTED pill.
 */
export type SegmentedTone = 'ok' | 'canary' | 'danger';

/** A rich segment: a `label` plus an optional trailing `count` badge and a
 *  semantic `tone`. Plain strings are still accepted and render identically.
 *  Mirrors the web `SegmentedTab`. */
export interface SegmentedTab {
  /** Segment label text. */
  label: string;
  /** Small trailing count badge inside the segment (e.g. catalog item counts). */
  count?: number;
  /** Tones the segment's active pill + a leading dot. */
  tone?: SegmentedTone;
}

/** Accepts the plain-string form or the rich object form, mixed freely.
 *  Mirrors the web `SegmentedTabItem`. */
export type SegmentedTabItem = string | SegmentedTab;

const toTab = (t: SegmentedTabItem): SegmentedTab => (typeof t === 'string' ? { label: t } : t);

// Per-item tone colors (dot + active label/badge accent) — web `--lk-seg-tone`.
const TONE_COLOR: Record<SegmentedTone, string> = {
  ok: colors.ok,
  canary: colors.warn,
  danger: colors.bad,
};
// Active count-badge tint per tone — the sanctioned paired literals for the web
// `color-mix(in srgb, var(--lk-seg-tone) 16%, transparent)`.
const TONE_TINT: Record<SegmentedTone, string> = {
  ok: 'rgba(52,245,197,0.16)',
  canary: 'rgba(255,176,32,0.16)',
  danger: 'rgba(255,77,109,0.16)',
};

export interface SegmentedTabsProps {
  /**
   * Segments, one button each. Each may be a plain label string or a
   * `{ label, count?, tone? }` object — the two forms can be mixed.
   */
  tabs?: SegmentedTabItem[];
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
      {tabs.map((item, i) => {
        const { label, count, tone: itemTone } = toTab(item);
        const isActive = i === active;
        const isLocked = locked?.includes(i) ?? false;
        const isMintActive = isActive && tone === 'mint';
        const toneColor = itemTone != null ? TONE_COLOR[itemTone] : undefined;
        // Label: mint-active dark-on-bright wins over a per-item tone (web
        // specificity: `[data-tone='mint'] .is-active` beats `.is-active.lk-seg-*`);
        // otherwise an active toned segment tints its label toward the tone.
        const labelColor = isMintActive
          ? '#0A0A12'
          : isActive
            ? (toneColor ?? colors.text)
            : colors.textDim;
        const countBg = isActive
          ? itemTone != null
            ? TONE_TINT[itemTone]
            : colors.glass
          : colors.glass2;
        const countColor = isActive ? (toneColor ?? colors.text) : colors.textDim;
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
            {toneColor != null && (
              <View style={[styles.dot, { backgroundColor: toneColor }]} />
            )}
            <Text
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              style={[styles.label, { color: labelColor }]}
            >
              {label}
            </Text>
            {count != null && (
              <View style={[styles.count, { backgroundColor: countBg }]}>
                <Text style={[styles.countText, { color: countColor }]}>{count}</Text>
              </View>
            )}
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
    paddingVertical: 8,
    paddingHorizontal: 6,
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
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.07,
  },
  // leading tone dot — 6px round, colored per tone (web `.lk-seg-dot`)
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  // trailing count badge — a small mono pill after the label (web `.lk-seg-count`)
  count: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: radii.pill,
  },
  countText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    lineHeight: 12, // web is line-height 1; 12 keeps mono glyphs unclipped on device
    fontVariant: ['tabular-nums'],
  },
});
