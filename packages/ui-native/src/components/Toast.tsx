import { useEffect, useRef, useState, type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, AccessibilityInfo, Easing, type ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts, nativeShadows } from '@lockin90/tokens';
import { Icon, type IconName } from './Icon';
import { OptionalBlurView } from '../internal/optionalBlur';
import { useReducedMotion } from '../internal/useReducedMotion';
import { useReduceTransparency } from '../internal/useReduceTransparency';

export type ToastTone = 'default' | 'success' | 'warn' | 'danger';

export interface ToastProps extends Omit<ViewProps, 'children'> {
  /** tints the edge and the icon's circle */
  tone?: ToastTone;
  /** bold first line */
  title?: string;
  /** optional dimmer second line */
  message?: ReactNode;
  /** override the default tone icon (pass any node, e.g. an <Icon />; give it the tone's colour:
   *  success `colors.zoneHigh`, warn `zoneMid`, danger `zoneLow`; native has no colour inheritance) */
  icon?: ReactNode;
  /** show a × button; called when it's pressed */
  onDismiss?: () => void;
  /** the × button's name, in the app's language (CONVENTIONS "Accessibility": names via props).
   *  @default 'Dismiss' (an English fallback for older apps) */
  dismissLabel?: string;
  /** an action's label ("Undo"), in the app's language; shown with `onAction` */
  actionLabel?: string;
  /** called when the action is pressed */
  onAction?: () => void;
  /** With an action: how long (ms) until `onTimeout`, shown as a line along the bottom edge that shrinks
   *  to nothing. It holds while the toast is touched or its action focused (WCAG 2.2.1), and while a
   *  screen reader is on (VoiceOver's focus can't be seen from JS): then a × (`dismissLabel`) ends it. */
  duration?: number;
  /** the countdown ran out (or the screen reader's × was pressed): do what the action could undo */
  onTimeout?: () => void;
  /** @deprecated 2026-11-11 (owner: the solid fill "ruins the style"): ignored, every toast is the glass
   *  card. Removed in the next major. */
  filled?: boolean;
}

/** Each tone's colour: the icon, its circle (16 %), the edge and the countdown line (at an alpha that
 *  keeps them 3:1 on the card and on the solid fill: they mark the state). `default` is neutral. */
const TONE: Record<ToastTone, { ink: string; circle: string; edge: string; line: string }> = {
  default: { ink: colors.textDim, circle: colors.glass2, edge: colors.border2, line: 'rgba(255,255,255,0.45)' },
  success: { ink: colors.zoneHigh, circle: 'rgba(52,245,197,0.16)', edge: 'rgba(52,245,197,0.45)', line: 'rgba(52,245,197,0.45)' },
  warn: { ink: colors.zoneMid, circle: 'rgba(255,176,32,0.16)', edge: 'rgba(255,176,32,0.5)', line: 'rgba(255,176,32,0.5)' },
  danger: { ink: colors.zoneLow, circle: 'rgba(255,77,109,0.16)', edge: 'rgba(255,77,109,0.7)', line: 'rgba(255,77,109,0.7)' },
};

/** Default glyph per tone — info for default/warn/danger, check for success. */
const TONE_ICON: Record<ToastTone, IconName> = {
  default: 'info',
  success: 'check',
  warn: 'info',
  danger: 'info',
};

/** How it comes in: a fade and a small slide down (a fade only under Reduce Motion). */
const ENTER_MS = 200;
const ENTER_DY = -8;

/** Whether a screen reader is on (VoiceOver / TalkBack), live. */
function useScreenReader() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let live = true;
    AccessibilityInfo.isScreenReaderEnabled?.()
      .then((v) => live && setOn(v))
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener?.('screenReaderChanged', setOn);
    return () => {
      live = false;
      sub?.remove?.();
    };
  }, []);
  return on;
}

/** A countdown of `total` ms that holds while `held`: the fraction left (1 → 0) to draw, `onEnd` once
 *  it runs out. Smooth, or under Reduce Motion one step per second. `total` 0: nothing runs. */
function useCountdown(total: number, held: boolean, stepped: boolean, onEnd?: () => void) {
  const left = useRef(new Animated.Value(1)).current;
  const remaining = useRef(total);
  const endRef = useRef(onEnd);
  endRef.current = onEnd;
  const done = useRef(false);

  useEffect(() => {
    if (!total || held || done.current) return;
    if (remaining.current <= 0) remaining.current = total;
    const startedAt = Date.now();
    const from = remaining.current;
    const finish = () => {
      done.current = true;
      remaining.current = 0;
      left.setValue(0);
      endRef.current?.();
    };
    const timer = setTimeout(finish, from);
    let steps: ReturnType<typeof setInterval> | undefined;
    if (stepped) {
      // the whole seconds left, drawn once a second
      const draw = () =>
        left.setValue(Math.ceil(Math.max(0, from - (Date.now() - startedAt)) / 1000) * 1000 / total);
      draw();
      steps = setInterval(draw, 1000);
    } else {
      Animated.timing(left, { toValue: 0, duration: from, easing: Easing.linear, useNativeDriver: true }).start();
    }
    return () => {
      clearTimeout(timer);
      if (steps) clearInterval(steps);
      left.stopAnimation();
      if (done.current) return;
      remaining.current = Math.max(0, from - (Date.now() - startedAt));
      left.setValue(remaining.current / total);
    };
  }, [total, held, stepped, left]);

  return left;
}

