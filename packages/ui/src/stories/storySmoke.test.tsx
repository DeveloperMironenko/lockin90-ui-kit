/* Story-driven smoke suite — enumerates EVERY *.stories.tsx file in this
   directory via import.meta.glob and renders each story export (everything
   except `default`) to static markup, asserting non-empty output. CSF3
   semantics are honored: args merge as { ...meta.args, ...story.args }, and
   `render()` runs INSIDE a function component (Storybook mounts it as one, so
   hook-using render functions work). A story that resolves neither a
   `render()` nor a `component` fails loudly; stories that genuinely cannot
   render server-side live in the explicit SKIP map below (every entry
   justified) — no silent exclusions. */
import { createElement, type ComponentType, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';

interface StoryLike {
  render?: (args: Record<string, unknown>, context: never) => ReactNode;
  component?: ComponentType<Record<string, unknown>>;
  args?: Record<string, unknown>;
}

interface StoryModule {
  default?: { component?: ComponentType<Record<string, unknown>>; args?: Record<string, unknown> };
  [exportName: string]: unknown;
}

/* `import.meta.glob` is Vite's static glob import — Vitest provides it at
   runtime. The package has no resolvable `vite/client` types (vite arrives
   transitively via storybook/vitest), so declare the one signature we use. */
declare global {
  interface ImportMeta {
    glob(pattern: string, options: { eager: true }): Record<string, StoryModule>;
  }
}

/* Stories that CANNOT render with react-dom/server (throw or render nothing
   during render itself, not in effects). Key = '<File>/<Export>'. Every skip
   must carry a reason. */
const SKIP: Record<string, string> = {
  'Modal/Default':
    'Modal is a document.body portal gated on a client-mount effect (`if (!open || !mounted) return null`) — ' +
    'renderToStaticMarkup never runs effects, so it renders null by design; needs a DOM to produce markup.',
};

const modules = import.meta.glob('./*.stories.tsx', { eager: true });

const files = Object.keys(modules).sort();
if (files.length === 0) throw new Error('import.meta.glob found no ./*.stories.tsx files');

for (const file of files) {
  const mod = modules[file];
  const meta = mod.default;
  // './Card.stories.tsx' → 'Card'; './FunnelChart.charts.stories.tsx' → 'FunnelChart.charts'
  const title = file.replace(/^\.\//, '').replace(/\.stories\.tsx$/, '');
  const storyNames = Object.keys(mod).filter((k) => k !== 'default');

  describe(title, () => {
    if (storyNames.length === 0) {
      test(`${title} has at least one story export`, () => {
        throw new Error(`${file} exports no stories (only \`default\`)`);
      });
      return;
    }

    for (const name of storyNames) {
      const id = `${title}/${name}`;
      const reason = SKIP[id];
      if (reason) {
        test.skip(`${id} renders [SKIPPED: ${reason}]`, () => {});
        continue;
      }

      test(`${id} renders`, () => {
        const story = mod[name] as StoryLike | null;
        if (story == null || typeof story !== 'object') {
          throw new Error(`${id}: export is not a CSF3 story object (got ${typeof story})`);
        }

        // CSF arg resolution: story args override meta-level args.
        const args = { ...meta?.args, ...story.args };
        const render = story.render;
        const component = story.component ?? meta?.component;
        if (typeof render !== 'function' && !component) {
          throw new Error(
            `${id}: story has neither its own render() nor a meta.component — cannot resolve an element to smoke-render`,
          );
        }

        // Run render() inside a function component (Storybook does the same),
        // so stories whose render uses hooks work under renderToStaticMarkup.
        const Story: ComponentType = () =>
          typeof render === 'function' ? render(args, {} as never) : createElement(component!, args);

        const html = renderToStaticMarkup(createElement(Story));
        expect(html.trim().length, `${id}: rendered EMPTY markup`).toBeGreaterThan(0);
      });
    }
  });
}
