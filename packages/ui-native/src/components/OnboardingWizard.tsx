import { type ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';
import { Chip } from './Chip';

/** Step lifecycle state in the node-dot tracker. */
export type OnboardingStepState = 'done' | 'current' | 'pending';

export interface OnboardingStep {
  /** Short label under the node, e.g. "Connect". */
  label: string;
  /** Lifecycle state — controls the dot fill + the connector line. */
  state: OnboardingStepState;
}

export interface OnboardingProvider {
  /** Provider / device name, e.g. "Oura Ring 4". */
  name: string;
  /** Meta line, e.g. "Strain & recovery" or "Connected · synced 4m ago". */
  meta?: string;
  /** When true, paints the connected state (mint border + check, no button). */
  connected?: boolean;
  /** Custom logo glyph. Falls back to a generic device mark. */
  logo?: ReactNode;
}

export interface OnboardingWizardProps {
  /** Step tracker nodes, left → right. */
  steps?: OnboardingStep[];
  /** Zero-based index of the active step (drives the index badge + nav meta). */
  step?: number;
  /** Current step title. */
  title?: string;
  /** Current step subtitle / description. */
  sub?: string;
  /** Provider-connect grid items. */
  providers?: OnboardingProvider[];
  /** Status chip label in the head, e.g. "1 connected". Hidden when empty. */
  stepLabel?: string;
  /** Overall progress percent (0–100). Defaults to the done-ratio of steps. */
  percent?: number;
  style?: StyleProp<ViewStyle>;
}

const CTA = gradients.cta.stops as unknown as [string, string];
const METER = [colors.accent, colors.accent2, colors.accent3] as unknown as [string, string, string];

const Check = ({ size = 18, color = colors.accent3 }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M5 12l5 5L20 6" stroke={color} strokeWidth={2.4} fill="none" />
  </Svg>
);

const OuraLogo = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={8.5} stroke={colors.accent3} strokeWidth={1.8} />
    <Circle cx={12} cy={12} r={3.4} stroke={colors.accent3} strokeWidth={1.8} />
  </Svg>
);

const WhoopLogo = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12h3l2-6 4 12 2-9 2 3h5"
      stroke={colors.accent2}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AppleLogo = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.8 7.6a5 5 0 0 0-8.8-2 5 5 0 1 0-7 7L12 20l7-7.4a5 5 0 0 0 1.8-5z"
      stroke={colors.accent}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  </Svg>
);

const ManualLogo = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M5 12h14" stroke={colors.textDim} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

const DEFAULT_STEPS: OnboardingStep[] = [
  { label: 'Account', state: 'done' },
  { label: 'Profile', state: 'done' },
  { label: 'Connect', state: 'current' },
  { label: 'Goals', state: 'pending' },
];

const DEFAULT_PROVIDERS: OnboardingProvider[] = [
  { name: 'Oura Ring 4', meta: 'Connected · synced 4m ago', connected: true, logo: <OuraLogo /> },
  { name: 'WHOOP 5.0', meta: 'Strain & recovery', logo: <WhoopLogo /> },
  { name: 'Apple Health', meta: 'Steps, sleep & HR', logo: <AppleLogo /> },
  { name: 'Manual', meta: 'Enter readings yourself', logo: <ManualLogo /> },
];

/** Onboarding wizard — a node-dot step tracker + progress meter, the current
 *  step's index/title/sub, a provider-connect grid (Connect / connected check),
 *  and a Back + gradient Continue footer. Mirrors the web `.lk-onb-*`. */
