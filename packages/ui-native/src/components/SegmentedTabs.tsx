import { useLayoutEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients, nativeShadows } from '@lockin90/tokens';
import { hapticSelection } from "../internal/optionalHaptics";
import { SLACK, WordMeasurer, breakableWords, fitFloor, glueCJK, hasCJK, wordFitScale, type Probe } from '../internal/wordFit';
import { innerRadius } from '../internal/radius';
import { useHighContrast } from '../internal/useHighContrast';
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

/** The track's edge and the gaps that place the lit pill (styles below), so its corners are the track's
 *  control radius less the pill's inset from the outer edge (CONVENTIONS "Corner radii"). */
const EDGE = 1;
const TRACK_PAD_X = 2;
const TRACK_PAD_SM = 3;
const TRACK_PAD_ROWS = 2;
const PILL_INSET_X = 2;
const PILL_INSET_Y = 4;
const PILL_INSET_ROWS = 2;
/** The lit pill's corners: on one row it is 5 in from the outer edge both ways (1 + 4 down, 1 + 2 + 2
 *  across), sm 4 (1 + 3), on rows 5 (1 + 2 + 2). */
const PILL_RADIUS = innerRadius(radii.sm, EDGE + PILL_INSET_Y);
const PILL_RADIUS_SM = innerRadius(radii.sm, EDGE + TRACK_PAD_SM);
const PILL_RADIUS_ROWS = innerRadius(radii.sm, EDGE + TRACK_PAD_ROWS + PILL_INSET_ROWS);

/** Above this OS text scale an `sm` track wraps its pills onto more rows (as ListRow's settings rows stack). */
const LARGE_TEXT = 1.35;
const LABEL_SIZE = 11;
/** A segment's side padding: the pill's (6, `fill` 4) plus the 2 it is inset. */
const PAD_X = 8;
const FILL_PAD_X = 6;
const FILL_LABEL_SIZE = 12.5;

/** A label's words: the pieces a line can't split (`breakableWords`: at spaces, after a hyphen or a
 *  slash), a CJK run whole (a zh / ja option is one word, owner 2026-11-11: never "アスリー / ト"); none
 *  for an empty or space-only label. */
export function wordsOf(label: string): string[] {
  return label
    .split(/[ \t\n\r\u2009\u200a]+/)
    .filter(Boolean)
    .flatMap((chunk) => (hasCJK(chunk) ? [chunk] : breakableWords(chunk)));
}

/** One label measured on one line at its own font size: the whole label and each word. */
export interface LabelWidths {
  full: number;
  words: number[];
}

/** How the segments are laid out: the labels per row (in order), each row's segment width, each label's
 *  font scale and whether it wraps onto more lines. */
export interface SegmentLayout {
  rows: number[];
  widths: number[];
  scales: number[];
  wraps: boolean[];
}

/** A label in `room`: on one line (shrunk as far as `minScale` if it must), else wrapping between words
 *  onto at most `maxLines` (at full size if it can, else at `minScale`); null when it can't fit. */
function fitLabel(
  { full, words }: LabelWidths,
  room: number,
  space: number,
  minScale: number,
  maxLines: number,
): { scale: number; wraps: boolean } | null {
  const r = room - SLACK;
  if (!words.length) return { scale: 1, wraps: false };
  if (!(r > 0)) return null;
  if (full <= r) return { scale: 1, wraps: false };
  const shrink = Math.floor((100 * r) / full) / 100;
  if (shrink >= minScale) return { scale: shrink, wraps: false };
  if (maxLines < 2 || words.length < 2) return null;
  for (const scale of [1, minScale]) {
    let lines = 1;
    let line = 0;
    let fits = true;
    for (const w of words) {
      const word = w * scale;
      if (word > r) fits = false;
      if (line === 0) line = word;
      else if (line + space * scale + word <= r) line += space * scale + word;
      else {
        lines += 1;
        line = word;
      }
    }
    if (fits && lines <= maxLines) return { scale, wraps: true };
  }
  return null;
}

