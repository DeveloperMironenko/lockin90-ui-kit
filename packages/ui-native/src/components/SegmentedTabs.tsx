import { useLayoutEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients, nativeShadows } from '@lockin90/tokens';
import { hapticSelection } from "../internal/optionalHaptics";
import { SLACK, WordMeasurer, wordFitScale, type Probe } from '../internal/wordFit';
import { Icon, type IconName } from './Icon';

/**
 * Per-segment tone — mirrors the web `SegmentedTone`. Two families:
 * - SEMANTIC tones (`ok`/`canary`/`danger`) — a leading dot + active-only
 *   label tint. `canary` paints amber for staged/partial rollouts, `ok` mint,
 *   `danger` red.
 * - COLOR tones (`amber`/`cyan`/`violet`/`magenta`) — set-type tints (the
 *   edit-set type selector, design `.sg`: warm-up amber → warn, working cyan,
 *   drop violet, failure magenta). The label is tinted at ALL times (inactive
 *   too), there is NO leading dot, and the ACTIVE segment paints a tone@16%
 *   fill + a 1px tone@50% border.
 * Do not confuse with the control-level `tone` (`'accent' | 'mint'`) prop,
 * which colors the SELECTED pill.
 */
export type SegmentedTone = 'ok' | 'canary' | 'danger' | 'amber' | 'cyan' | 'violet' | 'magenta';

/** The 4 color tones — always-tinted label, no dot (vs the semantic dots). */
type SegmentedColorTone = Extract<SegmentedTone, 'amber' | 'cyan' | 'violet' | 'magenta'>;
const COLOR_TONES: ReadonlySet<SegmentedTone> = new Set(['amber', 'cyan', 'violet', 'magenta']);

/** A rich segment: a `label` plus an optional trailing `count` badge and a
 *  semantic `tone`. Plain strings are still accepted and render identically.
 *  Mirrors the web `SegmentedTab`. */
export interface SegmentedTab {
  /** Segment label text. */
  label: string;
  /** Small trailing count badge inside the segment (e.g. catalog item counts). */
  count?: number;
  /** Semantic tone (dot + active tint) or color tone (always-tinted label,
   *  no dot, tinted active fill) — see `SegmentedTone`. */
  tone?: SegmentedTone;
  /** Leading 13px glyph before the label (e.g. the changelog service filter
   *  All/Web/Mobile). Mirrors the web `SegmentedTab.icon`. */
  icon?: IconName;
}

/** Accepts the plain-string form or the rich object form, mixed freely.
 *  Mirrors the web `SegmentedTabItem`. */
export type SegmentedTabItem = string | SegmentedTab;

const toTab = (t: SegmentedTabItem): SegmentedTab => (typeof t === 'string' ? { label: t } : t);

// Per-item tone colors (dot / label / active badge accent) — web `--lk-seg-tone`.
const TONE_COLOR: Record<SegmentedTone, string> = {
  ok: colors.ok,
  canary: colors.warn,
  danger: colors.bad,
  amber: colors.warn,
  cyan: colors.cyan,
  violet: colors.violet,
  magenta: colors.magenta,
};
// Tone tint at 16% (active fill / count badge) — the sanctioned paired literals
// for the web `color-mix(in srgb, var(--lk-seg-tone) 16%, transparent)`.
const TONE_TINT: Record<SegmentedTone, string> = {
  ok: 'rgba(52,245,197,0.16)',
  canary: 'rgba(255,176,32,0.16)',
  danger: 'rgba(255,77,109,0.16)',
  amber: 'rgba(255,176,32,0.16)',
  cyan: 'rgba(34,211,238,0.16)',
  violet: 'rgba(168,85,247,0.16)',
  magenta: 'rgba(255,61,129,0.16)',
};
// Active border for the 4 COLOR tones — paired literals for the web
// `color-mix(in srgb, var(--lk-seg-tone) 50%, transparent)` (design `.sg.on`).
const TONE_BORDER: Record<SegmentedColorTone, string> = {
  amber: 'rgba(255,176,32,0.5)',
  cyan: 'rgba(34,211,238,0.5)',
  violet: 'rgba(168,85,247,0.5)',
  magenta: 'rgba(255,61,129,0.5)',
};

