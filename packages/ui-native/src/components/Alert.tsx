import { type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, type ViewProps } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

export type AlertTone = 'info' | 'success' | 'warn' | 'danger';

export interface AlertProps extends Omit<ViewProps, 'children'> {
  /** signal color + default icon (info=accent, success=mint, warn=amber, danger=red) */
  tone?: AlertTone;
  /** bold heading line */
  title?: string;
  /** body text under the title */
  children?: ReactNode;
  /** override the leading glyph; defaults to a tone-appropriate icon */
  icon?: ReactNode;
  /** when provided, renders a top-right × close button */
  onDismiss?: () => void;
}

const TONE: Record<AlertTone, { c: string; bg: string; border: string }> = {
  info: { c: colors.accent, bg: 'rgba(124,92,255,0.08)', border: 'rgba(124,92,255,0.3)' },
  success: { c: colors.mint, bg: 'rgba(52,245,197,0.08)', border: 'rgba(52,245,197,0.3)' },
  warn: { c: colors.zoneMid, bg: 'rgba(255,176,32,0.08)', border: 'rgba(255,176,32,0.3)' },
  danger: { c: colors.zoneLow, bg: 'rgba(255,77,109,0.08)', border: 'rgba(255,77,109,0.3)' },
};

/** Warning-triangle glyph — shared between warn + danger tones. */
function WarningIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 4 2.5 20.5h19z" />
      <Path d="M12 10v4.5" />
      <Circle cx={12} cy={17.75} r={0.9} fill={color} stroke="none" />
    </Svg>
  );
}

/** Info "i" glyph — used for info tone. */
function InfoIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={9} />
      <Path d="M12 11v5" />
      <Circle cx={12} cy={7.75} r={0.9} fill={color} stroke="none" />
    </Svg>
  );
}

/** Check glyph — used for success tone. */
function CheckIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

function defaultIcon(tone: AlertTone, color: string): ReactNode {
  if (tone === 'success') return <CheckIcon color={color} />;
  if (tone === 'warn' || tone === 'danger') return <WarningIcon color={color} />;
  return <InfoIcon color={color} />;
}

/** Tinted callout box — info / success / warn / danger banner with optional dismiss. */
export function Alert({ tone = 'info', title, children, icon, onDismiss, style, ...rest }: AlertProps) {
  const t = TONE[tone];
  return (
    <View style={[styles.alert, { backgroundColor: t.bg, borderColor: t.border }, style]} {...rest}>
      <View style={[styles.bar, { backgroundColor: t.c }]} pointerEvents="none" />
      <View style={styles.icon}>{icon ?? defaultIcon(tone, t.c)}</View>
      <View style={styles.body}>
        {title != null && <Text style={styles.title}>{title}</Text>}
        {children != null && (typeof children === 'string'
          ? <Text style={styles.text}>{children}</Text>
          : children)}
      </View>
      {onDismiss && (
        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          hitSlop={6}
          style={styles.close}
        >
          <Svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={colors.textFaint} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="m6 6 12 12M18 6 6 18" />
          </Svg>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  alert: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingTop: 14,
    paddingRight: 15,
    paddingBottom: 14,
    paddingLeft: 17,
    borderRadius: radii.sm,
    borderWidth: 1,
    overflow: 'hidden',
  },
  bar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 3,
  },
  icon: {
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
    letterSpacing: -0.14,
    color: colors.text,
  },
  text: {
    marginTop: 3,
    fontFamily: fonts.ui,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textDim,
  },
  close: {
    marginTop: -3,
    marginRight: -4,
    width: 26,
    height: 26,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
