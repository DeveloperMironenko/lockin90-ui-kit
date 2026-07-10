import { useState, type ReactNode } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  type TextInputProps,
  type ViewProps,
} from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

export interface FormFieldProps extends ViewProps {
  /** small mono uppercase label rendered above the control */
  label?: string;
  /** faint helper text below the control (hidden when `error` is set) */
  help?: ReactNode;
  /** red error text below the control — replaces `help` when present */
  error?: ReactNode;
  /** appends a small accent `*` after the label */
  required?: boolean;
  /** the form control to wrap */
  children?: ReactNode;
}

/** Labeled form-control wrapper — mono label, the control, then faint help or red error. */
export function FormField({
  label,
  help,
  error,
  required = false,
  children,
  style,
  ...rest
}: FormFieldProps) {
  return (
    <View style={[styles.field, style]} {...rest}>
      {label ? (
        <Text style={styles.fieldLabel}>
          {label.toUpperCase()}
          {required ? <Text style={styles.req}> *</Text> : null}
        </Text>
      ) : null}
      <View style={styles.control}>{children}</View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : help ? (
        <Text style={styles.helpText}>{help}</Text>
      ) : null}
    </View>
  );
}

export interface SearchInputProps extends Omit<TextInputProps, 'onChange' | 'value'> {
  /** current query value (controlled) */
  value?: string;
  /** fires with the next string value on every keystroke and on clear */
  onChange?: (value: string) => void;
  /** placeholder copy (default 'Search…') */
  placeholder?: string;
  /** invoked by the trailing × clear button (in addition to `onChange('')`) */
  onClear?: () => void;
  /** shell shape — `'pill'` (default, standalone search) or `'sm'` (the standard
   *  Input radius, for menus/sheets where the search sits among other fields). */
  shape?: 'pill' | 'sm';
}

/** Search field — leading magnifier, transparent input, trailing × clear when non-empty. */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  onClear,
  shape = 'pill',
  style,
  onFocus,
  onBlur,
  ...rest
}: SearchInputProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = !!value && value.length > 0;

  function clear() {
    onChange?.('');
    onClear?.();
  }

  return (
    <View
      style={[
        styles.search,
        shape === 'sm' && styles.searchSm,
        { borderColor: focused ? colors.accent : colors.border2 },
      ]}
    >
      <View style={styles.searchLead}>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Circle cx={11} cy={11} r={7} stroke={colors.textFaint} strokeWidth={1.9} />
          <Line
            x1={16.5}
            y1={16.5}
            x2={21}
            y2={21}
            stroke={colors.textFaint}
            strokeWidth={1.9}
            strokeLinecap="round"
          />
        </Svg>
      </View>
      <TextInput
        style={[styles.searchInput, style]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        onChangeText={(t) => onChange?.(t)}
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
      {hasValue ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          onPress={clear}
          style={styles.searchClear}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Line
              x1={6}
              y1={6}
              x2={18}
              y2={18}
              stroke={colors.textDim}
              strokeWidth={2}
              strokeLinecap="round"
            />
            <Line
              x1={18}
              y1={6}
              x2={6}
              y2={18}
              stroke={colors.textDim}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </Svg>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // FormField
  field: { gap: 6, minWidth: 0 },
  fieldLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1.2,
    color: colors.textFaint,
  },
  req: { color: colors.accent, fontSize: 11 },
  control: { minWidth: 0 },
  helpText: {
    fontFamily: fonts.ui,
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.textFaint,
  },
  errorText: {
    fontFamily: fonts.ui,
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.zoneLow,
  },
  // SearchInput
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    borderWidth: 1,
    backgroundColor: colors.glass2,
  },
  searchSm: {
    borderRadius: radii.sm,
  },
  searchLead: { flexShrink: 0 },
  searchInput: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    color: colors.text,
    fontFamily: fonts.ui,
    fontSize: 14,
    lineHeight: 20,
  },
  searchClear: {
    flexShrink: 0,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
  },
});
