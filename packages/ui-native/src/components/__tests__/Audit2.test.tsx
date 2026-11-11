// @vitest-environment happy-dom
/// <reference lib="dom" />
/* Running-app audit fixes (native): ProgressBar is a named progressbar, Alert's footer is outside the
   live region, CodeInput boxes carry the field's name and hint, ReauthDialog keeps Confirm enabled and
   says what's missing. */
import { describe, expect, test, vi } from 'vitest';
import { Alert } from '../Alert';
import { ProgressBar } from '../ProgressBar';
import { CodeInput } from '../TagInput';
import { mount, propOf } from './dom';

describe('ProgressBar', () => {
  test('a progressbar named by its label or the app’s accessibilityLabel', () => {
    const a = mount(<ProgressBar value={0.4} label="Upload" />);
    const bar = a.host.querySelector('[role="progressbar"]')!;
    expect(bar.getAttribute('aria-label')).toBe('Upload');
    expect(propOf(bar, 'accessibilityValue')).toMatchObject({ now: 40 });
    a.unmount();
    const b = mount(<ProgressBar accessibilityLabel="Syncing" />);
    expect(b.host.querySelector('[role="progressbar"]')!.getAttribute('aria-label')).toBe('Syncing');
    b.unmount();
  });
});

describe('Alert footer', () => {
  test('the live region is the title and text only', () => {
    const { host, unmount } = mount(
      <Alert tone="danger" title="Too many tries" footer="Try again in 0:42">
        Wait a moment.
      </Alert>,
    );
    const live = host.querySelector('[aria-live="assertive"]')!.cloneNode(true) as Element;
    // the word measurers' probes are laid out but never read
    live.querySelectorAll('[data-testid="lk-fit-measure"]').forEach((m) => m.remove());
    expect(live.textContent).toBe('Too many triesWait a moment.');
    expect(host.textContent).toContain('Try again in 0:42');
    unmount();
  });
});

describe('CodeInput named by its field', () => {
  test('each box reads the field’s name, then its digit, and the hint', () => {
    const { host, unmount } = mount(
      <CodeInput length={2} accessibilityLabel="Reset code" accessibilityHint="Wrong code" digitLabel={(p, n) => `${p}/${n}`} />,
    );
    const boxes = host.querySelectorAll('input');
    expect(boxes[0].getAttribute('aria-label')).toBe('Reset code, 1/2');
    expect(propOf(boxes[1], 'accessibilityHint')).toBe('Wrong code');
    unmount();
  });
});

describe('ReauthDialog', () => {
  test('an empty Confirm stays enabled and says what is missing', async () => {
    const { ReauthDialog } = await import('../ReauthDialog');
    const { click } = await import('./dom');
    const submit = vi.fn();
    const { unmount } = mount(
      <ReauthDialog open onClose={() => {}} onSubmitPassword={submit} confirmLabel="Confirm" passwordRequiredLabel="Введіть пароль" />,
    );
    const confirm = Array.from(document.querySelectorAll('[role="button"]')).find((b) => b.getAttribute('aria-label') === 'Confirm')!;
    expect(confirm.getAttribute('aria-disabled')).not.toBe('true');
    click(confirm);
    expect(submit).not.toHaveBeenCalled();
    expect(document.body.textContent).toContain('Введіть пароль');
    unmount();
  });
});
