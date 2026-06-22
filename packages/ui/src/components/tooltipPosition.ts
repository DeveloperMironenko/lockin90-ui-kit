/** Pure, DOM-free positioning math for Tooltip/Popover — flip + shift collision
 *  handling so the bubble always stays inside the viewport. Unit-tested. */

export type Placement = 'top' | 'bottom' | 'left' | 'right';

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface TooltipPosition {
  /** viewport (fixed) coordinates for the bubble */
  top: number;
  left: number;
  /** the placement actually chosen after flipping */
  placement: Placement;
  /** arrow offset along the bubble's cross axis (px from the bubble's start edge) */
  arrow: number;
}

const OPPOSITE: Record<Placement, Placement> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

function coordsFor(t: Rect, bw: number, bh: number, p: Placement, gap: number): { top: number; left: number } {
  const cx = t.left + t.width / 2;
  const cy = t.top + t.height / 2;
  switch (p) {
    case 'top':
      return { top: t.top - gap - bh, left: cx - bw / 2 };
    case 'bottom':
      return { top: t.top + t.height + gap, left: cx - bw / 2 };
    case 'left':
      return { top: cy - bh / 2, left: t.left - gap - bw };
    case 'right':
      return { top: cy - bh / 2, left: t.left + t.width + gap };
  }
}

/** Is there room on the trigger's `p` side for the bubble (main axis only)? The
 *  cross axis is handled separately by shifting, so we don't reject a side just
 *  because the centered position would overflow sideways. */
function fitsMainAxis(t: Rect, bw: number, bh: number, p: Placement, vw: number, vh: number, gap: number, pad: number): boolean {
  switch (p) {
    case 'top':
      return t.top - gap - bh >= pad;
    case 'bottom':
      return t.top + t.height + gap + bh <= vh - pad;
    case 'left':
      return t.left - gap - bw >= pad;
    case 'right':
      return t.left + t.width + gap + bw <= vw - pad;
  }
}

const clamp = (v: number, lo: number, hi: number): number => Math.min(Math.max(v, lo), Math.max(lo, hi));

/**
 * Choose the side with room (preferred → opposite → the others = flip), then shift
 * along the cross axis so the bubble never leaves the screen, and report where the
 * arrow should sit so it keeps pointing at the trigger. Falls back to the preferred
 * side (clamped on screen) when nothing fits.
 */
export function computeTooltipPosition(
  trigger: Rect,
  bubbleW: number,
  bubbleH: number,
  preferred: Placement,
  viewportW: number,
  viewportH: number,
  gap = 8,
  pad = 8,
): TooltipPosition {
  const order: Placement[] = [preferred, OPPOSITE[preferred], 'top', 'bottom', 'left', 'right'];

  let placement: Placement = preferred;
  for (const p of order) {
    if (fitsMainAxis(trigger, bubbleW, bubbleH, p, viewportW, viewportH, gap, pad)) {
      placement = p;
      break;
    }
  }

  const coords = coordsFor(trigger, bubbleW, bubbleH, placement, gap);
  const cx = trigger.left + trigger.width / 2;
  const cy = trigger.top + trigger.height / 2;
  // clamp both axes into the viewport — the cross axis is the real "shift"; the main
  // axis is already a fit in the normal case (clamp is a no-op) but guards the fallback.
  const top = clamp(coords.top, pad, viewportH - bubbleH - pad);
  const left = clamp(coords.left, pad, viewportW - bubbleW - pad);
  const arrow =
    placement === 'top' || placement === 'bottom'
      ? clamp(cx - left, 12, bubbleW - 12)
      : clamp(cy - top, 12, bubbleH - 12);

  return { top, left, placement, arrow };
}

// ---------------------------------------------------------------------------
// Anchored dropdown (Menu / Popover) — opens below the trigger, flips above when
// there's no room, aligns to an edge and shifts to stay on-screen.
// ---------------------------------------------------------------------------

export type MenuSide = 'bottom' | 'top';
export type MenuAlign = 'left' | 'right' | 'center';

export interface MenuPosition {
  top: number;
  left: number;
  /** which side of the trigger the panel ended up on (after flipping) */
  side: MenuSide;
  /** horizontal offset of the trigger center within the panel (for an arrow) */
  arrow: number;
}

export function computeMenuPosition(
  trigger: Rect,
  panelW: number,
  panelH: number,
  align: MenuAlign,
  viewportW: number,
  viewportH: number,
  gap = 6,
  pad = 8,
): MenuPosition {
  const roomBelow = viewportH - (trigger.top + trigger.height) - pad;
  const roomAbove = trigger.top - pad;
  // open below unless it won't fit and there's more room above (flip up)
  const side: MenuSide = panelH + gap > roomBelow && roomAbove > roomBelow ? 'top' : 'bottom';
  const rawTop = side === 'bottom' ? trigger.top + trigger.height + gap : trigger.top - gap - panelH;
  // align to the requested edge/center, then shift to stay on screen
  const rawLeft =
    align === 'left'
      ? trigger.left
      : align === 'right'
        ? trigger.left + trigger.width - panelW
        : trigger.left + trigger.width / 2 - panelW / 2;
  const top = clamp(rawTop, pad, viewportH - panelH - pad);
  const left = clamp(rawLeft, pad, viewportW - panelW - pad);
  const arrow = clamp(trigger.left + trigger.width / 2 - left, 14, panelW - 14);
  return { top, left, side, arrow };
}
