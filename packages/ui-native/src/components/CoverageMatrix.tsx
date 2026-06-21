import { View, Text, StyleSheet, ScrollView, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

/** State of a single source × metric cell:
 *  - `on`  — source is the primary provider for that metric (filled check)
 *  - `alt` — source can provide it as a secondary / fallback (ring)
 *  - `off` / `' '` — source does not provide that metric (dash) */
export type CoverageCell = 'on' | 'alt' | 'off' | ' ';

export interface CoverageMatrixProps {
  /** card title */
  title?: string;
  /** mono summary line; defaults to "<sources> sources · <metrics> metrics" */
  subtitle?: string;
  /** row labels — the integration sources */
  sources?: string[];
  /** column labels — the metrics */
  metrics?: string[];
  /**
   * Coverage states as a grid, one row per source, one entry per metric.
   * Missing rows/cells fall back to `off`. `' '` is treated as `off`.
   */
  cells?: CoverageCell[][];
  /** show the Primary / Secondary / Not-provided legend */
  legend?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Faithful reproduction of the design's "Data coverage" example. */
const DEFAULT_SOURCES = ['Oura', 'WHOOP', 'Apple Health', 'Manual'];
const DEFAULT_METRICS = ['Sleep', 'HRV', 'Steps', 'Workouts', 'Heart', 'Temp'];
const DEFAULT_CELLS: CoverageCell[][] = [
  ['on', 'on', 'off', 'off', 'alt', 'on'], // Oura
  ['alt', 'on', 'off', 'on', 'on', 'off'], // WHOOP
  ['off', 'off', 'on', 'alt', 'alt', 'off'], // Apple Health
  ['off', 'off', 'alt', 'alt', 'off', 'off'], // Manual
];

/** width of the fixed source-label column */
const SRC_COL = 120;
/** width of each metric column */
const METRIC_COL = 56;

/** normalize a possibly-missing cell to a concrete state */
function cellAt(cells: CoverageCell[][], row: number, col: number): Exclude<CoverageCell, ' '> {
  const v = cells[row]?.[col];
  if (v === 'on' || v === 'alt') return v;
  return 'off';
}

/** A single coverage dot — filled check (on), ring (alt) or dash (off). */
function CoverageDot({ state }: { state: Exclude<CoverageCell, ' '> }) {
  if (state === 'on') {
    return (
      <View style={[styles.dot, styles.dotOn]} accessibilityRole="image" accessibilityLabel="Primary">
        <Svg viewBox="0 0 12 12" width={7} height={7}>
          <Path d="M2 6.5L5 9.5L10 3" stroke="#061b14" strokeWidth={3} fill="none" />
        </Svg>
      </View>
    );
  }
  if (state === 'alt') {
    return <View style={[styles.dot, styles.dotAlt]} accessibilityRole="image" accessibilityLabel="Secondary" />;
  }
  return <View style={styles.dotOff} accessibilityRole="image" accessibilityLabel="Not provided" />;
}

/** Coverage matrix — a sources × metrics grid showing which integration source
 *  provides which metric, with on / alternate / off cell states and a legend.
 *  Same prop API as the web component; the grid scrolls horizontally when wide. */
export function CoverageMatrix({
  title = 'Data coverage',
  subtitle,
  sources = DEFAULT_SOURCES,
  metrics = DEFAULT_METRICS,
  cells = DEFAULT_CELLS,
  legend = true,
  style,
}: CoverageMatrixProps) {
  const sub = subtitle ?? `${sources.length} sources · ${metrics.length} metrics`;

  return (
    <View style={[styles.cov, style]}>
      {/* header */}
      <View style={styles.head}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>

      {/* grid (horizontally scrollable) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollInner}>
        <View>
          {/* column header row */}
          <View style={styles.row}>
            <View style={[styles.srcCol, styles.headerCellLeft]}>
              <Text style={styles.colHead}>Source</Text>
            </View>
            {metrics.map((m) => (
              <View key={m} style={[styles.metricCol, styles.headerCell]}>
                <Text style={styles.colHead} numberOfLines={1}>
                  {m}
                </Text>
              </View>
            ))}
          </View>

          {/* one row per source */}
          {sources.map((source, row) => (
            <View key={source} style={[styles.row, styles.bodyRow]}>
              <View style={[styles.srcCol, styles.bodyCellLeft]}>
                <View style={styles.srcLabel}>
                  <View style={styles.mk} />
                  <Text style={styles.srcText} numberOfLines={1}>
                    {source}
                  </Text>
                </View>
              </View>
              {metrics.map((m, col) => (
                <View key={m} style={[styles.metricCol, styles.bodyCell]}>
                  <CoverageDot state={cellAt(cells, row, col)} />
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* legend */}
      {legend && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <CoverageDot state="on" />
            <Text style={styles.legendText}>Primary</Text>
          </View>
          <View style={styles.legendItem}>
            <CoverageDot state="alt" />
            <Text style={styles.legendText}>Secondary</Text>
          </View>
          <View style={styles.legendItem}>
            <CoverageDot state="off" />
            <Text style={styles.legendText}>Not provided</Text>
          </View>
        </View>
      )}
    </View>
  );
}

export type { CoverageCell as CoverageMatrixCell };

const styles = StyleSheet.create({
  cov: {
    flexDirection: 'column',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 22,
  },

  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 16 },
  title: { fontFamily: fonts.display, fontSize: 15, fontWeight: '600', color: colors.text },
  sub: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', color: colors.textFaint },

  scrollInner: { flexGrow: 1 },

  row: { flexDirection: 'row', alignItems: 'center' },
  bodyRow: { borderTopWidth: 1, borderTopColor: colors.border },

  srcCol: { width: SRC_COL, paddingRight: 14 },
  metricCol: { width: METRIC_COL, alignItems: 'center', justifyContent: 'center' },

  headerCell: { paddingBottom: 10, alignItems: 'center' },
  headerCellLeft: { paddingBottom: 10, paddingLeft: 4 },
  bodyCell: { paddingVertical: 9 },
  bodyCellLeft: { paddingVertical: 9, paddingLeft: 4 },

  colHead: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    textTransform: 'uppercase',
    letterSpacing: 0.76,
    color: colors.textFaint,
    fontWeight: '500',
  },

  srcLabel: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mk: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  srcText: { fontFamily: fonts.ui, fontSize: 13, fontWeight: '600', color: colors.text },

  // dots
  dot: { width: 13, height: 13, borderRadius: 6.5, alignItems: 'center', justifyContent: 'center' },
  dotOn: {
    backgroundColor: colors.zoneHigh,
    shadowColor: colors.zoneHigh,
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 3,
  },
  dotAlt: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.accent2,
    shadowColor: colors.accent2,
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 2,
  },
  dotOff: { width: 11, height: 1.5, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.18)' },

  // legend
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 18, marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legendText: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textDim },
});
