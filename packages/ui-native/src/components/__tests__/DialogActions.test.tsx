// @vitest-environment happy-dom
/// <reference lib="dom" />
/* Dialog actions (V10, CONVENTIONS "Dialog actions"): one footer slot in Sheet and Modal, "Cancel | Primary"
   each half the width at phone width; Sheet can show a named ×, a pinned subheader and a tall fixed height;
   Modal's body scrolls. */
import { StyleSheet, Text } from 'react-native';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Sheet } from '../Sheet';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { mount, propOf, propsWith } from './dom';

const dims = vi.hoisted(() => ({ width: 402 }));
vi.mock('react-native', async (orig) => {
  const rn = await orig<typeof import('react-native')>();
  return { ...rn, useWindowDimensions: () => ({ width: dims.width, height: 874, scale: 3, fontScale: 1 }) };
});
afterEach(() => {
  document.body.innerHTML = '';
  dims.width = 402;
});

const flat = (style: unknown) => StyleSheet.flatten(style as never) as Record<string, unknown>;
/** The cell around an action: the nearest ancestor with flex 1. */
const cellOf = (el: Element) => {
  for (let p: Element | null = el.parentElement; p; p = p.parentElement) {
    const st = propOf(p, 'style');
    if (st && flat(st).flex === 1) return flat(st);
  }
  return undefined;
};

describe('Sheet footer', () => {
  test('each action is an equal cell, in the order given', () => {
    const view = mount(
      <Sheet open title="Edit profile" footer={<><Button title="Cancel" /><Button variant="primary" title="Save" /></>}>
        <Text>body</Text>
      </Sheet>,
    );
    const cancel = document.querySelector('[aria-label="Cancel"]')!;
    const save = document.querySelector('[aria-label="Save"]')!;
    expect(cellOf(cancel)).toMatchObject({ flex: 1, flexBasis: 0 });
    expect(cellOf(save)).toMatchObject({ flex: 1, flexBasis: 0 });
    expect(cancel.compareDocumentPosition(save) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    view.unmount();
  });

  test('a × named by closeLabel closes it; none without closeLabel', () => {
    let closed = 0;
    const view = mount(<Sheet open title="Language" onClose={() => (closed += 1)} closeLabel="Закрыть" />);
    const x = document.querySelector('[aria-label="Закрыть"]')!;
    (propOf(x, 'onPress') as () => void)();
    expect(closed).toBe(1);
    view.unmount();
    mount(<Sheet open title="Language" onClose={() => {}} />);
    expect(document.querySelector('[role="button"]')).toBeNull();
  });

  test('subheader sits outside the scroll; tall fixes the panel at 80%', () => {
    const view = mount(
      <Sheet open height="tall" subheader={<Text testID="search">search</Text>}>
        <Text testID="body">body</Text>
      </Sheet>,
    );
    const body = document.querySelector('[data-testid="body"]')!;
    const search = document.querySelector('[data-testid="search"]')!;
    expect(propsWith(search, 'contentContainerStyle')).toBeUndefined();
    expect(propsWith(body, 'contentContainerStyle')).toBeDefined();
    expect(flat(propsWith(body, 'accessibilityViewIsModal')?.style).height).toBe('80%');
    view.unmount();
  });

  test('the title is a card title (display 17)', () => {
    const view = mount(<Sheet open title="Language" />);
    const title = Array.from(document.querySelectorAll('[role="heading"]')).find((el) => el.textContent === 'Language')!;
    expect(flat(propOf(title, 'style')).fontSize).toBe(17);
    view.unmount();
  });
});

describe('Modal', () => {
  test('the body scrolls and the footer actions are equal cells at phone width', () => {
    const view = mount(
      <Modal open title="Delete account" footer={<><Button title="Cancel" /><Button title="Delete" tone="danger" /></>}>
        <Text testID="body">body</Text>
      </Modal>,
    );
    const body = document.querySelector('[data-testid="body"]')!;
    expect(propsWith(body, 'keyboardShouldPersistTaps')).toBeDefined();
    expect(cellOf(document.querySelector('[aria-label="Delete"]')!)).toMatchObject({ flex: 1 });
    view.unmount();
  });
});

describe('wider than a phone (a tablet)', () => {
  test('the actions sit at the end at their own width, and wrap when they do not fit', () => {
    dims.width = 820;
    const footer = (
      <>
        <Button title="Cancel" />
        <Button variant="primary" title="Save" />
      </>
    );
    for (const el of [
      <Sheet open title="Edit profile" footer={footer} />,
      <Modal open title="Edit profile" footer={footer} />,
    ]) {
      const view = mount(el);
      const save = document.querySelector('[aria-label="Save"]')!;
      expect(cellOf(save)?.flexBasis).toBeUndefined();
      // the footer row: the nearest box that wraps
      let row: CSSStyleDeclaration | undefined;
      for (let p: Element | null = save.parentElement; p && !row; p = p.parentElement)
        if (getComputedStyle(p).flexWrap === 'wrap') row = getComputedStyle(p);
      expect(row?.justifyContent).toBe('flex-end');
      view.unmount();
    }
  });
});
