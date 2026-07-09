// Vitest config for the @lockin90/ui-native test suite (`pnpm test`).
//
// Mirrors the aliasing the native Storybook (.storybook/main.ts) and the
// static-catalog generator (scripts/catalog.vitest.config.mts) use:
// react-native → react-native-web, Expo/native web stubs, web-first extension
// resolution so react-native-svg / expo-linear-gradient pick their .web builds.
//
// On top of the catalog config it PINS react/react-dom to this package's own
// copy via resolve.alias: with the workspace's nested pnpm stores, externalized
// resolution can land inlined component code on a second react instance, which
// null-dispatcher-crashes every hooks component under renderToStaticMarkup.
import { defineConfig, type Plugin } from 'vitest/config';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = dirname(fileURLToPath(import.meta.url));

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
  name: 'test:jsx-in-expo-js',
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
    // Keep the RN ecosystem (and react itself — see header) in the vite
    // pipeline; otherwise vite marks them SSR-external before deps.inline runs.
    noExternal: [/react-native/, /expo/, /^react(-dom)?(\/|$)/, /lucide/],
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
      // ONE react per run: alias react/react-dom (and their subpath imports —
      // plain-string aliases also match `key + '/...'`) to this package's copy.
      'react-dom': resolve(pkg, 'node_modules/react-dom'),
      react: resolve(pkg, 'node_modules/react'),
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
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'node',
    testTimeout: 120_000,
    server: {
      deps: {
        // Must be vite-processed (not node-required) so the alias + web-first
        // extensions + jsx-in-js transform apply inside these packages too.
        inline: [/react-native/, /expo/, /^react(-dom)?(\/|$)/, /lucide/],
      },
    },
  },
});
