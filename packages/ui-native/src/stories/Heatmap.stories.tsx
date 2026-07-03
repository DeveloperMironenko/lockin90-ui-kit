import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { colors } from '@lockin90/tokens';
import { Heatmap, type HeatmapCell } from '../components/Heatmap';

const meta = { title: 'Native/Heatmap' } satisfies Meta;
export default meta;

type Story = StoryObj;

/* ---- catalog data (deterministic, ported from charts/catalog.js) --------- */

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v: number) => Math.max(0.03, Math.min(0.97, v));

/** rows × cols values in 0..1, wave-ish per row (the catalog gridData). */
function gridCells(seed: number, rows: number, cols: number): HeatmapCell[] {
  const out: HeatmapCell[] = [];
  for (let r = 0; r < rows; r++) {
    const rnd = mulberry32(seed + r * 13);
    for (let c = 0; c < cols; c++) {
      const t = c / (cols - 1);
      out.push({ value: clamp(0.45 + Math.sin(t * Math.PI * 2 + r) * 0.25 + (rnd() - 0.5) * 0.4) });
    }
  }
  return out;
}

/** mark ~8% of slots missing (the catalog gap-aware stream, seed + 99). */
function withGaps(cells: HeatmapCell[], seed: number): HeatmapCell[] {
  const rnd = mulberry32(seed + 99);
  return cells.map((c) => (rnd() < 0.08 ? { value: 0, missing: true } : c));
}

