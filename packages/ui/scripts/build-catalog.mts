/**
 * Static HTML catalog generator for @lockin90/ui (web).
 *
 * Renders EVERY story export of every `src/stories/*.stories.tsx` file to
 * static markup (react-dom/server) and writes a single self-contained
 * `<repo>/catalog/web.html` (inline tokens.css + dist/styles.css, no external
 * requests) that can be opened via file://.
 *
 * Run (from packages/ui):
 *   pnpm exec vitest run --config scripts/catalog.vitest.config.mts
 */
import { test } from 'vitest';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const here = dirname(fileURLToPath(import.meta.url));
const pkgDir = resolve(here, '..');
const repoRoot = resolve(pkgDir, '../..');
const outFile = resolve(repoRoot, 'catalog', 'web.html');

/* ------------------------------------------------------------------ */
/* CSF (Component Story Format) — minimal static renderer              */
/* ------------------------------------------------------------------ */

type AnyRecord = Record<string, unknown>;
type RenderFn = (args: AnyRecord, ctx: AnyRecord) => ReactNode;
type Decorator = (Story: () => ReactNode, ctx: AnyRecord) => ReactNode;

interface CsfMeta {
  title?: string;
  component?: unknown;
  args?: AnyRecord;
  parameters?: AnyRecord;
  render?: RenderFn;
  decorators?: Decorator[];
}

interface RenderedStory {
  name: string;
  exportName: string;
  layout: string;
  html: string | null;
  error: string | null; // set → placeholder card
}

/** Inline SVG shown where a story referenced a remote image — the catalog must
 *  work offline with zero network requests. (encodeURIComponent escapes the
 *  xmlns "http" so no literal external URL remains in the file.) */
const OFFLINE_IMG =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><rect width="100%" height="100%" fill="#101421"/><rect width="100%" height="100%" fill="url(#g)"/><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8B9CFF" stop-opacity="0.25"/><stop offset="0.55" stop-color="#34F5C5" stop-opacity="0.18"/><stop offset="1" stop-color="#B7F34D" stop-opacity="0.22"/></linearGradient></defs><text x="50%" y="50%" fill="#5B6480" font-family="monospace" font-size="26" text-anchor="middle">remote image stripped — offline catalog</text></svg>`,
  );

