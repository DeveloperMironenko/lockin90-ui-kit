// Vitest config used ONLY by `scripts/build-catalog.mts` (static HTML catalog
// generator). Run from packages/ui:
//   pnpm exec vitest run --config scripts/catalog.vitest.config.mts
// It is intentionally separate from the package's normal test setup.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['scripts/build-catalog.mts'],
    environment: 'node',
    testTimeout: 300_000,
    hookTimeout: 300_000,
  },
});
