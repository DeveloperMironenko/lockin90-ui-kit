import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { StyleSheet, Text, View, useWindowDimensions, type StyleProp, type TextStyle } from 'react-native';

/* No word ever breaks (CONVENTIONS "Accessibility"), measured rather than guessed: a hidden measurer lays
   each word out on one unconstrained line in the text's own font, and a word wider than its room makes the
   text shrink until it fits, never below the default text size or 11pt (`fitFloor`). SegmentedTabs, Select
   and FitText (and through it MetricTile, ListRow, Alert, FormField and Eyebrow) all use these pieces. */

/** Room kept beside a measured width, so rounding never pushes the last letter onto a new line. */
export const SLACK = 1;

/** The smallest size meaningful text is drawn at (CONVENTIONS "No meaningful text under 11px"). */
export const MIN_TEXT = 11;

/**
 * How far a text `fontSize` big may shrink so a word stays whole, at the OS text size `fontScale`: never
 * below the default text size (only the OS's enlargement is taken back: `1 / fontScale`; at the default size
 * or a smaller one nothing shrinks) and never drawn under 11pt. `belowDefault` (SegmentedTabs `fill`
 * choice rows only, owner 2026-11-11): at the default text size (or a smaller one) the text may shrink
 * below its design size, down to 11pt drawn; at a larger one the rule above stands. 1 when it can't shrink
 * at all; rounded up to 2 decimals, as the scales are.
 */
export function fitFloor(fontSize: number, fontScale: number, belowDefault = false): number {
  const fs = fontScale > 0 ? fontScale : 1;
  const minText = MIN_TEXT / ((fontSize > 0 ? fontSize : 14) * fs);
  const floor = belowDefault && fs <= 1 ? minText : Math.max(1 / Math.max(1, fs), minText);
  return Math.min(1, Math.ceil(floor * 100 - 1e-9) / 100);
}

/** Spaces a line breaks at (and drops). */
const SPACE = /[ \t\n\r\u2009\u200a]/;
/** A zero-width space: a break inside a word (`breakableAddress` puts them in an address). */
const ZWSP = '\u200b';
/** A no-break space, a narrow one, a word joiner: never a break on either side. */
const GLUE = /[\u00a0\u202f\u2060\ufeff]/;
/** Characters a line may break between without a space: CJK (Han, kana, Hangul and full-width forms). */
const CJK = /[⺀-鿿가-힯豈-﫿＀-￯]/;
/** CJK punctuation a line never starts with (、。」…) or ends with (「（…): it stays with its neighbour. */
const NO_START = /[、。〉》」』】〕〗〙・ー！），．：；？…]/;
const NO_END = /[〈《「『【〔〖〘（]/;
const DIGIT = /[0-9]/;
/** An email address or a web address: it also breaks after "@" and ".". */
const ADDRESS = /[^@]@[^@]|^[a-z][\w+.-]*:\/\/|^www\./i;

/** Whether a line may break between `a` and `b` (no space between them; `before` is the character before
 *  `a`), as iOS and Android break: after a hyphen or an en dash unless a digit follows ("GMT-3" stays
 *  whole), after a slash unless it sits between digits ("Europe/" "Kyiv", "12/31" whole), around an em
 *  dash and a CJK character, and in an address after "@" and ".". */
function breaksBetween(before: string | undefined, a: string, b: string, address: boolean): boolean {
  if (GLUE.test(a) || GLUE.test(b) || NO_START.test(b) || NO_END.test(a)) return false;
  if (CJK.test(a) || CJK.test(b)) return true;
  if (a === '—' || b === '—') return true;
  if (/[-‐–]/.test(a)) return !DIGIT.test(b);
  if (a === '/') return !(before != null && DIGIT.test(before) && DIGIT.test(b));
  return address && (a === '@' || a === '.');
}

/** Whether a text has a CJK character (Han, kana, Hangul, full-width forms). */
export function hasCJK(text: string): boolean {
  return CJK.test(text);
}

