import { defineConfig } from 'tsup';
import { copyFileSync } from 'node:fs';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.mjs' }),
  dts: true,
  clean: true,
  treeshake: true,
  // ship the raw CSS custom-property sheet alongside the JS token values
  onSuccess: async () => {
    copyFileSync('src/tokens.css', 'dist/tokens.css');
  },
});
