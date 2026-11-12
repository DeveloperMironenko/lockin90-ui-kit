// @vitest-environment happy-dom
/* Input / PasswordInput (web): the ref is the <input>, so an app can move focus to the next field. */
import { act, createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';
import { PasswordInput } from './PasswordInput';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe.each([
  ['Input', Input],
  ['PasswordInput', PasswordInput],
] as const)('%s ref', (_name, Field) => {
  it('is the input element and focuses it', () => {
    const ref = createRef<HTMLInputElement>();
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    act(() => root.render(<Field ref={ref} />));
    expect(ref.current).toBe(host.querySelector('input'));
    ref.current!.focus();
    expect(document.activeElement).toBe(ref.current);
    act(() => root.unmount());
    host.remove();
  });
});
