import { View, Text, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/* ── shared check glyph ─────────────────────────────────────────────── */
function CheckGlyph() {
  return (
    <Svg width={12} height={12} viewBox="0 0 16 16">
      <Path
        d="M3.5 8.5l3 3 6-7"
        fill="none"
        stroke="#fff"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* ── Checkbox ───────────────────────────────────────────────────────── */
export interface CheckboxProps {
  /** controlled checked state */
  checked?: boolean;
  /** show a dash instead of a tick (mixed selection) */
  indeterminate?: boolean;
  /** fires with the next checked value */
  onChange?: (checked: boolean) => void;
  /** text beside the box */
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Custom checkbox — accent-filled box with a tick (or dash when indeterminate). */
export function Checkbox({
  checked = false,
  indeterminate = false,
  onChange,
  label,
  disabled = false,
  style,
}: CheckboxProps) {
  const filled = checked || indeterminate;
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: indeterminate ? 'mixed' : checked, disabled }}
      disabled={disabled}
      onPress={() => onChange?.(!checked)}
      style={[styles.row, disabled && styles.disabled, style]}
    >
      <View style={[styles.box, filled && styles.boxFilled]}>
        {indeterminate ? <View style={styles.dash} /> : checked ? <CheckGlyph /> : null}
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </Pressable>
  );
}

/* ── Radio ──────────────────────────────────────────────────────────── */
export interface RadioProps {
  /** controlled selected state */
  checked?: boolean;
  /** fires with the next checked value */
  onChange?: (checked: boolean) => void;
  /** text beside the dot */
  label?: string;
  value?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Custom radio — accent dot fills the ring when selected. */
export function Radio({
  checked = false,
  onChange,
  label,
  disabled = false,
  style,
}: RadioProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange?.(!checked)}
      style={[styles.row, disabled && styles.disabled, style]}
    >
      <View style={[styles.ring, checked && styles.ringChecked]}>
        {checked ? <View style={styles.dot} /> : null}
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </Pressable>
  );
}

/* ── RadioGroup ─────────────────────────────────────────────────────── */
export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  options?: RadioOption[];
  /** currently selected value */
  value?: string;
  /** fires with the chosen option value */
  onChange?: (value: string) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** A vertical column of mutually-exclusive radios. */
export function RadioGroup({
  options = [],
  value,
  onChange,
  disabled = false,
  style,
}: RadioGroupProps) {
  return (
    <View accessibilityRole="radiogroup" style={[styles.group, style]}>
      {options.map((opt) => (
        <Radio
          key={opt.value}
          value={opt.value}
          label={opt.label}
          checked={value === opt.value}
          disabled={disabled}
          onChange={(c) => {
            if (c) onChange?.(opt.value);
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  disabled: { opacity: 0.5 },
  label: { fontFamily: fonts.ui, fontSize: 13.5, color: colors.text, lineHeight: 18 },

  // checkbox
  box: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.border2,
    backgroundColor: colors.glass2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxFilled: { backgroundColor: colors.accent, borderColor: 'transparent' },
  dash: { width: 9, height: 2, borderRadius: 1, backgroundColor: '#fff' },

  // radio
  ring: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.border2,
    backgroundColor: colors.glass2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringChecked: { borderColor: colors.accent },
  dot: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: colors.accent },

  // group
  group: { flexDirection: 'column', gap: 10 },
});