/** The design's dark ink for labels on a bright CTA gradient
 *  (design `.seg button[aria-pressed="true"]` — #07080d). */
const INK_ON_GRADIENT = '#07080D';

/** Above this OS text scale the segments always stack (as ListRow's settings rows). */
const LARGE_TEXT = 1.35;
/** `fill` labels shrink to fit their segment down to this scale before wrapping (web `MIN_FIT`). */
const FILL_MIN_SCALE = 0.8;
const LABEL_SIZE = 11;
/** A segment's side padding: the pill's (6, `fill` 4) plus the 2 it is inset. */
const PAD_X = 8;
const FILL_PAD_X = 6;
const FILL_LABEL_SIZE = 12.5;

/** A label's words (none for an empty or space-only label). */
export function wordsOf(label: string): string[] {
  return label.trim().split(/\s+/).filter(Boolean);
}

/** One label measured on one line at its own font size: the whole label and each word. */
export interface LabelWidths {
  full: number;
  words: number[];
}

/**
 * How labels fit their segments, from widths measured on one unconstrained line (so it can't miss):
 * each label's font scale (1, or down to `minScale` to stay on one line) and whether the segments must
 * stack — a word wider than its room even at `minScale`, or a label that needs more than 2 lines when it
 * wraps between words. `rooms[i]` is the width label `i` has inside its segment; `space` a space's width.
 */
export function segmentFit(
  widths: readonly LabelWidths[],
  rooms: readonly number[],
  space: number,
  minScale: number,
): { stacked: boolean; scales: number[] } {
  let stacked = false;
  const scales = widths.map(({ full, words }, i) => {
    const room = (rooms[i] ?? 0) - SLACK;
    if (!words.length || full <= room) return 1;
    const shrink = Math.floor((100 * room) / full) / 100;
    if (shrink >= minScale) return shrink;
    // wraps at spaces, at the smallest size: every word fits its room, in at most 2 lines
    let lines = 1;
    let line = 0;
    for (const w of words) {
      const word = w * minScale;
      if (word > room) stacked = true;
      if (line === 0) line = word;
      else if (line + space * minScale + word <= room) line += space * minScale + word;
      else {
        lines += 1;
        line = word;
      }
    }
    if (lines > 2) stacked = true;
    return minScale;
  });
  return { stacked, scales: stacked ? widths.map(() => 1) : scales };
}

/** Stacked labels shrink so their widest word fits the segment, down to this scale. */
const STACK_MIN_SCALE = 0.5;

