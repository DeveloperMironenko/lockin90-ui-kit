// Regenerates src/index.ts (the main barrel) from src/components/*.
// Emits `export *` for every component plus a named default re-export
// (`export { default as X }`) when the component file has a default export.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'src', 'components');
const dirs = fs
  .readdirSync(root)
  .filter((d) => fs.statSync(path.join(root, d)).isDirectory())
  .sort();

const lines = ['// Generated barrel for @lockin90/ui — run scripts/gen-index.mjs to refresh.', ''];
for (const d of dirs) {
  const tsx = path.join(root, d, 'index.tsx');
  const ts = path.join(root, d, 'index.ts');
  const file = fs.existsSync(tsx) ? tsx : fs.existsSync(ts) ? ts : null;
  if (!file) {
    console.error('No index for', d);
    continue;
  }
  const src = fs.readFileSync(file, 'utf8');
  lines.push(`export * from './components/${d}';`);
  if (/export\s+default/.test(src)) {
    lines.push(`export { default as ${d} } from './components/${d}';`);
  }
}
fs.writeFileSync(path.join(here, '..', 'src', 'index.ts'), lines.join('\n') + '\n');
console.log(`[@lockin90/ui] wrote src/index.ts (${dirs.length} components)`);
