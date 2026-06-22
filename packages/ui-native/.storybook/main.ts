import type { StorybookConfig } from '@storybook/react-native-web-vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: { name: '@storybook/react-native-web-vite', options: {} },
  core: { disableTelemetry: true },
  // expo-clipboard pulls in the Expo native runtime (doesn't bundle for browser);
  // alias it to a navigator.clipboard stub so the native CopyButton works in preview.
  viteFinal: async (cfg) => {
    cfg.resolve ??= {};
    cfg.resolve.alias = {
      ...(cfg.resolve.alias as Record<string, string> | undefined),
      'expo-clipboard': resolve(here, 'expo-clipboard.web.ts'),
    };
    return cfg;
  },
};

export default config;
