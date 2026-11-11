import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { StyleSheet, Text, View, useWindowDimensions, type StyleProp, type TextStyle } from 'react-native';

/* No word ever breaks (CONVENTIONS "Accessibility"), measured rather than guessed: a hidden measurer lays
   each word out on one unconstrained line in the text's own font, and a word wider than its room makes the
   text shrink until it fits. SegmentedTabs, Select and FitText (and through it MetricTile, ListRow, Alert,
   FormField and Eyebrow) all use these pieces. */

/** Room kept beside a measured width, so rounding never pushes the last letter onto a new line. */
export const SLACK = 1;

/** Characters a line may break after or between without a space: CJK (Han, kana, Hangul and full-width
 *  forms wrap anywhere). */
const CJK = /[\u2e80-\u9fff\uac00-\ud7af\uf900-\ufaff\uff00-\uffef]/;
/** A line may also break after a hyphen or a dash (iOS and Android both do; not after a slash, which
 *  stays inside a word such as "Europe/Kyiv"). */
const BREAK_AFTER = /[-\u2010\u2013\u2014]/;

/**
 * The pieces a line can't split: the text cut at spaces (a no-break space or a word joiner keeps its
 * words together), after a hyphen or a dash, and around every CJK character.
 */
export function breakableWords(text: string): string[] {
  const out: string[] = [];
  for (const chunk of text.split(/[ \t\n\r\u2009\u200a\u200b]+/)) {
    let cur = '';
    for (const ch of chunk) {
      if (CJK.test(ch)) {
        if (cur) out.push(cur);
        out.push(ch);
        cur = '';
      } else {
        cur += ch;
        if (BREAK_AFTER.test(ch)) {
          out.push(cur);
          cur = '';
        }
      }
    }
    if (cur) out.push(cur);
  }
  return out;
}

/** A styled part of a text: `<tag>…</tag>` (an i18n `Trans` component's tags, or a nested element). */
const STYLED = /<(\w+)>([\s\S]*?)<\/\1>/g;

/**
 * The words of a text whose styled parts are tagged (`Sent to <email>a@b.c</email>`), each with whether
 * it is in a styled part. A styled part is measured at bold, the widest weight it may have (AlertStrong is
 * 600, an email 600): its words are never wider than measured.
 */
export function taggedWords(text: string): { word: string; bold: boolean }[] {
  const out: { word: string; bold: boolean }[] = [];
  let at = 0;
  for (const m of text.matchAll(STYLED)) {
    for (const word of breakableWords(text.slice(at, m.index))) out.push({ word, bold: false });
    for (const word of breakableWords(m[2]!)) out.push({ word, bold: true });
    at = m.index! + m[0].length;
  }
  for (const word of breakableWords(text.slice(at))) out.push({ word, bold: false });
  return out;
}

/** The scale (2 decimals, at least `min`) at which a word `widest` wide fits `room`; 1 when it fits. */
export function wordFitScale(widest: number, room: number, min: number): number {
  const r = room - SLACK;
  if (!(widest > 0) || !(room > 0) || widest <= r) return 1;
  return Math.max(min, Math.floor((100 * r) / widest) / 100);
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** One probe: a text the measurer lays out on one line, in a style. */
export interface Probe {
  id: string;
  text: string;
  style: StyleProp<TextStyle>;
}

/** The measurer: one unconstrained line per probe, laid out but never seen or read. `keyPrefix` changes
 *  remount the probes (a new text or text size measures afresh). */
export function WordMeasurer({
  probes,
  record,
  refs,
  keyPrefix,
  testID,
}: {
  probes: readonly Probe[];
  record: (id: string, width: number) => void;
  refs: RefObject<Record<string, Text | null>>;
  keyPrefix: string;
  testID?: string;
}) {
  return (
    <View
      testID={testID}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.measure}
    >
      {probes.map((p) => (
        <Text
          key={`${keyPrefix}:${p.id}`}
          ref={(el) => {
            refs.current[p.id] = el;
          }}
          numberOfLines={1}
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no"
          onLayout={(e) => record(p.id, e.nativeEvent.layout.width)}
          style={[p.style, styles.probe]}
        >
          {p.text}
        </Text>
      ))}
    </View>
  );
}

/**
 * A text's word fit (`text` may tag its styled parts, see `taggedWords`): the scale at which its widest word fits the width the text is laid out in (its own
 * `onLayout` width), at least `minScale` (or, at a large text size, the default text size: `1 / fontScale`,
 * when that is smaller). The words are measured at the text's unscaled style and the
 * room at full size, so the scale never feeds back into what it is computed from; it is decided again
 * for a new text, text size or window width. Layout events alone are not enough on iOS Fabric (a tree mounted hidden gets none), so the
 * text and the probes are also measured from their refs in a layout effect.
 */
