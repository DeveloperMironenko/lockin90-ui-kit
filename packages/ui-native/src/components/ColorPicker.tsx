import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Input } from './Input';
import { Modal } from './Modal';

export interface ColorPickerProps {
  /** Current color as a hex string (e.g. "#7C5CFF" or "#7C5CFF80" when alpha). */
  value: string;
  /** Fires with the next hex string whenever the color changes. */
  onChange: (hex: string) => void;
  /** Preset swatch hexes shown in the grid. Defaults to the Aurora spectrum. */
  swatches?: string[];
  /** Allow editing an 8-digit (#RRGGBBAA) alpha channel. Default false. */
  allowAlpha?: boolean;
  /** Optional small mono label above the trigger. */
  label?: string;
  /** Marks the field invalid (red hex Input). */
  invalid?: boolean;
}

/** Aurora energy-spectrum default swatches (token hexes — data, not chrome). */
const DEFAULT_SWATCHES = [
  '#A8FF35', // lime
  '#34F5C5', // mint
  '#22D3EE', // cyan
  '#6E7BFF', // indigo
  '#7C5CFF', // accent
  '#A855F7', // violet
  '#FF3D81', // magenta
  '#FFB020', // warn / amber
  '#FF4D6D', // zone-low
  '#EEF1F8', // text (near-white)
];

/** Normalize loose input to a `#`-prefixed uppercase hex, tolerating partials. */
function normalizeHex(raw: string): string {
  let v = raw.trim().toUpperCase();
  if (!v.startsWith('#')) v = `#${v}`;
  return v;
}

function isCompleteHex(v: string): boolean {
  return /^#([0-9A-F]{6}|[0-9A-F]{8})$/.test(v);
}

/** Swatch-trigger color field (native parity of the web `ColorPicker`). The
 *  trigger chip shows the current color; tapping it opens a Modal with a hex
 *  `TextInput` and a grid of preset swatches. There is no OS color wheel on
 *  native — choose a preset or type a hex. Reuses Input + Modal. */
export function ColorPicker({
  value,
  onChange,
  swatches = DEFAULT_SWATCHES,
  allowAlpha = false,
  label,
  invalid = false,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const display = normalizeHex(value || '');

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label.toUpperCase()}</Text> : null}
      <Pressable
        style={styles.trigger}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Color ${display}`}
      >
        <View style={styles.swatch}>
          <View style={[styles.swatchFill, { backgroundColor: display }]} />
        </View>
        <Text style={styles.triggerHex}>{display}</Text>
      </Pressable>

      <Modal open={open} onClose={() => setOpen(false)} title="Color">
        <View style={styles.panel}>
          <Input
            label="Hex"
            inputSize="sm"
            invalid={invalid}
            value={display}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={allowAlpha ? 9 : 7}
            placeholder={allowAlpha ? '#RRGGBBAA' : '#RRGGBB'}
            onChangeText={(t) => onChange(normalizeHex(t))}
          />
          <View style={styles.grid}>
            {swatches.map((sw) => {
              const swNorm = normalizeHex(sw);
              const selected = isCompleteHex(display) && swNorm === display;
              return (
                <Pressable
                  key={swNorm}
                  style={[styles.preset, { backgroundColor: swNorm }, selected && styles.presetSelected]}
                  onPress={() => onChange(swNorm)}
                  accessibilityRole="button"
                  accessibilityLabel={swNorm}
                  accessibilityState={{ selected }}
                />
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6, minWidth: 0 },
  label: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1.2,
    color: colors.textFaint,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 9,
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.glass2,
  },
  swatch: {
    width: 22,
    height: 22,
    borderRadius: radii.sm,
    padding: 1,
    backgroundColor: colors.bg2,
  },
  swatchFill: {
    flex: 1,
    borderRadius: radii.sm - 2,
    borderWidth: 1,
    borderColor: colors.border2,
  },
  triggerHex: {
    fontFamily: fonts.mono,
    fontSize: 13,
    letterSpacing: 0.4,
    color: colors.text,
  },
  panel: { gap: 16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  preset: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetSelected: {
    borderColor: colors.text,
    borderWidth: 2,
  },
});
