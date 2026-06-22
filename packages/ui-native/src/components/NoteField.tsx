import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';

export interface NoteFieldProps extends TextInputProps {
  /** small mono uppercase label rendered above the field, e.g. "Private notes" */
  label?: string;
}

/** Private-notes field — a small mono uppercase label over a glass multiline
 *  textarea. Defaults to a 3-line height and an "Add a note…" placeholder. */
export function NoteField({
  label,
  style,
  placeholder,
  numberOfLines,
  onFocus,
  onBlur,
  ...rest
}: NoteFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label.toUpperCase()}</Text> : null}
      <TextInput
        multiline
        textAlignVertical="top"
        numberOfLines={numberOfLines ?? 3}
        placeholder={placeholder ?? 'Add a note…'}
        placeholderTextColor={colors.textFaint}
        style={[styles.note, { borderColor: focused ? colors.accent : colors.border2 }, style]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 7 },
  label: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.textFaint,
  },
  note: {
    width: '100%',
    minHeight: 80,
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: radii.sm,
    borderWidth: 1,
    backgroundColor: colors.glass2,
    color: colors.text,
    fontFamily: fonts.ui,
    fontSize: 13.5,
    lineHeight: 20,
  },
});
