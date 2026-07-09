import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';
import { Eyebrow } from './Eyebrow';
import { GradientText } from './GradientText';

export interface SectionHeaderProps extends ViewProps {
  /** mono uppercase overline (e.g. "Today · Thu Jun 11"). Omit for a bare title. */
  eyebrow?: string;
  /** the display title (e.g. "Energy"). */
  title: string;
  /** gradient-fill the title ('flux' | 'cta' | 'violet'), or `false` for a plain
   *  (white) title. Default 'flux' — the mockups' KIT MAP maps section titles to
   *  GradientText; pass `false` for screens whose title reads as solid `.disp`. */
  gradient?: 'flux' | 'cta' | 'violet' | false;
  /** title font size (default 26 — the mockup `.section-head .disp`). */
  titleSize?: number;
}

/** SectionHeader — the mockups' `.section-head`: an Eyebrow overline above a
 *  display title, optionally gradient-filled. Composes the kit `Eyebrow` +
 *  `GradientText` so every screen's header is one primitive, tokens-driven. */
export function SectionHeader({ eyebrow, title, gradient = 'flux', titleSize = 26, style, ...rest }: SectionHeaderProps) {
  const titleStyle = { ...styles.title, fontSize: titleSize };
  return (
    <View style={[styles.wrap, style]} {...rest}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {gradient ? (
        <GradientText gradient={gradient} style={titleStyle}>
          {title}
        </GradientText>
      ) : (
        <Text style={titleStyle}>{title}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 3 },
  title: { fontFamily: fonts.display, fontWeight: '700', letterSpacing: -0.5, color: colors.text },
});
