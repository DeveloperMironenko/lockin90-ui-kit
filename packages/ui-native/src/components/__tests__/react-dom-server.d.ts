/**
 * Test-only ambient types for `react-dom/server`: this package intentionally
 * ships without `@types/react-dom` (react-dom is a devDep used only by the
 * Storybook/catalog/test tooling; the published library never imports it).
 * Lives in __tests__ so react-native-builder-bob excludes it from `lib/`.
 */
declare module 'react-dom/server' {
  import type { ReactNode } from 'react';
  export function renderToStaticMarkup(node: ReactNode): string;
  export function renderToString(node: ReactNode): string;
}

/** `react-dom/client`, for the live-tree tests (dom.ts). */
declare module 'react-dom/client' {
  import type { ReactNode } from 'react';
  export interface Root {
    render(node: ReactNode): void;
    unmount(): void;
  }
  export function createRoot(container: Element): Root;
}
