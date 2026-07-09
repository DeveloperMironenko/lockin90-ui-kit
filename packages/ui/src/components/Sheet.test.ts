/* Sheet drag-release decision — the pure `shouldDismissSheet(dy, height, vy)`
   helper (extracted verbatim from the pointer-up predicate): dismiss when the
   pull passed DISMISS_FRACTION (25%) of the sheet height, or on a downward
   fling faster than DISMISS_VELOCITY (0.5 px/ms); a zero/upward pull never
   dismisses. */
import { describe, expect, it } from 'vitest';
import { shouldDismissSheet } from './Sheet';

describe('shouldDismissSheet', () => {
  it('dismisses when the drag passes 25% of the sheet height', () => {
    expect(shouldDismissSheet(101, 400, 0)).toBe(true);
    expect(shouldDismissSheet(300, 400, 0)).toBe(true);
  });

  it('does NOT dismiss at or under the 25% distance threshold (slow release)', () => {
    expect(shouldDismissSheet(100, 400, 0)).toBe(false); // exactly 25% — strict >
    expect(shouldDismissSheet(40, 400, 0.2)).toBe(false); // short + slow
  });

  it('a fast downward fling dismisses regardless of distance', () => {
    expect(shouldDismissSheet(1, 400, 0.51)).toBe(true);
    expect(shouldDismissSheet(10, 10_000, 2)).toBe(true);
  });

  it('velocity exactly at the 0.5 px/ms threshold does not dismiss (strict >)', () => {
    expect(shouldDismissSheet(10, 400, 0.5)).toBe(false);
  });

  it('never dismisses without downward travel, even on a violent fling', () => {
    expect(shouldDismissSheet(0, 400, 99)).toBe(false); // dy > 0 guard
  });

  it('an upward pull (negative dy) never dismisses', () => {
    expect(shouldDismissSheet(-50, 400, 5)).toBe(false);
  });
});
