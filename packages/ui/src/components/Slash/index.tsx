import type { SlashProps } from './types';

export default function Slash({
  width = 80,
  thickness = 3,
  angle = -8,
  margin = '8px 0',
}: SlashProps) {
  return (
    <div className="relative overflow-visible" style={{ width, height: 4, margin }}>
      <div
        className="absolute inset-x-0 top-1/2 bg-accent origin-left"
        style={{ height: thickness, transform: `translateY(-50%) rotate(${angle}deg)` }}
      />
    </div>
  );
}
