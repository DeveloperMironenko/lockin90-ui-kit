// @vitest-environment happy-dom
/// <reference lib="dom" />
/* TopLayer: a toast stays above an open Sheet / Modal. Those are RN Modals, native windows over the
   whole page (iOS a presented view controller, Android a Dialog; react-native-web a portal at the end
   of <body>), so the toast must be drawn inside the top-most open one, after its scrim and panel. */
import { Text } from 'react-native';
import { afterEach, describe, expect, test } from 'vitest';
import { Modal } from '../Modal';
import { Sheet } from '../Sheet';
import { TopLayer } from '../TopLayer';
import { mount, propOf } from './dom';

afterEach(() => {
  document.body.innerHTML = '';
});

const toast = () => document.querySelector('[data-testid="toast"]');
const inside = (id: string) => document.querySelector(`[data-testid="${id}"]`)?.closest('[aria-modal="true"]') ?? null;

function Page({ sheet = false, modal = false, show = true }) {
  return (
    <>
      <Sheet open={sheet} title="Physiological profile">
        <Text testID="sheet-body">body</Text>
      </Sheet>
      <Modal open={modal} title="Confirm">
        <Text testID="modal-body">body</Text>
      </Modal>
      {show && (
        <TopLayer>
          <Text testID="toast" pointerEvents="none">
            Units updated
          </Text>
        </TopLayer>
      )}
    </>
  );
}

describe('TopLayer', () => {
  test('in place when no Sheet or Modal is open', () => {
    const view = mount(<Page />);
    expect(toast()).not.toBeNull();
    expect(view.host.contains(toast())).toBe(true);
    view.unmount();
  });

  test('inside the open Sheet, after its panel (drawn over it), once', () => {
    const view = mount(<Page sheet />);
    const sheetWindow = inside('sheet-body');
    expect(sheetWindow).not.toBeNull();
    expect(document.querySelectorAll('[data-testid="toast"]')).toHaveLength(1);
    expect(sheetWindow!.contains(toast())).toBe(true);
    expect(view.host.contains(toast())).toBe(false);
    // later in the window's tree than the panel: painted above it
    const body = document.querySelector('[data-testid="sheet-body"]')!;
    expect(body.compareDocumentPosition(toast()!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    view.unmount();
  });

  test('the host lets touches through to the sheet (box-none), the toast keeps its own none', () => {
    const view = mount(<Page sheet />);
    const wrapper = toast()!.parentElement!;
    expect(propOf(wrapper, 'pointerEvents')).toBe('box-none');
    expect(propOf(wrapper.parentElement!, 'pointerEvents')).toBe('box-none');
    expect(propOf(toast()!, 'pointerEvents')).toBe('none');
    view.unmount();
  });

  test('a toast shown before the sheet opens moves into it, and back when it closes', () => {
    const view = mount(<Page />);
    view.rerender(<Page sheet />);
    expect(inside('sheet-body')!.contains(toast())).toBe(true);
    view.rerender(<Page />);
    expect(view.host.contains(toast())).toBe(true);
    view.unmount();
  });

  test('the latest one opened wins (a Modal over a Sheet)', () => {
    const view = mount(<Page sheet />);
    view.rerender(<Page sheet modal />);
    expect(inside('modal-body')!.contains(toast())).toBe(true);
    expect(document.querySelectorAll('[data-testid="toast"]')).toHaveLength(1);
    view.rerender(<Page sheet />);
    expect(inside('sheet-body')!.contains(toast())).toBe(true);
    view.unmount();
  });

  test('gone with the toast', () => {
    const view = mount(<Page sheet />);
    view.rerender(<Page sheet show={false} />);
    expect(toast()).toBeNull();
    view.unmount();
  });
});
