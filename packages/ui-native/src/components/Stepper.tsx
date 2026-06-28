import { Fragment } from 'react';
import { View, Text, Pressable, StyleSheet, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients, nativeShadows } from '@lockin90/tokens';
import { Icon } from './Icon';

/* ============================================================================
   Stepper + NumberStepper — flow-progress + quantity atoms.
   ========================================================================== */

export interface Step {
  label: string;
}

export interface StepperProps extends ViewProps {
  /** ordered steps; each renders a numbered node + label */
  steps?: Step[];
  /** 0-based index of the active step */
  current?: number;
  /** when true, render the current node (and all before it) as done/checked —
   *  the whole rail reads finished (the onboarding "Complete" state) */
  complete?: boolean;
}

const DEFAULT_STEPS: Step[] = [
  { label: 'Account' },
  { label: 'Profile' },
  { label: 'Goals' },
  { label: 'Done' },
];

/** Horizontal numbered progress rail — completed nodes filled mint with a
 *  check, the current node filled accent, future nodes faint glass; the
 *  connecting line fills accent up to the current step, faint beyond. When
 *  `complete`, the current node also reads done (mint check) so the whole
 *  rail shows finished. */
export function Stepper({ steps = DEFAULT_STEPS, current = 1, complete = false, style, ...rest }: StepperProps) {
  const active = Math.min(Math.max(0, current), Math.max(0, steps.length - 1));

  return (
    <View style={[styles.step, style]} {...rest}>
      {steps.map((stepItem, i) => {
        const done = complete ? i <= active : i < active;
        const isCurrent = !complete && i === active;
        return (
          <Fragment key={`${stepItem.label}-${i}`}>
            {i > 0 &&
              (i <= active ? (
                <LinearGradient
                  colors={[colors.accent, colors.accent2]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.line}
                />
              ) : (
                <View style={[styles.line, styles.lineFaint]} />
              ))}
            <View style={styles.item}>
              {done ? (
                <LinearGradient
                  colors={gradients.mint.stops as unknown as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.node, styles.nodeFilled, nativeShadows.glowMint]}
                >
                  <Icon name="check" size={14} color={colors.bg1} />
                </LinearGradient>
              ) : isCurrent ? (
                <LinearGradient
                  colors={gradients.cta.stops as unknown as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.node, styles.nodeFilled, nativeShadows.glowAccent]}
                >
                  <Text style={[styles.nodeNum, styles.nodeNumFilled]}>{i + 1}</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.node, styles.nodeFuture]}>
                  <Text style={styles.nodeNum}>{i + 1}</Text>
                </View>
              )}
              <Text
                style={[
                  styles.label,
                  done && styles.labelDone,
                  isCurrent && styles.labelCurrent,
                ]}
                numberOfLines={1}
              >
                {stepItem.label}
              </Text>
            </View>
          </Fragment>
        );
      })}
    </View>
  );
}

export interface NumberStepperProps extends Omit<ViewProps, 'onChange'> {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
}

/** Compact quantity control — a glass pill grouping a − button, the mono
 *  centered value, and a + button; ends disable at min / max. */
export function NumberStepper({
  value = 3,
  min = 0,
  max = 99,
  step = 1,
  onChange,
  style,
  ...rest
}: NumberStepperProps) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const current = clamp(value);
  const set = (v: number) => {
    const next = clamp(v);
    if (next !== current) onChange?.(next);
  };

  const atMin = current <= min;
  const atMax = current >= max;

  return (
    <View style={[styles.numstep, style]} {...rest}>
      <Pressable
        style={styles.btn}
        accessibilityRole="button"
        accessibilityLabel="Decrease"
        accessibilityState={{ disabled: atMin }}
        disabled={atMin}
        onPress={() => set(current - step)}
      >
        <Text style={[styles.btnLabel, atMin && styles.btnLabelDisabled]}>−</Text>
      </Pressable>
      <Text style={styles.value} accessibilityLiveRegion="polite">
        {current}
      </Text>
      <Pressable
        style={styles.btn}
        accessibilityRole="button"
        accessibilityLabel="Increase"
        accessibilityState={{ disabled: atMax }}
        disabled={atMax}
        onPress={() => set(current + step)}
      >
        <Text style={[styles.btnLabel, atMax && styles.btnLabelDisabled]}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ── Stepper ──────────────────────────────────────────────────────────── */
  step: { flexDirection: 'row', alignItems: 'flex-start', width: '100%' },
  item: { flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 },
  node: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  nodeFuture: { borderColor: colors.border2, backgroundColor: colors.glass2 },
  nodeFilled: { borderColor: 'transparent' },
  nodeNum: { fontFamily: fonts.mono, fontSize: 12, fontWeight: '600', color: colors.textFaint },
  nodeNumFilled: { color: colors.bg1 },
  label: {
    fontFamily: fonts.ui,
    fontSize: 11,
    letterSpacing: -0.06,
    color: colors.textFaint,
  },
  labelDone: { color: colors.textDim },
  labelCurrent: { color: colors.text, fontWeight: '600' },
  line: {
    flex: 1,
    minWidth: 18,
    height: 2,
    marginTop: 14,
    borderRadius: 2,
  },
  lineFaint: { backgroundColor: colors.border },

  /* ── NumberStepper ────────────────────────────────────────────────────── */
  numstep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border2,
    borderRadius: radii.pill,
    backgroundColor: colors.glass2,
    alignSelf: 'flex-start',
  },
  btn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  btnLabel: { fontFamily: fonts.display, fontSize: 18, fontWeight: '600', color: colors.textDim },
  btnLabelDisabled: { color: colors.textFaint, opacity: 0.35 },
  value: {
    minWidth: 36,
    paddingHorizontal: 6,
    fontFamily: fonts.mono,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});
