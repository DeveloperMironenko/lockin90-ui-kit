/**
 * Registry-driven story smoke suite: renders EVERY story export of every
 * module in the generated `STORY_MODULES` registry (all 134 modules, every
 * variant) through react-native-web SSR (`renderToStaticMarkup`, react-native
 * aliased to react-native-web by vitest.config.mts) and asserts non-empty
 * output — one named test per story.
 *
 * Native-only peers (expo-blur / expo-clipboard / expo-document-picker /
 * @react-native-community/datetimepicker) resolve to the same web stubs the
 * native Storybook uses (.storybook/*.web.ts); expo-linear-gradient is a real
 * install with a web build. Stories that still cannot render under web
 * aliasing must be added to the explicit SKIP list below with a justification
 * — no silent exclusions.
 */
import { createElement, isValidElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { STORY_MODULES } from '../index';

/** `"<meta title>/<export name>"` → why it cannot be smoke-rendered.
 *
 * react-native-web's `Modal` mounts its content through a DOM portal after the
 * component is on the client (`ModalPortal` returns null during SSR), so any
 * story whose root is an OPEN `Modal`/`Sheet` legitimately produces empty
 * server markup. The components themselves are still covered: `Sheet/Bottom`
 * and `Sheet/Left` wrap the sheet in a demo View (non-empty markup), and both
 * components' inner panels are plain Views once the portal exists on device. */
const SKIP = new Map<string, string>([
  ['Native/Modal/Default', 'react-native-web Modal is a client-only DOM portal — SSR output is empty by design'],
  ['Native/Modal/Small', 'react-native-web Modal is a client-only DOM portal — SSR output is empty by design'],
  ['Native/Sheet/Right', 'root is an open Sheet (react-native-web Modal portal) — SSR output is empty by design'],
]);

interface CsfStory {
  render?: (args: Record<string, unknown>) => unknown;
  args?: Record<string, unknown>;
}
interface CsfMeta {
  title?: string;
  component?: unknown;
  args?: Record<string, unknown>;
}

for (const [moduleName, mod] of Object.entries(STORY_MODULES)) {
  const meta = (mod.default ?? {}) as CsfMeta;
  const title = meta.title ?? moduleName;

  for (const [exportName, storyExport] of Object.entries(mod)) {
    if (exportName === 'default' || exportName === '__namedExportsOrder') continue;
    const id = `${title}/${exportName}`;

    if (SKIP.has(id)) {
      test.skip(`${id} renders — SKIPPED: ${SKIP.get(id)}`, () => {});
      continue;
    }

    test(`${id} renders`, () => {
      const story = (typeof storyExport === 'object' && storyExport !== null ? storyExport : {}) as CsfStory;
      const args: Record<string, unknown> = { ...(meta.args ?? {}), ...(story.args ?? {}) };

      // Resolve how the element is produced — clear failure if there is no way.
      let produce: () => unknown;
      if (typeof storyExport === 'function') {
        // CSF2-style function story
        produce = () => (storyExport as (a: Record<string, unknown>) => unknown)(args);
      } else if (typeof story.render === 'function') {
        produce = () => story.render!(args);
      } else if (meta.component) {
        const Component = meta.component as never;
        produce = () => createElement(Component, args as never);
      } else {
        throw new Error(`${id}: story has no render() and its meta has no component — cannot resolve an element`);
      }

      // Invoke render() INSIDE a component, exactly as Storybook does — several
      // stories call useState from their render function.
      const Harness = () => {
        const el = produce();
        if (!isValidElement(el)) {
          throw new Error(`${id}: story did not resolve to a React element (got ${typeof el})`);
        }
        return el as ReactElement;
      };
      const html = renderToStaticMarkup(createElement(Harness));
      expect(html.trim(), `${id} rendered EMPTY markup`).not.toBe('');
    });
  }
}
