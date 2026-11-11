/// <reference lib="dom" />
/**
 * Test-only helpers for behaviour that needs a live tree (focus, presses, effects, hit areas): mount a
 * component into the happy-dom document through react-native-web and read the React props a
 * react-native-web DOM node was rendered from (`hitSlop`, `accessibilityHint`… are not in the markup).
 * A test file using them starts with `// @vitest-environment happy-dom`.
 */
import { act, type ReactElement } from 'react';
import { createRoot } from 'react-dom/client';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

export function mount(el: ReactElement) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => root.render(el));
  return {
    host,
    rerender: (next: ReactElement) => act(() => root.render(next)),
    unmount: () => {
      act(() => root.unmount());
      host.remove();
    },
  };
}

type Fiber = {
  tag: number;
  memoizedProps?: Record<string, unknown>;
  return: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
  stateNode: unknown;
};

/** The node's fiber in the committed tree (the one cached on the node can be the stale alternate). */
function currentFiber(node: Element): Fiber | null {
  const fiberKey = Object.keys(node).find((k) => k.startsWith('__reactFiber$'));
  let top = fiberKey ? ((node as unknown as Record<string, Fiber>)[fiberKey] as Fiber | null) : null;
  while (top?.return) top = top.return;
  const stack = top ? [(top.stateNode as { current: Fiber }).current] : [];
  while (stack.length) {
    const f = stack.pop()!;
    if (f.stateNode === node) return f;
    if (f.sibling) stack.push(f.sibling);
    if (f.child) stack.push(f.child);
  }
  return null;
}

/** The nearest props, from the DOM node up through its owners, that carry `key`. */
export function propOf(node: Element, key: string): unknown {
  let fiber = currentFiber(node);
  while (fiber) {
    if (fiber.memoizedProps && key in fiber.memoizedProps && fiber.memoizedProps[key] !== undefined)
      return fiber.memoizedProps[key];
    fiber = fiber.return;
  }
  return undefined;
}

/** The touch target (pt) of a pressable node drawn `w`×`h`: its size plus its `hitSlop`. */
export function target(node: Element, w: number, h: number) {
  const slop = propOf(node, 'hitSlop') as number | { top?: number; bottom?: number; left?: number; right?: number } | undefined;
  const s = typeof slop === 'number' ? { top: slop, bottom: slop, left: slop, right: slop } : (slop ?? {});
  return { width: w + (s.left ?? 0) + (s.right ?? 0), height: h + (s.top ?? 0) + (s.bottom ?? 0) };
}

export const click = (node: Element) =>
  act(() => {
    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
