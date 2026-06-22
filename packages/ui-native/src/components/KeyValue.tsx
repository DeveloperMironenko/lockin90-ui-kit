import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';

/** A single label↔value row in a {@link KeyValue} list. */
export interface KeyValueRow {
  key: string;
  value: ReactNode;
}

export interface KeyValueProps extends ViewProps {
  /** The rows to render. Defaults to a few sample rows. */
  rows?: KeyValueRow[];
  /** 'spread' = key left / value right (default); 'inline' = key then value with a small gap. */
  align?: 'spread' | 'inline';
}

const DEFAULT_ROWS: KeyValueRow[] = [
  { key: 'Plan', value: 'Pro' },
  { key: 'MRR', value: '$29.00' },
  { key: 'Member since', value: 'Jan 2026' },
];

/** Definition list of key↔value rows — used in detail panels & settings.
 *  spread = key (mono faint) left / value right with hairline borders between
 *  rows; inline = key then value side by side with a small gap. */
export function KeyValue({ rows = DEFAULT_ROWS, align = 'spread', style, ...rest }: KeyValueProps) {
  const spread = align === 'spread';
  const last = rows.length - 1;
  return (
    <View style={[styles.list, style]} {...rest}>
      {rows.map((row, i) => (
        <View
          key={`${row.key}-${i}`}
          style={[
            spread ? styles.rowSpread : styles.rowInline,
            spread && i === 0 && styles.rowSpreadFirst,
            spread && i !== last && styles.rowSpreadBorder,
          ]}
        >
          <Text style={styles.key}>{row.key}</Text>
          {typeof row.value === 'string' || typeof row.value === 'number' ? (
            <Text style={[styles.val, spread && styles.valSpread]}>{row.value}</Text>
          ) : (
            <View style={spread && styles.valSpread}>{row.value}</View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { flexDirection: 'column' },
  rowSpread: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 9,
  },
  rowSpreadFirst: { paddingTop: 0 },
  rowSpreadBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowInline: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    paddingVertical: 3,
  },
  key: {
    fontFamily: fonts.mono,
    fontSize: 11.5,
    fontWeight: '500',
    letterSpacing: 0.46,
    color: colors.textFaint,
  },
  val: {
    fontFamily: fonts.ui,
    fontSize: 13,
    color: colors.text,
  },
  valSpread: { flexShrink: 1, textAlign: 'right' },
});