export function OnboardingWizard({
  steps = DEFAULT_STEPS,
  step = 2,
  title = 'Connect your devices',
  sub = 'Pull sleep, HRV, resting HR and recovery from the ring or watch you already wear.',
  providers = DEFAULT_PROVIDERS,
  stepLabel = '1 connected',
  percent,
  style,
}: OnboardingWizardProps) {
  const total = Math.max(1, steps.length);
  const doneCount = steps.filter((s) => s.state === 'done').length;
  const pct = Math.round(percent ?? (doneCount / total) * 100);
  const idx = Math.max(0, Math.min(total - 1, step)) + 1;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.topline}>
        <Text style={styles.lbl}>YOUR SETUP PROGRESS</Text>
        <Text style={styles.pct}>
          <Text style={styles.pctNum}>{pct}%</Text> complete
        </Text>
      </View>

      <View style={styles.steps}>
        {steps.map((s, i) => {
          const done = s.state === 'done';
          const current = s.state === 'current';
          const isLast = i === steps.length - 1;
          return (
            <View key={`${s.label}-${i}`} style={styles.node}>
              {!isLast ? (
                <View style={styles.conn}>
                  {done ? (
                    <LinearGradient
                      colors={[colors.accent3, colors.accent]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={StyleSheet.absoluteFill}
                    />
                  ) : null}
                </View>
              ) : null}
              {current ? (
                <LinearGradient
                  colors={CTA}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.dot, styles.dotCurrent]}
                >
                  <Text style={[styles.dotNum, styles.dotNumCurrent]}>{i + 1}</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.dot, done && styles.dotDone]}>
                  {done ? <Check size={18} /> : <Text style={styles.dotNum}>{i + 1}</Text>}
                </View>
              )}
              <Text style={[styles.name, done && styles.nameDone, current && styles.nameCurrent]} numberOfLines={2}>
                {s.label}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.meter}>
        <LinearGradient colors={METER} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.meterFill, { width: `${pct}%` }]} />
      </View>

      <View style={styles.rule} />

      <View style={styles.head}>
        <LinearGradient colors={CTA} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.idx}>
          <Text style={styles.idxNum}>{idx}</Text>
        </LinearGradient>
        <View style={styles.titles}>
          <Text style={styles.title}>{title}</Text>
          {sub ? <Text style={styles.sub}>{sub}</Text> : null}
        </View>
        {stepLabel ? <Chip tone="high" dot label={stepLabel} style={styles.status} /> : null}
      </View>

      <View style={styles.body}>
        <View style={styles.grid}>
          {providers.map((p, i) => (
            <View key={`${p.name}-${i}`} style={[styles.prov, p.connected && styles.provConnected]}>
              <View style={styles.logo}>{p.logo ?? <ManualLogo />}</View>
              <View style={styles.pmain}>
                <Text style={styles.pname} numberOfLines={1}>
                  {p.name}
                </Text>
                {p.meta ? <Text style={[styles.pmeta, p.connected && styles.pmetaOk]}>{p.meta}</Text> : null}
              </View>
              {p.connected ? (
                <View style={styles.check}>
                  <Check size={13} />
                </View>
              ) : (
                <Pressable style={styles.cbtn}>
                  <Text style={styles.cbtnLabel}>Connect</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.nav}>
        <Pressable style={styles.back}>
          <Svg width={16} height={16} viewBox="0 0 24 24">
            <Path d="M15 18l-6-6 6-6" stroke={colors.textDim} strokeWidth={1.8} fill="none" />
          </Svg>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
        <Text style={styles.navmeta}>
          Step <Text style={styles.navmetaNum}>{idx}</Text> of {total}
        </Text>
        <Pressable>
          <LinearGradient colors={CTA} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.continue}>
            <Text style={styles.continueLabel}>Continue</Text>
            <Svg width={16} height={16} viewBox="0 0 24 24">
              <Path d="M9 6l6 6-6 6" stroke="#07080d" strokeWidth={2.2} fill="none" />
            </Svg>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 22,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },

  topline: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 },
  lbl: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.4, color: colors.textFaint },
  pct: { fontFamily: fonts.display, fontWeight: '700', fontSize: 15, color: colors.text },
  pctNum: { color: colors.accent3 },

  steps: { flexDirection: 'row', alignItems: 'flex-start' },
  node: { flex: 1, alignItems: 'center', gap: 8, position: 'relative' },
  conn: {
    position: 'absolute',
    top: 19,
    left: '50%',
    right: 0,
    marginLeft: 22,
    marginRight: 22,
    height: 2,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border2,
    backgroundColor: colors.glass2,
    zIndex: 2,
  },
  dotDone: { borderColor: colors.accent3, backgroundColor: 'rgba(52,245,197,0.12)' },
  dotCurrent: {
    borderColor: 'transparent',
    shadowColor: colors.accent,
    shadowOpacity: 0.42,
    shadowRadius: 19,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  dotNum: { fontFamily: fonts.mono, fontWeight: '600', fontSize: 14, color: colors.textFaint },
  dotNumCurrent: { color: '#07080d' },
  name: { fontSize: 12, fontWeight: '500', color: colors.textFaint, textAlign: 'center', lineHeight: 16, maxWidth: 86 },
  nameDone: { color: colors.textDim },
  nameCurrent: { color: colors.text, fontWeight: '600' },

  meter: { height: 6, borderRadius: radii.pill, backgroundColor: 'rgba(255,255,255,0.07)', overflow: 'hidden', marginTop: 16 },
  meterFill: { height: '100%', borderRadius: radii.pill },

  rule: { height: 1, marginVertical: 22, marginBottom: 20, backgroundColor: colors.border2 },

  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 4 },
  idx: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  idxNum: { fontFamily: fonts.display, fontWeight: '700', fontSize: 18, color: '#07080d' },
  titles: { flex: 1, minWidth: 0 },
  title: { fontFamily: fonts.display, fontWeight: '700', fontSize: 22, letterSpacing: -0.4, lineHeight: 25, color: colors.text },
  sub: { marginTop: 5, fontSize: 13.5, color: colors.textDim, lineHeight: 20 },
  status: { marginLeft: 'auto' },

  body: { marginTop: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 13 },
  prov: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 15,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    flexBasis: '47%',
    flexGrow: 1,
  },
  provConnected: { borderColor: 'rgba(52,245,197,0.35)', backgroundColor: 'rgba(52,245,197,0.05)' },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass2,
  },
  pmain: { flex: 1, minWidth: 0 },
  pname: { fontFamily: fonts.display, fontWeight: '700', fontSize: 15, color: colors.text },
  pmeta: { fontFamily: fonts.mono, fontSize: 11, color: colors.textFaint, marginTop: 2 },
  pmetaOk: { color: colors.accent3 },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52,245,197,0.14)',
    borderWidth: 1.5,
    borderColor: colors.accent3,
  },
  cbtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.glass2,
  },
  cbtnLabel: { fontFamily: fonts.ui, fontSize: 13, fontWeight: '600', color: colors.text },

  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
  },
  backLabel: { fontSize: 13.5, color: colors.textDim },
  navmeta: { flex: 1, fontFamily: fonts.mono, fontSize: 11.5, color: colors.textFaint, textAlign: 'center' },
  navmetaNum: { color: colors.textDim },
  continue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: radii.pill,
    shadowColor: colors.accent,
    shadowOpacity: 0.36,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  continueLabel: { fontFamily: fonts.ui, fontWeight: '600', fontSize: 14, color: '#07080d' },
});
