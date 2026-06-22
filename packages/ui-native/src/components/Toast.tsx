import { type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, type ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts, nativeShadows } from '@lockin90/tokens';
import { Icon, type IconName } from './Icon';

export type ToastTone = 'default' | 'success' | 'warn' | 'danger';

export interface ToastProps extends Omit<ViewProps, 'children'> {
  /** tints the leading icon + the subtle left accent rail */
  tone?: ToastTone;
  /** bold first line */
  title?: string;
  /** optional dimmer second line */
  message?: ReactNode;
  /** override the default tone icon (pass any node, e.g. an <Icon />) */
  icon?: ReactNode;
  /** show a × button; called when it's pressed */
  onDismiss?: () => void;
}

/** Per-tone icon color + left accent rail color. `default` keeps the neutral rail. */
const TONE: Record<ToastTone, { icon: string; rail: string }> = {
  default: { icon: colors.textDim, rail: colors.border2 },
  success: { icon: colors.zoneHigh, rail: colors.zoneHigh },
  warn: { icon: colors.zoneMid, rail: colors.zoneMid },
  danger: { icon: colors.zoneLow, rail: colors.zoneLow },
};

/** Default glyph per tone — info for default/warn/danger, check for success. */
const TONE_ICON: Record<ToastTone, IconName> = {
  default: 'info',
  success: 'check',
  warn: 'info',
  danger: 'info',
};

/** Compact floating notification card — tone-tinted icon + title/message + optional dismiss. */
export function Toast({
  tone = 'default',
  title = 'Saved',
  message,
  icon,
  onDismiss,
  style,
  ...rest
}: ToastProps) {
  const t = TONE[tone];
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[styles.toast, style]}
      {...rest}
    >
      <View style={[styles.rail, { backgroundColor: t.rail }]} pointerEvents="none" />
      <View style={styles.icon}>
        {icon ?? <Icon name={TONE_ICON[tone]} size={17} color={t.icon} />}
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {message != null && (typeof message === 'string'
          ? <Text style={styles.msg}>{message}</Text>
          : message)}
      </View>
      {onDismiss && (
        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          hitSlop={6}
          style={styles.x}
        >
          <Svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={colors.textFaint} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="m6 6 12 12M18 6 6 18" />
          </Svg>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    maxWidth: 360,
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.bg1,
    overflow: 'hidden',
    ...nativeShadows.elev2,
  },
  rail: {
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
    fontFamily: fonts.ui,
    fontSize: 13.5,
    fontWeight: '600',
    lineHeight: 18,
    color: colors.text,
  },
  msg: {
    marginTop: 2,
    fontFamily: fonts.ui,
    fontSize: 12.5,
    lineHeight: 17.5,
    color: colors.textDim,
  },
  x: {
    marginTop: -2,
    marginLeft: 2,
    width: 20,
    height: 20,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
