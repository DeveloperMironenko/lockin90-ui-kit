import { useState } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { SearchInput } from './FormField';
import { ListRow } from './ListRow';
import { DotsLoader } from './DotsLoader';

export interface ComboboxOption {
  /** Stable identifier passed back to `onSelect`. */
  value: string;
  /** Primary line shown in the result row. */
  label: string;
  /** Optional dimmer second line under the label. */
  sublabel?: string;
}

export interface ComboboxProps {
  /** Current results to show (the consumer fetches/filters these). */
  options: ComboboxOption[];
  /** Fired as the user types — the consumer debounces/fetches and feeds `options`. */
  onSearch: (query: string) => void;
  /** Fired when a result row is chosen; the panel then closes. */
  onSelect: (option: ComboboxOption) => void;
  /** Placeholder copy for the search field. */
  placeholder?: string;
  /** Show a loading row while results fetch. */
  loading?: boolean;
  /** Shown when the query is non-empty, there are no options, and not loading. */
  emptyText?: string;
  /** Optional controlled query text. */
  value?: string;
  /** Extra style on the root wrapper. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Combobox — a search field (magnifier + clear) with an inline results panel
 * below it. Each result is a `ListRow` (label + optional sublabel); choosing
 * one calls `onSelect` and closes the panel. While `loading`, a `DotsLoader`
 * row shows; a non-empty query with zero options (and not loading) shows the
 * `emptyText` row. Manages its own query and open state, respecting a
 * controlled `value` when provided. Mirrors the web `@lockin90/ui` Combobox —
 * same name, props, and visual result list (rendered inline rather than in a
 * portaled dropdown).
 */
export function Combobox({
  options,
  onSearch,
  onSelect,
  placeholder = 'Search…',
  loading = false,
  emptyText = 'No results',
  value,
  style,
}: ComboboxProps) {
  const isControlled = value !== undefined;
  const [inner, setInner] = useState('');
  const query = isControlled ? value : inner;
  const [open, setOpen] = useState(false);

  function handleSearch(next: string) {
    if (!isControlled) setInner(next);
    setOpen(true);
    onSearch(next);
  }

  function choose(option: ComboboxOption) {
    onSelect(option);
    setOpen(false);
  }

  const trimmed = query.trim();
  const showEmpty = open && trimmed.length > 0 && !loading && options.length === 0;
  const showPanel = open && (loading || options.length > 0 || showEmpty);

  return (
    <View style={[styles.root, style]}>
      <SearchInput
        value={query}
        placeholder={placeholder}
        onChange={handleSearch}
        onClear={() => setOpen(false)}
        onFocus={() => {
          if (loading || options.length > 0) setOpen(true);
        }}
      />

      {showPanel ? (
        <View style={styles.panel}>
          {loading ? (
            <View style={styles.loading}>
              <DotsLoader size={6} />
            </View>
          ) : showEmpty ? (
            <Text style={styles.empty}>{emptyText}</Text>
          ) : (
            options.map((option, i) => (
              <ListRow
                key={option.value}
                title={option.label}
                subtitle={option.sublabel}
                onPress={() => choose(option)}
                divider={i > 0}
              />
            ))
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    minWidth: 0,
  },
  panel: {
    marginTop: 6,
    maxHeight: 280,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.border2,
    borderRadius: radii.md,
    backgroundColor: colors.bg1,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  empty: {
    paddingVertical: 16,
    paddingHorizontal: 14,
    textAlign: 'center',
    fontFamily: fonts.ui,
    fontSize: 13,
    color: colors.textFaint,
  },
});
