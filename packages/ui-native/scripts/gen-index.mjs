// Regenerates src/index.ts (the main barrel) from flat src/components/*.tsx files.
// Emits `export *` for every component plus a named default re-export
// (`export { default as X }`) when the component file has a default export.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'src', 'components');
const files = fs
  .readdirSync(root)
  .filter((f) => /\.tsx?$/.test(f) && !f.endsWith('.d.ts'))
  .sort();

const lines = ['// Generated barrel for @p90/ui-native — run scripts/gen-index.mjs to refresh.', ''];
for (const f of files) {
  const name = f.replace(/\.tsx?$/, '');
  const src = fs.readFileSync(path.join(root, f), 'utf8');
  lines.push(`export * from './components/${name}';`);
  if (/export\s+default/.test(src)) {
    lines.push(`export { default as ${name} } from './components/${name}';`);
  }
}
fs.writeFileSync(path.join(here, '..', 'src', 'index.ts'), lines.join('\n') + '\n');
console.log(`[@p90/ui-native] wrote src/index.ts (${files.length} components)`);
