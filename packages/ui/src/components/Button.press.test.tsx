// @vitest-environment happy-dom
/* Button loading (web): a press while busy does nothing, not even a form submit. */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('Button loading presses', () => {
  it('ignores clicks and submits while loading, and takes them again after', () => {
    const onClick = vi.fn();
    const onSubmit = vi.fn((e: Event) => e.preventDefault());
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    const render = (loading: boolean) =>
      act(() =>
        root.render(
          <form onSubmit={(e) => onSubmit(e.nativeEvent)}>
            <Button type="submit" loading={loading} onClick={onClick}>
              Save
            </Button>
          </form>,
        ),
      );
    render(true);
    act(() => host.querySelector('button')!.click());
    expect(onClick).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    render(false);
    act(() => host.querySelector('button')!.click());
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    act(() => root.unmount());
    host.remove();
  });
});
