// @vitest-environment happy-dom
/* Modal and Sheet (web): focus moves into the dialog, Tab stays inside, focus goes back on close, and the
   title names the dialog. */
import { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { Modal } from './Modal';
import { Sheet } from './Sheet';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let cleanup: () => void = () => {};
afterEach(() => cleanup());

function Harness({ kind }: { kind: 'modal' | 'sheet' }) {
  const [open, setOpen] = useState(false);
  const Dialog = kind === 'modal' ? Modal : Sheet;
  return (
    <>
      <button id="opener" onClick={() => setOpen(true)}>
        Open
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Edit name">
        <input id="first" />
        <button id="last">Save</button>
      </Dialog>
    </>
  );
}

function mount(kind: 'modal' | 'sheet') {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => root.render(<Harness kind={kind} />));
  cleanup = () => {
    act(() => root.unmount());
    host.remove();
  };
}

const tab = (shiftKey = false) =>
  act(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true }));
  });

describe('modal close button', () => {
  it('is named by closeLabel', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    act(() => root.render(<Modal onClose={() => {}} title="Skip setup?" closeLabel="Cerrar" />));
    expect(document.querySelector('.lk-modal-close')?.getAttribute('aria-label')).toBe('Cerrar');
    act(() => root.unmount());
    host.remove();
  });
});

describe.each(['modal', 'sheet'] as const)('%s focus', (kind) => {
  it('takes focus, is named by its title, keeps Tab inside and gives focus back on Escape', () => {
    mount(kind);
    const opener = document.getElementById('opener')!;
    opener.focus();
    act(() => opener.click());

    const dialog = document.querySelector('[role="dialog"]')!;
    expect(document.activeElement).toBe(dialog);
    const titleId = dialog.getAttribute('aria-labelledby')!;
    expect(document.getElementById(titleId)?.textContent).toBe('Edit name');

    document.getElementById('last')!.focus();
    tab();
    const focusables = dialog.querySelectorAll('button, input');
    expect(document.activeElement).toBe(focusables[0]);
    tab(true);
    expect(document.activeElement).toBe(focusables[focusables.length - 1]);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });
});
