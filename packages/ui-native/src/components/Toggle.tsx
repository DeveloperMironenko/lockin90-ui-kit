import { View, Text, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { hapticSelection } from '../internal/optionalHaptics';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';

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

/** The design's dark ink for content sitting on a bright CTA gradient
 *  (design `.switch[aria-checked="true"]::after` — #07080d). */
const INK_ON_GRADIENT = '#07080D';

/** On/off switch — the design `.switch`: OFF is a glass pill track (subtle
 *  white fill + border-2) holding a solid text-dim knob; ON fills the TRACK
 *  with the CTA gradient (violet→cyan) + accent glow and the knob goes dark
 *  ink. Mirrors the web `.lk-toggle` 1:1 (lockin90-design settings screens).
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
  // The track has a 1px border and `left`/`width` are border-box, but the absolute
  // knob is positioned inside the border — so the travel must subtract BOTH borders,
  // else the "on" knob overshoots by 2px and sits flush against the right edge.
  const knobOffset = dims.track - TRACK_BORDER * 2 - dims.knob - dims.pad * 2;

  // knob: solid text-dim when off, dark ink when on (design `.switch::after`)
  const knob = (
    <View
      style={[
        styles.knob,
        {
          width: dims.knob,
          height: dims.knob,
          borderRadius: dims.knob / 2,
          // Vertically center regardless of track height/border (plain `top: pad`
          // left the knob a hair high). Horizontal inset stays `pad`.
          top: '50%',
          marginTop: -dims.knob / 2,
          left: dims.pad,
          transform: [{ translateX: checked ? knobOffset : 0 }],
          backgroundColor: checked ? INK_ON_GRADIENT : colors.textDim,
        },
      ]}
    />
  );

  const track = (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => {
        // selection tick when the app ships expo-haptics (silent no-op otherwise)
        hapticSelection();
        onChange?.(!checked);
      }}
      style={[
        styles.track,
        { width: dims.track, height: dims.height },
        checked ? styles.trackOn : styles.trackOff,
        disabled && styles.disabled,
      ]}
    >
      {checked && (
        <LinearGradient
          colors={gradients.cta.stops as unknown as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.trackFill}
        />
      )}
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

// Design sizes (mobile mock `.switch` / `.switch.sm`): md 42×24 knob 18,
// sm 36×21 knob 15; knob inset 2px.
const SIZE = {
  md: { track: 42, height: 24, knob: 18, pad: 2 },
  sm: { track: 36, height: 21, knob: 15, pad: 2 },
} as const;

/** Track border width (must match `trackOff`/`trackOn` borderWidth below). */
const TRACK_BORDER = 1;

const styles = StyleSheet.create({
  track: {
    position: 'relative',
    borderRadius: radii.pill,
    flexShrink: 0,
    overflow: 'hidden',
  },
  trackOff: {
    // design `.switch`: rgba(255,255,255,.06) fill + border-2 hairline
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.border2,
  },
  // on — the TRACK fills with the CTA gradient + accent glow, border transparent
  // (design `.switch[aria-checked="true"]`)
  trackOn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    boxShadow: '0 0 14px rgba(124,92,255,0.45)',
  },
  trackFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.pill,
  },
  knob: {
    position: 'absolute',
    zIndex: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontFamily: fonts.ui, fontSize: 14, fontWeight: '500', color: colors.text },
  disabled: { opacity: 0.5 },
});
