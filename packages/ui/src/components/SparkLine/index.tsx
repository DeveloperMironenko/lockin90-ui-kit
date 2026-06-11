import { colors } from '@lockin90/tokens';
import type { SparkLineProps } from './types';

export default function SparkLine({
  values,
  width = 220,
  height = 60,
  color = colors.accent,
  className,
}: SparkLineProps) {
  if (values.length === 0) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const dx = width / Math.max(values.length - 1, 1);
  const path = values
    .map((v, i) => {
      const x = i * dx;
      const y = height - ((v - min) / range) * (height - 6) - 3;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
  const last = values[values.length - 1];
  const lastY = height - ((last - min) / range) * (height - 6) - 3;
  return (
    <svg width={width} height={height} className={className}>
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={width - 1} cy={lastY} r={2.5} fill={color} />
    </svg>
  );
}