/** A text whose CJK characters never break apart: a word joiner between each two of them (a SegmentedTabs
 *  label is one word in every script, owner 2026-11-11: "アスリー / ト" never). */
export function glueCJK(text: string): string {
  const chars = Array.from(text);
  let out = '';
  chars.forEach((ch, i) => {
    const prev = chars[i - 1];
    if (prev != null && !SPACE.test(prev) && !SPACE.test(ch) && (CJK.test(prev) || CJK.test(ch))) out += '\u2060';
    out += ch;
  });
  return out;
}

/** A piece a line can't split; `address` when it is part of an email or web address. */
export interface Piece {
  word: string;
  bold: boolean;
  address?: true;
}

/** A text cut into the pieces a line can't split; `bold[i]` says whether code point `i` is in a styled
 *  part, and a piece with any styled letter is bold. */
function pieces(text: string, bold: readonly boolean[] | null): Piece[] {
  const chars = Array.from(text);
  // a space is a break unless a word joiner (or a no-break space) sits right beside it
  const breakSpace = (k: number) => SPACE.test(chars[k]!) && !GLUE.test(chars[k - 1] ?? '') && !GLUE.test(chars[k + 1] ?? '');
  const out: Piece[] = [];
  let i = 0;
  while (i < chars.length) {
    if (breakSpace(i)) {
      i += 1;
      continue;
    }
    let j = i;
    while (j < chars.length && !breakSpace(j)) j += 1;
    const address = ADDRESS.test(chars.slice(i, j).filter((c) => c !== ZWSP).join(''));
    let word = '';
    let styled = false;
    const flush = () => {
      if (word) out.push(address ? { word, bold: styled, address: true } : { word, bold: styled });
      word = '';
      styled = false;
    };
    for (let k = i; k < j; k += 1) {
      const ch = chars[k]!;
      if (ch === ZWSP) {
        flush();
        continue;
      }
      if (word && !SPACE.test(ch) && !SPACE.test(chars[k - 1]!) && breaksBetween(chars[k - 2], chars[k - 1]!, ch, address)) flush();
      word += ch;
      if (bold?.[k]) styled = true;
    }
    flush();
    i = j;
  }
  return out;
}

/**
 * The pieces a line can't split: the text cut at spaces (a no-break space or a word joiner keeps its
 * words together), after a hyphen, a dash or a slash, around every CJK character, and in an email or web
 * address after "@" and "." (`breaksBetween`).
 */
export function breakableWords(text: string): string[] {
  return pieces(text, null).map((p) => p.word);
}

/** A tag of a styled part: `<tag>`, `</tag>` (an i18n `Trans` component's tags, or a nested element),
 *  or a self-closing `<br/>`. */
const TAG = /<(\/?)(\w+)\s*(\/?)>/g;

/**
 * The words of a text whose styled parts are tagged (`Sent to <email>a@b.c</email>.`), each with whether
 * it is in a styled part (and whether it is part of an address). The tags are taken out first, so a piece
 * that runs across one with no space ("Re-authentication" and the "," after it) is one piece; a piece with
 * a styled letter is measured at bold, the widest weight it may have (AlertStrong is 600, an email 600):
 * it is never wider than measured.
 */
export function taggedWords(text: string): Piece[] {
  let plain = '';
  const bold: boolean[] = [];
  let depth = 0;
  let at = 0;
  const add = (s: string, styled: boolean) => {
    plain += s;
    for (let n = Array.from(s).length; n > 0; n -= 1) bold.push(styled);
  };
  for (const m of text.matchAll(TAG)) {
    add(text.slice(at, m.index), depth > 0);
    if (m[3]) add(' ', false);
    else depth = m[1] ? Math.max(0, depth - 1) : depth + 1;
    at = m.index! + m[0].length;
  }
  add(text.slice(at), depth > 0);
  return pieces(plain, bold);
}

