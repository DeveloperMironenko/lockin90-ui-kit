import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** The open dialogs, last opened last: only the top one traps Tab (a dialog opened from a dialog). */
const stack: HTMLElement[] = [];

/** A modal dialog's focus (Modal, Sheet — not exported): while `active`, focus moves into the panel (the
 *  panel itself, so its name is read, unless something inside already took it, e.g. an `autoFocus`
 *  field), Tab and Shift+Tab stay inside it (the topmost dialog only), and on close focus goes back to
 *  what had it before the dialog opened. The panel needs `tabIndex={-1}`. */
export function useDialogFocus(active: boolean, panelRef: RefObject<HTMLElement | null>) {
  // The opener is read while rendering the render that opens the dialog: by the time effects run, an
  // `autoFocus` child has already taken focus.
  const opener = useRef<HTMLElement | null>(null);
  const wasActive = useRef(false);
  if (active && !wasActive.current && typeof document !== 'undefined') {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }
  wasActive.current = active;

  useEffect(() => {
    const panel = panelRef.current;
    if (!active || !panel) return;
    const previous = opener.current;
    stack.push(panel);
    if (!panel.contains(document.activeElement)) panel.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || stack[stack.length - 1] !== panel) return;
      const list = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      const at = document.activeElement;
      if (!list.length) {
        e.preventDefault();
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && (at === first || at === panel || !panel.contains(at))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (at === last || !panel.contains(at))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      const at = stack.indexOf(panel);
      if (at >= 0) stack.splice(at, 1);
      if (previous?.isConnected) previous.focus();
    };
  }, [active, panelRef]);
}
