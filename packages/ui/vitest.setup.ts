import '@testing-library/jest-dom/vitest';

// happy-dom doesn't ship matchMedia / IntersectionObserver, which the Aurora
// motion layer (useReducedMotion / useInView) reaches for. Stub them so
// components render in tests (useInView already falls back to visible when the
// observer is absent, but we provide a no-op class for completeness).
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = '';
    thresholds = [];
  }
  globalThis.IntersectionObserver = IO as unknown as typeof IntersectionObserver;
}