/** Rewrite any external resource reference to a local data URI / inert anchor. */
function stripExternalResources(html: string): string {
  return html
    .replace(/(\s(?:src|poster)=")https?:\/\/[^"]*(")/g, `$1${OFFLINE_IMG}$2`)
    .replace(/\ssrcset="[^"]*"/g, (m) => (/https?:\/\//.test(m) ? '' : m))
    .replace(/(\shref=")https?:\/\/[^"]*(")/g, '$1#$2')
    .replace(/url\((['"]?)https?:\/\/[^)'"]*\1\)/g, `url(${OFFLINE_IMG})`);
}

interface Section {
  title: string;
  file: string;
  stories: RenderedStory[];
}

/** "TwoSeries" → "Two Series" (Storybook's export-name prettifier, simplified). */
function prettifyName(exportName: string): string {
  return exportName
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .replace(/^\s+|\s+$/g, '');
}

function renderStory(meta: CsfMeta, storyExport: unknown, exportName: string): RenderedStory {
  const story = (typeof storyExport === 'object' && storyExport !== null ? storyExport : {}) as AnyRecord;
  const args: AnyRecord = { ...(meta.args ?? {}), ...((story.args as AnyRecord) ?? {}) };
  const parameters: AnyRecord = { ...(meta.parameters ?? {}), ...((story.parameters as AnyRecord) ?? {}) };
  const layout = typeof parameters.layout === 'string' ? parameters.layout : 'padded';
  const name = typeof story.name === 'string' ? story.name : prettifyName(exportName);
  const ctx: AnyRecord = { args, parameters, name, title: meta.title };

  const renderFn: RenderFn | undefined =
    typeof storyExport === 'function'
      ? (storyExport as RenderFn)
      : ((story.render as RenderFn | undefined) ?? meta.render);

  const decorators: Decorator[] = [
    ...(((story.decorators as Decorator[] | undefined) ?? [])),
    ...((meta.decorators ?? [])),
  ];

  try {
    const Root = () => {
      let node: () => ReactNode;
      if (renderFn) {
        node = () => renderFn(args, ctx);
      } else if (meta.component) {
        node = () => createElement(meta.component as never, args as never);
      } else {
        throw new Error('story has no render() and meta has no component');
      }
      for (const dec of decorators) {
        const prev = node;
        const Prev = () => prev();
        node = () => dec(Prev, ctx);
      }
      return node();
    };
    const html = renderToStaticMarkup(createElement(Root));
    if (html.trim() === '') {
      return { name, exportName, layout, html: null, error: 'client-only: renders nothing on the server (empty SSR output — e.g. mounted-gate/portal)' };
    }
    return { name, exportName, layout, html: stripExternalResources(html), error: null };
  } catch (err) {
    return { name, exportName, layout, html: null, error: `SSR failed: ${err instanceof Error ? err.message : String(err)}` };
  }
}

/* ------------------------------------------------------------------ */
/* HTML page scaffold                                                  */
/* ------------------------------------------------------------------ */

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Strip external @import lines (Google Fonts) — the catalog must make zero network requests. */
function stripExternalImports(css: string): string {
  return css.replace(/@import\s+url\((['"]?)https?:\/\/[^)]*\1\)[^;]*;/g, '/* external @import stripped for offline catalog */');
}

/** Offline font mapping: use the real brand font when installed locally, else
 *  fall back to a close local face — never a network fetch, never serif. */
const FONT_FALLBACK_CSS = `
  @font-face { font-family: 'Space Grotesk'; font-weight: 100 900; src: local('Space Grotesk'), local('Helvetica Neue'), local('Segoe UI'), local('Arial'); }
  @font-face { font-family: 'Inter'; font-weight: 100 900; src: local('Inter'), local('Helvetica Neue'), local('Segoe UI'), local('Arial'); }
  @font-face { font-family: 'JetBrains Mono'; font-weight: 100 900; src: local('JetBrains Mono'), local('Menlo'), local('Consolas'), local('Courier New'); }
`;

const CATALOG_CSS = `
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { margin: 0; background: var(--bg-0, #080A12); color: var(--text, #E8ECF8); font-family: 'Inter', system-ui, -apple-system, sans-serif; }
  .cat-shell { display: grid; grid-template-columns: 264px minmax(0, 1fr); min-height: 100vh; }
  .cat-nav { position: sticky; top: 0; height: 100vh; overflow-y: auto; padding: 20px 14px 40px; border-right: 1px solid rgba(139,156,255,0.14); background: rgba(10,13,22,0.7); }
  .cat-nav h3 { font: 600 10px/1.4 'Space Grotesk', system-ui, sans-serif; letter-spacing: 0.14em; text-transform: uppercase; color: #8B9CFF; margin: 18px 6px 6px; }
  .cat-nav a { display: block; padding: 3px 8px; border-radius: 6px; font-size: 12.5px; color: #A6B0CF; text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cat-nav a:hover { background: rgba(139,156,255,0.10); color: #E8ECF8; }
  .cat-nav a small { color: #5B6480; }
  .cat-main { padding: 28px 36px 120px; min-width: 0; }
  .cat-header { padding: 8px 0 22px; border-bottom: 1px solid rgba(139,156,255,0.14); margin-bottom: 26px; }
  .cat-header h1 { font: 700 26px/1.15 'Space Grotesk', system-ui, sans-serif; margin: 0 0 6px; background: linear-gradient(90deg,#8B9CFF,#34F5C5 55%,#B7F34D); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .cat-header p { margin: 2px 0; color: #A6B0CF; font-size: 13px; }
  .cat-header .cat-note { color: #5B6480; font-size: 12px; }
  .cat-section { margin: 0 0 44px; }
  .cat-section > h2 { font: 600 17px/1.2 'Space Grotesk', system-ui, sans-serif; color: #E8ECF8; margin: 0 0 4px; padding-top: 12px; }
  .cat-section > h2 small { color: #5B6480; font-weight: 400; font-size: 12px; margin-left: 8px; }
  .cat-section > .cat-file { color: #5B6480; font-size: 11px; font-family: 'JetBrains Mono', ui-monospace, monospace; margin: 0 0 14px; }
  .cat-grid { display: flex; flex-wrap: wrap; gap: 16px; }
  .cat-card { flex: 1 1 380px; max-width: 100%; min-width: 0; border: 1px solid rgba(139,156,255,0.14); border-radius: 14px; background: rgba(16,20,33,0.55); overflow: hidden; }
  .cat-card > header { padding: 8px 14px; font: 500 11.5px/1.4 'JetBrains Mono', ui-monospace, monospace; letter-spacing: 0.04em; color: #8B9CFF; border-bottom: 1px solid rgba(139,156,255,0.10); background: rgba(10,13,22,0.5); }
  /* contain:paint keeps position:fixed overlays (sheet/drawer scrims) inside their card
     instead of covering the whole catalog page. */
  .cat-preview { padding: 24px; overflow-x: auto; background: var(--bg-0, #080A12); contain: paint; position: relative; min-height: 60px; }
  .cat-preview[data-layout='centered'] { display: flex; align-items: center; justify-content: center; min-height: 96px; }
  .cat-preview[data-layout='fullscreen'] { padding: 0; }
  .cat-card--placeholder .cat-preview { display: flex; align-items: center; justify-content: center; min-height: 96px; }
  .cat-placeholder { border: 1px dashed rgba(255,184,90,0.4); border-radius: 10px; padding: 14px 16px; color: #FFB85A; font-size: 12px; max-width: 460px; }
  .cat-placeholder b { display: block; margin-bottom: 4px; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; }
  @media (max-width: 880px) { .cat-shell { grid-template-columns: 1fr; } .cat-nav { position: static; height: auto; border-right: 0; border-bottom: 1px solid rgba(139,156,255,0.14); } }
`;

function buildPage(opts: {
  pkgLabel: string;
  sections: Section[];
  extraCss: string[];
  storyTotal: number;
  placeholderTotal: number;
}): string {
  const { pkgLabel, sections, extraCss, storyTotal, placeholderTotal } = opts;
  const date = new Date().toISOString().slice(0, 10);

  // Nav grouped by title category ("Charts/AreaChart" → "Charts").
  const byCategory = new Map<string, Section[]>();
  for (const s of sections) {
    const cat = s.title.includes('/') ? s.title.slice(0, s.title.indexOf('/')) : 'Other';
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(s);
  }
  const nav = [...byCategory.entries()]
    .map(
      ([cat, secs]) =>
        `<h3>${escapeHtml(cat)}</h3>` +
        secs
          .map((s) => {
            const label = s.title.includes('/') ? s.title.slice(s.title.indexOf('/') + 1) : s.title;
            return `<a href="#${slug(s.title)}">${escapeHtml(label)} <small>${s.stories.length}</small></a>`;
          })
          .join('\n'),
    )
    .join('\n');

  const body = sections
    .map((s) => {
      const cards = s.stories
        .map((st) => {
          if (st.error !== null) {
            return `<article class="cat-card cat-card--placeholder" data-export="${escapeHtml(st.exportName)}"><header>${escapeHtml(st.name)}</header><div class="cat-preview"><div class="cat-placeholder"><b>not statically renderable</b>${escapeHtml(st.error)}</div></div></article>`;
          }
          return `<article class="cat-card" data-export="${escapeHtml(st.exportName)}"><header>${escapeHtml(st.name)}</header><div class="cat-preview lk-app" data-layout="${escapeHtml(st.layout)}">${st.html}</div></article>`;
        })
        .join('\n');
      return `<section class="cat-section" id="${slug(s.title)}"><h2>${escapeHtml(s.title)}<small>${s.stories.length} ${s.stories.length === 1 ? 'story' : 'stories'}</small></h2><p class="cat-file">${escapeHtml(s.file)}</p><div class="cat-grid">${cards}</div></section>`;
    })
    .join('\n');

  const placeholderNote = placeholderTotal > 0 ? ` · ${placeholderTotal} placeholder card${placeholderTotal === 1 ? '' : 's'}` : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>LockIn90 UI Kit — ${escapeHtml(pkgLabel)} catalog</title>
<style>
${extraCss.join('\n\n')}

${CATALOG_CSS}
</style>
</head>
<body>
<div class="cat-shell">
<nav class="cat-nav">${nav}</nav>
<main class="cat-main">
<header class="cat-header">
<h1>LockIn90 UI Kit — ${escapeHtml(pkgLabel)}</h1>
<p>${sections.length} components · ${storyTotal} stories${placeholderNote} · generated ${date}</p>
<p class="cat-note">SSR static preview — interactions/animations are not live. Fully self-contained (zero network requests); brand fonts (Space Grotesk / Inter / JetBrains Mono) render only if installed locally, otherwise system fallbacks apply.</p>
</header>
${body}
</main>
</div>
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* Generator                                                           */
/* ------------------------------------------------------------------ */

test('build catalog/web.html', async () => {
  const modules = import.meta.glob('../src/stories/*.stories.tsx');
  const sections: Section[] = [];
  let storyTotal = 0;
  let placeholderTotal = 0;
  const placeholderLog: string[] = [];

  for (const [path, load] of Object.entries(modules).sort(([a], [b]) => a.localeCompare(b))) {
    const file = path.replace('../', 'packages/ui/');
    const short = path.split('/').pop()!.replace('.stories.tsx', '');
    let mod: AnyRecord;
    try {
      mod = (await load()) as AnyRecord;
    } catch (err) {
      sections.push({
        title: short,
        file,
        stories: [{ name: 'module import failed', exportName: short, layout: 'padded', html: null, error: String(err instanceof Error ? err.message : err) }],
      });
      placeholderTotal += 1;
      placeholderLog.push(`${short} (whole file): import failed — ${err instanceof Error ? err.message : err}`);
      continue;
    }

    const meta = (mod.default ?? {}) as CsfMeta;
    const title = meta.title ?? short;
    const stories: RenderedStory[] = [];
    for (const [key, value] of Object.entries(mod)) {
      if (key === 'default' || key === '__namedExportsOrder') continue;
      const rendered = renderStory(meta, value, key);
      stories.push(rendered);
      storyTotal += 1;
      if (rendered.error !== null) {
        placeholderTotal += 1;
        placeholderLog.push(`${title} / ${rendered.name}: ${rendered.error}`);
      }
    }
    sections.push({ title, file, stories });
  }

  sections.sort((a, b) => a.title.localeCompare(b.title));

  const tokensCss = stripExternalImports(readFileSync(resolve(repoRoot, 'packages/tokens/src/tokens.css'), 'utf8'));
  const stylesCss = stripExternalImports(readFileSync(resolve(pkgDir, 'dist/styles.css'), 'utf8'));

  const html = buildPage({
    pkgLabel: '@lockin90/ui (web)',
    sections,
    extraCss: [FONT_FALLBACK_CSS, tokensCss, stylesCss],
    storyTotal,
    placeholderTotal,
  });

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);

  // eslint-disable-next-line no-console
  console.log(`\n[catalog] wrote ${outFile}`);
  console.log(`[catalog] ${sections.length} components, ${storyTotal} stories, ${placeholderTotal} placeholders`);
  if (placeholderLog.length > 0) {
    console.log('[catalog] placeholder cards:');
    for (const line of placeholderLog) console.log(`  - ${line}`);
  }
});
