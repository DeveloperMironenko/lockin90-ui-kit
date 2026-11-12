/* SegmentedTabs `fill`: how the segments fit their track (owner 2026-11-11), from widths measured on one
   line — the same rules as native `segmentRows` (ui-native SegmentedTabs). */

/** Room kept beside a measured width, so rounding never pushes the last letter onto a new line. */
const SLACK = 1;
/** Characters a browser breaks between without a space: CJK (Han, kana, Hangul and full-width forms). */
const CJK = /[⺀-鿿가-힯豈-﫿＀-￯]/;

/** A label's words: split at spaces and after a hyphen or a slash (as the browser breaks), a CJK run whole
 *  (a zh / ja option is one word: never "アスリー / ト"; the stylesheet's `word-break: keep-all` keeps it so). */
export function wordsOf(label: string): string[] {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((chunk) => (CJK.test(chunk) ? [chunk] : chunk.split(/(?<=[-‐–/])(?=.)/)));
}

/** The scale (2 decimals, at least `min`, at most 1) at which a word `widest` wide fits `room`. */
function wordFitScale(widest: number, room: number, min: number): number {
  const r = room - SLACK;
  if (!(widest > 0) || !(room > 0) || widest <= r) return 1;
  return Math.min(1, Math.max(min, Math.floor((100 * r) / widest) / 100));
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
 * (the track's column gap). `aloneScale` is the floor of a label alone on its row (at a large text size
 * labels wrap rather than shrink: `minScale` 1 there, and only a label too wide for the full width shrinks,
 * down to `aloneScale`). A word wider than the full width even at `aloneScale` is the last resort:
 * each label a row, shrunk to the floor, the word breaking. Native `segmentRows` is the same.
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
