/**
 * Test-only helpers for asserting on react-native-web SSR output in a plain
 * `node` vitest environment (no jsdom in this workspace): render a component
 * to static markup, parse it with a minimal well-formed-HTML parser (React's
 * `renderToStaticMarkup` output only), and map react-native-web's atomic CSS
 * classes back to declarations via `StyleSheet.getSheet()`.
 */
import { createElement, type ComponentType, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StyleSheet } from 'react-native';

/** Render an element (or component + props) to static HTML. */
export function render(el: ReactElement): string;
export function render<P extends object>(comp: ComponentType<P>, props: P): string;
export function render(elOrComp: unknown, props?: object): string {
  const el =
    props === undefined && typeof elOrComp === 'object'
      ? (elOrComp as ReactElement)
      : createElement(elOrComp as ComponentType, props);
  return renderToStaticMarkup(el);
}

/* ------------------------------------------------------------------ */
/* Minimal HTML tree                                                   */
/* ------------------------------------------------------------------ */

export interface El {
  tag: string;
  attrs: Record<string, string>;
  children: El[];
  /** direct text content (concatenated text nodes) */
  text: string;
  parent: El | null;
}

const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']);

/** Parse React static markup into a tree. Handles `<tag a="v">`, `</tag>`,
 *  self-closed `<tag/>` and HTML void tags; no comments/doctype/script needed. */
export function parse(html: string): El {
  const root: El = { tag: '#root', attrs: {}, children: [], text: '', parent: null };
  let cur = root;
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:="[^"]*")?)*)\s*(\/?)>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(html)) !== null) {
    const textChunk = html.slice(last, m.index);
    if (textChunk) cur.text += decode(textChunk);
    last = tagRe.lastIndex;
    const [, closing, rawTag, rawAttrs, selfClose] = m;
    const tag = rawTag.toLowerCase();
    if (closing) {
      // walk up to the matching open tag (defensive — output is well formed)
      let up: El | null = cur;
      while (up && up.tag !== tag) up = up.parent;
      cur = up?.parent ?? root;
      continue;
    }
    const el: El = { tag, attrs: parseAttrs(rawAttrs), children: [], text: '', parent: cur };
    cur.children.push(el);
    if (!selfClose && !VOID_TAGS.has(tag)) cur = el;
  }
  const tail = html.slice(last);
  if (tail) cur.text += decode(tail);
  return root;
}

function parseAttrs(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:="([^"]*)")?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    if (m[1]) attrs[m[1]] = m[2] !== undefined ? decode(m[2]) : '';
  }
  return attrs;
}

function decode(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
}

/** Depth-first collect of every element matching `pred`. */
export function findAll(node: El, pred: (el: El) => boolean): El[] {
  const out: El[] = [];
  const walk = (el: El) => {
    if (el.tag !== '#root' && pred(el)) out.push(el);
    el.children.forEach(walk);
  };
  walk(node);
  return out;
}

/** First element whose DIRECT text equals `text` (trimmed). */
export function findByText(node: El, text: string): El | undefined {
  return findAll(node, (el) => el.text.trim() === text)[0];
}

/** Ancestors of `el`, nearest first (excluding the #root sentinel). */
export function ancestors(el: El): El[] {
  const out: El[] = [];
  for (let p = el.parent; p && p.tag !== '#root'; p = p.parent) out.push(p);
  return out;
}

/** Parse `style="a:b;c:d"` into a record. */
export function inlineStyle(el: El): Record<string, string> {
  const out: Record<string, string> = {};
  for (const decl of (el.attrs.style ?? '').split(';')) {
    const i = decl.indexOf(':');
    if (i > 0) out[decl.slice(0, i).trim()] = decl.slice(i + 1).trim();
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* react-native-web atomic-class lookup                                */
/* ------------------------------------------------------------------ */

/** Class names whose rule contains `declaration` (e.g. `align-items:flex-end`)
 *  in react-native-web's accumulated style sheet. Must be called AFTER the
 *  styles in question have been rendered at least once. */
export function classesFor(declaration: string): string[] {
  const sheet = (StyleSheet as unknown as { getSheet(): { textContent: string } }).getSheet();
  const out: string[] = [];
  const re = /\.([A-Za-z0-9_-]+)\{([^}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sheet.textContent)) !== null) {
    if (m[2].includes(declaration)) out.push(m[1]);
  }
  return out;
}

/** Does `el` carry any class matching `declaration` (via `classesFor`)? */
export function hasDeclaration(el: El, declaration: string): boolean {
  const classes = new Set((el.attrs.class ?? '').split(/\s+/));
  return classesFor(declaration).some((c) => classes.has(c));
}
