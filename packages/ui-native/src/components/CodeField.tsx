import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
} from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';

export interface CodeFieldProps
  extends Omit<TextInputProps, 'value' | 'onChange' | 'onChangeText'> {
  /** Current code / embed string. */
  value: string;
  /** Fired with the next string on every edit. */
  onChange: (value: string) => void;
  /** Optional language label rendered as a chip in the header (e.g. 'html', 'json'). */
  language?: string;
  /** Placeholder shown when empty. */
  placeholder?: string;
  /** Visible rows of the input. Default 8. */
  rows?: number;
  /** Invalid state — red border. */
  invalid?: boolean;
  /** Wrap long lines. On native the multiline input always wraps; kept for prop parity. */
  wrap?: boolean;
}

/** Editable multiline monospace code / embed input on the same dark inset
 *  surface as `CodeBlock`. Mirrors the web `CodeField` prop API. Tab-to-insert
 *  is web-only (no soft-keyboard Tab on native); otherwise identical. */
export function CodeField({
  value,
  onChange,
  language,
  placeholder,
  rows = 8,
  invalid = false,
  // `wrap` is destructured (not forwarded to TextInput) for prop parity with
  // web; native multiline always wraps, so it has no runtime effect here.
  wrap: _wrap = false,
  style,
  onFocus,
  onBlur,
  ...rest
}: CodeFieldProps) {
  const [focused, setFocused] = useState(false);
  const hasHeader = language != null;

  const borderColor = invalid
    ? colors.zoneLow
    : focused
      ? colors.accent
      : colors.border;

  return (
    <View style={[styles.root, { borderColor }]}>
      {hasHeader && (
        <View style={styles.head}>
          <View
            style={styles.dots}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <View style={[styles.dot, { backgroundColor: colors.zoneLow }]} />
            <View style={[styles.dot, { backgroundColor: colors.zoneMid }]} />
            <View style={[styles.dot, { backgroundColor: colors.mint }]} />
          </View>
          {language != null && (
            <Text style={styles.lang} numberOfLines={1}>
              {language}
            </Text>
          )}
        </View>
      )}
      <TextInput
        multiline
        textAlignVertical="top"
        numberOfLines={rows}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        style={[styles.ta, { minHeight: rows * 20 + 28 }, style]}
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
  root: {
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg0,
    overflow: 'hidden',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.glass,
  },
  dots: { flexDirection: 'row', gap: 5 },
  dot: { width: 9, height: 9, borderRadius: 999 },
  lang: {
    marginLeft: 'auto',
    fontFamily: fonts.mono,
    fontSize: 10.5,
    letterSpacing: 0.4,
    color: colors.textFaint,
  },
  ta: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fonts.mono,
    fontSize: 11.5,
    lineHeight: 20,
    color: colors.textDim,
  },
});
