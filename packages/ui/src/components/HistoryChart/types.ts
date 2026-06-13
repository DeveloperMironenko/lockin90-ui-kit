export interface HistoryChartProps {
  /** Series of points; each `v` is a 0–100 energy value, evenly spaced on x. */
  data: { v: number }[];
  width?: number;
  height?: number;
}
