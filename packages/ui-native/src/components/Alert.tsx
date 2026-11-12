import { createContext, isValidElement, useContext, useEffect, useRef, type ReactNode } from 'react';
import { AccessibilityInfo, Platform, View, Text, Pressable, StyleSheet, type ViewProps } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { useContrastColors } from '../internal/useHighContrast';
import { FitText } from './FitText';

export type AlertTone = 'info' | 'success' | 'warn' | 'danger' | 'neutral' | 'cyan' | 'violet';

export interface AlertProps extends Omit<ViewProps, 'children'> {
  /** signal color + default icon (info=accent, success=mint, warn=amber, danger=red);
   *  `neutral` (glass box) and `cyan` (cyan-tinted box) are quiet notes: no left bar, a cyan icon;
   *  `violet` (accent-tinted box, accent icon) is the onboarding "why we ask" note */
  tone?: AlertTone;
  /** bold heading line */
  title?: string;
  /** body text under the title */
  children?: ReactNode;
  /** override the leading glyph; defaults to a tone-appropriate icon */
  icon?: ReactNode;
  /** when provided, renders a top-right × close button */
  onDismiss?: () => void;
  /** the × button's name, in the app's language (CONVENTIONS "Accessibility": names via props).
   *  @default 'Dismiss' (an English fallback for older apps) */
  dismissLabel?: string;
  /** the title's level, as web: a heading level (`h2`…`h6`) makes the title a header; `p` (the default)
   *  keeps it plain text (an alert's title is not the screen's header). */
  titleAs?: AlertTitleLevel;
  /** `false`: no live region at all (the app announces it itself). @default true */
  live?: boolean;
  /** content under the text that is NOT announced when it changes — a ticking countdown ("Try again in
   *  0:42"): the live region is then the title and text only. */
  footer?: ReactNode;
  /** iOS: say the alert when it mounts (not only when its text changes). Default: `danger` only — an
   *  error usually mounts in answer to an action (a failed submit); a `warn` note present when the screen
   *  opens isn't read out on top of the screen. (Android's live region and web's role do their own.) */
  announceOnMount?: boolean;
  /** A rich text body's plain words (an i18n `Trans` inside a `Text`), so a word too wide for the body
   *  shrinks the text instead of splitting (FitText). Plain strings and nested `Text` are measured
   *  without it. */
  measureText?: string;
  /** The 3px tone bar at the start edge. Default: on for info / success / warn / danger, off for the notes
   *  (neutral, cyan, violet). As web. */
  bar?: boolean;
}

export type AlertTitleLevel = 'p' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

// info is the status `--info` (as Toast), not the brand accent (owner, 2026-11-11)
const TONE: Record<AlertTone, { c: string; bg: string; border: string }> = {
  info: { c: colors.info, bg: 'rgba(110,123,255,0.08)', border: 'rgba(110,123,255,0.3)' },
  success: { c: colors.mint, bg: 'rgba(52,245,197,0.08)', border: 'rgba(52,245,197,0.3)' },
  warn: { c: colors.zoneMid, bg: 'rgba(255,176,32,0.08)', border: 'rgba(255,176,32,0.3)' },
  danger: { c: colors.zoneLow, bg: 'rgba(255,77,109,0.08)', border: 'rgba(255,77,109,0.3)' },
  neutral: { c: colors.accent2, bg: colors.glass, border: colors.border },
  cyan: { c: colors.accent2, bg: 'rgba(34,211,238,0.05)', border: 'rgba(34,211,238,0.22)' },
  violet: { c: colors.accent, bg: 'rgba(124,92,255,0.055)', border: 'rgba(124,92,255,0.2)' },
};

/** The quiet notes: no bar by default. */
const NOTE_TONES: ReadonlySet<AlertTone> = new Set(['neutral', 'cyan', 'violet']);

/** Every tone's icon (CONVENTIONS "Type": icons sized per slot). */
const ICON = 16;

/** The tone an `AlertStrong` sits in (a violet note colours it `accentSoft`). */
const ToneContext = createContext<AlertTone | null>(null);

/** The bold part of an alert's sentence (web: `<b>` inside it): 600 in the full text colour; a `violet`
 *  note colours it `accentSoft`. Pass it as an i18n `Trans` component: `components={{ b: <AlertStrong /> }}`. */
export function AlertStrong({ children }: { children?: ReactNode }) {
  const tone = useContext(ToneContext);
  return <Text style={[styles.strong, tone === 'violet' && styles.strongSoft]}>{children}</Text>;
}

/** Warning-triangle glyph — shared between warn + danger tones. */
function WarningIcon({ color }: { color: string }) {
  return (
    <Svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 4 2.5 20.5h19z" />
      <Path d="M12 10v4.5" />
      <Circle cx={12} cy={17.75} r={0.9} fill={color} stroke="none" />
    </Svg>
  );
}