/** add day-of-month labels (1…31) to a month grid. */
function withDayNums(cells: HeatmapCell[]): HeatmapCell[] {
  return cells.map((c, i) => (i < 31 ? { ...c, label: String(i + 1) } : c));
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const CORR = ['SLEEP', 'HRV', 'TRAIN', 'FOOD', 'MOOD'];

/** A 30-cell compliance strip: 1 = confirmed (mint), 0 = skipped (faint), a couple of skips. */
const STRIP_CELLS: HeatmapCell[] = Array.from({ length: 30 }, (_, i) => ({
  value: i === 3 || i === 12 ? 0 : 1,
}));

export const Default: Story = {
  render: () => (
    <View style={{ padding: 8 }}>
      <Heatmap />
    </View>
  ),
};

export const CalendarGrid: Story = {
  render: () => (
    <View style={{ padding: 8 }}>
      <Heatmap columns={7} cellSize={40} gap={8} />
    </View>
  ),
};

export const ContributionStrip: Story = {
  render: () => (
    <View style={{ width: 320, padding: 8 }}>
      <Text style={{ color: '#fff', marginBottom: 8 }}>30-day compliance</Text>
      <Heatmap
        variant="strip"
        columns={30}
        cellSize={22}
        gap={3}
        cells={STRIP_CELLS}
        colorFrom="#11151F"
        colorTo="#34F5C5"
      />
    </View>
  ),
};

export const ZoneScale: Story = {
  render: () => (
    <View style={{ width: 320, padding: 8 }}>
      <Heatmap
        variant="strip"
        columns={17}
        cellSize={30}
        gap={3}
        cells={Array.from({ length: 17 }, (_, i) => ({ value: i / 16 }))}
        colorScale={(v) =>
          v < 0.4
            ? `rgba(255,77,109,${0.45 + v})`
            : v < 0.7
              ? `rgba(255,176,32,${0.4 + v * 0.5})`
              : `rgba(52,245,197,${0.3 + v * 0.7})`
        }
      />
    </View>
  ),
};

/* ---- catalog reproductions (heatmap-charts HM-01…HM-15) ------------------ */

/** HM-01 heat-grid — 7×16 day cells · SELECT SCALE: zone / single-hue mint / spectrum. */
export const HM01HeatGrid: Story = {
  render: () => (
    <View style={{ padding: 8, gap: 20 }}>
      <Heatmap cells={gridCells(11, 7, 16)} columns={16} cellSize={14} gap={2.5} radius={3} scale="zone" rowLabels={DAYS} />
      <Heatmap cells={gridCells(11, 7, 16)} columns={16} cellSize={14} gap={2.5} radius={3} scale={colors.mint} rowLabels={DAYS} />
      <Heatmap cells={gridCells(11, 7, 16)} columns={16} cellSize={14} gap={2.5} radius={3} scale="spectrum" rowLabels={DAYS} />
    </View>
  ),
};

/** HM-03 streak-year — 30×7 micro cells (GitHub-style) · mint scale. */
export const HM03StreakYear: Story = {
  render: () => (
    <View style={{ padding: 8 }}>
      <Heatmap cells={gridCells(33, 7, 30)} columns={30} cellSize={8} gap={1.6} radius={1.5} scale={colors.mint} />
    </View>
  ),
};

/** HM-04 month-cal — 5×7 month grid · day numerals in-cell · weekday letters. */
export const HM04MonthCal: Story = {
  render: () => (
    <View style={{ padding: 8 }}>
      <Heatmap
        cells={withDayNums(gridCells(44, 5, 7))}
        columns={7}
        cellSize={30}
        gap={3}
        radius={4}
        scale={colors.mint}
        labelPosition="corner"
        dayLetters
      />
    </View>
  ),
};

/** HM-06 dot-matrix — circles sized AND opacified by value (double encoding). */
export const HM06DotMatrix: Story = {
  render: () => (
    <View style={{ padding: 8 }}>
      <Heatmap
        cells={gridCells(66, 7, 16)}
        columns={16}
        cellSize={14}
        gap={2.5}
        scale={colors.mint}
        dots
        rowLabels={DAYS}
      />
    </View>
  ),
};

/** HM-07 glass-grid — glass cells · mint border opacity carries the value. */
export const HM07GlassGrid: Story = {
  render: () => (
    <View style={{ padding: 8 }}>
      <Heatmap
        cells={gridCells(77, 7, 16)}
        columns={16}
        cellSize={14}
        gap={2.5}
        radius={3}
        scale={colors.mint}
        glass
        rowLabels={DAYS}
      />
    </View>
  ),
};

/** HM-08 gap-aware — missing slots render as dashed empty cells — never fake zeros. */
export const HM08GapAware: Story = {
  render: () => (
    <View style={{ padding: 8 }}>
      <Heatmap
        cells={withGaps(gridCells(88, 7, 16), 88)}
        columns={16}
        cellSize={14}
        gap={2.5}
        radius={3}
        scale={colors.mint}
        rowLabels={DAYS}
      />
    </View>
  ),
};

/** HM-09 hour-day — 24h × 7d · hour labels top · spectrum scale. */
export const HM09HourDay: Story = {
  render: () => (
    <View style={{ padding: 8 }}>
      <Heatmap
        cells={gridCells(91, 7, 24)}
        columns={24}
        cellSize={10}
        gap={1.8}
        radius={2}
        scale="spectrum"
        rowLabels={DAYS}
        colLabels={[
          { at: 0, label: '12A' },
          { at: 6, label: '6A' },
          { at: 12, label: '12P' },
          { at: 18, label: '6P' },
        ]}
      />
    </View>
  ),
};

/** HM-10 week-strips — five week rows × 7 day pills · rounded 6px. */
export const HM10WeekStrips: Story = {
  render: () => (
    <View style={{ padding: 8 }}>
      <Heatmap
        cells={gridCells(92, 5, 7)}
        columns={7}
        cellSize={26}
        gap={3}
        radius={6}
        scale={colors.mint}
        rowLabels={['W1', 'W2', 'W3', 'W4', 'W5']}
        dayLetters
      />
    </View>
  ),
};

/** HM-11 corr-matrix — 5×5 diverging matrix (mint + / coral −) · signed values in cells. */
export const HM11CorrMatrix: Story = {
  render: () => (
    <View style={{ padding: 8 }}>
      <Heatmap
        cells={gridCells(93, 5, 5)}
        columns={5}
        cellSize={34}
        gap={3}
        scale="diverge"
        showValues
        rowLabels={CORR}
        colLabels={[
          { at: 0, label: 'SLP' },
          { at: 1, label: 'HRV' },
          { at: 2, label: 'TRN' },
          { at: 3, label: 'FOOD' },
          { at: 4, label: 'MOOD' },
        ]}
      />
    </View>
  ),
};

/** HM-12 diverge-heat — above baseline mint / below coral, opacity = magnitude. */
export const HM12DivergeHeat: Story = {
  render: () => (
    <View style={{ padding: 8 }}>
      <Heatmap
        cells={gridCells(94, 7, 16)}
        columns={16}
        cellSize={14}
        gap={2.5}
        radius={3}
        scale="diverge"
        rowLabels={DAYS}
      />
    </View>
  ),
};

/** HM-13 focus-row — one row full strength · others dimmed to 22%. */
export const HM13FocusRow: Story = {
  render: () => (
    <View style={{ padding: 8 }}>
      <Heatmap
        cells={gridCells(95, 7, 16)}
        columns={16}
        cellSize={14}
        gap={2.5}
        radius={3}
        scale={colors.mint}
        focusRow={2}
        rowLabels={DAYS}
      />
    </View>
  ),
};

/** HM-14 value-cells — big cells with mono values inside (dark text on hot cells). */
export const HM14ValueCells: Story = {
  render: () => (
    <View style={{ padding: 8 }}>
      <Heatmap
        cells={gridCells(96, 4, 7)}
        columns={7}
        cellSize={34}
        gap={3}
        scale={colors.mint}
        showValues="pct"
        rowLabels={['SLEEP', 'ENERGY', 'FOCUS', 'MOOD']}
        dayLetters
      />
    </View>
  ),
};

/** HM-15 today-ring — month-cal + white ring around today + glow dot above. */
export const HM15TodayRing: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Heatmap
        cells={withDayNums(gridCells(97, 5, 7)).map((c, i) =>
          i === 2 * 7 + 3 ? { ...c, today: true } : c,
        )}
        columns={7}
        cellSize={30}
        gap={3}
        radius={4}
        scale={colors.mint}
        labelPosition="corner"
        dayLetters
        todayColor={colors.text}
        todayPulse
      />
    </View>
  ),
};
