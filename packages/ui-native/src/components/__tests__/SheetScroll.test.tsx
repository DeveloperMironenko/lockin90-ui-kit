// @vitest-environment happy-dom
/// <reference lib="dom" />
/* Sheet bottom edge (owner, 2026-11-11): the body scrolls to the panel's bottom edge (the screen's)
   and its content ends 18 + the safe-area inset higher; the panel itself has no bottom padding, which
   drew an opaque band the content was cut at. */
import { StyleSheet, Text } from 'react-native';
import { afterEach, describe, expect, test } from 'vitest';
import { Sheet } from '../Sheet';
import { mount, propOf, propsWith } from './dom';

afterEach(() => {
  document.body.innerHTML = '';
});

const flat = (style: unknown) => StyleSheet.flatten(style as never) as Record<string, unknown>;

describe.each(['bottom', 'right'] as const)('Sheet side=%s', (side) => {
  test('the body is a scroll whose content carries the bottom padding; the panel none', () => {
    const view = mount(
      <Sheet open side={side} title="Physiological profile">
        <Text testID="body">body</Text>
      </Sheet>,
    );
    const body = document.querySelector('[data-testid="body"]')!;
    const content = flat(propOf(body, 'contentContainerStyle'));
    // 2 (the body's) + 18 (the panel's) + the inset (0 here: no SafeAreaProvider)
    expect(content.paddingBottom).toBe(20);
    expect(propOf(body, 'keyboardShouldPersistTaps')).toBe('handled');
    // the panel: the view that is accessibilityViewIsModal
    const panel = flat(propsWith(body, 'accessibilityViewIsModal')?.style);
    expect(panel.paddingTop).toBeGreaterThan(0);
    expect(panel.paddingBottom ?? 0).toBe(0);
    expect(panel.paddingVertical).toBeUndefined();
    view.unmount();
  });
});
