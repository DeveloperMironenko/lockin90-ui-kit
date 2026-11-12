import { useEffect, useRef, useState, type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, AccessibilityInfo, type ViewProps } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, fonts, nativeShadows } from '@lockin90/tokens';
import { Icon, type IconName } from './Icon';
import { useReducedMotion } from '../internal/useReducedMotion';

export type ToastTone = 'default' | 'success' | 'info' | 'warn' | 'danger';

export interface ToastProps extends Omit<ViewProps, 'children'> {
  /** what happened: `success` (a save, a completed change), `danger` (a failure), `warn`, `info`; sets the
   *  edge and the icon */
  tone?: ToastTone;
  /** the message (bold) */
  title?: string;
  /** optional dimmer second line */
  message?: ReactNode;
  /** override the default tone icon (pass any node, e.g. an <Icon />; give it the tone's colour:
   *  success `colors.ok`, info `info`, warn `warn`, danger `bad`; native has no colour inheritance) */
  icon?: ReactNode;
  /** show a × button; called when it's pressed */
  onDismiss?: () => void;
  /** the × button's name, in the app's language (CONVENTIONS "Accessibility": names via props).
   *  @default 'Dismiss' (an English fallback for older apps) */
  dismissLabel?: string;
  /** an action's label ("Undo", "Try again"), in the app's language; shown with `onAction` */
  actionLabel?: string;
  /** called when the action is pressed */
  onAction?: () => void;
  /** With an action: how long (ms) until `onTimeout`, shown as a seconds ring inside the action that
   *  drains to 0. It holds while the toast is touched or its action focused (WCAG 2.2.1), and while a
   *  screen reader is on (VoiceOver's focus can't be seen from JS): then a × (`dismissLabel`) ends it. */
  duration?: number;
  /** the countdown reached 0 (or the screen reader's × was pressed): do what the action could undo */
  onTimeout?: () => void;
  /** @deprecated 2026-11-11 (owner: the solid fill "ruins the style"): ignored, every toast is the card's
   *  surface. Removed in the next major. */
  filled?: boolean;
}

/** Each tone's colour: the icon, its circle (14 %) and the edge (at an alpha that keeps it 3:1 on the card
 *  (cardSolid): it marks the state). `default` is neutral. */
const TONE: Record<ToastTone, { ink: string; circle: string; edge: string }> = {
  default: { ink: colors.textDim, circle: colors.glass2, edge: colors.border2 },
  success: { ink: colors.ok, circle: 'rgba(52,245,197,0.14)', edge: 'rgba(52,245,197,0.45)' },
  info: { ink: colors.info, circle: 'rgba(110,123,255,0.14)', edge: 'rgba(110,123,255,0.7)' },
  warn: { ink: colors.warn, circle: 'rgba(255,176,32,0.14)', edge: 'rgba(255,176,32,0.5)' },
  danger: { ink: colors.bad, circle: 'rgba(255,77,109,0.14)', edge: 'rgba(255,77,109,0.7)' },
};

/** Default glyph per tone — check for success, info for the others. */
const TONE_ICON: Record<ToastTone, IconName> = {
  default: 'info',
  success: 'check',
  info: 'info',
  warn: 'info',
  danger: 'info',
};

/** How it comes in: a fade and a small slide down (a fade only under Reduce Motion). */
const ENTER_MS = 200;
const ENTER_DY = -8;
/** The action's dark label on the CTA gradient (4.5:1 at every point of it). */
const ON_CTA = '#080A12';
/** The seconds ring: r 8 in a 20 box, drawn 16. */
const RING_C = 2 * Math.PI * 8;

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

/** A countdown of `total` ms that holds while `held`: the ms left (redrawn each frame, or four times a
 *  second when `stepped`) and `onEnd` once it reaches 0. `total` 0: nothing runs. */
