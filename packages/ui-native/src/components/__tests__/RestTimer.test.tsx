/* RestTimer (native) — m:ss formatting, remaining-fraction clamp, the mint
   arc dashoffset, the paused dim, and the Skip / sublabel / trailing slots.
   Mirrors the web twin's contract (same geometry: r=50 → C ≈ 314.16). */
import { createElement } from 'react';
import { Text } from 'react-native';
import { describe, expect, test } from 'vitest';
import { RestTimer, formatRestTime, restFraction } from '../RestTimer';
import { findByText, hasDeclaration, parse, render } from './markup';

describe('formatRestTime', () => {
  test('formats m:ss with zero-padded seconds (clamped at 0)', () => {
    expect(formatRestTime(95)).toBe('1:35');
    expect(formatRestTime(60)).toBe('1:00');
    expect(formatRestTime(9)).toBe('0:09');
    expect(formatRestTime(-5)).toBe('0:00');
  });
});

describe('restFraction', () => {
  test('clamps to 0–1 and guards totalSec ≤ 0', () => {
    expect(restFraction(45, 90)).toBe(0.5);
    expect(restFraction(120, 90)).toBe(1);
    expect(restFraction(-3, 90)).toBe(0);
    expect(restFraction(30, 0)).toBe(0);
  });
});

describe('RestTimer', () => {
  test('renders the centered mono time + label and a half-drained arc', () => {
    const html = render(RestTimer, { remainingSec: 45, totalSec: 90 });
    const root = parse(html);
    expect(findByText(root, '0:45')).toBeDefined();
    expect(findByText(root, 'REST')).toBeDefined(); // default label, uppercased
    // C = 2π·50 ≈ 314.16 → offset at 50% ≈ 157.08
    expect(html).toContain('157.07'); // dashoffset (float serialization tolerant)
  });

  test('renders sublabel, Skip button, and trailing slot', () => {
    const html = render(RestTimer, {
      remainingSec: 30,
      totalSec: 90,
      sublabel: 'Next: Bench Press · set 3 of 5',
      onSkip: () => {},
      trailing: createElement(Text, null, '128 bpm'),
    });
    const root = parse(html);
    expect(findByText(root, 'Next: Bench Press · set 3 of 5')).toBeDefined();
    expect(findByText(root, 'Skip')).toBeDefined();
    expect(findByText(root, '128 bpm')).toBeDefined();
  });

  test('paused announces itself and drops the glow arc', () => {
    const paused = render(RestTimer, { remainingSec: 30, totalSec: 90, paused: true });
    expect(paused).toContain(', paused');
    const live = render(RestTimer, { remainingSec: 30, totalSec: 90 });
    expect(live).not.toContain(', paused');
    // the glow duplicate (blur filter) only renders while running
    expect(live).toContain('lk-resttimer-blur');
    expect(paused).not.toContain('lk-resttimer-blur');
  });

  test('compact renders the 42px ring (r 18 → C ≈ 113.10) with the mint time inside', () => {
    const html = render(RestTimer, {
      remainingSec: 45,
      totalSec: 90,
      compact: true,
      sublabel: 'Next 1:05',
      onSkip: () => {},
    });
    const root = parse(html);
    const time = findByText(root, '0:45')!;
    expect(time).toBeDefined();
    // compact readout is MINT (design `.rg .num`), not the hero white
    expect(hasDeclaration(time, '52,245,197')).toBe(true);
    // label moved OUT of the ring into the text column, above the sublabel
    expect(findByText(root, 'REST')).toBeDefined();
    expect(findByText(root, 'Next 1:05')).toBeDefined();
    expect(findByText(root, 'Skip')).toBeDefined();
    // compact geometry: C = 2π·18 ≈ 113.10 → offset at 50% ≈ 56.55
    expect(html).toContain('113.10');
    expect(html).toContain('56.5');
    expect(html).not.toContain('157.0'); // no hero arc
    // the glow duplicate arc still renders in compact
    expect(html).toContain('lk-resttimer-blur');
  });

  test('hero default keeps the 116/r50 geometry (no compact readout)', () => {
    const html = render(RestTimer, { remainingSec: 45, totalSec: 90 });
    expect(html).toContain('157.07');
    expect(html).not.toContain('113.10');
    const time = findByText(parse(html), '0:45')!;
    expect(hasDeclaration(time, '52,245,197')).toBe(false); // hero time stays text-white
  });
});
