/* RestTimer — m:ss formatting, arc dashoffset ∝ remaining fraction, the
   paused state, and the optional Skip / sublabel / trailing slots. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { RestTimer, formatRestTime, restFraction } from './RestTimer';

describe('formatRestTime', () => {
  it('formats m:ss with zero-padded seconds', () => {
    expect(formatRestTime(95)).toBe('1:35');
    expect(formatRestTime(60)).toBe('1:00');
    expect(formatRestTime(9)).toBe('0:09');
    expect(formatRestTime(0)).toBe('0:00');
    expect(formatRestTime(-5)).toBe('0:00'); // clamped
  });
});

describe('restFraction', () => {
  it('clamps to 0–1 and guards totalSec ≤ 0', () => {
    expect(restFraction(45, 90)).toBe(0.5);
    expect(restFraction(120, 90)).toBe(1);
    expect(restFraction(-3, 90)).toBe(0);
    expect(restFraction(30, 0)).toBe(0);
  });
});

describe('RestTimer', () => {
  it('renders the mono time, label, and a half-drained arc', () => {
    const html = renderToStaticMarkup(<RestTimer remainingSec={45} totalSec={90} />);
    expect(html).toContain('1:35'.replace('1:35', '0:45')); // 45s
    expect(html).toContain('Rest'); // default label
    // C = 2π·50 ≈ 314.16 → offset at 50% ≈ 157.08
    expect(html).toContain('stroke-dashoffset="157.08"');
    expect(html).toContain('role="timer"');
  });

  it('renders sublabel, Skip button, and trailing slot', () => {
    const html = renderToStaticMarkup(
      <RestTimer
        remainingSec={30}
        totalSec={90}
        sublabel="Next: Bench Press · set 3 of 5"
        onSkip={() => {}}
        trailing={<span>128 bpm</span>}
      />,
    );
    expect(html).toContain('Next: Bench Press · set 3 of 5');
    expect(html).toContain('Skip');
    expect(html).toContain('128 bpm');
  });

  it('paused dims the ring and says so to AT', () => {
    const html = renderToStaticMarkup(<RestTimer remainingSec={30} totalSec={90} paused />);
    expect(html).toContain('lk-resttimer-paused');
    expect(html).toContain(', paused');
    const live = renderToStaticMarkup(<RestTimer remainingSec={30} totalSec={90} />);
    expect(live).not.toContain('lk-resttimer-paused');
  });
});
