import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients, nativeShadows } from '@lockin90/tokens';
import { hapticSelection } from "../internal/optionalHaptics";
import { Icon, type IconName } from './Icon';

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
  /** Leading 13px glyph before the label (e.g. the changelog service filter
   *  All/Web/Mobile). Mirrors the web `SegmentedTab.icon`. */
  icon?: IconName;
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

/** The design's dark ink for labels on a bright CTA gradient
 *  (design `.seg button[aria-pressed="true"]` — #07080d). */
const INK_ON_GRADIENT = '#07080D';

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
   * `'gradient'` paints it with the CTA gradient (`gradients.cta`) + accent
   * glow + dark label — the design settings `.seg` treatment (unit system /
   * week start controls). Mirrors web `tone="gradient"`.
   */
  tone?: 'accent' | 'mint' | 'gradient';
  /**
   * Control scale. `'md'` (default) is the full-width tab bar (equal-width
   * segments). `'sm'` is the design settings compact control: a
   * content-hugging pill track (padding 3, gap 2, `--border` hairline, glass
   * fill) of mono 10.5px segments (padding 5×11) that size to their label.
   * Mirrors web `size="sm"` / design `.seg`.
   */
  size?: 'md' | 'sm';
  /**
   * Track/active treatment. `'raised'` (default) keeps the standard raised
   * glass active pill. `'tint'` is the design changelog `.svc-toggle`
   * treatment: glass track, hairline-bordered segments, and an ACTIVE segment
   * painted with an accent tint + accent border (no shadow); count badges
   * shrink to mono 8.5 and tint cyan when active. Mirrors web
   * `appearance="tint"`.
   */
  appearance?: 'raised' | 'tint';
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
  size = 'md',
  appearance = 'raised',
}: SegmentedTabsProps) {
  const isSm = size === 'sm';
  const isTint = appearance === 'tint';
  return (
    <View
      style={[styles.track, isSm && styles.trackSm, isTint && styles.trackTint]}
      accessibilityRole="tablist"
    >
      {tabs.map((item, i) => {
        const { label, count, tone: itemTone, icon } = toTab(item);
        const isActive = i === active;
        const isLocked = locked?.includes(i) ?? false;
        const isGradActive = isActive && tone !== 'accent';
        const toneColor = itemTone != null ? TONE_COLOR[itemTone] : undefined;
        // Label: a gradient-active (mint/cta) dark-on-bright label wins over a
        // per-item tone (web specificity: `[data-tone] .is-active` beats
        // `.is-active.lk-seg-*`); otherwise an active toned segment tints its
        // label toward the tone.
        const labelColor = isGradActive
          ? tone === 'mint'
            ? '#0A0A12'
            : INK_ON_GRADIENT
          : isActive
            ? (toneColor ?? colors.text)
            : colors.textDim;
        const countBg = isActive
          ? itemTone != null
            ? TONE_TINT[itemTone]
            : isTint
              ? TINT_COUNT_ACTIVE.bg
              : colors.glass
          : colors.glass2;
        const countColor = isActive
          ? (toneColor ?? (isTint ? TINT_COUNT_ACTIVE.color : colors.text))
          : isTint
            ? colors.textFaint
            : colors.textDim;
        return (
          <Pressable
            key={i}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive, disabled: isLocked }}
            disabled={isLocked}
            onPress={isLocked ? undefined : () => { hapticSelection(); onChange?.(i); }}
            style={({ pressed }) => [
              styles.tab,
              isSm && styles.tabSm,
              isTint && styles.tabTint,
              isActive && tone === 'accent' && (isTint ? styles.tabActiveTint : styles.tabActive),
              pressed && !isActive && !isLocked && styles.tabPressed,
              isLocked && styles.tabLocked,
            ]}
          >
            {isGradActive && (
              <LinearGradient
                colors={
                  (tone === 'mint' ? gradients.mint.stops : gradients.cta.stops) as unknown as [
                    string,
                    string,
                  ]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.tabActiveFill, tone === 'mint' ? styles.glowMint : styles.glowCta]}
              />
            )}
            {toneColor != null && (
              <View style={[styles.dot, { backgroundColor: toneColor }]} />
            )}
            {icon != null && <Icon name={icon} size={13} color={labelColor} />}
            <Text
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              style={[styles.label, isSm && styles.labelSm, { color: labelColor }]}
            >
              {label}
            </Text>
            {count != null && (
              <View
                style={[
                  styles.count,
                  isTint && styles.countTint,
                  isTint && isActive && styles.countTintActive,
                  { backgroundColor: countBg },
                ]}
              >
                <Text style={[styles.countText, isTint && styles.countTextTint, { color: countColor }]}>
                  {count}
                </Text>
              </View>
            )}
            {isLocked && <Icon name="lock" size={12} color={colors.textDim} />}
          </Pressable>
        );
      })}
    </View>
  );
}

// `appearance="tint"` active count-badge accent — the sanctioned paired alpha
// literals for the design `.svc-btn[aria-pressed="true"] .svc-count`
// (accent-2 on a cyan tint).
const TINT_COUNT_ACTIVE = {
  color: colors.accent2,
  bg: 'rgba(34,211,238,0.10)',
  border: 'rgba(34,211,238,0.30)',
};
// design `.svc-btn[aria-pressed="true"]`: accent-tinted pill + accent border
const TINT_ACTIVE = {
  bg: 'rgba(124,92,255,0.14)',
  border: 'rgba(124,92,255,0.32)',
};

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
  // sm — design settings `.seg`: content-hugging track, padding 3, gap 2,
  // `--border` hairline, glass fill
  trackSm: {
    alignSelf: 'flex-start',
    gap: 2,
    padding: 3,
    backgroundColor: colors.glass,
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
  // sm segments hug their label (design `.seg button`: padding 5px 11px)
  tabSm: {
    flex: 0,
    paddingVertical: 5,
    paddingHorizontal: 11,
  },
  // appearance="tint" — design changelog `.svc-toggle`: glass track; segments
  // carry a transparent hairline so the active border doesn't shift layout
  trackTint: { backgroundColor: colors.glass },
  tabTint: {
    gap: 5,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  // design `.svc-btn[aria-pressed="true"]` — accent tint + accent border, no shadow
  tabActiveTint: {
    backgroundColor: TINT_ACTIVE.bg,
    borderColor: TINT_ACTIVE.border,
  },
  // design `.svc-count`: mono 8.5, padding 1×5, glass-2 + `--border` hairline
  countTint: {
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  countTintActive: {
    borderColor: TINT_COUNT_ACTIVE.border,
  },
  countTextTint: { fontSize: 8.5, lineHeight: 11 },
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
  // gradient-tone active segment: a gradient fill (the LinearGradient is
  // absolutely positioned behind the label) + glow, mirroring web
  // `[data-tone='mint'|'gradient'] .is-active`. The label paints dark-on-bright.
  tabActiveFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.pill,
  },
  glowMint: { ...nativeShadows.glowMint },
  // design `.seg button[aria-pressed="true"]`: 0 0 14px rgba(124,92,255,.4)
  glowCta: { boxShadow: '0 0 14px rgba(124,92,255,0.4)' },
  label: {
    fontFamily: fonts.ui,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.07,
  },
  // sm — design `.seg button`: mono 10.5/500
  labelSm: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    fontWeight: '500',
    letterSpacing: 0,
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
