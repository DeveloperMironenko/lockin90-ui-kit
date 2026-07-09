import { Fragment, type ReactNode } from 'react';
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
  /** visual treatment — `compact` (default) is the original 30px filled rail;
   *  `glow` matches the onboarding tracker (40px nodes, hollow mint "done",
   *  CTA "current" with a stronger glow, mint connectors). Note: the
   *  web variant pulses the current node — that animation is web-only by
   *  design; native renders a static stronger glow in its place. */
  variant?: 'compact' | 'glow';
  /** When provided, each step's node + label becomes pressable; fired with the
   *  0-based step index. Steps beyond `current` are disabled by default to
   *  match the onboarding "no jumping ahead" UX — pass `allowAhead` to override. */
  onStepPress?: (index: number) => void;
  /** Allow pressing future steps (default false — only completed/current). */
  allowAhead?: boolean;
  /** Web-parity alias of `onStepPress` — provided so the same callback name
   *  works on both web (`<Stepper onStepClick={…} />`) and native. Future
   *  steps are always disabled (no `allowAhead` escape hatch on this path) to
   *  match the web behavior exactly. */
  onStepClick?: (index: number) => void;
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
export function Stepper({
  steps = DEFAULT_STEPS,
  current = 1,
  complete = false,
  variant = 'compact',
  onStepPress,
  allowAhead = false,
  onStepClick,
  style,
  ...rest
}: StepperProps) {
  const active = Math.min(Math.max(0, current), Math.max(0, steps.length - 1));
  const isGlow = variant === 'glow';
  // Web-parity callback wins when both are passed; mirrors web semantics
  // (no `allowAhead` — future steps are always disabled on this path).
  const pressHandler = onStepClick ?? onStepPress;
  const allowAheadResolved = onStepClick ? false : allowAhead;

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
                  colors={
                    isGlow
                      ? (gradients.mint.stops as unknown as [string, string])
                      : [colors.accent, colors.accent2]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.line,
                    isGlow && styles.lineGlow,
                    isGlow && (nativeShadows.glowMint as object),
                  ]}
                />
              ) : (
                <View style={[styles.line, isGlow && styles.lineGlow, styles.lineFaint]} />
              ))}
            <PressableMaybe
              onPress={pressHandler}
              index={i}
              pressable={!!pressHandler && (allowAheadResolved || i <= active)}
              isCurrent={isCurrent}
              label={stepItem.label}
              style={[styles.item, isGlow && styles.itemGlow]}
            >
              {done ? (
                isGlow ? (
                  // Glow "done": hollow mint ring with a stroked check —
                  // no gradient fill; the border + tint carry the state.
                  <View style={[styles.node, styles.nodeGlow, styles.nodeGlowDone]}>
                    <Icon name="check" size={16} color={colors.zoneHigh} />
                  </View>
                ) : (
                  <LinearGradient
                    colors={gradients.mint.stops as unknown as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.node, styles.nodeFilled, nativeShadows.glowMint]}
                  >
                    <Icon name="check" size={14} color={colors.bg1} />
                  </LinearGradient>
                )
              ) : isCurrent ? (
                // CTA gradient with accent glow. The web variant pulses this
                // glow via @keyframes; native renders the peak-state glow
                // statically — driving an animated shadow on RN would need a
                // new animation lib for marginal gain, so we keep it still.
                <LinearGradient
                  colors={gradients.cta.stops as unknown as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.node,
                    styles.nodeFilled,
                    isGlow && styles.nodeGlow,
                    nativeShadows.glowAccent,
                  ]}
                >
                  <Text
                    style={[
                      styles.nodeNum,
                      styles.nodeNumFilled,
                      isGlow && styles.nodeNumGlow,
                    ]}
                  >
                    {i + 1}
                  </Text>
                </LinearGradient>
              ) : (
                <View
                  style={[
                    styles.node,
                    styles.nodeFuture,
                    isGlow && styles.nodeGlow,
                    isGlow && styles.nodeGlowFuture,
                  ]}
                >
                  <Text style={[styles.nodeNum, isGlow && styles.nodeNumGlow]}>{i + 1}</Text>
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
            </PressableMaybe>
          </Fragment>
        );
      })}
    </View>
  );
}

/** Internal: render children inside a Pressable when `pressable` is true,
 *  otherwise inside a plain View. Lets the same JSX path serve both the
 *  static stepper and the clickable-rail variant without nesting branches. */
function PressableMaybe({
  pressable,
  onPress,
  index,
  isCurrent,
  label,
  style,
  children,
}: {
  pressable: boolean;
  onPress: ((index: number) => void) | undefined;
  index: number;
  isCurrent: boolean;
  label: string;
  style: ViewProps['style'];
  children: ReactNode;
}) {
  if (!pressable || !onPress) return <View style={style}>{children}</View>;
  return (
    <Pressable
      style={style}
      onPress={() => onPress(index)}
      accessibilityRole="button"
      accessibilityLabel={`Go to step ${index + 1}: ${label}`}
      accessibilityState={isCurrent ? { selected: true } : undefined}
      hitSlop={6}
    >
      {children}
    </Pressable>
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
  // Cells may SHRINK to node width (labels ellipsize via numberOfLines) so the
  // rail always fits its container — web parity: `.lk-step-item` is a fixed
  // 30px track and `.lk-step-line` flexes, so the web rail never overflows.
  item: { flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 1, minWidth: 30 },
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
  // Glow nodes are 40px tall (vs 30px compact), so the connector must drop to
  // their vertical center: (40 - 2) / 2 = 19.
  lineGlow: { marginTop: 19 },

  /* glow variant — 40px nodes, hollow mint "done", CTA "current" */
  itemGlow: { flex: 1, minWidth: 40 },
  nodeGlow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  nodeGlowDone: {
    borderColor: colors.zoneHigh,
    backgroundColor: 'rgba(52,245,197,0.12)',
  },
  nodeGlowFuture: {
    borderColor: colors.border2,
    backgroundColor: colors.bg1,
  },
  nodeNumGlow: { fontSize: 14 },

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
