/* Running-app audit fixes (1.35, 2026-11-10): Select's aria-required on the combobox, ProgressBar named
   by aria-label / aria-labelledby, CodeInput tied by FormField (described, required on its boxes),
   Alert's footer outside the live region. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Alert } from './Alert';
import { FormField } from './FormField';
import { ProgressBar } from './ProgressBar';
import { Select } from './Select';
import { CodeInput } from './TagInput';

const html = renderToStaticMarkup;

describe('Select in a required FormField', () => {
  it('puts aria-required on the combobox, not the wrapper', () => {
    const out = html(
      <FormField label="Country" required>
        <Select options={[{ value: 'ua', label: 'Ukraine' }]} />
      </FormField>,
    );
    expect(out).toMatch(/<button[^>]*role="combobox"[^>]*aria-required="true"/);
    expect(out).not.toMatch(/<div class="lk-select-wrap[^"]*"[^>]*aria-required/);
  });
});

describe('ProgressBar name', () => {
  it('takes aria-label and aria-labelledby', () => {
    expect(html(<ProgressBar value={0.4} aria-label="Upload" />)).toMatch(/role="progressbar"[^>]*aria-label="Upload"/);
    expect(html(<ProgressBar aria-labelledby="t" />)).toMatch(/role="progressbar"[^>]*aria-labelledby="t"/);
  });
});

describe('CodeInput in a FormField', () => {
  it('the group is named and described; aria-required sits on the boxes', () => {
    const out = html(
      <FormField label="Reset code" required error="Wrong code">
        <CodeInput length={4} />
      </FormField>,
    );
    const group = out.match(/<div role="group"[^>]*>/)![0];
    expect(group).toMatch(/aria-labelledby="[^"]+"/);
    expect(group).toMatch(/aria-describedby="[^"]+-error"/);
    expect(group).not.toContain('aria-required');
    expect(out.match(/<input[^>]*aria-required="true"/g)).toHaveLength(4);
  });
});

describe('Alert footer', () => {
  it('sits outside the live region, which is the title and text only', () => {
    const out = html(
      <Alert tone="danger" title="Too many tries" footer="Try again in 0:42">
        Wait a moment.
      </Alert>,
    );
    expect(out).toMatch(/^<div class="lk-alert[^"]*">/);
    expect(out).toMatch(/<div role="alert"><div class="lk-alert-words"[^>]*><p class="lk-alert-title">Too many tries<\/p><p class="lk-alert-text">Wait a moment.<\/p><\/div><\/div><div class="lk-alert-footer">Try again in 0:42<\/div>/);
  });

  it('live={false} has no live region', () => {
    expect(html(<Alert tone="danger" live={false}>x</Alert>)).not.toMatch(/role=/);
  });
});
