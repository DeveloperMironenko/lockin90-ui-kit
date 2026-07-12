/* TemplateCard — source pills (coach mint / ai violet / manual none), the
   tinted edge bar, button-vs-div rendering, and the content lines. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { TemplateCard } from './TemplateCard';

describe('TemplateCard', () => {
  it('renders name, meta, and lastUsed', () => {
    const html = renderToStaticMarkup(
      <TemplateCard name="Push Day A" meta="Chest · Arms · 5 ex · ~48m" lastUsed="Last used 2d ago" />,
    );
    expect(html).toContain('Push Day A');
    expect(html).toContain('Chest · Arms · 5 ex · ~48m');
    expect(html).toContain('Last used 2d ago');
  });

  it('shows the mint Coach pill / violet AI pill; manual shows none', () => {
    const coach = renderToStaticMarkup(<TemplateCard name="A" source="coach" />);
    expect(coach).toContain('lk-templatecard-src-coach');
    expect(coach).toContain('Coach');
    const ai = renderToStaticMarkup(<TemplateCard name="B" source="ai" />);
    expect(ai).toContain('lk-templatecard-src-ai');
    expect(ai).toContain('AI');
    const manual = renderToStaticMarkup(<TemplateCard name="C" source="manual" />);
    expect(manual).not.toContain('lk-templatecard-src');
  });

  it('tint paints the left edge bar', () => {
    const html = renderToStaticMarkup(<TemplateCard name="A" tint="var(--cyan)" />);
    expect(html).toContain('lk-templatecard-tint');
    expect(html).toContain('background:var(--cyan)');
    const plain = renderToStaticMarkup(<TemplateCard name="A" />);
    expect(plain).not.toContain('lk-templatecard-tint');
  });

  it('leading renders the tinted icon tile INSTEAD of the edge bar', () => {
    const html = renderToStaticMarkup(
      <TemplateCard name="A" tint="var(--cyan)" leading={<span>icon</span>} />,
    );
    expect(html).toContain('lk-templatecard-lead');
    expect(html).not.toContain('lk-templatecard-tint');
    expect(html).toContain('icon');
  });

  it('metaCount bolds the count fragment after the meta line', () => {
    const html = renderToStaticMarkup(<TemplateCard name="A" meta="Chest · Arms" metaCount="5 ex" />);
    expect(html).toContain('Chest · Arms');
    expect(html).toContain('<b class="lk-templatecard-meta-count">5 ex</b>');
    const countOnly = renderToStaticMarkup(<TemplateCard name="A" metaCount="5 ex" />);
    expect(countOnly).toContain('5 ex');
  });

  it('onPress renders a <button>; without it a <div>', () => {
    const pressable = renderToStaticMarkup(<TemplateCard name="A" onPress={() => {}} />);
    expect(pressable).toMatch(/^<button/);
    expect(pressable).toContain('lk-templatecard-tappable');
    const still = renderToStaticMarkup(<TemplateCard name="A" />);
    expect(still).toMatch(/^<div/);
  });
});
