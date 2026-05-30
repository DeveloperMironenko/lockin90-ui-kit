// Tailwind config used ONLY for Storybook (and any local CSS tooling) so the
// kit's utility classes render in the docs site. Apps that consume @lockin90/ui
// supply their own tailwind.config with the same @lockin90/tokens preset.
const preset = require('@lockin90/tokens/tailwind-preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './.storybook/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Admin-only tokens (mirrors lockin90-admin/tailwind.config.ts) so admin
      // primitives like AuditEntry/DataTable render correctly in Storybook.
      colors: {
        'border-subtle': '#131313',
        'green-zone': '#3FB661',
        'amber-zone': '#F0A93B',
      },
    },
  },
};
