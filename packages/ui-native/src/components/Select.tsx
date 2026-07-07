import { useState } from 'react';
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
}

const DEFAULT_OPTIONS: SelectOption[] = [
  { value: 'one', label: 'Option one' },
  { value: 'two', label: 'Option two' },
  { value: 'three', label: 'Option three' },
];

/** Down chevron matching the web glyph (`M6 9l6 6 6-6`). */
function Chevron({ color }: { color: string }) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
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
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = options.find((o) => o.value === value);

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
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label.toUpperCase()}</Text> : null}
      <Pressable
        style={[
          styles.field,
          invalid && styles.fieldInvalid,
          disabled && styles.fieldDisabled,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        onPress={() => setOpen(true)}
      >
        <Text style={[styles.value, !selected && styles.placeholder]} numberOfLines={1}>
          {selected ? selected.label : (placeholder ?? '')}
        </Text>
        <Chevron color={colors.textDim} />
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
                    accessibilityLabel="Close"
                    hitSlop={8}
                    onPress={close}
                    style={styles.closeBtn}
                  >
                    <CloseX color={colors.textDim} />
                  </Pressable>
                </View>
              ) : null}
              {searchable ? (
                <TextInput
                  style={styles.search}
                  value={query}
                  onChangeText={setQuery}
                  placeholder={searchPlaceholder}
                  placeholderTextColor={colors.textFaint}
                  autoCorrect={false}
                  autoCapitalize="none"
                  autoFocus
                  returnKeyType="search"
                />
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
  label: {
    fontFamily: fonts.ui,
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1.2,
    color: colors.textFaint,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.glass2,
    paddingVertical: 9,
    paddingLeft: 12,
    paddingRight: 11,
  },
  fieldInvalid: { borderColor: colors.zoneLow },
  fieldDisabled: { opacity: 0.55 },
  value: { flexShrink: 1, fontFamily: fonts.ui, fontSize: 14, color: colors.text },
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
  search: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.glass2,
    fontFamily: fonts.ui,
    fontSize: 15,
    color: colors.text,
  },
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
