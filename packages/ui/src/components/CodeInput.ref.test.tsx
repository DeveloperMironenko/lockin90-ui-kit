// @vitest-environment happy-dom
/* CodeInput (web): ref.focus() lands in the first empty box (the last when the code is complete), so
   Return in the field before can move into the code. */
import { act, createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { CodeInput, type CodeInputHandle } from './TagInput';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('CodeInput ref', () => {
  it.each([
    ['', 0],
    ['12', 2],
    ['123456', 5],
  ])('value %j: focus() focuses box %i', (value, box) => {
    const ref = createRef<CodeInputHandle>();
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    act(() => root.render(<CodeInput ref={ref} value={value} />));
    act(() => ref.current!.focus());
    expect(document.activeElement).toBe(host.querySelectorAll('input')[box]);
    act(() => root.unmount());
    host.remove();
  });
});
