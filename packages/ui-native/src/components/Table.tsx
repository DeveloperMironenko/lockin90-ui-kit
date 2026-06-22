import { type ReactNode } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

export interface TableColumn {
  /** Key looked up on each row to read the cell value. */
  key: string;
  /** Column header label (rendered mono uppercase). */
  header: string;
  /** Horizontal alignment for the header + cells. Default 'left'. */
  align?: 'left' | 'right' | 'center';
  /** Optional fixed column width (number of px). */
  width?: number;
  /** Render this column's cells in the mono font with tabular numerals. */
  mono?: boolean;
  /** Make this header pressable to sort by `key`. Pair with the Table sort props. */
  sortable?: boolean;
}

export interface TableProps {
  /** Column definitions. Defaults to a small billing sample. */
  columns?: TableColumn[];
  /** Row data — each cell value is read as `row[col.key]`. Defaults to a sample. */
  rows?: Record<string, ReactNode>[];
  /** Fired when a body row is pressed. */
  onRowClick?: (row: Record<string, ReactNode>, index: number) => void;
  /** Tighter vertical padding for data-dense admin tables. */
  dense?: boolean;
  /** Key of the currently-sorted column — that header brightens + shows its direction. */
  sortKey?: string;
  /** Sort direction of the active column. Default 'asc'. */
  sortDir?: 'asc' | 'desc';
  /** Fired with a sortable column's `key` when its header is pressed. */
  onSort?: (key: string) => void;
}

/** Sort indicator glyph next to a sortable header: a neutral up/down chevron pair
 *  (↕) when the column isn't the active sort, a single up/down chevron when it is.
 *  Mirrors the web glyph (`M7 10l5-5 5 5` up / `M7 14l5 5 5-5` down). */
function SortIcon({ state }: { state: 'none' | 'asc' | 'desc' }) {
  return (
    <Svg
      width={11}
      height={11}
      viewBox="0 0 24 24"
      fill="none"
      stroke={state === 'none' ? colors.textFaint : colors.accent}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {state !== 'desc' && <Path d="M7 10l5-5 5 5" />}
      {state !== 'asc' && <Path d="M7 14l5 5 5-5" />}
    </Svg>
  );
}

const DEFAULT_COLUMNS: TableColumn[] = [
  { key: 'name', header: 'User' },
  { key: 'plan', header: 'Plan' },
  { key: 'mrr', header: 'MRR', align: 'right', mono: true },
  { key: 'status', header: 'Status' },
];

const DEFAULT_ROWS: Record<string, ReactNode>[] = [
  { name: 'Ava Mitchell', plan: 'Pro', mrr: '$29.00', status: 'Active' },
  { name: 'Liam Carter', plan: 'Team', mrr: '$99.00', status: 'Active' },
  { name: 'Noah Bennett', plan: 'Pro', mrr: '$29.00', status: 'Trialing' },
  { name: 'Emma Reyes', plan: 'Free', mrr: '$0.00', status: 'Churned' },
];

const alignSelf = (a: TableColumn['align']) =>
  a === 'right' ? 'flex-end' : a === 'center' ? 'center' : 'flex-start';
const textAlign = (a: TableColumn['align']) => a ?? 'left';

/** Glass data table — RN has no `<table>`, so it's built with Views: a
 *  mono-uppercase faint header row, then a Pressable hairline-bordered row per
 *  datum, cells flexing by column with align + mono support and an opt-in dense
 *  mode. Wrapped in a horizontal ScrollView for overflow. The base admin atom. */
export function Table({
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  onRowClick,
  dense,
  sortKey,
  sortDir = 'asc',
  onSort,
}: TableProps) {
  const clickable = typeof onRowClick === 'function';

  const cellBox = (col: TableColumn) => [
    dense ? styles.cellDense : styles.cell,
    col.width != null
      ? { width: col.width, alignItems: alignSelf(col.align) as 'flex-start' }
      : { flex: 1, alignItems: alignSelf(col.align) as 'flex-start' },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.table}>
        {/* header */}
        <View style={[styles.head, dense && styles.headDense]}>
          {columns.map((col) => {
            const isActive = sortKey === col.key;
            const sortable = Boolean(col.sortable) && typeof onSort === 'function';
            const label = (
              <Text
                style={[styles.th, isActive && styles.thActive, { textAlign: textAlign(col.align) }]}
                numberOfLines={1}
              >
                {col.header.toUpperCase()}
              </Text>
            );

            if (!sortable) {
              return (
                <View key={col.key} style={cellBox(col)}>
                  {label}
                </View>
              );
            }

            return (
              <View key={col.key} style={cellBox(col)}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => onSort!(col.key)}
                  style={[
                    styles.sortHead,
                    col.align === 'right' && styles.sortHeadReverse,
                  ]}
                >
                  {label}
                  <SortIcon state={isActive ? sortDir : 'none'} />
                </Pressable>
              </View>
            );
          })}
        </View>

        {/* body */}
        {rows.map((row, i) => {
          const last = i === rows.length - 1;
          const RowInner = (
            <View style={[styles.row, dense && styles.rowDense, last && styles.rowLast]}>
              {columns.map((col) => (
                <View key={col.key} style={cellBox(col)}>
                  <Text
                    style={[
                      styles.td,
                      dense && styles.tdDense,
                      col.mono && styles.tdMono,
                      { textAlign: textAlign(col.align) },
                    ]}
                    numberOfLines={1}
                  >
                    {row[col.key]}
                  </Text>
                </View>
              ))}
            </View>
          );

          return clickable ? (
            <Pressable
              key={i}
              onPress={() => onRowClick!(row, i)}
              style={({ pressed }) => (pressed ? styles.pressed : undefined)}
            >
              {RowInner}
            </Pressable>
          ) : (
            <View key={i}>{RowInner}</View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  table: { minWidth: '100%' },
  head: {
    flexDirection: 'row',
    backgroundColor: colors.glass2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headDense: {},
  // Per-cell padding so text isn't cramped against the cell edge; header and
  // data cells share the same horizontal padding so columns line up (web: th 9/12, td 10/12).
  cell: { paddingVertical: 10, paddingHorizontal: 12 },
  cellDense: { paddingVertical: 8, paddingHorizontal: 10 },
  th: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1.2,
    color: colors.textFaint,
  },
  // active sorted header brightens to match web (.lk-table-th-active)
  thActive: { color: colors.text },
  // sortable header: label + chevron on one pressable line; reversed for right-aligned cols
  sortHead: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sortHeadReverse: { flexDirection: 'row-reverse' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowDense: {},
  rowLast: { borderBottomWidth: 0 },
  pressed: { backgroundColor: colors.glass },
  td: {
    fontFamily: fonts.ui,
    fontSize: 13,
    color: colors.textDim,
  },
  tdDense: { fontSize: 12.5 },
  tdMono: {
    fontFamily: fonts.mono,
    fontVariant: ['tabular-nums'],
    color: colors.text,
  },
});
