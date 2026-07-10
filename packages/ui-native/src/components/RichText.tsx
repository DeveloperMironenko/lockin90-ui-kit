import { Fragment } from 'react';
import { Text, type TextStyle, type TextProps, type StyleProp } from 'react-native';

export interface RichTextProps extends Omit<TextProps, 'children'> {
  /** The translated string. May contain `<b>…</b>` and `<a href="…">…</a>` segments. */
  text: string;
  /** Style applied to the bolded segments — defaults to `{ fontWeight: '700' }`. */
  boldStyle?: StyleProp<TextStyle>;
  /** Style applied to link segments — defaults to accent + underline. */
  linkStyle?: StyleProp<TextStyle>;
  /** Fired with the href when a link segment is pressed. Without it, links
   *  render styled but inert (the host decides in-app vs external routing). */
  onLinkPress?: (href: string) => void;
}

const DEFAULT_BOLD: TextStyle = { fontWeight: '700' };
const DEFAULT_LINK: TextStyle = { color: '#22D3EE', textDecorationLine: 'underline' };

type Segment = { kind: 'plain' | 'bold' | 'link'; text: string; href?: string };

/** Tokenize `<b>…</b>` and `<a href="…">…</a>` segments; everything else is plain. */
function parseSegments(text: string): Segment[] {
  const re = /<b>([^<]*)<\/b>|<a href="([^"]*)">([^<]*)<\/a>/g;
  const segs: Segment[] = [];
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) segs.push({ kind: 'plain', text: text.slice(last, m.index) });
    if (m[1] != null) segs.push({ kind: 'bold', text: m[1] });
    else segs.push({ kind: 'link', text: m[3] ?? '', href: m[2] ?? '' });
    last = m.index + m[0].length;
  }
  if (last < text.length) segs.push({ kind: 'plain', text: text.slice(last) });
  return segs;
}

/**
 * RichText — renders a translation/back-end string with embedded `<b>…</b>`
 * and `<a href="…">…</a>` tags into a nested Text composition: `boldStyle`
 * on bold segments, `linkStyle` + `onLinkPress(href)` on link segments.
 *
 * Why: the shared `@lockin90/i18n` catalogs use `<b>…</b>` markers so the web
 * (next-intl `t.rich`) can stylise inline parts, and back-end-authored copy
 * (e.g. notification bodies) may carry links that deep-link in-app or open
 * externally — the HOST decides via `onLinkPress`. i18next on mobile renders
 * values verbatim, so this component is the mobile-side equivalent of
 * `t.rich` + anchor handling. No other markup is supported (deliberate).
 */
export function RichText({ text, boldStyle, linkStyle, onLinkPress, style, ...rest }: RichTextProps) {
  const segs = parseSegments(text);
  return (
    <Text {...rest} style={style}>
      {segs.map((s, i) => (
        <Fragment key={i}>
          {s.kind === 'plain' ? (
            s.text
          ) : s.kind === 'bold' ? (
            <Text style={[DEFAULT_BOLD, boldStyle]}>{s.text}</Text>
          ) : (
            <Text
              style={[DEFAULT_LINK, linkStyle]}
              accessibilityRole="link"
              onPress={onLinkPress && s.href ? () => onLinkPress(s.href as string) : undefined}
            >
              {s.text}
            </Text>
          )}
        </Fragment>
      ))}
    </Text>
  );
}
