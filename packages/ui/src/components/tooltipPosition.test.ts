import { describe, it, expect } from 'vitest';
import { computeTooltipPosition, type Rect } from './tooltipPosition';

const VW = 1000;
const VH = 800;

describe('computeTooltipPosition', () => {
  it('keeps the preferred side when there is room', () => {
    const trigger: Rect = { top: 400, left: 480, width: 40, height: 20 }; // center (500,410)
    const r = computeTooltipPosition(trigger, 120, 40, 'top', VW, VH);
    expect(r.placement).toBe('top');
    expect(r.top).toBe(400 - 8 - 40); // above the trigger
    expect(r.left).toBe(440); // centered: 500 - 60
    expect(r.arrow).toBe(60); // arrow at the trigger center within the bubble
  });

  it('flips top → bottom when there is no room above', () => {
    const trigger: Rect = { top: 4, left: 480, width: 40, height: 20 }; // hugging the top edge
    const r = computeTooltipPosition(trigger, 120, 40, 'top', VW, VH);
    expect(r.placement).toBe('bottom');
    expect(r.top).toBe(4 + 20 + 8); // below the trigger
  });

  it('flips left → right when there is no room on the left', () => {
    const trigger: Rect = { top: 400, left: 6, width: 40, height: 20 };
    const r = computeTooltipPosition(trigger, 120, 40, 'left', VW, VH);
    expect(r.placement).toBe('right');
    expect(r.left).toBe(6 + 40 + 8); // to the right of the trigger
  });

  it('keeps "top" but shifts the bubble in from the right edge, arrow still tracking the trigger', () => {
    const trigger: Rect = { top: 400, left: 920, width: 40, height: 20 }; // center x = 940
    const r = computeTooltipPosition(trigger, 200, 40, 'top', VW, VH);
    expect(r.placement).toBe('top'); // does NOT needlessly flip
    expect(r.left + 200).toBeLessThanOrEqual(VW - 8 + 0.01); // shifted fully on-screen
    expect(r.left + r.arrow).toBeCloseTo(940, 0); // arrow points at the trigger center
  });

  it('clamps the arrow so it never leaves the bubble under extreme shift', () => {
    const trigger: Rect = { top: 400, left: 994, width: 4, height: 20 };
    const r = computeTooltipPosition(trigger, 120, 40, 'top', VW, VH);
    expect(r.arrow).toBeGreaterThanOrEqual(12);
    expect(r.arrow).toBeLessThanOrEqual(120 - 12);
  });
});
