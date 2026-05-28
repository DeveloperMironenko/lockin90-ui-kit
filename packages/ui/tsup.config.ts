import { defineConfig } from 'tsup';
import { preserveDirectivesPlugin } from 'esbuild-plugin-preserve-directives';

// bundle:false transpiles each source file 1:1 so per-file "use client"
// directives (and React Server Component boundaries) survive into the output
// and consumers can tree-shake at the component level.
export default defineConfig({
  entry: ['src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}', '!src/**/*.stories.tsx'],
  format: ['esm', 'cjs'],
  bundle: false,
  splitting: false,
  dts: true,
  clean: true,
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.mjs' };
  },
  esbuildPlugins: [
    preserveDirectivesPlugin({
      directives: ['use client', 'use server'],
      include: /\.(ts|tsx)$/,
      exclude: /node_modules/,
    }),
  ],
});
