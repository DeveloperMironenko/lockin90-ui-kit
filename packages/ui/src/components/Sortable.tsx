import {
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

/* ============================================================================
   Sortable — drag-to-reorder list. Pointer-Events based (no external dep): a
   pointerdown on the handle starts a drag, pointermove tracks the cursor and
   computes the index it would drop at (a drop indicator marks the gap), and
   pointerup commits the new order via `onReorder(nextIds)`. Keyboard a11y: a
   focused handle responds to ↑/↓ which move the item one slot and emit the new
   order. Emits `lk-sortable*` classes; tokens-only styling lives in the CSS
   partial. Mirrors the native `@lockin90/ui-native` `Sortable` API.
   ========================================================================== */

export interface SortableItem {
  /** stable identity — used as the React key and reported back in `onReorder`. */
  id: string;
  /** the row content to render (the handle is added by `Sortable`). */
  node: ReactNode;
}

export interface SortableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** the ordered rows. */
  items: SortableItem[];
  /** called with the full id list (in the new order) after a reorder. */
  onReorder: (nextIds: string[]) => void;
  /**
   * Drag only by the dedicated grip handle (default). When `false`, the whole
   * row is the drag surface (the handle is still rendered as an affordance).
   */
  handle?: boolean;
  /** disable all interaction (rows render but cannot be moved). */
  disabled?: boolean;
}

/** Move the item at `from` to `to` and return the reordered array. */
function move<T>(list: T[], from: number, to: number): T[] {
  const next = list.slice();
  const [picked] = next.splice(from, 1);
  next.splice(to, 0, picked);
  return next;
}

/** Drag-to-reorder list — pointer drag + keyboard (↑/↓) move, drop indicator. */
export function Sortable({
  items,
  onReorder,
  handle = true,
  disabled = false,
  className,
  ...rest
}: SortableProps) {
  const reactId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  // index of the row currently being dragged (null = idle)
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  // index of the gap the dragged row would drop INTO (the drop indicator)
  const [overIndex, setOverIndex] = useState<number | null>(null);
  // live mirrors so the global pointerup handler reads current values
  const dragIndexRef = useRef<number | null>(null);
  const overIndexRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);

  const ids = items.map((it) => it.id);

  // "latest props" ref so the stable window handlers always see current data
  const latest = useRef({ ids, onReorder });
  latest.current = { ids, onReorder };

  const commit = (from: number, to: number) => {
    if (from === to) return;
    const { ids: curIds, onReorder: cb } = latest.current;
    cb(move(curIds, from, to));
  };

  const setDrag = (v: number | null) => {
    dragIndexRef.current = v;
    setDragIndex(v);
  };
  const setOver = (v: number | null) => {
    overIndexRef.current = v;
    setOverIndex(v);
  };

  /** Geometry: which slot does clientY land in, given the live row rects. */
  const indexAtY = (clientY: number): number => {
    const root = listRef.current;
    if (!root) return 0;
    const rows = Array.from(
      root.querySelectorAll<HTMLElement>('[data-lk-sortable-row]'),
    );
    for (let i = 0; i < rows.length; i++) {
      const rect = rows[i].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return i;
    }
    return rows.length;
  };

  // Stable window handlers (created once) so add/removeEventListener identities
  // match across the re-renders that happen mid-drag. They read live data from
  // refs, so they never go stale.
  const handlers = useRef<{ move: (e: PointerEvent) => void; up: () => void } | null>(null);
  if (!handlers.current) {
    const onMove = (e: PointerEvent) => {
      if (pointerIdRef.current !== e.pointerId) return;
      setOver(indexAtY(e.clientY));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      const from = dragIndexRef.current;
      const rawTo = overIndexRef.current;
      if (from != null && rawTo != null) {
        // dropping AFTER its own slot shifts the target index down by one
        const to = rawTo > from ? rawTo - 1 : rawTo;
        commit(from, to);
      }
      setDrag(null);
      setOver(null);
      pointerIdRef.current = null;
    };
    handlers.current = { move: onMove, up: onUp };
  }

  const startDrag = (index: number, e: ReactPointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    pointerIdRef.current = e.pointerId;
    setDrag(index);
    setOver(index);
    const h = handlers.current!;
    window.addEventListener('pointermove', h.move);
    window.addEventListener('pointerup', h.up);
    window.addEventListener('pointercancel', h.up);
  };

  const onHandleKeyDown = (index: number, e: ReactKeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      commit(index, index - 1);
    } else if (e.key === 'ArrowDown' && index < items.length - 1) {
      e.preventDefault();
      commit(index, index + 1);
    }
  };

  return (
    <div
      ref={listRef}
      className={cn('lk-sortable', disabled && 'lk-sortable-disabled', className)}
      role="list"
      {...rest}
    >
      {items.map((item, i) => {
        const dragging = dragIndex === i;
        const rowDrag = !handle && !disabled;
        return (
          <div
            key={item.id}
            data-lk-sortable-row
            role="listitem"
            className={cn(
              'lk-sortable-row',
              rowDrag && 'lk-sortable-row--draggable',
              dragging && 'lk-sortable-dragging',
            )}
          >
            {/* drop indicator — the gap the dragged row would land in */}
            {dragIndex != null && overIndex === i && (
              <span className="lk-sortable-indicator" aria-hidden />
            )}
            <button
              type="button"
              className="lk-sortable-handle"
              aria-label="Reorder item"
              aria-describedby={`${reactId}-hint`}
              disabled={disabled}
              tabIndex={disabled ? -1 : 0}
              onPointerDown={(e) => (handle ? startDrag(i, e) : undefined)}
              onKeyDown={(e) => onHandleKeyDown(i, e)}
            >
              <Icon name="grip" />
            </button>
            <div
              className="lk-sortable-content"
              onPointerDown={(e) => (rowDrag ? startDrag(i, e) : undefined)}
            >
              {item.node}
            </div>
          </div>
        );
      })}
      {/* drop indicator for landing at the very end */}
      {dragIndex != null && overIndex === items.length && (
        <span className="lk-sortable-indicator lk-sortable-indicator-end" aria-hidden />
      )}
      <span id={`${reactId}-hint`} className="lk-sortable-hint">
        Press Arrow Up or Arrow Down to reorder.
      </span>
    </div>
  );
}

// TODO nested: a `SortableTree` (parent/child indent + reparent) is deferred —
// ship flat reorder first per the build spec; nesting can layer on later.
