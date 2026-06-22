import type { StorybookConfig } from '@storybook/react-native-web-vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: { name: '@storybook/react-native-web-vite', options: {} },
  core: { disableTelemetry: true },
  // These optional native peers pull in the Expo/native runtime and don't bundle
  // for the browser; alias each to a tiny web stub so the components that lazily
  // require() them (CopyButton, Card/ProGate, Dropzone, DateField) render in preview.
  viteFinal: async (cfg) => {
    cfg.resolve ??= {};
    cfg.resolve.alias = {
      ...(cfg.resolve.alias as Record<string, string> | undefined),
      'expo-clipboard': resolve(here, 'expo-clipboard.web.ts'),
      'expo-blur': resolve(here, 'expo-blur.web.ts'),
      'expo-document-picker': resolve(here, 'expo-document-picker.web.ts'),
      '@react-native-community/datetimepicker': resolve(here, 'datetimepicker.web.ts'),
    };
    return cfg;
  },
};

export default config;
