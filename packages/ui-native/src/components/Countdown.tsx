import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radii, fonts, nativeShadows } from '@lockin90/tokens';

export type CountdownUnit = 'days' | 'hours' | 'minutes' | 'seconds';

const ALL_UNITS: CountdownUnit[] = ['days', 'hours', 'minutes', 'seconds'];

const UNIT_LABEL: Record<CountdownUnit, string> = {
  days: 'Days',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
};

export interface CountdownProps {
  /** Target epoch (ms). When set, the countdown ticks live every second and clears on unmount. */
  to?: number;
  /** Static parts shown when `to` is not provided (a fixed, non-ticking countdown). */
  parts?: { days?: number; hours?: number; minutes?: number; seconds?: number };
  /** Which cells to render, in order. Defaults to all four. */
  units?: CountdownUnit[];
  /** The unit cell to render glowing (the `.lit` accent cell). */
  highlightUnit?: CountdownUnit;
  style?: StyleProp<ViewStyle>;
}

/** Break a positive remaining-millisecond span into clamped day/hour/minute/second parts. */
function splitRemaining(ms: number): Record<CountdownUnit, number> {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/** Two-digit zero-pad. */
function pad(value: number): string {
  return String(Math.max(0, value)).padStart(2, '0');
}

/**
 * Countdown — a row of glass cells (days / hours / minutes / seconds), each a big
 * display number with a mono unit label, counting down to a target time.
 *
 * Pass `to` (epoch ms) to tick live every second, or `parts` for a static render.
 * `highlightUnit` glows one cell with the accent border + glow. Clamps at zero.
 * Native analogue of the web `Countdown` — identical prop API.
 */
export function Countdown({ to, parts, units = ALL_UNITS, highlightUnit, style }: CountdownProps) {
  // Do NOT call Date.now() at module scope — only inside the effect/initializer.
  const computeParts = (): Record<CountdownUnit, number> => {
    if (to != null) return splitRemaining(to - Date.now());
    return {
      days: Math.max(0, parts?.days ?? 0),
      hours: Math.max(0, parts?.hours ?? 0),
      minutes: Math.max(0, parts?.minutes ?? 0),
      seconds: Math.max(0, parts?.seconds ?? 0),
    };
  };

  const [value, setValue] = useState<Record<CountdownUnit, number>>(computeParts);

  useEffect(() => {
    if (to == null) {
      setValue({
        days: Math.max(0, parts?.days ?? 0),
        hours: Math.max(0, parts?.hours ?? 0),
        minutes: Math.max(0, parts?.minutes ?? 0),
        seconds: Math.max(0, parts?.seconds ?? 0),
      });
      return;
    }
    const tick = () => setValue(splitRemaining(to - Date.now()));
    tick(); // sync immediately
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [to, parts?.days, parts?.hours, parts?.minutes, parts?.seconds]);

  return (
    <View style={[styles.row, style]} accessibilityRole="timer">
      {units.map((unit) => {
        const lit = highlightUnit === unit;
        return (
          <View key={unit} style={[styles.cell, lit && styles.cellLit]}>
            <Text style={styles.num}>{pad(value[unit])}</Text>
            <Text style={styles.label}>{UNIT_LABEL[unit]}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  cell: {
    minWidth: 92,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    alignItems: 'center',
    gap: 9,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  cellLit: {
    borderColor: colors.accent,
    backgroundColor: colors.glass2,
    ...nativeShadows.glowAccent,
  },
  num: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 46,
    letterSpacing: -1.38,
    lineHeight: 46,
    color: colors.text,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    fontWeight: '500',
    letterSpacing: 1.68,
    textTransform: 'uppercase',
    color: colors.textDim,
  },
});
