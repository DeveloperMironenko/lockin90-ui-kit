/* TabBar — an item can be shown before its page exists (disabled) and named for screen readers. */
// @vitest-environment happy-dom
/// <reference lib="dom" />
import { describe, expect, it, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { TabBar } from './TabBar';

function mount(node: React.ReactNode) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => root.render(node));
  return { host, unmount: () => act(() => root.unmount()) };
}

describe('TabBar items', () => {
  it('a disabled item is announced disabled and its click does nothing', () => {
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
    const [training, log] = Array.from(host.querySelectorAll('button'));
    expect(log.getAttribute('aria-disabled')).toBe('true');
    expect(log.getAttribute('aria-label')).toBe('Log a workout');
    expect(training.hasAttribute('aria-disabled')).toBe(false);
    act(() => log.click());
    expect(onFabPress).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    act(() => training.click());
    expect(onChange).toHaveBeenCalledWith(0);
    unmount();
  });
});
