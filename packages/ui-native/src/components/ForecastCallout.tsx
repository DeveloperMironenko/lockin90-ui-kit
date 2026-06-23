import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Chip, type ChipTone } from './Chip';
import { Icon, type IconName } from './Icon';

export type ForecastCalloutTone = 'accent' | 'positive' | 'negative' | 'warn';

export interface ForecastCalloutProps extends Omit<ViewProps, 'children'> {
  /** small leading label chip, e.g. 'Forecast' / '31-day' */
  chip?: string;
  /** the forecast prose (projected peak / dip); emphasized spans allowed */
  children: ReactNode;
  /** tone — colors the leading chip + left accent bar (default 'accent') */
  tone?: ForecastCalloutTone;
  /** optional leading glyph */
  icon?: IconName;
}

const TONE: Record<ForecastCalloutTone, { c: string; bg: string; border: string }> = {
  accent: { c: colors.accent, bg: 'rgba(124,92,255,0.08)', border: 'rgba(124,92,255,0.3)' },
  positive: { c: colors.mint, bg: 'rgba(52,245,197,0.08)', border: 'rgba(52,245,197,0.3)' },
  negative: { c: colors.zoneLow, bg: 'rgba(255,77,109,0.08)', border: 'rgba(255,77,109,0.3)' },
  warn: { c: colors.zoneMid, bg: 'rgba(255,176,32,0.08)', border: 'rgba(255,176,32,0.3)' },
};

/** Map the callout tone to the matching Chip tone. */
const CHIP_TONE: Record<ForecastCalloutTone, ChipTone> = {
  accent: 'accent',
  positive: 'high',
  negative: 'low',
  warn: 'mid',
};

/**
 * Forecast callout — a tinted glass panel with a left accent bar in the tone
 * color, a tone-colored leading Chip (+ optional icon), then the projected
 * peak/dip prose. Mirrors the design `.callout` vocab. Compose Chip + Icon.
 */
export function ForecastCallout({
  chip,
  children,
  tone = 'accent',
  icon,
  style,
  ...rest
}: ForecastCalloutProps) {
  const t = TONE[tone];
  return (
    <View
      style={[styles.fc, { backgroundColor: t.bg, borderColor: t.border }, style]}
      {...rest}
    >
      <View style={[styles.bar, { backgroundColor: t.c }]} pointerEvents="none" />
      {(chip || icon) && (
        <View style={styles.top}>
          {icon && <Icon name={icon} size={16} color={t.c} />}
          {chip && <Chip tone={CHIP_TONE[tone]} dot label={chip} />}
        </View>
      )}
      {typeof children === 'string' ? (
        <Text style={styles.text}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fc: {
    position: 'relative',
    paddingTop: 12,
    paddingRight: 13,
    paddingBottom: 12,
    paddingLeft: 16,
    borderRadius: radii.sm,
    borderWidth: 1,
    overflow: 'hidden',
    gap: 7,
  },
  bar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 3,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  text: {
    fontFamily: fonts.ui,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textDim,
  },
});
