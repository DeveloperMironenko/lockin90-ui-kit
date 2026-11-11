import { isValidElement, type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, type TextStyle, type ViewProps, type ViewStyle } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

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
}

export type AlertTitleLevel = 'p' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const TONE: Record<AlertTone, { c: string; bg: string; border: string }> = {
  info: { c: colors.accent, bg: 'rgba(124,92,255,0.08)', border: 'rgba(124,92,255,0.3)' },
  success: { c: colors.mint, bg: 'rgba(52,245,197,0.08)', border: 'rgba(52,245,197,0.3)' },
  warn: { c: colors.zoneMid, bg: 'rgba(255,176,32,0.08)', border: 'rgba(255,176,32,0.3)' },
  danger: { c: colors.zoneLow, bg: 'rgba(255,77,109,0.08)', border: 'rgba(255,77,109,0.3)' },
  neutral: { c: colors.accent2, bg: colors.glass, border: colors.border },
  cyan: { c: colors.accent2, bg: 'rgba(34,211,238,0.05)', border: 'rgba(34,211,238,0.22)' },
  violet: { c: colors.accent, bg: 'rgba(124,92,255,0.055)', border: 'rgba(124,92,255,0.2)' },
};

/** Quiet notes (design .tz-note / .note-safe): no bar, their own box, glyph and text sizes. */
const NOTE: Partial<Record<AlertTone, { box: ViewStyle; text: TextStyle; iconSize: number }>> = {
  neutral: {
    // The web's .tz-note sizes: mobile auth screens match the running web app at phone width.
    box: { gap: 9, paddingTop: 11, paddingBottom: 11, paddingLeft: 13, paddingRight: 13 },
    text: { fontSize: 12.5, lineHeight: 19 },
    iconSize: 17,
  },
  cyan: {
    box: { gap: 9, paddingTop: 12, paddingBottom: 12, paddingLeft: 14, paddingRight: 14 },
    text: { fontSize: 12.5, lineHeight: 19 },
    iconSize: 17,
  },
  // the web's phone-width .lk-alert-violet sizes (on the 4px scale)
  violet: {
    box: { gap: 12, paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16, borderRadius: radii.md },
    text: { fontSize: 12.5, lineHeight: 19 },
    iconSize: 18,
  },
};

/** The bold part of a `violet` note's sentence (web: `<b>` inside it), in the light accent. Pass it as an
 *  i18n `Trans` component: `components={{ b: <AlertStrong /> }}`. */
export function AlertStrong({ children }: { children?: ReactNode }) {
  return <Text style={styles.strong}>{children}</Text>;
}

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

/** Info "i" glyph — used for info tone (and the quiet notes, smaller and thinner). */
function InfoIcon({ color, size = 18, strokeWidth = 1.9 }: { color: string; size?: number; strokeWidth?: number }) {
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
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
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
  const note = NOTE[tone];
  if (note) return <InfoIcon color={color} size={note.iconSize} strokeWidth={tone === 'violet' ? 1.7 : 1.6} />;
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
  style,
  ...rest
}: AlertProps) {
  const t = TONE[tone];
  const note = NOTE[tone];
  // a text-only neutral note centres its icon; with a title or a dismiss it top-aligns like every tone
  const centred = tone === 'neutral' && title == null && !onDismiss;
  return (
    <View
      // an error is an alert and read as soon as it shows; every tone is a live region (web: alert / status)
      accessibilityRole={tone === 'danger' ? 'alert' : undefined}
      accessibilityLiveRegion={tone === 'danger' ? 'assertive' : 'polite'}
      style={[styles.alert, { backgroundColor: t.bg, borderColor: t.border }, note?.box, centred && styles.centred, style]}
      {...rest}
    >
      {!note && <View style={[styles.bar, { backgroundColor: t.c }]} pointerEvents="none" />}
      <View style={[styles.icon, centred && styles.iconCentered]}>{icon ?? defaultIcon(tone, t.c)}</View>
      <View style={styles.body}>
        {title != null && (
          <Text style={styles.title} accessibilityRole={titleAs === 'p' ? undefined : 'header'}>
            {title}
          </Text>
        )}
        {children != null && (isText(children)
          ? <Text style={[styles.text, note?.text, note && title == null && styles.textAlone]}>{children}</Text>
          : children)}
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
  // web: --accent mixed 40% with white
  strong: { fontWeight: '600', color: '#CBBEFF' },
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
  centred: { alignItems: 'center' },
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
    lineHeight: 19,
    color: colors.textDim,
  },
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
