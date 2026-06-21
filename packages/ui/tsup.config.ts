import { defineConfig } from 'tsup';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/** Concatenate the authored CSS partials into a single dist/styles.css.
 *  Order: base → primitives → every component stylesheet (alpha). */
function bundleCss() {
  const stylesDir = join('src', 'styles');
  const compDir = join(stylesDir, 'components');
  const parts: string[] = [];
  for (const f of ['base.css', 'primitives.css']) {
    const p = join(stylesDir, f);
    if (existsSync(p)) parts.push(`/* ${f} */\n` + readFileSync(p, 'utf8'));
  }
  if (existsSync(compDir)) {
    for (const f of readdirSync(compDir).filter((n) => n.endsWith('.css')).sort()) {
      parts.push(`/* components/${f} */\n` + readFileSync(join(compDir, f), 'utf8'));
    }
  }
  const header =
    '/* @lockin90/ui — Aurora Flux component styles. Pair with @lockin90/tokens/tokens.css.\n' +
    '   import "@lockin90/tokens/tokens.css";\n' +
    '   import "@lockin90/ui/styles.css"; */\n\n';
  writeFileSync(join('dist', 'styles.css'), header + parts.join('\n\n'));
}

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.mjs' }),
  dts: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', 'react/jsx-runtime', '@lockin90/tokens'],
  onSuccess: async () => {
    bundleCss();
  },
});
