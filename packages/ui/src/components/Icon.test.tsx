/* Icon — the training-set additions: kit-reused Lucide glyphs (dumbbell,
   footprints, bike, waves, zap, ball) and the 7 custom Aurora activity
   glyphs (activity-mobility/rowing/yoga/pilates/foam-roll/sauna/cold-plunge),
   stroke 1.85, 24-box viewBox. */
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
    ['activity-rowing', 'M6 13.5l4.5-2.2 3 1.2 2-3 2.5 2'],
    ['activity-yoga', 'M12 8v4M12 12c-3.5 0-6.5 1.5-6.5 4M12 12c3.5 0 6.5 1.5 6.5 4M8 15.5h8'],
    ['activity-pilates', 'M8 9l4 2 4-2M12 11v4M9 20l3-5 3 5'],
    ['activity-sauna', 'M4 20h16'],
    ['activity-cold-plunge', 'M12 3v18'],
  ];

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
