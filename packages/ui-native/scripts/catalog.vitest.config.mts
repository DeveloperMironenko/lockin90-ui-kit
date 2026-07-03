// Vitest config used ONLY by `scripts/build-catalog.mts` (static HTML catalog
// generator). Run from packages/ui-native:
//   pnpm exec vitest run --config scripts/catalog.vitest.config.mts
//
// Mirrors the aliasing the native Storybook uses (.storybook/main.ts):
// react-native → react-native-web, plus the Expo/native web stubs, plus
// web-first extension resolution so react-native-svg picks its .web build.
import { defineConfig, type Plugin } from 'vitest/config';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pkg = resolve(here, '..');

// esbuild isn't a direct dep of this package — reach it through vitest → vite → esbuild
// (same instance vite itself uses), so we add no dependencies.
const req = createRequire(import.meta.url);
const viteRequire = createRequire(req.resolve('vitest/package.json'));
const esbuildRequire = createRequire(viteRequire.resolve('vite/package.json'));
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
const esbuild: typeof import('esbuild') = esbuildRequire('esbuild');

/** Expo packages ship raw JSX inside .js build output (Metro handles it on
 *  device; @storybook/react-native-web-vite does the same transform for the
 *  browser preview). Teach vite's SSR pipeline to parse those files as JSX. */
const jsxInJs: Plugin = {
  name: 'catalog:jsx-in-expo-js',
  enforce: 'pre',
  async transform(code, id) {
    if (/node_modules\/(expo-[^/]+|@expo\/[^/]+)\/.*\.js$/.test(id)) {
      const out = await esbuild.transform(code, { loader: 'jsx', jsx: 'automatic', sourcefile: id });
      return { code: out.code, map: out.map || null };
    }
    return null;
  },
};

export default defineConfig({
  plugins: [jsxInJs],
  ssr: {
    // Keep the RN ecosystem in the vite pipeline at the vite level too —
    // otherwise vite marks them SSR-external before vite-node's deps.inline runs.
    noExternal: [/react-native/, /expo/],
  },
  resolve: {
    alias: {
      // Pin react-native-svg to its ESM build: its CJS `main` can't be
      // ssr-transformed, so vite-node executes it with a real Node `require()`
      // — bypassing the react-native→react-native-web alias and crashing on
      // real react-native's Flow syntax. The ESM entry keeps the whole package
      // inside the vite pipeline (aliases + .web.* extensions apply).
      'react-native-svg': resolve(pkg, 'node_modules/react-native-svg/lib/module/index.js'),
      'react-native': resolve(pkg, 'node_modules/react-native-web'),
      'expo-clipboard': resolve(pkg, '.storybook/expo-clipboard.web.ts'),
      'expo-blur': resolve(pkg, '.storybook/expo-blur.web.ts'),
      'expo-document-picker': resolve(pkg, '.storybook/expo-document-picker.web.ts'),
      '@react-native-community/datetimepicker': resolve(pkg, '.storybook/datetimepicker.web.ts'),
    },
    // Web-first, like @storybook/react-native-web-vite — react-native-svg and
    // expo-linear-gradient resolve their *.web.* sources instead of native ones.
    extensions: ['.web.tsx', '.web.ts', '.web.mjs', '.web.js', '.tsx', '.ts', '.mjs', '.js', '.json'],
  },
  test: {
    include: ['scripts/build-catalog.mts'],
    environment: 'node',
    testTimeout: 300_000,
    hookTimeout: 300_000,
    server: {
      deps: {
        // Must be vite-processed (not node-required) so the alias + web-first
        // extensions + jsx-in-js transform apply inside these packages too.
        inline: [/react-native/, /expo/],
      },
    },
  },
});
