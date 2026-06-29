import { Fragment } from 'react';
import { Text, type TextStyle, type TextProps, type StyleProp } from 'react-native';

export interface RichTextProps extends Omit<TextProps, 'children'> {
  /** The translated string. May contain `<b>…</b>` segments. */
  text: string;
  /** Style applied to the bolded segments — defaults to `{ fontWeight: '700' }`. */
  boldStyle?: StyleProp<TextStyle>;
}

const DEFAULT_BOLD: TextStyle = { fontWeight: '700' };

/**
 * RichText — renders a translation string with embedded `<b>…</b>` tags into a
 * nested Text composition, applying `boldStyle` to the bolded segments.
 *
 * Why: the shared `@lockin90/i18n` catalogs use `<b>…</b>` markers in some
 * strings so the web (next-intl `t.rich({ b: chunks => <b>{chunks}</b> })`)
 * can stylise inline parts. i18next on mobile renders the value verbatim —
 * tags and all — so without a parser the user sees literal `<b>...</b>` text.
 * This component is the mobile-side equivalent of `t.rich`. No other markup
 * is supported (deliberate — the catalog only uses `<b>`).
 */
export function RichText({ text, boldStyle, style, ...rest }: RichTextProps) {
  // Split on `<b>(content)</b>`. With the capture group, .split returns:
  //   [plain, bold, plain, bold, …]  — odd indices are bold segments.
  const parts = text.split(/<b>([^<]*)<\/b>/);
  return (
    <Text {...rest} style={style}>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i % 2 === 0 ? p : <Text style={[DEFAULT_BOLD, boldStyle]}>{p}</Text>}
        </Fragment>
      ))}
    </Text>
  );
}
