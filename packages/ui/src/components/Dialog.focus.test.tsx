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

describe('dialog focus edge cases', () => {
  it('gives focus back to the opener even when an autoFocus field took it on open', () => {
    function Auto() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button id="opener2" onClick={() => setOpen(true)}>
            Open
          </button>
          <Modal open={open} onClose={() => setOpen(false)} title="Rename">
            <input id="auto" autoFocus />
          </Modal>
        </>
      );
    }
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    act(() => root.render(<Auto />));
    const opener = document.getElementById('opener2')!;
    opener.focus();
    act(() => opener.click());
    expect(document.activeElement).toBe(document.getElementById('auto'));
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(document.activeElement).toBe(opener);
    act(() => root.unmount());
    host.remove();
  });

  it('only the top dialog traps Tab', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    act(() =>
      root.render(
        <>
          <Sheet title="Settings">
            <button id="under">Under</button>
          </Sheet>
          <Modal title="Sure?">
            <button id="yes">Yes</button>
            <button id="no">No</button>
          </Modal>
        </>,
      ),
    );
    // inside the top dialog, mid-list: nobody intervenes (the dialog underneath used to pull focus to itself)
    document.getElementById('yes')!.focus();
    const e = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    act(() => {
      document.dispatchEvent(e);
    });
    expect(e.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(document.getElementById('yes'));
    // at its end, the top dialog wraps to its own first control
    document.getElementById('no')!.focus();
    tab();
    expect(document.activeElement).toBe(document.getElementById('yes'));
    act(() => root.unmount());
    host.remove();
  });
});