/** Compact floating notification: the dark glass card (blurred where expo-blur is, solid under Reduce
 *  Transparency) with a tone-tinted edge and a soft shadow, the icon in a small tone-tinted circle, white
 *  text, an optional action ("Undo") and ×. Fades in with a small slide. */
export function Toast({
  tone = 'default',
  title = 'Saved',
  message,
  icon,
  onDismiss,
  dismissLabel = 'Dismiss',
  actionLabel,
  onAction,
  duration,
  onTimeout,
  filled: _filled,
  style,
  ...rest
}: ToastProps) {
  const t = TONE[tone];
  const reducedMotion = useReducedMotion();
  const solid = useReduceTransparency();
  const enter = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: ENTER_MS, useNativeDriver: true }).start();
  }, [enter]);
  const motion = {
    opacity: enter,
    transform: reducedMotion ? [] : [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [ENTER_DY, 0] }) }],
  };

  const counting = Boolean(onAction && actionLabel && duration);
  const reader = useScreenReader();
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const left = useCountdown(counting ? duration! : 0, touched || focused || reader, reducedMotion, onTimeout);
  const hold = (on: boolean) => () => setTouched(on);
  // a screen reader holds the countdown: its × ends it (does what the action would undo, at once)
  const dismiss = onDismiss ?? (counting && reader ? onTimeout : undefined);

  const content = (
    <>
      <View style={[styles.icon, { backgroundColor: t.circle }]}>
        {icon ?? <Icon name={TONE_ICON[tone]} size={16} color={t.ink} />}
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {message != null && (typeof message === 'string' ? <Text style={styles.msg}>{message}</Text> : message)}
      </View>
      {onAction && actionLabel ? (
        <Pressable
          onPress={onAction}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          // the label's box reaches the 44pt touch target
          hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
      {dismiss && (
        <Pressable
          onPress={dismiss}
          accessibilityRole="button"
          accessibilityLabel={dismissLabel}
          // the 20pt box reaches the 44pt touch target
          hitSlop={12}
          style={styles.x}
        >
          <Svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={colors.textFaint} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="m6 6 12 12M18 6 6 18" />
          </Svg>
        </Pressable>
      )}
      {counting && (
        // the time left, from full to nothing (in the tone's colour, 3:1 on the card); not announced
        <Animated.View
          pointerEvents="none"
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden
          testID="toast-countdown"
          style={[styles.count, { backgroundColor: t.line, transform: [{ scaleX: left }] }]}
        />
      )}
    </>
  );

  const card = [styles.toast, { borderColor: t.edge }, solid && styles.solid];
  return (
    <Animated.View
      accessibilityRole="alert"
      accessibilityLiveRegion={tone === 'danger' ? 'assertive' : 'polite'}
      style={[styles.shadow, motion, style]}
      // a finger on the toast holds the countdown
      onTouchStart={counting ? hold(true) : undefined}
      onTouchEnd={counting ? hold(false) : undefined}
      onTouchCancel={counting ? hold(false) : undefined}
      {...rest}
    >
      {OptionalBlurView && !solid ? (
        <OptionalBlurView intensity={24} tint="dark" style={card}>
          {content}
        </OptionalBlurView>
      ) : (
        <View style={card}>{content}</View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // the soft shadow on an unclipped box (a clipped one, for the blur's corners, would cut it)
  shadow: {
    maxWidth: 360,
    borderRadius: radii.md,
    ...nativeShadows.elev2,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
    paddingVertical: 9,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: radii.md,
    borderWidth: 1,
    backgroundColor: colors.card,
    // the blur and the countdown line clipped to the radius
    overflow: 'hidden',
  },
  // Reduce Transparency: opaque
  solid: { backgroundColor: colors.bg1 },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fonts.ui,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
    color: colors.text,
  },
  msg: {
    marginTop: 2,
    fontFamily: fonts.ui,
    fontSize: 12.5,
    lineHeight: 17.5,
    color: colors.textDim,
  },
  action: {
    minHeight: 28,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.6 },
  actionText: {
    fontFamily: fonts.ui,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
    color: colors.accent2,
  },
  // the countdown: 2pt along the bottom edge, shrinking toward the start
  count: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    transformOrigin: 'left',
  },
  x: {
    width: 20,
    height: 20,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
