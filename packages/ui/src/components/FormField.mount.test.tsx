// @vitest-environment happy-dom
/* FormField (web): going between one and several children keeps the control mounted (focus, typed text). */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { FormField } from './FormField';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('FormField children', () => {
  it('never remounts the control', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    act(() =>
      root.render(
        <FormField label="Email">
          <input />
        </FormField>,
      ),
    );
    const input = host.querySelector('input');
    act(() =>
      root.render(
        <FormField label="Email">
          <input />
          <span>hint</span>
        </FormField>,
      ),
    );
    expect(host.querySelector('input')).toBe(input);
    act(() => root.unmount());
    host.remove();
  });
});
