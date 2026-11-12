// @vitest-environment happy-dom
/// <reference lib="dom" />
/* TabBar (native) — an item can be shown before its screen exists (disabled) and named for screen
   readers. */
import { describe, expect, test, vi } from 'vitest';
import { act } from 'react';
import { TabBar } from '../TabBar';
import { mount } from './dom';

describe('TabBar items', () => {
  test('a disabled item is announced disabled and its press does nothing', () => {
    const onChange = vi.fn();
    const onFabPress = vi.fn();
    const { host, unmount } = mount(
      <TabBar
        items={[
          { icon: 'star', label: 'Training' },
          { icon: 'plus', label: 'Log', accessibilityLabel: 'Log a workout', disabled: true },
        ]}
        fabIndex={1}
        onChange={onChange}
        onFabPress={onFabPress}
      />,
    );
    const [training, log] = Array.from(host.querySelectorAll('[role="tab"]')) as HTMLElement[];
    expect(log.getAttribute('aria-disabled')).toBe('true');
    expect(log.getAttribute('aria-label')).toBe('Log a workout');
    expect(training.getAttribute('aria-disabled')).not.toBe('true');
    act(() => log.click());
    expect(onFabPress).not.toHaveBeenCalled();
    act(() => training.click());
    expect(onChange).toHaveBeenCalledWith(0);
    unmount();
  });
});
