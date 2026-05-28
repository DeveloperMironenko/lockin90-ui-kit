export const ZONE_COLORS: Record<string, string> = {
  green: '#22C55E',
  amber: '#F59E0B',
  red:   '#FF1F1F',
  gray:  '#555555',
};

export const HOUR_LABELS = ['6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p', '10p'];

export function getZone(v: number, i: number): string {
  if (i >= 14 && i <= 16) return 'red';
  if (i >= 22 && i <= 24) return 'red';
  if (i >= 4 && i <= 6) return 'amber';
  if (v >= 67) return 'green';
  if (v >= 34) return 'amber';
  return 'gray';
}

export function buildCurvePath(
  points: { x: number; y: number }[],
): string {
  let p = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const cx = (prev.x + cur.x) / 2;
    p += ` Q ${prev.x} ${prev.y}, ${cx} ${(prev.y + cur.y) / 2}`;
    p += ` T ${cur.x} ${cur.y}`;
  }
  return p;
}
