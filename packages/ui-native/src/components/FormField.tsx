import { Children, cloneElement, Fragment, isValidElement, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AccessibilityInfo,
  Platform,
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
import { useContrastColors } from '../internal/useHighContrast';
import { Icon } from './Icon';
import { FitText } from './FitText';

export interface FormFieldProps extends ViewProps {
  /** small mono uppercase label rendered above the control */
  label?: string;
  /** faint helper text below the control (hidden when `error` is set) */
  help?: ReactNode;
  /** red error text below the control — replaces `help` when present */
  error?: ReactNode;
  /** appends a small accent `*` after the label */
  required?: boolean;
  /** the word read after the label when `required` ("required", in the app's language). Without it the
   *  control's name is the label alone. */
  requiredLabel?: string;
  /** a link or action at the end of the label row (e.g. "Forgot password?") */
  labelAction?: ReactNode;
  /** the form control to wrap */
  children?: ReactNode;
}

type ControlProps = { accessibilityLabel?: string; accessibilityHint?: string };

const textOf = (node: ReactNode): string | undefined =>
  typeof node === 'string' || typeof node === 'number' ? String(node) : undefined;

/** Labeled form-control wrapper — mono label, the control, then faint help or red error. The one control
 *  child is named by the label (its `accessibilityLabel`, unless it sets its own) and hinted by the error
 *  or help; a new error is announced (FormField.md §7). */
export function FormField({
  label,
  help,
  error,
  required = false,
  requiredLabel,
  labelAction,
  children,
  style,
  ...rest
}: FormFieldProps) {
  const errorText = textOf(error);
  // Increase Contrast steps the label and help up
  const c = useContrastColors();
  // a new error is read once: Android by the error's live region, iOS (no live regions) by an
  // announcement; an error already there when the field mounts is not announced
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current && errorText && Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(errorText);
    mounted.current = true;
  }, [errorText]);

  // the one control child gets the name and hint; mapped (never swapped for a bare element), so going
  // between one and several children never remounts the control
  const single = Children.count(children) === 1;
  const name = label ? (required && requiredLabel ? `${label}, ${requiredLabel}` : label) : undefined;
  const hint = error ? errorText : textOf(help);
  const body = Children.map(children, (child) =>
    single && isValidElement<ControlProps>(child) && child.type !== Fragment
      ? cloneElement(child, {
          accessibilityLabel: child.props.accessibilityLabel ?? name,
          accessibilityHint: child.props.accessibilityHint ?? hint,
        })
      : child,
  );
  return (
    <View style={[styles.field, style]} {...rest}>
      {label || labelAction ? (
        <View style={styles.labelRow}>
          {label ? (
            // a word wider than the field (a half-width column at a large text size) shrinks, never splits
            <FitText style={[styles.fieldLabel, { color: c.textDim }]}>
              {label.toUpperCase()}
              {/* a thin space, as the web's 3px gap (a full space read twice as wide) */}
              {required ? <Text style={styles.req}>{'\u2009*'}</Text> : null}
            </FitText>
          ) : null}
          {labelAction != null ? <View style={styles.labelAction}>{labelAction}</View> : null}
        </View>
      ) : null}
      <View style={styles.control}>{body}</View>
      {error ? (
        // an icon before the text, as web: the colour is never the only cue
        <View style={styles.errorRow}>
          <View style={styles.errorIcon} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
            <Icon name="info" size={12} color={colors.zoneLow} />
          </View>
          <Text style={styles.errorText} accessibilityLiveRegion="polite" accessibilityRole="alert">
            {error}
          </Text>
        </View>
      ) : help ? (
        <Text style={[styles.helpText, { color: c.textFaint }]}>{help}</Text>
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
  /** the clear button's name, in the app's language (CONVENTIONS "Accessibility": names via props).
   *  @default 'Clear search' (an English fallback for older apps) */
  clearLabel?: string;
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
  clearLabel = 'Clear search',
  shape = 'pill',
  style,
  onFocus,
  onBlur,
  ...rest
}: SearchInputProps) {
  const [focused, setFocused] = useState(false);
  const c = useContrastColors();
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
        { borderColor: focused ? colors.accent : c.borderControl },
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
        placeholderTextColor={c.textFaint}
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
          accessibilityLabel={clearLabel}
          hitSlop={12}
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
  // a long action goes to its own line, end-aligned (as web); never overflows
  labelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    columnGap: 10,
    rowGap: 2,
  },
  labelAction: { marginLeft: 'auto', maxWidth: '100%', flexShrink: 1, alignItems: 'flex-end' },
  // the label the web shows (11px / 500, text-dim, 0.12em, line height 1.55 = 17)
  fieldLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 17,
    fontWeight: '500',
    letterSpacing: 1.32,
    color: colors.textDim,
  },
  req: { color: colors.accent, fontSize: 11 },
  control: { minWidth: 0 },
  helpText: {
    fontFamily: fonts.ui,
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.textFaint,
  },
  errorRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 5 },
  // centred on the 17 line
  errorIcon: { marginTop: 2.5 },
  errorText: {
    flexShrink: 1,
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
    backgroundColor: colors.field,
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
    // 16, as the web field; the 20 line keeps the box height
    fontSize: 16,
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
