import { Children, isValidElement, type ReactNode } from 'react';
import { Text, type TextProps } from 'react-native';
import { useReportMinWidth, useWordFit } from '../internal/wordFit';

export interface FitTextProps extends TextProps {
  /** The text to measure when the children are rich (an i18n `Trans`, whose parts inherit the scaled
   *  size): the translation as it is, its tagged parts (`<b>…</b>`, `<email>…</email>`) measured at bold.
   *  Strings and numbers among the children, nested ones too, are measured without it. */
  measureText?: string;
  /** Called with the narrowest width (pt) in which every word fits whole at the smallest size it may
   *  shrink to (for a layout that chooses its columns by it, as MetricTile's `onMinWidth`). */
  onMinWidth?: (width: number) => void;
}

/** The string a text's children say: strings and numbers, and those inside nested elements (a styled
 *  `Text`, a link, AlertStrong), tagged `<n>…</n>` so they are measured at bold (`taggedWords`); a
 *  component that makes its own text (an i18n `Trans`) needs `measureText`. */
export function textOf(children: ReactNode, nested = false): string {
  let s = '';
  Children.forEach(children, (c) => {
    if (typeof c === 'string' || typeof c === 'number') s += String(c);
    else if (isValidElement<{ children?: ReactNode; style?: unknown }>(c)) {
      // a bare `Text` wrapping a sentence (an Alert's body) is no styled part: its own parts are
      if (c.type === Text && c.props.style == null) s += textOf(c.props.children, nested);
      else {
        const inner = textOf(c.props.children, true);
        s += nested ? inner : `<n>${inner}</n>`;
      }
    }
  });
  return s;
}

/**
 * A `Text` whose words never break in the middle (CONVENTIONS "Accessibility"): lines still wrap
 * between words, and when its widest word is wider than the width it is laid out in (a long word at a
 * large text size), the whole text shrinks until that word fits — never below the default text size or
 * 11pt (`fitFloor`); a word wider than that is the layout's to fix (a column fewer, the text above its
 * icon), and breaks only as the last resort. Measured by a hidden measurer (one line per word in the
 * text's own font), never by turning text scaling off. Text that fits is drawn exactly as a `Text`. In a
 * row, give it a box that can shrink (`flexShrink: 1, minWidth: 0`): a text that can't shrink is as wide
 * as its content, and that is no room to fit to.
 */
export function FitText({ style, children, measureText, onLayout, onMinWidth, ...rest }: FitTextProps) {
  const { scaled, textRef, onRoom, measurer, minWidth } = useWordFit(measureText ?? textOf(children), style);
  useReportMinWidth(minWidth, onMinWidth);
  return (
    <>
      <Text
        ref={textRef}
        style={scaled ? [style, scaled] : style}
        onLayout={(e) => {
          onRoom(e.nativeEvent.layout.width);
          onLayout?.(e);
        }}
        {...rest}
      >
        {children}
      </Text>
      {measurer}
    </>
  );
}
