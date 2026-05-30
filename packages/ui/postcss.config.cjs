// PostCSS config consumed by Storybook's Vite builder so the Tailwind directives
// in .storybook/tailwind.css are expanded into utility classes.
//
// tailwindcss / postcss-import / autoprefixer are devDeps of the consuming apps
// (and live in the workspace pnpm store) rather than @lockin90/ui itself, so we
// resolve them from the monorepo root instead of relying on local hoisting.
const path = require('node:path');
const fs = require('node:fs');

const ROOT = path.resolve(__dirname, '..', '..');
const PNPM = path.join(ROOT, 'node_modules', '.pnpm');

function fromStore(prefix, sub) {
  const dir = fs
    .readdirSync(PNPM)
    .filter((d) => d.startsWith(prefix))
    .sort()
    .pop();
  return require(path.join(PNPM, dir, 'node_modules', sub));
}

const tailwindcss = fromStore('tailwindcss@', 'tailwindcss');
const postcssImport = fromStore('postcss-import@', 'postcss-import');
const autoprefixer = fromStore('autoprefixer@', 'autoprefixer');

module.exports = {
  plugins: [
    postcssImport(),
    tailwindcss({ config: path.join(__dirname, 'tailwind.config.cjs') }),
    autoprefixer(),
  ],
};
