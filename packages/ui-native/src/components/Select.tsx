import { useState, type ReactNode } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { hapticSelection } from "../internal/optionalHaptics";
import { SearchInput } from './FormField';

/** A single option in a {@link Select}. */
export interface SelectOption {
  value: string;
  label: string;
  /** render the option dimmed and unselectable */
  disabled?: boolean;
}

export interface SelectProps {
  /** options to render; defaults to a few sample options */
  options?: SelectOption[];
  /** controlled selected value */
  value?: string;
  /** fired with the newly selected value */
  onChange?: (value: string) => void;
  /** placeholder rendered when no value is selected */
  placeholder?: string;
  /** small mono uppercase label rendered above the field */
  label?: string;
  /** red border to signal an invalid value */
  invalid?: boolean;
  /** disable the field */
  disabled?: boolean;
  /** show a search field in the option sheet to filter a long list (by label). */
  searchable?: boolean;
  /** placeholder for the search field (pass a localized string). @default 'Search…' */
  searchPlaceholder?: string;
  /** title shown at the top of the option sheet (with a close button). */
  title?: string;
  /** accessibility label of the sheet's close button (pass a localized string). @default 'Close' */
  closeLabel?: string;
  /** the field's name for screen readers when there is no visible `label`
   *  (falls back to `label`). Mirrors web `aria-label`. */
  accessibilityLabel?: string;
  /** read after the name (a `FormField` passes its error or help here). */
  accessibilityHint?: string;
  /**
   * Field scale. `'md'` (default) is the standard form field. `'sm'` is the
   * design settings compact glass pill (`.pref-select`): mono 11px value,
   * `--glass-2` fill, `--border` hairline, r10, padding 6×9, 13px chevron —
   * hugs its content instead of stretching. Mirrors web `size="sm"`.
   */
  size?: 'md' | 'sm';
  /**
   * Optional leading icon rendered inside the field before the value
   * (design `.lang-wrap` globe on the language select). Mirrors web `leading`.
   */
  leading?: ReactNode;
}

const DEFAULT_OPTIONS: SelectOption[] = [
  { value: 'one', label: 'Option one' },
  { value: 'two', label: 'Option two' },
  { value: 'three', label: 'Option three' },
];

