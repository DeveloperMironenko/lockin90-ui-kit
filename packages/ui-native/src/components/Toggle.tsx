import { View, Text, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients, nativeShadows } from '@lockin90/tokens';

export type ToggleSize = 'sm' | 'md';

export interface ToggleProps {
  /** whether the switch is on (default false) */
  checked?: boolean;
  /** fired with the next checked state when toggled */
  onChange?: (checked: boolean) => void;
  /** optional text rendered beside the switch */
  label?: string;
  /** control scale (default 'md') */
  size?: ToggleSize;
  /** when true, the switch is non-interactive and dimmed */
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** On/off switch — a glass pill track (glass-2 + border-2) holding a white knob
 *  that slides L→R when on; the track lights up with the CTA gradient + glow.
 *  An optional `label` is laid out in a row beside the switch. */
export function Toggle({
  checked = false,
  onChange,
  label,
  size = 'md',
  disabled = false,
  style,
}: ToggleProps) {
  const dims = size === 'sm' ? SIZE.sm : SIZE.md;
  const knobOffset = dims.track - dims.knob - dims.pad * 2;

  const knob = (
    <View
      style={[
        styles.knob,
        {
          width: dims.knob,
          height: dims.knob,
          borderRadius: dims.knob / 2,
          top: dims.pad,
          left: dims.pad,
          transform: [{ translateX: checked ? knobOffset : 0 }],
        },
      ]}
    />
  );

  const track = (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange?.(!checked)}
      style={[
        styles.track,
        { width: dims.track, height: dims.height },
        !checked && styles.trackOff,
        disabled && styles.disabled,
      ]}
    >
      {checked ? (
        <LinearGradient
          colors={gradients.cta.stops as unknown as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: radii.pill }, styles.trackOn]}
        />
      ) : null}
      {knob}
    </Pressable>
  );

  if (label == null) {
    return <View style={style}>{track}</View>;
  }

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange?.(!checked)}
      style={[styles.row, disabled && styles.disabled, style]}
    >
      {track}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const SIZE = {
  md: { track: 58, height: 32, knob: 24, pad: 3 },
  sm: { track: 44, height: 26, knob: 20, pad: 3 },
} as const;

const styles = StyleSheet.create({
  track: {
    position: 'relative',
    borderRadius: radii.pill,
    flexShrink: 0,
  },
  trackOff: {
    backgroundColor: colors.glass2,
    borderWidth: 1,
    borderColor: colors.border2,
  },
  trackOn: {
    borderWidth: 1,
    borderColor: 'rgba(124,92,255,0.40)',
  },
  knob: {
    position: 'absolute',
    backgroundColor: '#fff',
    zIndex: 1,
    ...nativeShadows.glowAccent,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontFamily: fonts.ui, fontSize: 14, fontWeight: '500', color: colors.text },
  disabled: { opacity: 0.5 },
});