/**
 * How the segments fit `inner` (the track's width inside its edge), from widths measured on one
 * unconstrained line (owner 2026-11-11): one row if every label fits it on one line, shrunk if it must (to
 * `minScale`: `fitFloor`); else as few rows as fit, balanced and in order (5 → 3 + 2, 4 → 2 + 2, then
 * 2 + 2 + 1…), a row's segments as wide as the fullest row's (a shorter row centred) unless a label needs
 * the row's whole width shared by fewer (a label that needs the full width gets a row of its own). On rows,
 * a label may wrap between words onto 2 lines, then more; never a column list as such. `roomOf(i, w)` is
 * the room label `i` has in a segment `w` wide; `space` a space's width; `gap` the space between segments
 * (0 here: they sit edge to edge). `aloneScale` is the floor of a label alone on its row (at a large text size
 * labels wrap rather than shrink: `minScale` 1 there, and only a label too wide for the full width shrinks,
 * down to `aloneScale`). A word wider than the full width even at `aloneScale` is the last resort:
 * each label a row, shrunk to the floor, the word breaking. Web `segmentRows` is the same.
 */
export function segmentRows(
  measures: readonly LabelWidths[],
  roomOf: (i: number, segW: number) => number,
  inner: number,
  space: number,
  minScale: number,
  gap = 0,
  aloneScale = minScale,
): SegmentLayout {
  const widthFor = (c: number) => (inner - gap * (c - 1)) / c;
  const n = measures.length;
  if (!n) return { rows: [], widths: [], scales: [], wraps: [] };
  let best: { layout: SegmentLayout; score: number[] } | null = null;
  for (const maxLines of [2, Infinity]) {
    for (let mask = 0; mask < 1 << (n - 1); mask += 1) {
      const rows: number[] = [];
      let count = 1;
      for (let g = 0; g < n - 1; g += 1) {
        if (mask & (1 << g)) {
          rows.push(count);
          count = 1;
        } else count += 1;
      }
      rows.push(count);
      const lines = rows.length === 1 ? 1 : maxLines;
      const fullest = Math.max(...rows);
      const layout: SegmentLayout = { rows, widths: [], scales: [], wraps: [] };
      let start = 0;
      let ok = true;
      for (const c of rows) {
        const tryWidth = (segW: number, floor: number) => {
          const out: { scale: number; wraps: boolean }[] = [];
          for (let k = 0; k < c; k += 1) {
            const f = fitLabel(measures[start + k]!, roomOf(start + k, segW), space, floor, lines);
            if (!f) return null;
            out.push(f);
          }
          return out;
        };
        // a label alone on its row shrinks (to `aloneScale`) only at the row's whole width: in a shorter
        // row it first takes the whole width
        let segW = widthFor(fullest);
        let fits = tryWidth(segW, c === 1 && c === fullest ? aloneScale : minScale);
        if (!fits && c < fullest) fits = tryWidth((segW = widthFor(c)), c === 1 ? aloneScale : minScale);
        if (!fits) {
          ok = false;
          break;
        }
        layout.widths.push(segW);
        for (const f of fits) {
          layout.scales.push(f.scale);
          layout.wraps.push(f.wraps);
        }
        start += c;
      }
      if (!ok) continue;
      // fewer rows, then balanced, then fewer labels wrapped, then the fuller rows first
      const score = [rows.length, fullest - Math.min(...rows), layout.wraps.filter(Boolean).length, ...rows.map((r) => -r)];
      const d = best ? score.findIndex((v, i) => v !== best!.score[i]) : -1;
      const better = !best || (d !== -1 && score[d]! < best.score[d]!);
      if (better) best = { layout, score };
    }
    if (best) return best.layout;
  }
  return {
    rows: measures.map(() => 1),
    widths: measures.map(() => inner),
    scales: measures.map(({ words }, i) => wordFitScale(Math.max(0, ...words), roomOf(i, inner), aloneScale)),
    wraps: measures.map(() => true),
  };
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
   * content-hugging track (padding 3, gap 2, the field's fill and edge) of mono 10.5px segments (padding 5×11) that size to their label.
   * Mirrors web `size="sm"` / design `.seg`.
   */
  size?: 'md' | 'sm';
  /**
   * Track/active treatment. `'raised'` (default) keeps the standard raised
   * glass active pill. `'tint'` is the design changelog `.svc-toggle`
   * treatment: hairline-bordered segments, and an ACTIVE segment
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
  const highContrast = useHighContrast();
  const choice = kind === 'choice';
  const items = tabs.map(toTab);
  const labels = items.map((t) => t.label);
  // Nothing is cut off and no word breaks (CONVENTIONS "Accessibility"), decided from measured widths
  // (`md`): a hidden measurer lays every label, each of its words, a space and each count out on one
  // unconstrained line in the label's own font; with the track's width that goes to `segmentRows`: one row
  // when every label fits it on one line (a `fill` label shrinks first, down to `fitFloor` with
  // `belowDefault`: 11pt at the default text size, the default size at a larger one), else as few balanced
  // rows as fit (3 + 2, 2 + 2, 2 + 2 + 1…, owner 2026-11-11: never a column list as such), at any text size
  // (above 1.35 without shrinking first: only a label alone on its row shrinks).
  // The track stays invisible until the widths are in, so it never shows one layout and then jumps to another.
  // `sm` hugs its labels (they never wrap); at a large text size its pills wrap onto more rows.
  const { fontScale, width: windowW } = useWindowDimensions();
  const large = fontScale > LARGE_TEXT;
  const measuring = !isSm;
  const [trackW, setTrack] = useState(0);
  // on rows with a label shrunk, a track as wide as its content (in a parent that doesn't stretch it) is
  // narrower than its room: that narrower width is not taken, or the labels would shrink again and again
  const shrunkRows = useRef(false);
  const setTrackW = (w: number) => setTrack((prev) => (shrunkRows.current && w < prev ? prev : w));
  const shown = labels.map(glueCJK);
  const measureKey = `${labels.join('\u0000')}|${items.map((t) => t.count ?? '').join(',')}|${fontScale}|${fill}|${windowW}`;
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
    probes.push({ id: `f${i}`, text: shown[i]! });
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
  let layout: SegmentLayout = { rows: [items.length], widths: [], scales: labels.map(() => 1), wraps: labels.map(() => false) };
  if (ready) {
    const gap = isTint ? 5 : 4;
    // a label's room in a segment `segW` wide: less its padding, dot, icon, count and lock (the hairline
    // of a tint or color-tone segment is on its absolute pill: it takes no room)
    const roomOf = (i: number, segW: number) => {
      const t = items[i]!;
      const colorTone = t.tone != null && COLOR_TONES.has(t.tone);
      let room = segW - 2 * (fill ? FILL_PAD_X : PAD_X);
      if (t.tone != null && !colorTone) room -= 6 + gap;
      if (t.icon != null) room -= 13 + gap;
      if (t.count != null) room -= widths[`c${i}`]! + 12 + gap;
      if (locked?.includes(i)) room -= 12 + gap;
      return room;
    };
    const measures = items.map((t, i) => ({
      full: widths[`f${i}`]!,
      words: wordsOf(t.label).map((_, k) => widths[`w${i}.${k}`]!),
    }));
    // the track's inner width: 1 border + 2 padding each side, segments edge to edge (on rows too)
    // at a large text size labels wrap onto rows at their size (owner 2026-11-11); only a label alone on
    // its row that is still too wide shrinks, to the floor
    const minScale = fitFloor(fill ? FILL_LABEL_SIZE : LABEL_SIZE, fontScale, fill);
    const space = Math.max(0, widths.sp2! - widths.sp0!);
    layout = segmentRows(measures, roomOf, trackW - 2 * 1 - 2 * 2, space, large ? 1 : minScale, 0, minScale);
  }
  const onRows = layout.rows.length > 1;
  shrunkRows.current = onRows && layout.scales.some((k) => k !== 1);
  const pending = measuring && !ready;
  const baseSize = fill ? FILL_LABEL_SIZE : LABEL_SIZE;
  // each segment's row, for its width on rows
  const rowOf: number[] = [];
  layout.rows.forEach((c, r) => {
    for (let k = 0; k < c; k += 1) rowOf.push(r);
  });
  const segments = items.map(({ count, tone: itemTone, icon }, i) => {
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
            hitSlop={!isSm && !onRows ? { top: 1, bottom: 1 } : undefined}
            style={({ pressed }) => [
              styles.tab,
              !isSm && !onRows && styles.tabRow,
              onRows && [styles.tabOnRows, { width: layout.widths[rowOf[i]!] }],
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
                isSm ? styles.pillSm : onRows ? styles.pillOnRows : styles.pillRow,
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
                  isSm ? styles.pillSm : onRows ? styles.pillOnRows : styles.pillRow,
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
                layout.scales[i] !== 1 && { fontSize: baseSize * layout.scales[i]! },
                { color: labelColor },
              ]}
            >
              {shown[i]}
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
  });
  return (
    <View
      style={[
        styles.track,
        isSm && styles.trackSm,
        // a field's edge, as the Input beside it (Increase Contrast: the strong one), red when invalid
        invalid ? styles.trackInvalid : highContrast ? styles.trackEdgeStrong : styles.trackEdge,
        onRows && styles.trackRows,
        isSm && large && styles.trackSmWrap,
        // always set (iOS Fabric kept a dropped `opacity: 0` on the track: the row stayed invisible)
        pending ? styles.pending : styles.shown,
      ]}
      accessibilityRole={choice ? 'radiogroup' : 'tablist'}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      ref={trackRef}
      onLayout={measuring ? (e) => setTrackW(e.nativeEvent.layout.width) : undefined}
    >
      {onRows
        ? layout.rows.map((c, r) => {
            const from = rowOf.indexOf(r);
            return (
              <View key={r} style={styles.row}>
                {segments.slice(from, from + c)}
              </View>
            );
          })
        : segments}
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
    paddingHorizontal: TRACK_PAD_X,
    // a control's corners, as the field beside it (owner 2026-11-11: one radius for every control)
    borderRadius: radii.sm,
    // a field's fill and edge (owner 2026-11-11: fields, selects and option switches look alike); the
    // edge's colour below (Increase Contrast, invalid)
    backgroundColor: colors.field,
    borderWidth: EDGE,
  },
  trackEdge: { borderColor: colors.borderControl },
  trackEdgeStrong: { borderColor: colors.borderControlStrong },
  trackInvalid: { borderColor: colors.zoneLow },
  // sm — design settings `.seg`: content-hugging track, padding 3, gap 2 (the field's fill and edge)
  trackSm: {
    alignSelf: 'flex-start',
    minHeight: 0,
    gap: 2,
    padding: TRACK_PAD_SM,
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
    borderRadius: PILL_RADIUS,
    backgroundColor: 'transparent',
  },
  // in the row: the track's height less its edge
  tabRow: { minHeight: 42 },
  // fill — web `.lk-seg--fill` at phone width: padding 8 / 4 inside the pill
  tabFill: {
    paddingHorizontal: FILL_PAD_X,
  },
  pill: { position: 'absolute', borderRadius: PILL_RADIUS, backgroundColor: 'transparent' },
  pillRow: { top: PILL_INSET_Y, bottom: PILL_INSET_Y, left: PILL_INSET_X, right: PILL_INSET_X },
  // on rows: 2 in all round (4 between pills and at the track's edge)
  pillOnRows: {
    top: PILL_INSET_ROWS,
    bottom: PILL_INSET_ROWS,
    left: PILL_INSET_ROWS,
    right: PILL_INSET_ROWS,
    borderRadius: PILL_RADIUS_ROWS,
  },
  pillSm: { top: 0, bottom: 0, left: 0, right: 0, borderRadius: PILL_RADIUS_SM },
  pillHairline: { borderWidth: 1, borderColor: 'transparent' },
  // on rows (owner 2026-11-11: labels that don't fit one row wrap into balanced rows of pills, centred,
  // never a column list as such) the track keeps the control's corners as on one row (radii.sm), its
  // pills the same less their inset; the parent's whole width (a parent that doesn't stretch would leave
  // it as wide as its labels)
  trackRows: {
    flexDirection: 'column',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    borderRadius: radii.sm,
    padding: TRACK_PAD_ROWS,
  },
  row: { flexDirection: 'row', justifyContent: 'center' },
  tabOnRows: { flex: 0, borderRadius: PILL_RADIUS_ROWS },
  // sm at a large text size: its pills wrap onto more rows (never a column list)
  trackSmWrap: { flexWrap: 'wrap', maxWidth: '100%' },
  // until the labels are measured the row is laid out but not shown (no visible jump to a stacked layout)
  pending: { opacity: 0 },
  shown: { opacity: 1 },
  // sm segments hug their label (design `.seg button`: padding 5px 11px)
  tabSm: {
    flex: 0,
    borderRadius: PILL_RADIUS_SM,
    paddingVertical: 5,
    paddingHorizontal: 11,
  },
  // appearance="tint" — design changelog `.svc-toggle`: the field's track; segments
  // carry a transparent hairline so the active border doesn't shift layout
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
    // a badge's corners, as Badge
    borderRadius: radii.sm,
  },
  countText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 13, // web is line-height 1; 13 keeps the 11 mono glyphs unclipped on device
    fontVariant: ['tabular-nums'],
  },
});
