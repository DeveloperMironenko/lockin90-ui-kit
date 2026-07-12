/* SetTable (native) — set labels (W / 1,2,… / D / F), set-type colors, row
   tints, PR badge only on done PR sets, reference tones, column selection,
   and the + Add set row. Mirrors the web twin's contract. */
import { describe, expect, test } from 'vitest';
import { colors } from '@lockin90/tokens';
import { SetTable, setLabels, type WorkoutSet } from '../SetTable';
import { findByText, hasDeclaration, parse, render, type El } from './markup';

/** The element carries the color, whether react-native-web serialized it as
 *  an atomic class or an inline style (dynamic style objects go inline). */
function carriesColor(el: El, rgb: string): boolean {
  return (el.attrs.style ?? '').includes(rgb) || hasDeclaration(el, rgb);
}

const SETS: WorkoutSet[] = [
  { id: 'a', setType: 'warmup', weight: 40, reps: 10, unit: 'kg', reference: '42.5×10', referenceTone: 'coach', done: true },
  { id: 'b', setType: 'working', weight: 80, reps: 5, reference: '80×5', referenceTone: 'coach', done: true, isPr: true },
  { id: 'c', setType: 'working', weight: 80, reps: 5, reference: '82.5×5', referenceTone: 'ai', isCurrent: true },
  { id: 'd', setType: 'drop', weight: 60, reps: 12 },
  { id: 'e', setType: 'failure', weight: 60 },
];

describe('setLabels', () => {
  test('numbers working sets only; warmup/drop/failure get W/D/F', () => {
    expect(setLabels(SETS)).toEqual(['W', '1', '2', 'D', 'F']);
  });
});

describe('SetTable', () => {
  test('renders colored set labels, values, and the unit-derived header', () => {
    const html = render(SetTable, { sets: SETS });
    const root = parse(html);
    expect(findByText(root, 'W')).toBeDefined();
    expect(findByText(root, 'D')).toBeDefined();
    expect(findByText(root, 'F')).toBeDefined();
    expect(findByText(root, '60×—')).toBeDefined(); // missing reps → em dash
    expect(findByText(root, 'KG × REPS')).toBeDefined();
    expect(findByText(root, 'COACH REC')).toBeDefined(); // default header, uppercased
    // set-type colors — warmup amber, failure magenta
    expect(carriesColor(findByText(root, 'W')!, '255,176,32')).toBe(true); // zoneMid
    expect(carriesColor(findByText(root, 'F')!, '255,61,129')).toBe(true); // magenta
    expect(colors.zoneMid).toBe('#FFB020');
  });

  test('stamps the PR badge only on done PR sets', () => {
    const withPr = parse(render(SetTable, { sets: SETS }));
    expect(findByText(withPr, 'PR')).toBeDefined(); // set b (done + isPr)
    const notDone = parse(
      render(SetTable, { sets: [{ id: 'x', setType: 'working', weight: 80, reps: 5, isPr: true }] as WorkoutSet[] }),
    );
    expect(findByText(notDone, 'PR')).toBeUndefined();
  });

  test('tones the reference column (coach mint / ai violet accent)', () => {
    const root = parse(render(SetTable, { sets: SETS }));
    expect(carriesColor(findByText(root, '42.5×10')!, '52,245,197')).toBe(true); // mint
    expect(carriesColor(findByText(root, '82.5×5')!, '124,92,255')).toBe(true); // accent
  });

  test('renders only the requested columns', () => {
    const root = parse(render(SetTable, { sets: SETS, columns: ['set', 'value'] }));
    expect(findByText(root, '80×5')).toBeDefined();
    expect(findByText(root, '42.5×10')).toBeUndefined(); // reference dropped
  });

  test('add row renders only with onAddSet (uppercased label)', () => {
    const withAdd = parse(render(SetTable, { sets: SETS, onAddSet: () => {}, addLabel: 'Add drop set' }));
    expect(findByText(withAdd, '+ ADD DROP SET')).toBeDefined();
    const without = parse(render(SetTable, { sets: SETS }));
    expect(findByText(without, '+ ADD SET')).toBeUndefined();
  });
});
