/* Names via props and announcement roles (CONVENTIONS "Accessibility"): Alert, Toast, DotsLoader and
   SearchInput take their spoken names from the app; an error interrupts, anything else is a status. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Alert } from './Alert';
import { DotsLoader } from './DotsLoader';
import { SearchInput } from './FormField';
import { Toast } from './Toast';

const html = renderToStaticMarkup;

describe('Alert', () => {
  it('names its close button from dismissLabel', () => {
    expect(html(<Alert onDismiss={() => {}} dismissLabel="Cerrar">x</Alert>)).toContain('aria-label="Cerrar"');
  });

  it('is an alert when danger, a status otherwise', () => {
    expect(html(<Alert tone="danger">Failed</Alert>)).toMatch(/^<div[^>]*role="alert"/);
    expect(html(<Alert tone="info">Note</Alert>)).toMatch(/^<div[^>]*role="status"/);
  });

  it('titles with a plain p by default and a heading level on request', () => {
    expect(html(<Alert title="Heads up">x</Alert>)).toContain('<p class="lk-alert-title">Heads up</p>');
    expect(html(<Alert title="Heads up" titleAs="h3">x</Alert>)).toContain('<h3 class="lk-alert-title">Heads up</h3>');
  });
});

describe('Toast', () => {
  it('names its close button from dismissLabel and interrupts only for danger', () => {
    expect(html(<Toast onDismiss={() => {}} dismissLabel="Schließen" />)).toContain('aria-label="Schließen"');
    expect(html(<Toast tone="danger" title="Not saved" />)).toMatch(/^<div[^>]*role="alert"/);
    expect(html(<Toast tone="success" title="Saved" />)).toMatch(/^<div[^>]*role="status"/);
  });
});

describe('DotsLoader and SearchInput', () => {
  it('read the app’s words', () => {
    expect(html(<DotsLoader label="Cargando" />)).toContain('aria-label="Cargando"');
    expect(html(<SearchInput value="run" clearLabel="Borrar" />)).toContain('aria-label="Borrar"');
  });
});
