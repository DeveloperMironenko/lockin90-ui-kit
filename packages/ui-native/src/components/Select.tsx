import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, View, Text, Pressable, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { hapticSelection } from "../internal/optionalHaptics";
import { SearchInput } from './FormField';
import { useContrastColors } from '../internal/useHighContrast';
import { breakableWords, WordMeasurer } from '../internal/wordFit';
import { Sheet } from './Sheet';
import { sizedIcon } from '../internal/iconSlot';
import { optionMatches } from '../internal/selectMatch';

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
  /** the search field's clear button name, in the app's language (U4). @default 'Clear search' */
  clearLabel?: string;
  /** shown (and announced) when the search finds nothing, in the app's language (U5). @default 'No matches' */
  noMatchesLabel?: string;
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
   * Control size (CONVENTIONS "Control sizes"): `'md'` (default) the form field, 44 tall, value 16; `'sm'`
   * 36 tall with a 44 target, value 14 (a header's language picker, beside a `sm` ChoiceChip) — it hugs
   * its content instead of stretching. Both on the field fill with the control edge. Mirrors web.
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

/** Dark custom select (NOT a browser `<select>`). RN has no native `<select>`, so pressing the field opens
 *  the kit `Sheet` of option rows with a selected checkmark. Mirrors the web Select look + prop API. */
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
  clearLabel = 'Clear search',
  noMatchesLabel = 'No matches',
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
  // Increase Contrast steps the edge, placeholder and label up
  const c = useContrastColors();
  // A word of the value never breaks (CONVENTIONS "Accessibility"): its widest piece a line can't break
  // (`breakableWords`: a time zone breaks after its "/", as iOS and Android do) is measured on one
  // unconstrained line, and the select is at least that wide plus its chrome (padding, edge, icon,
  // chevron), never wider than the screen less its 16pt gutters. Words still wrap between them, so the
  // field grows taller. A parent's maxWidth narrower than that minimum is overflowed: the app's
  // maxWidth is for the default text size.
  const shownText = selected ? selected.label : (placeholder ?? '');
  const words = breakableWords(shownText);
  const { width: screenW } = useWindowDimensions();
  const [wordW, setWordW] = useState<{ text: string; w: number[] }>({ text: '', w: [] });
  const [leadW, setLeadW] = useState(0);
  const measuredWords = wordW.text === shownText ? wordW.w : [];
  const widest = measuredWords.length === words.length && words.length ? Math.max(...measuredWords) : 0;
  const chrome = isSm ? 12 + 10 + 2 + 6 + 14 : 12 + 11 + 2 + 8 + 16;
  const need = widest ? Math.ceil(widest) + 1 + chrome + (leading != null ? leadW + (isSm ? 6 : 8) : 0) : 0;
  const minWidth = need ? (screenW > 32 ? Math.min(screenW - 32, need) : need) : undefined;
  // also measured from refs in a layout effect: a tree mounted while hidden gets no `onLayout` on iOS
  // Fabric (SegmentedTabs has the same guard)
  const wordRefs = useRef<Record<string, Text | null>>({});
  const fieldRef = useRef<View>(null);
  const leadRef = useRef<View>(null);
  const hasLeading = leading != null;
  useLayoutEffect(() => {
    fieldRef.current?.measure?.((_x, _y, fw) => {
      if (!(fw > 0)) return;
      words.forEach((_, k) => wordRefs.current[String(k)]?.measure?.((_wx, _wy, w) => recordWord(k, w)));
      leadRef.current?.measure?.((_lx, _ly, lw) => setLeadW(lw));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- words follow shownText
  }, [shownText, hasLeading]);
  const recordWord = (k: number, w: number) =>
    setWordW((prev) => {
      const base = prev.text === shownText ? prev.w : [];
      if (base[k] === w) return prev;
      const next = base.slice();
      next[k] = w;
      return { text: shownText, w: next };
    });

  const shown = searchable && query.trim() ? options.filter((o) => optionMatches(o, query)) : options;
  // iOS has no live regions: "No matches" is announced when the search runs empty
  const empty = open && searchable && query.trim() !== '' && shown.length === 0;
  useEffect(() => {
    if (empty && Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(noMatchesLabel);
  }, [empty, noMatchesLabel]);

  function close() {
    setOpen(false);
    setQuery('');
  }
  function choose(v: string) {
    close();
    onChange?.(v);
  }

  return (
    <View ref={fieldRef} style={[styles.wrap, isSm && styles.wrapSm, minWidth != null && { minWidth }]}>
      {label ? <Text style={[styles.label, { color: c.textDim }]}>{label.toUpperCase()}</Text> : null}
      <Pressable
        style={[
          styles.field,
          isSm && styles.fieldSm,
          { borderColor: c.borderControl },
          invalid && styles.fieldInvalid,
          disabled && styles.fieldDisabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        accessibilityValue={selected ? { text: selected.label } : undefined}
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        // sm's 36pt box reaches the 44pt target
        hitSlop={isSm ? { top: 4, bottom: 4 } : undefined}
        onPress={() => { hapticSelection(); setOpen(true); }}
      >
        {leading != null ? (
          <View ref={leadRef} style={styles.leading} onLayout={(e) => setLeadW(e.nativeEvent.layout.width)}>
            {/* a field's icon: 16, faint (CONVENTIONS "Type"), unless the app sets its own */}
            {sizedIcon(leading, 16, colors.textFaint)}
          </View>
        ) : null}
        <Text
          // wraps between words to more lines (the field grows): never cut, never split (the minWidth above)
          style={[styles.value, isSm && styles.valueSm, !selected && { color: c.textFaint }]}
        >
          {selected ? selected.label : (placeholder ?? '')}
        </Text>
        <Chevron color={isSm ? colors.textFaint : colors.textDim} size={isSm ? 14 : 16} />
        <WordMeasurer
          testID="lk-select-measure"
          probes={words.map((w, k) => ({ id: String(k), text: w, style: [styles.value, styles.measureText, isSm && styles.valueSm] }))}
          record={(id, w) => recordWord(Number(id), w)}
          refs={wordRefs}
          keyPrefix={shownText}
        />
      </Pressable>

      {/* the kit Sheet (V9): the same panel, handle, title and close as every sheet; a searchable list is
          a fixed 80% tall with the search pinned above it */}
      <Sheet
        open={open}
        onClose={close}
        title={title}
        closeLabel={title ? closeLabel : undefined}
        height={searchable ? 'tall' : 'auto'}
        padded={false}
        subheader={
          searchable ? (
            /* the ONE search primitive (kit rule: never a bare TextInput where SearchInput exists),
               autofocused */
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder={searchPlaceholder}
              clearLabel={clearLabel}
              autoCorrect={false}
              autoCapitalize="none"
              autoFocus
              returnKeyType="search"
            />
          ) : undefined
        }
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
              <Text style={[styles.rowLabel, isSel && styles.rowLabelSel, opt.disabled && styles.rowLabelDisabled]}>
                {opt.label}
              </Text>
              {isSel ? <Check color={colors.accent2} /> : null}
            </Pressable>
          );
        })}
        {searchable && shown.length === 0 ? (
          // nothing matches: said (Android's live region; iOS announces it below)
          <Text style={styles.empty} accessibilityLiveRegion="polite">
            {noMatchesLabel}
          </Text>
        ) : null}
      </Sheet>
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
    // the one label style (CONVENTIONS "Type"): .14em
    letterSpacing: 1.54,
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
    backgroundColor: colors.field,
    // the web field's height (as Input): 9 + 14 × 1.4 + 9 + 2 borders = 39.6
    minHeight: 44, // a 44pt target, as the web field at phone width (CONVENTIONS "Accessibility")
    paddingVertical: 9,
    paddingLeft: 12,
    paddingRight: 11,
  },
  // sm (CONVENTIONS "Control sizes"): 36 tall (its target 44 by hitSlop), as web
  fieldSm: {
    minHeight: 36,
    gap: 6,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 10,
  },
  fieldInvalid: { borderColor: colors.zoneLow },
  fieldDisabled: { opacity: 0.55 },
  measureText: { flex: 0 },
  leading: { flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
  // the value takes the row and sits left after the icon, as on web; `sm` hugs its content, and in a
  // wider box (a row's controls one width, owner 2026-11-11) still sits left, the chevron at the end
  // a control's value: 16 at md, 14 at sm (CONVENTIONS "Type"), as web
  value: { flex: 1, fontFamily: fonts.ui, fontSize: 16, lineHeight: 20, color: colors.text },
  valueSm: { flex: 0, flexGrow: 1, flexShrink: 1, fontFamily: fonts.ui, fontSize: 14, lineHeight: 18 },
  // an option row: 44 at least (as web's options at phone width)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 44,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
  },
  rowPressed: { backgroundColor: colors.glass2 },
  rowLabel: { flexShrink: 1, fontFamily: fonts.ui, fontSize: 15, color: colors.textDim },
  rowLabelSel: { color: colors.accent2, fontWeight: '600' },
  rowLabelDisabled: { color: colors.textFaint, opacity: 0.6 },
  empty: { paddingVertical: 12, paddingHorizontal: 14, fontFamily: fonts.ui, fontSize: 13, lineHeight: 19.5, color: colors.textDim },
});
