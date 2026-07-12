/* SetTable — set labels (W / 1,2,… / D / F with working-set numbering), the
   set-type color classes, row tints, PR badge only on done PR sets, the
   reference tones, column selection, and the + Add set row. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SetTable, setLabels, type WorkoutSet } from './SetTable';

const SETS: WorkoutSet[] = [
  { id: 'a', setType: 'warmup', weight: 40, reps: 10, unit: 'kg', reference: '40×10', referenceTone: 'coach', done: true },
  { id: 'b', setType: 'working', weight: 80, reps: 5, reference: '80×5', referenceTone: 'coach', done: true, isPr: true },
  { id: 'c', setType: 'working', weight: 80, reps: 5, reference: '82.5×5', referenceTone: 'ai', isCurrent: true },
  { id: 'd', setType: 'drop', weight: 60, reps: 12 },
  { id: 'e', setType: 'failure', weight: 60 },
];

describe('setLabels', () => {
  it('numbers working sets only; warmup/drop/failure get W/D/F', () => {
    expect(setLabels(SETS)).toEqual(['W', '1', '2', 'D', 'F']);
  });

  it('a custom label overrides the derived one without breaking numbering', () => {
    expect(
      setLabels([
        { setType: 'working' },
        { setType: 'working', label: 'AMRAP' },
        { setType: 'working' },
      ]),
    ).toEqual(['1', 'AMRAP', '3']);
  });
});

describe('SetTable', () => {
  it('renders set-type colored labels, row tints, and mono values', () => {
    const html = renderToStaticMarkup(<SetTable sets={SETS} />);
    expect(html).toContain('lk-settable-warmup');
    expect(html).toContain('lk-settable-working');
    expect(html).toContain('lk-settable-drop');
    expect(html).toContain('lk-settable-failure');
    expect(html).toContain('lk-settable-current');
    expect(html).toContain('lk-settable-done');
    expect(html).toContain('80×5');
    expect(html).toContain('60×—'); // missing reps → em dash
    expect(html).toContain('KG × REPS'); // unit-derived value header
    expect(html).toContain('Coach rec'); // default reference header
  });

  it('stamps the PR badge only on done PR sets', () => {
    const html = renderToStaticMarkup(<SetTable sets={SETS} />);
    expect(html.match(/lk-settable-pr/g)).toHaveLength(1); // set b only
    const notDonePr = renderToStaticMarkup(
      <SetTable sets={[{ id: 'x', setType: 'working', weight: 80, reps: 5, isPr: true }]} />,
    );
    expect(notDonePr).not.toContain('lk-settable-pr');
  });

  it('tones the reference column (coach mint / ai violet)', () => {
    const html = renderToStaticMarkup(<SetTable sets={SETS} />);
    expect(html).toContain('lk-settable-ref-coach');
    expect(html).toContain('lk-settable-ref-ai');
  });

  it('renders only the requested columns', () => {
    const html = renderToStaticMarkup(<SetTable sets={SETS} columns={['set', 'value']} />);
    expect(html).not.toContain('lk-settable-ref');
    expect(html).not.toContain('lk-settable-check');
  });

  it('done checks are aria-pressed; add row renders only with onAddSet', () => {
    const html = renderToStaticMarkup(<SetTable sets={SETS} onAddSet={() => {}} addLabel="Add drop set" />);
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain('+ Add drop set');
    const noAdd = renderToStaticMarkup(<SetTable sets={SETS} />);
    expect(noAdd).not.toContain('lk-settable-add');
  });

  it('editable boxes ONLY the current set value — done/pending stay plain tappable text', () => {
    const html = renderToStaticMarkup(<SetTable sets={SETS} editable />);
    expect(html.match(/lk-settable-valbox/g)).toHaveLength(1); // set c (isCurrent) only
    const noCurrent = renderToStaticMarkup(
      <SetTable sets={SETS.filter((s) => !s.isCurrent)} editable />,
    );
    expect(noCurrent).not.toContain('lk-settable-valbox');
  });
});
