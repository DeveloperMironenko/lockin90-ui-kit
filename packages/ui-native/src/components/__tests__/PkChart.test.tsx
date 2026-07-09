import { describe, expect, test } from 'vitest';
import { PkChart, beatPeriodMs } from '../PkChart';
import { render } from './markup';

/* Heartbeat pacing: the live (raw-`samples`) trace beats once per
 * 60000/bpm ms; a non-positive/non-finite bpm or `still` must render NO beat
 * elements. The sonar ring's first animation frame carries scale(0.5) inline —
 * beat elements are detectable in static markup by that transform. */

const LIVE_SAMPLES = [1, 4, 2, 8, 3];

const hasBeatRing = (html: string) => /scale\(0\.5\)/.test(html);

describe('beatPeriodMs (bpm → beat period)', () => {
  test('period is 60000/bpm', () => {
    expect(beatPeriodMs(60)).toBe(1000);
    expect(beatPeriodMs(64)).toBe(937.5);
    expect(beatPeriodMs(120)).toBe(500);
  });

  test('non-positive and non-finite bpm produce no beat (0)', () => {
    expect(beatPeriodMs(0)).toBe(0);
    expect(beatPeriodMs(-5)).toBe(0);
    expect(beatPeriodMs(Number.NaN)).toBe(0);
    expect(beatPeriodMs(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe('PkChart beat elements in markup', () => {
  test('live samples + valid bpm render the heartbeat ring', () => {
    expect(hasBeatRing(render(PkChart, { samples: LIVE_SAMPLES, bpm: 64 }))).toBe(true);
  });

  test('`still` renders no beat', () => {
    expect(hasBeatRing(render(PkChart, { samples: LIVE_SAMPLES, bpm: 64, still: true }))).toBe(false);
  });

  test('bpm <= 0 / non-finite renders no beat', () => {
    expect(hasBeatRing(render(PkChart, { samples: LIVE_SAMPLES, bpm: 0 }))).toBe(false);
    expect(hasBeatRing(render(PkChart, { samples: LIVE_SAMPLES, bpm: -10 }))).toBe(false);
    expect(hasBeatRing(render(PkChart, { samples: LIVE_SAMPLES, bpm: Number.NaN }))).toBe(false);
  });

  test('the doses (non-live) variant never beats, even with a valid bpm', () => {
    expect(hasBeatRing(render(PkChart, { bpm: 64 }))).toBe(false);
  });
});
