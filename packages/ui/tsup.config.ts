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
  // marketing subpath styles (src/marketing/<Component>/styles.css) — folded into
  // the single global dist/styles.css so the app needs no extra CSS import.
  const mktDir = join('src', 'marketing');
  if (existsSync(mktDir)) {
    for (const d of readdirSync(mktDir).sort()) {
      const p = join(mktDir, d, 'styles.css');
      if (existsSync(p)) parts.push(`/* marketing/${d}/styles.css */\n` + readFileSync(p, 'utf8'));
    }
  }
  const header =
    '/* @lockin90/ui — Aurora Flux component styles. Pair with @lockin90/tokens/tokens.css.\n' +
    '   import "@lockin90/tokens/tokens.css";\n' +
    '   import "@lockin90/ui/styles.css"; */\n\n';
  writeFileSync(join('dist', 'styles.css'), header + parts.join('\n\n'));
}

export default defineConfig({
  entry: ['src/index.ts', 'src/marketing/index.ts', 'src/admin/index.ts'],
  format: ['esm', 'cjs'],
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.mjs' }),
  dts: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', 'react/jsx-runtime', '@lockin90/tokens'],
  onSuccess: async () => {
    bundleCss();
    // The kit is a client-component library (hooks throughout); bundling strips the per-file
    // "use client" directives, so app server components can't import the bundles directly. Prepend
    // the directive to both the base + marketing outputs so each is a client boundary.
    for (const rel of ['index', 'marketing/index', 'admin/index']) {
      for (const ext of ['mjs', 'cjs']) {
        const p = join('dist', `${rel}.${ext}`);
        if (existsSync(p)) {
          const src = readFileSync(p, 'utf8');
          if (!src.startsWith("'use client'")) writeFileSync(p, `'use client';\n` + src);
        }
      }
    }
  },
});
