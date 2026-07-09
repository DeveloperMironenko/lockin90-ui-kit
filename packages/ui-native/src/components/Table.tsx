import { Fragment, useState, type ReactNode } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Checkbox } from './Checkbox';

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
  /** Show a leading checkbox column with a select-all header checkbox. */
  selectable?: boolean;
  /** Stable key per row used for selection. Defaults to the row index as a string. */
  rowKey?: (row: Record<string, ReactNode>, index: number) => string;
  /** Controlled set of selected row keys. */
  selectedKeys?: string[];
  /** Fired with the next set of selected row keys when selection changes. */
  onSelectionChange?: (keys: string[]) => void;
  /**
   * Per-row status tint. Return `'ok' | 'warn' | 'danger'` to give a row a subtle
   * left-border + gradient tint (mint / amber / rose), or `undefined` for none.
   * If omitted, the row's own `_tone` field is read as a fallback. Tints are purely
   * decorative and don't change layout.
   */
  rowTone?: (
    row: Record<string, ReactNode>,
    index: number,
  ) => 'ok' | 'warn' | 'danger' | undefined;
  /** Enable the expandable-detail-row affordance — adds a leading chevron column. */
  expandable?: boolean;
  /** Renders the full-width detail panel shown beneath an expanded row. */
  renderDetail?: (row: Record<string, ReactNode>, index: number) => ReactNode;
  /** Controlled set of expanded row keys (uses the same `rowKey` accessor). */
  expandedKeys?: (string | number)[];
  /** Fired with the next set of expanded row keys when an expand toggle changes. */
  onExpandedChange?: (keys: (string | number)[]) => void;
}

/** Per-tone rail + row wash colors (web `.lk-table-row-ok/-warn/-danger`): a 3px
 *  left accent bar plus a 6% status tint fading to transparent by 70% of the row. */
const ROW_TONE: Record<'ok' | 'warn' | 'danger', { rail: string; wash: string; washEnd: string }> = {
  ok: { rail: colors.zoneHigh, wash: 'rgba(52,245,197,0.06)', washEnd: 'rgba(52,245,197,0)' },
  warn: { rail: colors.zoneMid, wash: 'rgba(255,176,32,0.06)', washEnd: 'rgba(255,176,32,0)' },
  danger: { rail: colors.zoneLow, wash: 'rgba(255,77,109,0.06)', washEnd: 'rgba(255,77,109,0)' },
};

/** Chevron toggle for an expandable row — rotates down→up when its row is open.
 *  Mirrors the web glyph (`M6 9l6 6 6-6`) + `.lk-table-expand-open` rotation. */
