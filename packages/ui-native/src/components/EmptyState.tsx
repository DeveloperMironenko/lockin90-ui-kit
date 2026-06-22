import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

export interface EmptyStateProps extends Omit<ViewProps, 'children'> {
  /** Illustration shown in the glass tile. Defaults to a faint star. */
  icon?: ReactNode;
  /** Headline. */
  title?: string;
  /** Supporting sentence. */
  description?: ReactNode;
  /** Call-to-action, typically a <Button>. */
  action?: ReactNode;
  /** Smaller, tighter variant for in-card placeholders. */
  compact?: boolean;
}

/** Default star glyph — faint accent outline. */
function StarIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 2.5 14.9 9l7 .5-5.4 4.6 1.7 6.9L12 17.6 5.8 21l1.7-6.9L2.1 9.5l7-.5z" />
    </Svg>
  );
}

/** Centered zero-state: glass icon tile + headline + body + action. */
export function EmptyState({
  icon,
  title = 'Nothing here yet',
  description = 'Once you start logging, this is where it shows up.',
  action,
  compact,
  style,
  ...rest
}: EmptyStateProps) {
  const glyph = icon ?? <StarIcon size={compact ? 24 : 30} />;
  return (
    <View style={[styles.empty, compact && styles.emptyCompact, style]} {...rest}>
      <View style={[styles.tile, compact && styles.tileCompact]}>{glyph}</View>
      {title != null && <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>}
      {description != null && (typeof description === 'string'
        ? <Text style={[styles.desc, compact && styles.descCompact]}>{description}</Text>
        : description)}
      {action != null && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyCompact: {
    gap: 9,
    paddingVertical: 24,
    paddingHorizontal: 18,
  },
  tile: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass2,
    borderWidth: 1,
    borderColor: colors.border2,
  },
  tileCompact: {
    width: 48,
    height: 48,
    borderRadius: 15,
  },
  title: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: -0.17,
    color: colors.text,
    textAlign: 'center',
  },
  titleCompact: {
    fontSize: 15,
  },
  desc: {
    maxWidth: 340,
    fontFamily: fonts.ui,
    fontSize: 13.5,
    lineHeight: 21,
    color: colors.textDim,
    textAlign: 'center',
  },
  descCompact: {
    fontSize: 12.5,
  },
  action: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 4,
  },
});