/** Stacked segments: each label's scale so its widest word fits its room (labels wrap between words). */
export function stackedScales(widths: readonly LabelWidths[], rooms: readonly number[]): number[] {
  return widths.map(({ words }, i) => wordFitScale(Math.max(0, ...words), rooms[i] ?? 0, STACK_MIN_SCALE));
}

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
  /** Equal segments that fit a phone row: 12.5 labels, padding 8 / 4 (web `fill` at phone width). */
  fill?: boolean;
  /** The track's line in `colors.zoneLow`: a required choice not made (web `invalid`). */
  invalid?: boolean;
  /**
   * What the control is. `'tabs'` (default) switches views: a `tablist` of `tab`s. `'choice'` is a form
   * value (units, sex, activity level): a `radiogroup` of `radio`s, the chosen one `checked`. Mirrors
   * web `kind` (where the arrow keys also move the choice).
   */
  kind?: 'tabs' | 'choice';
  /** The group's name (a `FormField` passes its label here). */
  accessibilityLabel?: string;
  /** Read after the name (a `FormField` passes its error or help here). */
  accessibilityHint?: string;
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
  fill = false,
  invalid = false,
  kind = 'tabs',
  accessibilityLabel,
  accessibilityHint,
}: SegmentedTabsProps) {
  const isSm = size === 'sm';
  const isTint = appearance === 'tint';
  const choice = kind === 'choice';
  const items = tabs.map(toTab);
  const labels = items.map((t) => t.label);
  // Nothing is cut off and no word breaks (CONVENTIONS "Accessibility"), decided from measured widths:
  // - a large OS text size (> 1.35, as ListRow) always stacks the segments, each the full width, labels
  //   wrapping between words; a word wider than even that (a half-width column) shrinks to fit
  //   (`stackedScales`, down to 50 %);
  // - `md` at any size: a hidden measurer lays every label, each of its words, a space and each count out
  //   on one unconstrained line in the label's own font; with the track's width that gives each label's
  //   room, and `segmentFit` says the label's scale (`fill`: down to 80 % to stay on one line, as web) or
  //   that the segments stack (a word wider than its room, or more than 2 lines). The row stays invisible
  //   until the widths are in, so it never shows one layout and then jumps to another.
  // - `sm` hugs its labels (they never wrap) and stacks only at a large text size.
  const { fontScale } = useWindowDimensions();
  const large = fontScale > LARGE_TEXT;
  const measuring = !isSm;
  const [trackW, setTrackW] = useState(0);
  const measureKey = `${labels.join('\u0000')}|${items.map((t) => t.count ?? '').join(',')}|${fontScale}|${fill}`;
  const [measured, setMeasured] = useState<{ key: string; w: Record<string, number> }>({ key: measureKey, w: {} });
  const widths = measured.key === measureKey ? measured.w : {};
  const record = (id: string, w: number) =>
    setMeasured((prev) => {
      const base = prev.key === measureKey ? prev.w : {};
      return base[id] === w && prev.key === measureKey ? prev : { key: measureKey, w: { ...base, [id]: w } };
    });
  const probes: { id: string; text: string; count?: boolean }[] = [
    { id: 'sp2', text: 'a a' },
    { id: 'sp0', text: 'aa' },
  ];
  items.forEach((t, i) => {
    probes.push({ id: `f${i}`, text: t.label });
    wordsOf(t.label).forEach((w, k) => probes.push({ id: `w${i}.${k}`, text: w }));
    if (t.count != null) probes.push({ id: `c${i}`, text: String(t.count), count: true });
  });
  // Layout events alone are not enough: a tree mounted while hidden (a Suspense / frozen screen, e.g. the
  // app's language loading) never gets its `onLayout` on iOS Fabric, which left the row invisible. So the
  // track and the probes are also measured from their refs in a layout effect (React runs it again when a
  // hidden tree is shown).
  const trackRef = useRef<View>(null);
  const probeRefs = useRef<Record<string, Text | null>>({});
  useLayoutEffect(() => {
    if (!measuring) return;
    trackRef.current?.measure?.((_x, _y, w) => {
      if (!(w > 0)) return; // hidden: nothing to measure yet
      setTrackW(w);
      for (const p of probes) probeRefs.current[p.id]?.measure?.((_px, _py, pw) => record(p.id, pw));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- probes follow measureKey
  }, [measureKey, measuring]);
  const ready = measuring && trackW > 0 && probes.every((p) => widths[p.id] != null);
  let fit: { stacked: boolean; scales: number[] } = { stacked: false, scales: labels.map(() => 1) };
  let stacked = large;
  if (ready) {
    const n = Math.max(items.length, 1);
    const gap = isTint ? 5 : 4;
    // a label's room in a segment `segW` wide: less its padding, edge, dot, icon, count and lock
    const roomsIn = (segW: number) =>
      items.map((t, i) => {
        const colorTone = t.tone != null && COLOR_TONES.has(t.tone);
        let room = segW - 2 * (fill ? FILL_PAD_X : PAD_X) - (isTint || colorTone ? 2 : 0);
        if (t.tone != null && !colorTone) room -= 6 + gap;
        if (t.icon != null) room -= 13 + gap;
        if (t.count != null) room -= widths[`c${i}`]! + 12 + gap;
        if (locked?.includes(i)) room -= 12 + gap;
        return room;
      });
    const measures = items.map((t, i) => ({
      full: widths[`f${i}`]!,
      words: wordsOf(t.label).map((_, k) => widths[`w${i}.${k}`]!),
    }));
    // the row: the track (1 border + 2 padding each side, segments edge to edge) shared equally
    if (!large) {
      fit = segmentFit(measures, roomsIn((trackW - 2 * 1 - 2 * 2) / n), Math.max(0, widths.sp2! - widths.sp0!), fill ? FILL_MIN_SCALE : 1);
      stacked = fit.stacked;
    }
    // stacked: each segment the track's whole inner width; labels wrap between words, and a word wider
    // than that (a narrow column at a large text size) shrinks to fit (down to STACK_MIN_SCALE)
    if (stacked) fit = { stacked: true, scales: stackedScales(measures, roomsIn(trackW - 2 * 1 - 2 * 2)) };
  }
  const pending = measuring && !ready;
  const baseSize = fill ? FILL_LABEL_SIZE : LABEL_SIZE;
  return (
    <View
      style={[
        styles.track,
        isSm && styles.trackSm,
        isTint && styles.trackTint,
        invalid && styles.trackInvalid,
        stacked && styles.trackStacked,
        // always set (iOS Fabric kept a dropped `opacity: 0` on the track: the row stayed invisible)
        pending ? styles.pending : styles.shown,
      ]}
      accessibilityRole={choice ? 'radiogroup' : 'tablist'}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      ref={trackRef}
      onLayout={measuring ? (e) => setTrackW(e.nativeEvent.layout.width) : undefined}
    >
      {items.map(({ label, count, tone: itemTone, icon }, i) => {
        const isActive = i === active;
        const isLocked = locked?.includes(i) ?? false;
        const isGradActive = isActive && tone !== 'accent';
        const toneColor = itemTone != null ? TONE_COLOR[itemTone] : undefined;
        const isColorTone = itemTone != null && COLOR_TONES.has(itemTone);
        // Label: a gradient-active (mint/cta) dark-on-bright label wins over a
        // per-item tone (web specificity: `[data-tone] .is-active` beats
        // `.is-active.lk-seg-*`); a COLOR-toned label is tinted at ALL times
        // (inactive too — web `.lk-seg-colortone`); otherwise an active
        // SEMANTIC-toned segment tints its label toward the tone.
        const labelColor = isGradActive
          ? tone === 'mint'
            ? '#0A0A12'
            : INK_ON_GRADIENT
          : isColorTone
            ? toneColor!
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
            accessibilityRole={choice ? 'radio' : 'tab'}
            accessibilityState={choice ? { checked: isActive, disabled: isLocked } : { selected: isActive, disabled: isLocked }}
            disabled={isLocked}
            onPress={isLocked ? undefined : () => { hapticSelection(); onChange?.(i); }}
            // the row's segments are the track's height less its edge (42): the target reaches 44
            hitSlop={!isSm && !stacked ? { top: 1, bottom: 1 } : undefined}
            style={({ pressed }) => [
              styles.tab,
              !isSm && !stacked && styles.tabRow,
              stacked && styles.tabStacked,
              isSm && styles.tabSm,
              isTint && styles.tabTint,
              fill && styles.tabFill,
              pressed && !isActive && !isLocked && styles.tabPressed,
              isLocked && styles.tabLocked,
            ]}
          >
            {/* the pill: drawn inset in the segment (the segment itself is the whole target) */}
            <View
              pointerEvents="none"
              style={[
                styles.pill,
                isSm ? styles.pillSm : stacked ? styles.pillStacked : styles.pillRow,
                // color-tone and tint segments always carry a hairline, so the active one's border
                // doesn't change the pill's size
                (isTint || isColorTone) && styles.pillHairline,
                // a color-toned ACTIVE segment paints the tone@16% fill + tone@50% border INSTEAD of
                // the raised glass pill
                isActive && tone === 'accent' && !isColorTone &&
                  (isTint ? styles.tabActiveTint : styles.tabActive),
                isActive && !isGradActive && isColorTone && {
                  backgroundColor: TONE_TINT[itemTone!],
                  borderColor: TONE_BORDER[itemTone as SegmentedColorTone],
                },
              ]}
            />
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
                style={[
                  styles.pill,
                  isSm ? styles.pillSm : stacked ? styles.pillStacked : styles.pillRow,
                  tone === 'mint' ? styles.glowMint : styles.glowCta,
                ]}
              />
            )}
            {toneColor != null && !isColorTone && (
              <View style={[styles.dot, { backgroundColor: toneColor }]} />
            )}
            {icon != null && <Icon name={icon} size={13} color={labelColor} />}
            {/* never cut, never broken inside a word: the measured fit above sets the scale or stacks */}
            <Text
              style={[
                styles.label,
                isSm && styles.labelSm,
                fill && styles.labelFill,
                fit.scales[i] !== 1 && { fontSize: baseSize * fit.scales[i]! },
                { color: labelColor },
              ]}
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
      {measuring && (
        <WordMeasurer
          testID="lk-seg-measure"
          probes={probes.map((p): Probe => ({
            id: p.id,
            text: p.text,
            style: p.count ? [styles.countText, isTint && styles.countTextTint] : [styles.label, fill && styles.labelFill],
          }))}
          record={record}
          refs={probeRefs}
          keyPrefix={measureKey}
        />
      )}
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
  // md: the track is a field's height (44 with its edge: inline with an Input, owner 2026-11-11), its
  // segments edge to edge and the track's whole height (each a 44pt target with the edge), the pill
  // drawn 4 in from the top and bottom and 2 from each side (4 at the ends and between pills)
  track: {
    flexDirection: 'row',
    minHeight: 44,
    paddingHorizontal: 2,
    borderRadius: radii.pill,
    backgroundColor: colors.bg1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  // sm — design settings `.seg`: content-hugging track, padding 3, gap 2,
  // `--border` hairline, glass fill
  trackSm: {
    alignSelf: 'flex-start',
    minHeight: 0,
    gap: 2,
    padding: 3,
    backgroundColor: colors.glass,
  },
  tab: {
    flex: 1,
    minWidth: 0,
    // a 44pt target, as the web segment at phone width (CONVENTIONS "Accessibility")
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: PAD_X,
    borderRadius: radii.pill,
    backgroundColor: 'transparent',
  },
  // in the row: the track's height less its edge
  tabRow: { minHeight: 42 },
  // fill — web `.lk-seg--fill` at phone width: padding 8 / 4 inside the pill
  tabFill: {
    paddingHorizontal: FILL_PAD_X,
  },
  pill: { position: 'absolute', borderRadius: radii.pill, backgroundColor: 'transparent' },
  pillRow: { top: 4, bottom: 4, left: 2, right: 2 },
  // stacked: 2 in all round (4 between pills and at the track's edge)
  pillStacked: { top: 2, bottom: 2, left: 2, right: 2, borderRadius: radii.sm },
  pillSm: { top: 0, bottom: 0, left: 0, right: 0 },
  pillHairline: { borderWidth: 1, borderColor: 'transparent' },
  trackInvalid: {
    borderColor: colors.zoneLow,
  },
  // a label that can't fit: the segments stack, each the full width (labels wrap, never cut)
  // stacked, the track is a tall box: a container's corners (radii.md), its segments a control's
  // (radii.sm, 16 − the 4 padding ≈ 10), never the pill that turns a tall box into a stadium
  trackStacked: { flexDirection: 'column', alignItems: 'stretch', borderRadius: radii.md, padding: 2 },
  tabStacked: { flex: 0, borderRadius: radii.sm },
  // until the labels are measured the row is laid out but not shown (no visible jump to a stacked layout)
  pending: { opacity: 0 },
  shown: { opacity: 1 },
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
  countTextTint: { fontSize: 11, lineHeight: 13 },
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
  glowMint: { ...nativeShadows.glowMint },
  // design `.seg button[aria-pressed="true"]`: 0 0 14px rgba(124,92,255,.4)
  glowCta: { boxShadow: '0 0 14px rgba(124,92,255,0.4)' },
  labelFill: {
    fontSize: FILL_LABEL_SIZE,
  },
  label: {
    fontFamily: fonts.ui,
    fontSize: LABEL_SIZE,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.07,
  },
  // sm — design `.seg button`: mono 10.5/500
  labelSm: {
    fontFamily: fonts.mono,
    fontSize: 11,
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
    fontSize: 11,
    lineHeight: 13, // web is line-height 1; 13 keeps the 11 mono glyphs unclipped on device
    fontVariant: ['tabular-nums'],
  },
});