function useCountdown(total: number, held: boolean, stepped: boolean, onEnd?: () => void) {
  const [left, setLeft] = useState(total);
  const remaining = useRef(total);
  const endRef = useRef(onEnd);
  const done = useRef(false);
  useEffect(() => {
    endRef.current = onEnd;
  });

  useEffect(() => {
    if (!total || held || done.current) return;
    if (remaining.current <= 0) remaining.current = total;
    const startedAt = Date.now();
    const from = remaining.current;
    const now = () => Math.max(0, from - (Date.now() - startedAt));
    const timer = setTimeout(() => {
      done.current = true;
      remaining.current = 0;
      setLeft(0);
      endRef.current?.();
    }, from);
    let frame = 0;
    let steps: ReturnType<typeof setInterval> | undefined;
    if (stepped) {
      steps = setInterval(() => setLeft(now()), 250);
    } else {
      const tick = () => {
        setLeft(now());
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      if (steps) clearInterval(steps);
      if (done.current) return;
      remaining.current = now();
      setLeft(remaining.current);
    };
  }, [total, held, stepped]);

  return left;
}

/** Compact floating notification: the card's surface, opaque (`cardSolid`: it floats over photos and
 *  fields, so its text stays at 4.5:1 whatever is behind) with the tone's edge and a soft shadow, the tone icon in a small circle, the message in
 *  white, an optional filled action ("Undo") with a seconds ring, and ×. Fades in with a small slide. */
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
  const enter = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: ENTER_MS, useNativeDriver: true }).start();
  }, [enter]);
  const motion = {
    opacity: enter,
    transform: reducedMotion ? [] : [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [ENTER_DY, 0] }) }],
  };

  const action = Boolean(onAction && actionLabel);
  const counting = action && Boolean(duration);
  const reader = useScreenReader();
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const left = useCountdown(counting ? duration! : 0, touched || focused || reader, reducedMotion, onTimeout);
  const seconds = Math.ceil(left / 1000);
  // smooth, or whole seconds under Reduce Motion
  const fraction = counting ? (reducedMotion ? (seconds * 1000) / duration! : left / duration!) : 0;
  const hold = (on: boolean) => () => setTouched(on);
  // a screen reader holds the countdown: its × ends it (does what the action would undo, at once)
  const dismiss = onDismiss ?? (counting && reader ? onTimeout : undefined);

  const content = (
    <>
      <View style={[styles.icon, { backgroundColor: t.circle }]}>
        {icon ?? <Icon name={TONE_ICON[tone]} size={13} color={t.ink} />}
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {message != null && (typeof message === 'string' ? <Text style={styles.msg}>{message}</Text> : message)}
      </View>
      {action ? (
        <Pressable
          onPress={onAction}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityRole="button"
          // named by its label only: the ring and its number are not read
          accessibilityLabel={actionLabel}
          // the 26pt button reaches the 44pt touch target
          hitSlop={{ top: 9, bottom: 9, left: 4, right: 4 }}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <LinearGradient
            colors={gradients.cta.stops as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.action, counting && styles.actionRing]}
          >
            {counting && (
              <View
                style={styles.ring}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                testID="toast-countdown"
              >
                <Svg width={16} height={16} viewBox="0 0 20 20" style={styles.ringSvg}>
                  <Circle cx={10} cy={10} r={8} fill="none" stroke={ON_CTA} strokeWidth={1.8} opacity={0.22} />
                  <Circle
                    cx={10}
                    cy={10}
                    r={8}
                    fill="none"
                    stroke={ON_CTA}
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeDasharray={`${RING_C}`}
                    strokeDashoffset={RING_C * (1 - fraction)}
                  />
                </Svg>
                {/* part of the 16pt ring graphic (hidden from screen readers): it keeps its size */}
                <Text style={styles.ringNumber} allowFontScaling={false}>
                  {seconds}
                </Text>
              </View>
            )}
            <Text style={styles.actionText}>{actionLabel}</Text>
          </LinearGradient>
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
    </>
  );

  const card = [styles.toast, { borderColor: t.edge }];
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
      <View style={card}>{content}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // the soft shadow on the outer box
  shadow: {
    maxWidth: 360,
    borderRadius: radii.md,
    ...nativeShadows.elev2,
  },
  // slim (owner, 2026-11-11, variant C): 6 / 6 / 6 / 10, 10 apart
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    paddingLeft: 10,
    paddingRight: 6,
    borderRadius: radii.md,
    borderWidth: 1,
    backgroundColor: colors.cardSolid,
  },
  icon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 4,
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
  // the filled action: 26 tall, corners 10 (the toast's 16 less its 6 padding), 0 10 (0 10 0 5 with the
  // ring), 5 apart
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 26,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
  },
  // the ring sits 5 from its left edge
  actionRing: { paddingLeft: 5 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  actionText: {
    fontFamily: fonts.ui,
    fontSize: 12.5,
    fontWeight: '600',
    color: ON_CTA,
  },
  ring: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  ringSvg: { position: 'absolute', transform: [{ rotate: '-90deg' }] },
  ringNumber: {
    fontFamily: fonts.ui,
    fontSize: 8.5,
    lineHeight: 10,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: ON_CTA,
  },
  x: {
    width: 20,
    height: 20,
    marginHorizontal: 2,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
