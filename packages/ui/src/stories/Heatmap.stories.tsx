import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heatmap, type HeatmapCell } from '../components/Heatmap';

const meta = {
  title: 'Primitives/Heatmap',
  component: Heatmap,
} satisfies Meta<typeof Heatmap>;
export default meta;

/** A 30-cell compliance strip: 1 = confirmed (mint), 0 = skipped (faint), a couple of skips. */
const STRIP_CELLS: HeatmapCell[] = Array.from({ length: 30 }, (_, i) => ({
  value: i === 3 || i === 12 ? 0 : 1,
}));

/** Defaults: a calendar-week grid (7 cols), Jun 5 flagged low, Jun 11 = today. */
export const Default: StoryObj<typeof meta> = { args: {} };

/** Calendar grid sized like the design's month view (larger cells). */
export const CalendarGrid: StoryObj<typeof meta> = {
  args: { columns: 7, cellSize: 40, gap: 8, max: 1 },
};

/** 30-day contribution / compliance strip — wraps in a single dense row. */
export const ContributionStrip: StoryObj<typeof meta> = {
  args: {
    variant: 'strip',
    columns: 30,
    cellSize: 22,
    gap: 3,
    cells: STRIP_CELLS,
    colorFrom: 'rgba(255,255,255,0.05)',
    colorTo: '#34F5C5',
  },
};

/** Custom three-zone color scale (low → mid → high) via `colorScale`. */
export const ZoneScale: StoryObj<typeof meta> = {
  args: {
    variant: 'strip',
    columns: 17,
    cellSize: 30,
    gap: 3,
    cells: Array.from({ length: 17 }, (_, i) => ({ value: i / 16 })),
    colorScale: (v) =>
      v < 0.4
        ? `rgba(255,77,109,${0.45 + v})`
        : v < 0.7
          ? `rgba(255,176,32,${0.4 + v * 0.5})`
          : `rgba(52,245,197,${0.3 + v * 0.7})`,
  },
};