/** Down chevron matching the web glyph (`M6 9l6 6 6-6`). */
function Chevron({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={size < 16 ? 1.8 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

/** Checkmark shown on the selected option row (mirrors the web Select). */
function Check({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 13l4 4L19 7" />
    </Svg>
  );
}

/** Close glyph for the sheet header. */
function CloseX({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 6 6 18M6 6l12 12" />
    </Svg>
  );
}

/** Dark glassy custom select (NOT a browser `<select>`). RN has no native
 *  `<select>`, so pressing the field opens a bottom-sheet Modal of styled options
 *  with a selected checkmark. Mirrors the web Select look + prop API. */
export function Select({
  options = DEFAULT_OPTIONS,
  value,
  onChange,
  placeholder,
  label,
  invalid = false,
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Search…',
  title,
  closeLabel = 'Close',
  accessibilityLabel,
  accessibilityHint,
  size = 'md',
  leading,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = options.find((o) => o.value === value);
  const isSm = size === 'sm';

  const shown =
    searchable && query.trim()
      ? options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()))
      : options;

  function close() {
    setOpen(false);
    setQuery('');
  }
  function choose(v: string) {
    close();
    onChange?.(v);
  }

  return (
    <View style={[styles.wrap, isSm && styles.wrapSm]}>
      {label ? <Text style={styles.label}>{label.toUpperCase()}</Text> : null}
      <Pressable
        style={[
          styles.field,
          isSm && styles.fieldSm,
          invalid && styles.fieldInvalid,
          disabled && styles.fieldDisabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        accessibilityValue={selected ? { text: selected.label } : undefined}
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        // sm is 6 + 13 + 6 + 2 = 27 tall, md 39.6: the slop reaches the 44pt touch target, same look
        hitSlop={isSm ? { top: 9, bottom: 9, left: 4, right: 4 } : { top: 3, bottom: 3 }}
        onPress={() => { hapticSelection(); setOpen(true); }}
      >
        {leading != null ? <View style={styles.leading}>{leading}</View> : null}
        <Text
          style={[styles.value, isSm && styles.valueSm, !selected && styles.placeholder]}
          numberOfLines={1}
        >
          {selected ? selected.label : (placeholder ?? '')}
        </Text>
        <Chevron color={isSm ? colors.textFaint : colors.textDim} size={isSm ? 13 : 16} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <View style={styles.backdrop}>
          <Pressable style={styles.dismissArea} onPress={close} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[styles.sheet, searchable ? styles.sheetTall : styles.sheetAuto]}
          >
            <View style={styles.handle} />
              {title ? (
                <View style={styles.header}>
                  <Text style={styles.title}>{title.toUpperCase()}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={closeLabel}
                    hitSlop={8}
                    onPress={close}
                    style={styles.closeBtn}
                  >
                    <CloseX color={colors.textDim} />
                  </Pressable>
                </View>
              ) : null}
              {searchable ? (
                /* the ONE search primitive (kit rule: never a bare TextInput where
                   SearchInput exists) — sm shape to sit among fields, autofocused */
                <View style={styles.searchWrap}>
                  <SearchInput
                    shape="sm"
                    value={query}
                    onChange={setQuery}
                    placeholder={searchPlaceholder}
                    autoCorrect={false}
                    autoCapitalize="none"
                    autoFocus
                    returnKeyType="search"
                  />
                </View>
              ) : null}
              <ScrollView
                style={searchable ? styles.scrollFill : styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator
                keyboardShouldPersistTaps="handled"
                bounces={false}
              >
                {shown.map((opt) => {
                  const isSel = opt.value === value;
                  return (
                  <Pressable
                    key={opt.value}
                    style={({ pressed }) => [styles.row, pressed && !opt.disabled && styles.rowPressed]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSel, disabled: opt.disabled }}
                    disabled={opt.disabled}
                    onPress={() => choose(opt.value)}
                  >
                    <Text
                      style={[styles.rowLabel, isSel && styles.rowLabelSel, opt.disabled && styles.rowLabelDisabled]}
                      numberOfLines={1}
                    >
                      {opt.label}
                    </Text>
                    {isSel ? <Check color={colors.accent} /> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'column', gap: 6, alignSelf: 'stretch' },
  // sm hugs its content instead of stretching (design `.pref-select` pill)
  wrapSm: { alignSelf: 'auto' },
  // the same caption as FormField's label (11px / 500, text-dim, line height 17), as the web shows
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 17,
    fontWeight: '500',
    letterSpacing: 1.32,
    color: colors.textDim,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderRadius: radii.sm,
    borderWidth: 1,
    // a field's edge at 3:1 on the card (CONVENTIONS "Accessibility")
    borderColor: colors.borderControl,
    backgroundColor: colors.glass2,
    // the web field's height (as Input): 9 + 14 × 1.4 + 9 + 2 borders = 39.6
    minHeight: 39.6,
    paddingVertical: 9,
    paddingLeft: 12,
    paddingRight: 11,
  },
  // sm — design settings `.pref-select`: mono glass pill, `--border` hairline,
  // r10, padding 6×9 (lead icon → text gap 5, mock `.lang-wrap` geometry)
  fieldSm: {
    minHeight: 0,
    gap: 5,
    paddingVertical: 6,
    paddingLeft: 9,
    paddingRight: 8,
  },
  fieldInvalid: { borderColor: colors.zoneLow },
  fieldDisabled: { opacity: 0.55 },
  leading: { flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
  // the value takes the row and sits left after the icon, as on web; `sm` hugs its content
  value: { flex: 1, fontFamily: fonts.ui, fontSize: 14, color: colors.text },
  valueSm: { flex: 0, flexShrink: 1, fontFamily: fonts.mono, fontSize: 11 },
  placeholder: { color: colors.textFaint },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  dismissArea: { flex: 1 },
  sheet: {
    backgroundColor: colors.bg1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingTop: 8,
  },
  // Searchable (long) lists: fixed ~90% tall sheet, matching the edit sheets, list scrolls.
  sheetTall: { height: '80%' },
  // Short lists: size to content, cap so it never overflows.
  sheetAuto: { maxHeight: '80%' },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 99,
    backgroundColor: colors.border2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.textFaint,
  },
  closeBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  searchWrap: { marginHorizontal: 16, marginTop: 12 },
  scroll: { flexGrow: 0 },
  scrollFill: { flex: 1 },
  scrollContent: { paddingTop: 4, paddingBottom: 28 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowPressed: { backgroundColor: colors.glass2 },
  rowLabel: { flexShrink: 1, fontFamily: fonts.ui, fontSize: 15, color: colors.textDim },
  rowLabelSel: { color: colors.accent, fontWeight: '600' },
  rowLabelDisabled: { color: colors.textFaint, opacity: 0.6 },
});
