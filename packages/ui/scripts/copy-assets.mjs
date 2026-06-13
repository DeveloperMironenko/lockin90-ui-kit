import { copyFileSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const src = join(root, 'src');
mkdirSync(join(root, 'dist'), { recursive: true });

// The kit ships ONE global stylesheet (dist/styles.css). Component styling lives in the
// base src/styles.css plus per-component `styles.css` files under the subpath areas
// (src/admin/**, src/marketing/**) — kept separate so parallel component work never
// collides on one file. Concatenate them all here, base first.
function findCss(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...findCss(p));
    else if (entry.endsWith('.css')) out.push(p);
  }
  return out;
}

let css = readFileSync(join(src, 'styles.css'), 'utf8');
const extra = [...findCss(join(src, 'admin')), ...findCss(join(src, 'marketing'))].sort();
for (const file of extra) {
  css += `\n\n/* ${relative(src, file)} */\n${readFileSync(file, 'utf8')}`;
}
writeFileSync(join(root, 'dist', 'styles.css'), css);
console.log(`[@lockin90/ui] wrote dist/styles.css (base + ${extra.length} component sheets)`);
