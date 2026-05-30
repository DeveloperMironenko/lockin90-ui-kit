// Regenerates src/admin.ts (the @lockin90/ui/admin barrel) from src/admin/*.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'src', 'admin');
const dirs = fs
  .readdirSync(root)
  .filter((d) => fs.statSync(path.join(root, d)).isDirectory())
  .sort();

const lines = ['// @lockin90/ui/admin — operator-surface primitives. Run scripts/gen-admin.mjs to refresh.', ''];
for (const d of dirs) {
  const tsx = path.join(root, d, 'index.tsx');
  const ts = path.join(root, d, 'index.ts');
  const file = fs.existsSync(tsx) ? tsx : fs.existsSync(ts) ? ts : null;
  if (!file) {
    console.error('No index for', d);
    continue;
  }
  const src = fs.readFileSync(file, 'utf8');
  lines.push(`export * from './admin/${d}';`);
  if (/export\s+default/.test(src)) {
    lines.push(`export { default as ${d} } from './admin/${d}';`);
  }
}
fs.writeFileSync(path.join(here, '..', 'src', 'admin.ts'), lines.join('\n') + '\n');
console.log(`[@lockin90/ui] wrote src/admin.ts (${dirs.length} admin components)`);