export function useWordFit(text: string, style: StyleProp<TextStyle>, minScale: number) {
  const { fontScale, width: windowW } = useWindowDimensions();
  const flat = (StyleSheet.flatten(style) ?? {}) as TextStyle;
  // each distinct word once, a styled one measured at bold
  const seen = new Set<string>();
  const words = taggedWords(text).filter(({ word, bold }) => {
    const id = `${bold ? 'b' : 'r'}${word}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  const key = [
    text,
    fontScale,
    windowW,
    flat.fontFamily,
    flat.fontSize,
    flat.fontWeight,
    flat.letterSpacing,
    flat.textTransform,
  ].join('|');
  const [m, setM] = useState<{ key: string; w: Record<string, number>; room: number }>({ key, w: {}, room: 0 });
  const cur = m.key === key ? m : { key, w: {} as Record<string, number>, room: 0 };
  // the room is read while the text is drawn at full size: a text as wide as its content (a label in a
  // row) reports its own width, so a narrower room read while shrunk would shrink it again and again;
  // shrunk, only a wider room (its parent grew) is taken
  const drawn = useRef(1);
  const record = (id: string, width: number) =>
    setM((prev) => {
      if (id === '@room' && drawn.current !== 1 && prev.key === key && !(width > prev.room + SLACK)) return prev;
      const base = prev.key === key ? prev : { key, w: {}, room: 0 };
      if (id === '@room') return base.room === width && base === prev ? prev : { ...base, room: width };
      return base.w[id] === width && base === prev ? prev : { ...base, w: { ...base.w, [id]: width } };
    });
  const probes: Probe[] = words.map(({ word, bold }, k) => ({
    id: `w${k}`,
    text: word,
    style: [style, styles.probeReset, bold && styles.probeBold],
  }));
  const textRef = useRef<Text>(null);
  const probeRefs = useRef<Record<string, Text | null>>({});
  useLayoutEffect(() => {
    if (!words.length) return;
    (textRef.current as unknown as View | null)?.measure?.((_x, _y, w) => {
      if (!(w > 0)) return; // hidden: nothing to measure yet
      record('@room', w);
      for (const p of probes) (probeRefs.current[p.id] as unknown as View | null)?.measure?.((_a, _b, pw) => record(p.id, pw));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- probes follow key
  }, [key]);
  const ready = words.length > 0 && cur.room > 0 && probes.every((p) => cur.w[p.id] != null);
  const widest = ready ? Math.max(...probes.map((p) => cur.w[p.id]!)) : 0;
  // a word as wide as the text (within a point of rounding) fits: only a word wider than its line splits
  // at an accessibility text size half the size can still be too big (AX3 is 3.57×): a word may then
  // shrink to the default text size's, never below it
  const floor = Math.min(minScale, fontScale > 1 ? 1 / fontScale : minScale);
  const scale = ready && widest > cur.room + SLACK ? wordFitScale(widest, cur.room, floor) : 1;
  drawn.current = scale;
  /** The style with the scale applied (size, line height and letter spacing together). */
  const scaled: TextStyle | null =
    scale === 1
      ? null
      : {
          fontSize: round2((flat.fontSize ?? 14) * scale),
          ...(typeof flat.lineHeight === 'number' ? { lineHeight: round2(flat.lineHeight * scale) } : {}),
          ...(typeof flat.letterSpacing === 'number' ? { letterSpacing: round2(flat.letterSpacing * scale) } : {}),
        };
  // once measured the probes go (nothing extra stays in the tree a screen reader walks); a new text,
  // text size or window width brings them back
  const measurer = words.length && !ready ? (
    <WordMeasurer probes={probes} record={record} refs={probeRefs} keyPrefix={key} testID="lk-fit-measure" />
  ) : null;
  return { scale, scaled, textRef, onRoom: (w: number) => record('@room', w), measurer };
}

const styles = StyleSheet.create({
  measure: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 10000,
    height: 0,
    overflow: 'hidden',
    opacity: 0,
    alignItems: 'flex-start',
  },
  probe: { flex: 0, flexShrink: 0, alignSelf: 'flex-start' },
  // a probe is the bare word on one line: no margins, padding or width of the measured text
  probeReset: { margin: 0, marginTop: 0, padding: 0, width: undefined, maxWidth: undefined, minWidth: undefined },
  probeBold: { fontWeight: '700' },
});