/** Info "i" glyph — used for info tone (and the quiet notes, smaller and thinner). */
function InfoIcon({ color, size = ICON, strokeWidth = 1.9 }: { color: string; size?: number; strokeWidth?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={9} />
      <Path d="M12 11v5" />
      <Circle cx={12} cy={7.75} r={0.9} fill={color} stroke="none" />
    </Svg>
  );
}

/** Check glyph — used for success tone. */
function CheckIcon({ color }: { color: string }) {
  return (
    <Svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

/** Text children (a string, or a `<Text>` holding a sentence with styled parts, such as an i18n `Trans`) get
 *  the alert's text style, as any text inside the web alert does; anything else (views, fragments, components)
 *  renders as given. */
function isText(children: ReactNode): boolean {
  return typeof children === 'string' || typeof children === 'number' || (isValidElement(children) && children.type === Text);
}

function defaultIcon(tone: AlertTone, color: string): ReactNode {
  if (tone === 'success') return <CheckIcon color={color} />;
  if (tone === 'warn' || tone === 'danger') return <WarningIcon color={color} />;
  return <InfoIcon color={color} />;
}

/** Tinted callout box — info / success / warn / danger banner (or a quiet neutral / cyan note) with optional dismiss. */
export function Alert({
  tone = 'info',
  title,
  children,
  icon,
  onDismiss,
  dismissLabel = 'Dismiss',
  titleAs = 'p',
  live = true,
  footer,
  announceOnMount,
  measureText,
  bar,
  style,
  ...rest
}: AlertProps) {
  // the live region: the whole alert, or (with a footer) the title + text only, as web
  const liveProps = live
    ? {
        accessibilityRole: tone === 'danger' ? ('alert' as const) : undefined,
        accessibilityLiveRegion: tone === 'danger' ? ('assertive' as const) : ('polite' as const),
      }
    : {};
  const t = TONE[tone];
  // Increase Contrast steps the body text up
  const c = useContrastColors();
  // iOS has no live regions: a danger / warn alert says itself when its text changes, and on mount when
  // `announceOnMount` (default: danger only); Android reads the live region below; `live={false}` opts out
  const spoken = [title, typeof children === 'string' || typeof children === 'number' ? String(children) : '']
    .filter(Boolean)
    .join('. ');
  const mounted = useRef(false);
  const onMount = announceOnMount ?? tone === 'danger';
  useEffect(() => {
    const first = !mounted.current;
    mounted.current = true;
    if (!live || !spoken || Platform.OS !== 'ios' || (tone !== 'danger' && tone !== 'warn')) return;
    if (first && !onMount) return;
    AccessibilityInfo.announceForAccessibility(spoken);
  }, [spoken, live, tone, onMount]);
  const note = NOTE_TONES.has(tone);
  const barOn = bar ?? !note;
  // a text-only neutral note centres its icon; with a title or a dismiss it top-aligns like every tone
  const centred = tone === 'neutral' && title == null && !onDismiss;
  return (
    <View
      // an error is an alert and read as soon as it shows; every tone is a live region (web: alert / status)
      {...(footer == null ? liveProps : {})}
      style={[styles.alert, { backgroundColor: t.bg, borderColor: t.border }, centred && styles.centred, style]}
      {...rest}
    >
      {barOn && <View style={[styles.bar, { backgroundColor: t.c }]} pointerEvents="none" />}
      <View style={[styles.icon, centred && styles.iconCentered]}>{icon ?? defaultIcon(tone, t.c)}</View>
      <View style={styles.body}>
        <View {...(footer == null ? {} : liveProps)}>
          {title != null && (
            <FitText style={styles.title} accessibilityRole={titleAs === 'p' ? undefined : 'header'}>
              {title}
            </FitText>
          )}
          {children != null && (isText(children)
            ? (
              <ToneContext.Provider value={tone}>
                <FitText measureText={measureText} style={[styles.text, { color: c.textDim }, title == null && styles.textAlone]}>{children}</FitText>
              </ToneContext.Provider>
            )
            : <ToneContext.Provider value={tone}>{children}</ToneContext.Provider>)}
        </View>
        {footer != null ? <View style={styles.footer}>{typeof footer === 'string' ? <Text style={styles.text}>{footer}</Text> : footer}</View> : null}
      </View>
      {onDismiss && (
        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel={dismissLabel}
          // the 26pt box reaches the 44pt touch target
          hitSlop={9}
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
  // emphasis: 600 in the full text colour, as web; a violet note's in accentSoft
  strong: { fontWeight: '600', color: colors.text },
  strongSoft: { color: colors.accentSoft },
  alert: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    // one box for every tone (owner, 2026-11-11): 12 / 16, as web
    gap: 12,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    // a container's corners (CONVENTIONS "Corner radii")
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  centred: { alignItems: 'center' },
  bar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 3,
  },
  icon: {
    // centred on the first 19.5pt line
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCentered: { marginTop: 0 },
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
    lineHeight: 19.5,
    color: colors.textDim,
  },
  footer: { marginTop: 8 },
  // a note's body alone sits flush with its icon (no gap under a missing title)
  textAlone: { marginTop: 0 },
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