/** An email or web address that breaks where it reads well (a zero-width space after each "@", "." and
 *  "/" inside it): iOS and Android otherwise never break an address, and one wider than its line breaks
 *  at any letter. Put it where the address is shown and measured (a `Trans` value). */
export function breakableAddress(address: string): string {
  return address.replace(/([@./])(?=\S)/g, '$1​');
}

/** The scale (2 decimals, at least `min`, at most 1) at which a word `widest` wide fits `room`; 1 when it
 *  fits. */
export function wordFitScale(widest: number, room: number, min: number): number {
  const r = room - SLACK;
  if (!(widest > 0) || !(room > 0) || widest <= r) return 1;
  return Math.min(1, Math.max(min, Math.floor((100 * r) / widest) / 100));
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

type Measured = { key: string; w: Record<string, number>; room: number; box: number };

/**
 * A text's word fit (`text` may tag its styled parts, see `taggedWords`): the scale at which its widest
 * word fits the width the text is laid out in, at least `fitFloor` (never below the default text size or
 * 11pt; past that the word breaks, the last resort). The words are measured at the text's unscaled style.
 * The room is the text's own width read while it is drawn at full size, so the scale never feeds back into
 * what it is computed from. Shrunk, the room is still followed: a text narrower than its shrunk widest word
 * has been squeezed (that width is the new room), and the box the text sits in (a 0-tall probe spanning
 * it) growing means the room may have grown: the text is drawn at full size again and re-read. A new text
 * or text size measures the words afresh. Layout events alone are not enough on iOS Fabric (a tree mounted
 * hidden gets none), so the text, the box and the probes are also measured from their refs in a layout
 * effect. `minWidth` is the narrowest room in which every word fits at the floor (for a layout that
 * chooses its columns by it). `belowDefault`: at the default text size the text may shrink below its size,
 * to 11pt (`fitFloor`'s; a word value in a fixed grid, MetricTile `textValue`).
 */
export function useWordFit(text: string, style: StyleProp<TextStyle>, belowDefault = false) {
  const { fontScale } = useWindowDimensions();
  const flat = (StyleSheet.flatten(style) ?? {}) as TextStyle;
  // each distinct word once, a styled one measured at bold; an address is left out (it breaks after its
  // "@" and "." where `breakableAddress` lets it, else anywhere: it never shrinks the text around it)
  const seen = new Set<string>();
  const words = taggedWords(text).filter(({ word, bold, address }) => {
    if (address) return false;
    const id = `${bold ? 'b' : 'r'}${word}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  const key = [
    text,
    fontScale,
    flat.fontFamily,
    flat.fontSize,
    flat.fontWeight,
    flat.letterSpacing,
    flat.textTransform,
  ].join('|');
  const [m, setM] = useState<Measured>({ key, w: {}, room: 0, box: 0 });
  const cur: Measured = m.key === key ? m : { key, w: {}, room: 0, box: m.box };
  // what is drawn: the scale and the widest word at it (read by `record` from the last render)
  const drawn = useRef({ scale: 1, widest: 0 });
  const record = (id: string, width: number) =>
    setM((prev) => {
      const base: Measured = prev.key === key ? prev : { key, w: {}, room: 0, box: prev.box };
      const same = (next: Measured) => (next === base && base === prev ? prev : next);
      const shrunk = drawn.current.scale !== 1;
      if (id === '@box') {
        if (Math.abs(base.box - width) <= SLACK) return same(base);
        // shrunk, a wider box may give the text more room: draw it at full size and read it again
        return same({ ...base, box: width, room: shrunk && base.box > 0 && width > base.box ? 0 : base.room });
      }
      if (id === '@room') {
        // shrunk, a text as wide as its content is narrower than its room: only a squeeze (narrower than
        // the widest word it draws) is a new room
        if (shrunk && !(width < drawn.current.widest - SLACK)) return same(base);
        return base.room === width ? same(base) : same({ ...base, room: width });
      }
      return base.w[id] === width ? same(base) : same({ ...base, w: { ...base.w, [id]: width } });
    });
  const probes: Probe[] = words.map(({ word, bold }, k) => ({
    id: `w${k}`,
    text: word,
    style: [style, styles.probeReset, bold && styles.probeBold],
  }));
  const textRef = useRef<Text>(null);
  const boxRef = useRef<View>(null);
  const probeRefs = useRef<Record<string, Text | null>>({});
  const needsRoom = cur.room === 0;
  useLayoutEffect(() => {
    if (!words.length) return;
    boxRef.current?.measure?.((_x, _y, w) => {
      if (w > 0) record('@box', w);
    });
    (textRef.current as unknown as View | null)?.measure?.((_x, _y, w) => {
      if (!(w > 0)) return; // hidden: nothing to measure yet
      record('@room', w);
      for (const p of probes) (probeRefs.current[p.id] as unknown as View | null)?.measure?.((_a, _b, pw) => record(p.id, pw));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- probes follow key
  }, [key, needsRoom]);
  const measured = probes.every((p) => cur.w[p.id] != null);
  const ready = words.length > 0 && cur.room > 0 && measured;
  const widest = measured && probes.length ? Math.max(...probes.map((p) => cur.w[p.id]!)) : 0;
  const floor = fitFloor(flat.fontSize ?? 14, fontScale, belowDefault);
  // a word as wide as the text (within a point of rounding) fits: only a word wider than its line shrinks
  const scale = ready && widest > cur.room + SLACK ? wordFitScale(widest, cur.room, floor) : 1;
  drawn.current = { scale, widest: widest * scale };
  /** The style with the scale applied (size, line height and letter spacing together). */
  const scaled: TextStyle | null =
    scale === 1
      ? null
      : {
          fontSize: round2((flat.fontSize ?? 14) * scale),
          ...(typeof flat.lineHeight === 'number' ? { lineHeight: round2(flat.lineHeight * scale) } : {}),
          ...(typeof flat.letterSpacing === 'number' ? { letterSpacing: round2(flat.letterSpacing * scale) } : {}),
        };
  const minWidth = !words.length ? 0 : measured ? Math.ceil(widest * floor + SLACK) : undefined;
  // once measured the probes go (nothing extra stays in the tree a screen reader walks); a new text, text
  // size or room brings them back. The box probe stays: it is what says the room may have grown.
  const measurer = words.length ? (
    <>
      <View
        ref={boxRef}
        testID="lk-fit-box"
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.box}
        onLayout={(e) => record('@box', e.nativeEvent.layout.width)}
      />
      {!ready && <WordMeasurer probes={probes} record={record} refs={probeRefs} keyPrefix={key} testID="lk-fit-measure" />}
    </>
  ) : null;
  return { scale, scaled, textRef, onRoom: (w: number) => record('@room', w), measurer, minWidth };
}

/** Calls `onMinWidth` with a `minWidth` whenever it is known and changes. */
export function useReportMinWidth(minWidth: number | undefined, onMinWidth: ((w: number) => void) | undefined) {
  const report = useRef(onMinWidth);
  report.current = onMinWidth;
  useEffect(() => {
    if (minWidth != null) report.current?.(minWidth);
  }, [minWidth]);
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
  // spans the box the text sits in, 0 tall: its width growing says the room may have grown
  box: { position: 'absolute', left: 0, right: 0, top: 0, height: 0, opacity: 0 },
  probe: { flex: 0, flexShrink: 0, alignSelf: 'flex-start' },
  // a probe is the bare word on one line: no margins, padding or width of the measured text
  probeReset: { margin: 0, marginTop: 0, padding: 0, width: undefined, maxWidth: undefined, minWidth: undefined },
  probeBold: { fontWeight: '700' },
});
