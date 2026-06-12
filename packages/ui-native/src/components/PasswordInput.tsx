import { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
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
 * internal and starts hidden. The eye icon is the SAME SVG as the web
 * @lockin90/ui PasswordInput so the two platforms render an identical control.
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
        {visible ? <EyeOff /> : <Eye />}
      </Pressable>
    </View>
  );
}

/** Eye icon — same 24×24 paths + 1.6 stroke as the web PasswordInput toggle. */
function Eye() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke={colors.textFaint}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={3} stroke={colors.textFaint} strokeWidth={1.6} />
    </Svg>
  );
}

function EyeOff() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 4.6A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a18.5 18.5 0 0 1-3.2 4M6.6 6.6A18.4 18.4 0 0 0 2 12s3.5 7 10 7a10.8 10.8 0 0 0 3.4-.5"
        stroke={colors.textFaint}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const TOGGLE_WIDTH = 44;

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
});
