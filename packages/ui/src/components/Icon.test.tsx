/* Icon — the training-set additions: kit-reused Lucide glyphs (dumbbell,
   footprints, bike, waves, zap, ball) and the 8 custom Aurora activity
   glyphs (activity-mobility/rowing/yoga/pilates/stretching/foam-roll/sauna/
   cold-plunge), stroke 1.85, 24-box viewBox. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Icon, type IconName } from './Icon';

const KIT_REUSED: IconName[] = ['dumbbell', 'footprints', 'bike', 'waves', 'zap', 'ball'];

describe('Icon — kit-reused activity glyphs', () => {
  it('renders a Lucide svg for every kit-reused name, each visually distinct', () => {
    const markups = KIT_REUSED.map((name) => renderToStaticMarkup(<Icon name={name} />));
    markups.forEach((html) => expect(html).toContain('<svg'));
    // no two of the six should render identical path data
    expect(new Set(markups).size).toBe(KIT_REUSED.length);
  });

  it('skill reuses the existing target glyph — no duplicate name was added', () => {
    const html = renderToStaticMarkup(<Icon name="target" />);
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

  it('activity-rowing is no longer a duplicate of the swimming (waves) glyph', () => {
    const rowing = renderToStaticMarkup(<Icon name="activity-rowing" />);
    const waves = renderToStaticMarkup(<Icon name="waves" />);
    expect(rowing).not.toBe(waves);
    // the old (wrong) swimming-wave path must not appear on the rowing glyph
    expect(rowing).not.toContain('M4 17c1.6 0 1.6 1.2 3.2 1.2');
  });

  it('activity-stretching is a dedicated glyph, distinct from activity-mobility', () => {
    const stretching = renderToStaticMarkup(<Icon name="activity-stretching" />);
    const mobility = renderToStaticMarkup(<Icon name="activity-mobility" />);
    expect(stretching).not.toBe(mobility);
  });

  it.each(CASES)('%s renders the exact board path on a 1.85 stroke, 24-box viewBox', (name, pathFragment) => {
    const html = renderToStaticMarkup(<Icon name={name} />);
    expect(html).toContain('viewBox="0 0 24 24"');
    expect(html).toContain(pathFragment);
    expect(html).toContain('stroke-width="1.85"');
  });

  it('activity-foam-roll renders the roller rect + 3 ribs', () => {
    const html = renderToStaticMarkup(<Icon name="activity-foam-roll" />);
    expect(html).toContain('<rect');
    expect(html).toContain('M8 9v6M12 9v6M16 9v6');
    expect(html).toContain('stroke-width="1.85"');
  });
});