function ExpandIcon({ open }: { open: boolean }) {
  return (
    <View style={open ? styles.expandIconOpen : undefined}>
      <Svg
        width={13}
        height={13}
        viewBox="0 0 24 24"
        fill="none"
        stroke={colors.textFaint}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M6 9l6 6 6-6" />
      </Svg>
    </View>
  );
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

/** Next expanded-keys list after toggling `key`: removed when present, appended
 *  when absent (set semantics — duplicates collapse, order of survivors kept).
 *  (Pure — extracted from the component so the bookkeeping is unit-testable.) */
export function toggleExpandKey(
  keys: Iterable<string | number>,
  key: string | number,
): (string | number)[] {
  const next = new Set(keys);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return [...next];
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
  selectable = false,
  rowKey = (_row, i) => String(i),
  selectedKeys,
  onSelectionChange,
  rowTone,
  expandable = false,
  renderDetail,
  expandedKeys,
  onExpandedChange,
}: TableProps) {
  const clickable = typeof onRowClick === 'function';

  // Expansion bookkeeping — controlled via `expandedKeys`/`onExpandedChange`, else
  // an internal set. Only meaningful when `expandable` is on. The chevron column is
  // added when `expandable` is set regardless of whether a `renderDetail` is given.
  const [internalExpanded, setInternalExpanded] = useState<(string | number)[]>([]);
  const expandedControlled = expandedKeys !== undefined;
  const expanded = new Set(expandedControlled ? expandedKeys : internalExpanded);

  const toggleExpanded = (key: string | number) => {
    const arr = toggleExpandKey(expanded, key);
    if (!expandedControlled) setInternalExpanded(arr);
    onExpandedChange?.(arr);
  };

  // Selection bookkeeping — only meaningful when `selectable` is on.
  const selected = new Set(selectedKeys ?? []);
  const allKeys = selectable ? rows.map((row, i) => rowKey(row, i)) : [];
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selected.has(k));
  const someSelected = allKeys.some((k) => selected.has(k));

  const toggleRow = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectionChange?.([...next]);
  };

  const toggleAll = () => {
    onSelectionChange?.(allSelected ? [] : allKeys);
  };

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
          {expandable && (
            // empty leading header cell over the chevron column (web th "Expand row")
            <View style={[dense ? styles.cellDense : styles.cell, styles.expandCell]} />
          )}
          {selectable && (
            <View style={[dense ? styles.cellDense : styles.cell, styles.selectCell]}>
              <Checkbox
                checked={allSelected}
                indeterminate={!allSelected && someSelected}
                onChange={toggleAll}
              />
            </View>
          )}
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
          const key = selectable ? rowKey(row, i) : undefined;
          const isSelected = key != null && selected.has(key);
          // Tone: explicit `rowTone` accessor wins, else the row's own `_tone` field.
          const tone =
            rowTone?.(row, i) ??
            (row._tone as 'ok' | 'warn' | 'danger' | undefined);
          const toneColors = tone ? ROW_TONE[tone] : undefined;
          // Expansion uses the same `rowKey` accessor so keys stay consistent with
          // selection; it's evaluated independently of `selectable`.
          const expandKey = expandable ? rowKey(row, i) : undefined;
          const isExpanded = expandKey != null && expanded.has(expandKey);
          const RowInner = (
            <View
              style={[
                styles.row,
                dense && styles.rowDense,
                last && styles.rowLast,
                isSelected && styles.rowSelected,
                isExpanded && styles.rowExpanded,
              ]}
            >
              {toneColors && (
                // Decorative status tint — a wash fading across the row + a 3px
                // left rail. Absolutely positioned so there's no layout shift and
                // the pressed glass still reads on top.
                <>
                  <LinearGradient
                    colors={[toneColors.wash, toneColors.washEnd] as [string, string]}
                    locations={[0, 0.7]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                    pointerEvents="none"
                  />
                  <View
                    style={[styles.toneRail, { backgroundColor: toneColors.rail }]}
                    pointerEvents="none"
                  />
                </>
              )}
              {expandable && (
                // Chevron is its own Pressable; pressing it captures the touch so
                // the outer row Pressable's onRowClick does NOT fire.
                <View style={[dense ? styles.cellDense : styles.cell, styles.expandCell]}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={isExpanded ? 'Collapse row' : 'Expand row'}
                    accessibilityState={{ expanded: isExpanded }}
                    onPress={() => toggleExpanded(expandKey!)}
                    hitSlop={6}
                    style={styles.expandBtn}
                  >
                    <ExpandIcon open={isExpanded} />
                  </Pressable>
                </View>
              )}
              {selectable && (
                // Checkbox is its own Pressable; pressing it captures the touch so the
                // outer row Pressable's onRowClick does NOT fire.
                <View style={[dense ? styles.cellDense : styles.cell, styles.selectCell]}>
                  <Checkbox checked={isSelected} onChange={() => toggleRow(key!)} />
                </View>
              )}
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

          return (
            <Fragment key={i}>
              {clickable ? (
                <Pressable
                  onPress={() => onRowClick!(row, i)}
                  style={({ pressed }) => (pressed ? styles.pressed : undefined)}
                >
                  {RowInner}
                </Pressable>
              ) : (
                <View>{RowInner}</View>
              )}
              {expandable && isExpanded && renderDetail && (
                // full-width detail panel beneath the expanded row — flush cell,
                // accent-tinted inner band (web `.lk-table-detail-row/-cell/-inner`)
                <View style={[styles.detail, last && styles.detailLast]}>
                  <View style={styles.detailInner}>{renderDetail(row, i)}</View>
                </View>
              )}
            </Fragment>
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
  // selected row keeps a faint persistent tint (distinct from the pressed glass)
  rowSelected: { backgroundColor: colors.glass },
  // the open parent row keeps a faint accent tint (matches the detail panel)
  rowExpanded: { backgroundColor: 'rgba(124,92,255,0.05)' },
  // the 3px status accent bar hugging a toned row's left edge
  toneRail: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 3 },
  // leading chevron column: narrow, content hugs, button centered
  expandCell: { width: 36, alignItems: 'center', justifyContent: 'center' },
  expandBtn: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.sm,
  },
  // chevron points down when collapsed, flips up when the row is open
  expandIconOpen: { transform: [{ rotate: '180deg' }] },
  // detail panel: flush hairline-bordered cell + accent-tinted padded inner band
  detail: { borderBottomWidth: 1, borderBottomColor: colors.border },
  detailLast: { borderBottomWidth: 0 },
  detailInner: {
    padding: 16,
    backgroundColor: 'rgba(124,92,255,0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(124,92,255,0.18)',
  },
  // leading checkbox column: narrow, content hugs, box centered
  selectCell: { width: 44, alignItems: 'center', justifyContent: 'center' },
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
