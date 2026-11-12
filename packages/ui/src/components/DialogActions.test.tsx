// @vitest-environment happy-dom
/* Dialog actions (V10, CONVENTIONS "Dialog actions"): Sheet and Modal have one footer slot whose actions
   are equal at phone width (`.lk-dialog-actions`); Sheet can show a named ×, a pinned subheader and a
   tall fixed height. As native. */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Sheet } from './Sheet';
import { Modal } from './Modal';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const mount = (el: React.ReactElement) => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => root.render(el));
  return () => act(() => root.unmount());
};
afterEach(() => {
  document.body.innerHTML = '';
});

describe('Sheet', () => {
  it('pins the footer under the body as dialog actions, in the order given', () => {
    const off = mount(
      <Sheet title="Edit profile" footer={<><button>Cancel</button><button>Save</button></>}>
        body
      </Sheet>,
    );
    const foot = document.querySelector('.lk-sheet-foot')!;
    expect(foot.classList.contains('lk-dialog-actions')).toBe(true);
    expect(foot.previousElementSibling!.className).toBe('lk-sheet-body');
    expect(Array.from(foot.children).map((b) => b.textContent)).toEqual(['Cancel', 'Save']);
    off();
  });

  it('a × named by closeLabel calls onClose; subheader is outside the body; tall', () => {
    const onClose = vi.fn();
    const off = mount(
      <Sheet title="Time zone" onClose={onClose} closeLabel="Cerrar" height="tall" subheader={<input aria-label="Search" />}>
        list
      </Sheet>,
    );
    act(() => document.querySelector<HTMLButtonElement>('[aria-label="Cerrar"]')!.click());
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.lk-sheet-body [aria-label="Search"]')).toBeNull();
    expect(document.querySelector('.lk-sheet-subheader [aria-label="Search"]')).not.toBeNull();
    expect(document.querySelector('.lk-sheet')!.classList.contains('lk-sheet--tall')).toBe(true);
    off();
  });

  it('no × without closeLabel', () => {
    const off = mount(<Sheet title="Time zone" onClose={() => {}} />);
    expect(document.querySelector('.lk-sheet-close')).toBeNull();
    off();
  });
});

describe('Modal', () => {
  it('its footer is dialog actions', () => {
    const off = mount(<Modal title="Delete" footer={<button>Cancel</button>}>x</Modal>);
    expect(document.querySelector('.lk-modal-foot')!.classList.contains('lk-dialog-actions')).toBe(true);
    off();
  });
});
