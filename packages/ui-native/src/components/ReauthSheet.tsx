import { type ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Chip } from './Chip';

/** The protected action being gated by the step-up reauth. */
export interface ReauthAction {
  /** Uppercase label above the action line, e.g. "Protected action". */
  label: string;
  /** Action description, e.g. "Change email →". Rendered before {@link target}. */
  value: string;
  /** Optional emphasized target (the new value), shown bold + cyan. */
  target?: string;
}

export interface ReauthSheetProps {
  /** Sheet title. */
  title?: string;
  /** Supporting line under the title. */
  subtitle?: string;
  /** The sensitive action this reauth gates. */
  action?: ReauthAction;
  /** Step-up chip text, e.g. "step-up · expires in 5 min". */
  expiresLabel?: string;
  /** Face ID button caption. */
  scanLabel?: string;
  /** Password-fallback link text. */
  passwordLabel?: string;
  /** Cancel button text. */
  cancelLabel?: string;
  /** Face ID button handler. */
  onScan?: () => void;
  /** Password-fallback handler. */
  onUsePassword?: () => void;
  /** Cancel handler. */
  onCancel?: () => void;
  style?: StyleProp<ViewStyle>;
}

const Lock = () => (
  <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
    <Rect x={4} y={10} width={16} height={11} rx={2} stroke={colors.accent} strokeWidth={1.7} />
    <Path d="M8 10V7a4 4 0 0 1 8 0v3" stroke={colors.accent} strokeWidth={1.7} />
  </Svg>
);

const Mail = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={5} width={18} height={14} rx={2} stroke={colors.zoneMid} strokeWidth={1.7} />
    <Path d="m3 7 9 6 9-6" stroke={colors.zoneMid} strokeWidth={1.7} />
  </Svg>
);

const Face = () => (
  <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M9 10h.01M15 10h.01M12 9v3.5l-1.2 1M9.5 15c.8.7 1.7 1 2.5 1s1.7-.3 2.5-1"
      stroke={colors.accent}
      strokeWidth={1.6}
    />
  </Svg>
);

const DEFAULT_ACTION: ReauthAction = {
  label: 'Protected action',
  value: 'Change email → ',
  target: 'm.kane@new.com',
};

/** Reauth / step-up sheet — a security confirmation surface: a lock badge +
 *  expiry chip, a "Confirm it's you" title + subtitle, a framed protected-action
 *  row, a Face ID button with a glowing scan ring, a password fallback, and a
 *  Cancel button. */
export function ReauthSheet({
  title = "Confirm it's you",
  subtitle = 'Required to change your email',
  action = DEFAULT_ACTION,
  expiresLabel = 'step-up · expires in 5 min',
  scanLabel = 'Scan to confirm',
  passwordLabel = 'Use password instead',
  cancelLabel = 'Cancel',
  onScan,
  onUsePassword,
  onCancel,
  style,
}: ReauthSheetProps) {
  return (
    <View style={[styles.sheet, style]} accessibilityRole="none" accessibilityLabel={title}>
      <View style={styles.topline} />

      <View style={styles.top}>
        <View style={styles.lock}>
          <Lock />
        </View>
        {expiresLabel ? <Chip tone="accent" dot label={expiresLabel} /> : null}
      </View>

      <View style={styles.head}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      </View>

      {action ? (
        <View style={styles.action}>
          <Mail />
          <View style={styles.actTxt}>
            <Text style={styles.actLabel}>{action.label.toUpperCase()}</Text>
            <Text style={styles.actValue} numberOfLines={1}>
              {action.value}
              {action.target ? <Text style={styles.actTarget}>{action.target}</Text> : null}
            </Text>
          </View>
        </View>
      ) : null}

      <Pressable style={styles.face} onPress={onScan} accessibilityRole="button" accessibilityLabel={scanLabel}>
        <View style={styles.ring}>
          <Face />
        </View>
        <Text style={styles.scan}>{scanLabel}</Text>
      </Pressable>

      {passwordLabel ? (
        <Pressable onPress={onUsePassword} accessibilityRole="button">
          <Text style={styles.pass}>{passwordLabel}</Text>
        </Pressable>
      ) : null}

      <Pressable style={styles.cancel} onPress={onCancel} accessibilityRole="button">
        <Text style={styles.cancelTxt}>{cancelLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    width: '100%',
    maxWidth: 340,
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderRadius: radii.md,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 13,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowRadius: 50,
    shadowOffset: { width: 0, height: 18 },
    elevation: 16,
  },
  topline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  lock: {
    width: 30,
    height: 30,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(124,92,255,0.12)',
    borderWidth: 1,
    borderColor: colors.border2,
  },
  head: { alignItems: 'center', gap: 3 },
  title: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 18,
    color: colors.text,
    letterSpacing: -0.18,
    textAlign: 'center',
  },
  sub: { fontSize: 11.5, color: colors.textDim, lineHeight: 16, maxWidth: 240, textAlign: 'center' },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    width: '100%',
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,176,32,0.28)',
    backgroundColor: 'rgba(255,176,32,0.05)',
  },
  actTxt: { flex: 1, gap: 1, minWidth: 0 },
  actLabel: { fontSize: 9, letterSpacing: 0.81, color: colors.zoneMid, fontWeight: '700' },
  actValue: { fontFamily: fonts.mono, fontSize: 11, color: colors.text },
  actTarget: { color: colors.accent2, fontWeight: '600' },
  face: { alignItems: 'center', gap: 9, marginTop: 4, marginBottom: 2 },
  ring: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(124,92,255,0.6)',
    backgroundColor: 'rgba(124,92,255,0.08)',
    shadowColor: colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  scan: { fontFamily: fonts.display, fontWeight: '700', fontSize: 13, color: colors.accent },
  pass: { fontFamily: fonts.ui, fontSize: 13, fontWeight: '600', color: colors.accent2, paddingVertical: 5, paddingHorizontal: 12 },
  cancel: {
    width: '100%',
    marginTop: 2,
    paddingVertical: 10,
    borderRadius: radii.sm,
    backgroundColor: colors.glass2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelTxt: { fontFamily: fonts.ui, fontWeight: '600', fontSize: 12.5, color: colors.textDim },
});
