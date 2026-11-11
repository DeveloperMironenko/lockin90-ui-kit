import { Children, isValidElement, type ReactNode } from 'react';
import { Text, type TextProps } from 'react-native';
import { useWordFit } from '../internal/wordFit';

export interface FitTextProps extends TextProps {
  /** The smallest scale a word may shrink to so it stays whole; at a large text size it may also go down
   *  to the default text size (`1 / fontScale`) when that is smaller. @default 0.5 */
  minScale?: number;
  /** The text to measure when the children are rich (an i18n `Trans`, whose parts inherit the scaled
   *  size): the translation as it is, its tagged parts (`<b>…</b>`, `<email>…</email>`) measured at bold.
   *  Strings and numbers among the children, nested ones too, are measured without it. */
  measureText?: string;
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
 * large text size, a third of a phone's width), the whole text shrinks until that word fits, down to
 * `minScale`. Measured by a hidden measurer (one line per word in the text's own font), never by
 * turning text scaling off. Text that fits is drawn exactly as a `Text`.
 */
export function FitText({ style, children, minScale = 0.5, measureText, onLayout, ...rest }: FitTextProps) {
  const { scaled, textRef, onRoom, measurer } = useWordFit(measureText ?? textOf(children), style, minScale);
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
