/* Icon (native) — training-set additions: kit-reused Lucide glyphs
   (dumbbell, footprints, bike, waves, zap, ball) and the 8 custom Aurora
   activity glyphs, stroke 1.85, 24-box viewBox. Mirrors the web twin's
   coverage. */
import { describe, expect, test } from 'vitest';
import { Icon, type IconName } from '../Icon';
import { render } from './markup';

const KIT_REUSED: IconName[] = ['dumbbell', 'footprints', 'bike', 'waves', 'zap', 'ball'];

describe('Icon — kit-reused activity glyphs', () => {
  test('renders an svg for every kit-reused name, each visually distinct', () => {
    const markups = KIT_REUSED.map((name) => render(Icon, { name }));
    markups.forEach((html) => expect(html).toContain('<svg'));
    expect(new Set(markups).size).toBe(KIT_REUSED.length);
  });

  test('skill reuses the existing target glyph — no duplicate name was added', () => {
    const html = render(Icon, { name: 'target' });
    expect(html).toContain('<svg');
  });
});

describe('Icon — custom Aurora activity glyphs', () => {
  const CASES: Array<[IconName, string]> = [
    ['activity-mobility', 'M12 8v5M6 21l3-5 3-3 3 3 3 5M8.5 12.5h7'],
    ['activity-rowing', 'M4.5 5l11 11M14 5l-2.2.6.7 2.4M15.5 16.5 20 12'],
    ['activity-yoga', 'M12 8v4M12 12c-3.5 0-6.5 1.5-6.5 4M12 12c3.5 0 6.5 1.5 6.5 4M8 15.5h8'],
    ['activity-pilates', 'M8 9l4 2 4-2M12 11v4M9 20l3-5 3 5'],
    ['activity-stretching', 'M7 7v4l5 2M12 13l6-1M18 12l-1.5-2M18 12l.5-2.4'],
    ['activity-sauna', 'M4 20h16'],
    ['activity-cold-plunge', 'M12 3v18'],
  ];

  test.each(CASES)('%s renders the exact board path on a 1.85 stroke, 24-box viewBox', (name, pathFragment) => {
    const html = render(Icon, { name, color: '#EEF1F8' });
    expect(html).toContain('viewBox="0 0 24 24"');
    expect(html).toContain(pathFragment);
    expect(html).toContain('stroke-width="1.85"');
  });

  test('activity-rowing is no longer a duplicate of the swimming (waves) glyph', () => {
    const rowing = render(Icon, { name: 'activity-rowing', color: '#EEF1F8' });
    const waves = render(Icon, { name: 'waves', color: '#EEF1F8' });
    expect(rowing).not.toBe(waves);
    expect(rowing).not.toContain('M4 17c1.6 0 1.6 1.2 3.2 1.2');
  });

  test('activity-stretching is a dedicated glyph, distinct from activity-mobility', () => {
    const stretching = render(Icon, { name: 'activity-stretching', color: '#EEF1F8' });
    const mobility = render(Icon, { name: 'activity-mobility', color: '#EEF1F8' });
    expect(stretching).not.toBe(mobility);
  });

  test('activity-foam-roll renders the roller rect + 3 ribs', () => {
    const html = render(Icon, { name: 'activity-foam-roll', color: '#EEF1F8' });
    expect(html).toContain('<rect');
    expect(html).toContain('M8 9v6M12 9v6M16 9v6');
    expect(html).toContain('stroke-width="1.85"');
  });
});
