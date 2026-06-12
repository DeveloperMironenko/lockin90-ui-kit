import { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { colors, fonts, fontSizes, radius, spacing } from '@lockin90/tokens';

export interface PasswordInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  invalid?: boolean;
  editable?: boolean;
  /** Passed through to the underlying TextInput. */
  autoComplete?: TextInputProps['autoComplete'];
  /** Passed through to the underlying TextInput (iOS). */
  textContentType?: TextInputProps['textContentType'];
  style?: StyleProp<TextStyle>;
}

/**
 * Aurora password field — matches `Input`, plus an overlaid show/hide eye
 * toggle on the right. The component owns `secureTextEntry`; reveal state is
 * internal and starts hidden.
 */
export function PasswordInput({
  value,
  onChangeText,
  placeholder,
  invalid,
  editable = true,
  autoComplete,
  textContentType,
  style,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.wrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        secureTextEntry={!visible}
        editable={editable}
        autoComplete={autoComplete}
        textContentType={textContentType}
        autoCapitalize="none"
        autoCorrect={false}
        style={[styles.input, invalid && styles.invalid, style]}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        disabled={!editable}
        onPress={() => setVisible((v) => !v)}
        hitSlop={8}
        style={styles.toggle}
      >
        <Text style={styles.toggleText}>{visible ? 'Hide' : 'Show'}</Text>
      </Pressable>
    </View>
  );
}

const TOGGLE_WIDTH = 54;

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingLeft: spacing.md,
    paddingRight: TOGGLE_WIDTH,
    paddingVertical: spacing.sm + 2,
    color: colors.text,
    fontFamily: fonts.ui,
    fontSize: fontSizes.base,
  } as ViewStyle & TextStyle,
  invalid: {
    borderColor: colors.bad,
  },
  toggle: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: TOGGLE_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontFamily: fonts.uiMedium,
    fontSize: fontSizes.sm,
    color: colors.textDim,
  },
});
