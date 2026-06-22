import { useRef, useState, type ReactNode } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  PanResponder,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Icon } from './Icon';

/* ============================================================================
   Sortable (native) — drag-to-reorder list. Mirrors the web `@lockin90/ui`
   `Sortable`: same export name + prop API (`items`, `onReorder`, `handle`,
   `disabled`).

   Interaction: a long-press on the grip handle arms a PanResponder drag; moving
   the finger past a row's half-height swaps neighbours live, and release commits
   the new order via `onReorder(nextIds)`.

   GRACEFUL FALLBACK (always available): every row also renders up/down chevron
   buttons that move the row one slot and call `onReorder`. This is the keyboard-
   /accessibility-equivalent of the web's ↑/↓ handle support, and it guarantees
   reordering works even where a gesture drag is awkward (small targets, nested
   scroll views). The web uses pointer drag + ↑/↓ on a focused handle; native
   uses gesture drag + the visible chevron buttons — same `onReorder` contract.
   ========================================================================== */

export interface SortableItem {
  /** stable identity — used as the key and reported back in `onReorder`. */
  id: string;
  /** the row content to render (the handle + controls are added by `Sortable`). */
  node: ReactNode;
}

export interface SortableProps {
  /** the ordered rows. */
  items: SortableItem[];
  /** called with the full id list (in the new order) after a reorder. */
  onReorder: (nextIds: string[]) => void;
  /**
   * Drag only by the dedicated grip handle (default). When `false`, a long-press
   * anywhere on the row arms the drag. (The chevron fallback is unaffected.)
   */
  handle?: boolean;
  /** disable all interaction (rows render but cannot be moved). */
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Move the item at `from` to `to` and return the reordered array. */
function move<T>(list: T[], from: number, to: number): T[] {
  const next = list.slice();
  const [picked] = next.splice(from, 1);
  next.splice(to, 0, picked);
  return next;
}

/** Drag-to-reorder list — long-press grip drag + up/down chevron fallback. */
export function Sortable({
  items,
  onReorder,
  handle = true,
  disabled = false,
  style,
}: SortableProps) {
  const ids = items.map((it) => it.id);
  // index of the row currently being dragged (null = idle)
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  // live mirrors for the PanResponder closure (refs don't re-create the responder)
  const dragIndexRef = useRef<number | null>(null);
  const rowHeightRef = useRef(56);

  const reorder = (from: number, to: number) => {
    if (from === to || to < 0 || to >= items.length) return;
    onReorder(move(ids, from, to));
  };

  const onRowLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) rowHeightRef.current = h;
  };

  const pan = useRef(
    PanResponder.create({
      // arm only after a deliberate long-press on the handle (set below via grant)
      onMoveShouldSetPanResponder: () => dragIndexRef.current != null,
      onPanResponderMove: (_e, gesture) => {
        const start = dragIndexRef.current;
        if (start == null) return;
        const rows = Math.round(gesture.dy / rowHeightRef.current);
        const target = Math.max(0, Math.min(items.length - 1, start + rows));
        if (target !== start) {
          reorder(start, target);
          dragIndexRef.current = target;
          setDragIndex(target);
        }
      },
      onPanResponderRelease: () => {
        dragIndexRef.current = null;
        setDragIndex(null);
      },
      onPanResponderTerminate: () => {
        dragIndexRef.current = null;
        setDragIndex(null);
      },
    }),
  ).current;

  const armDrag = (index: number) => {
    if (disabled) return;
    dragIndexRef.current = index;
    setDragIndex(index);
  };

  return (
    <View style={[styles.root, style]} {...pan.panHandlers}>
      {items.map((item, i) => {
        const dragging = dragIndex === i;
        return (
          <View
            key={item.id}
            onLayout={i === 0 ? onRowLayout : undefined}
            style={[styles.row, dragging && styles.dragging, disabled && styles.disabledRow]}
          >
            {/* grip handle — long-press to arm the drag */}
            <Pressable
              onLongPress={() => armDrag(i)}
              onPressOut={() => {
                // if a long-press armed but no drag followed, release on press-out
                if (!dragging) {
                  dragIndexRef.current = null;
                }
              }}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityLabel="Drag to reorder"
              hitSlop={6}
              style={styles.handle}
            >
              <Icon name="grip" size={18} color={colors.textFaint} />
            </Pressable>

            {/* row content */}
            <View style={styles.content}>
              {typeof item.node === 'string' || typeof item.node === 'number' ? (
                <Text style={styles.contentText} numberOfLines={1}>
                  {item.node}
                </Text>
              ) : (
                item.node
              )}
            </View>

            {/* up/down fallback controls — always present (a11y-equivalent of web ↑/↓) */}
            <View style={styles.controls}>
              <Pressable
                onPress={() => reorder(i, i - 1)}
                disabled={disabled || i === 0}
                accessibilityRole="button"
                accessibilityLabel="Move up"
                hitSlop={6}
                style={[styles.ctrl, (disabled || i === 0) && styles.ctrlDisabled]}
              >
                {/* `chevron` points right; rotate −90° → points up */}
                <View style={styles.chevronUp}>
                  <Icon name="chevron" size={16} color={colors.textDim} />
                </View>
              </Pressable>
              <Pressable
                onPress={() => reorder(i, i + 1)}
                disabled={disabled || i === items.length - 1}
                accessibilityRole="button"
                accessibilityLabel="Move down"
                hitSlop={6}
                style={[
                  styles.ctrl,
                  (disabled || i === items.length - 1) && styles.ctrlDisabled,
                ]}
              >
                {/* rotate +90° → points down */}
                <View style={styles.chevronDown}>
                  <Icon name="chevron" size={16} color={colors.textDim} />
                </View>
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
}

// TODO nested: a `SortableTree` (parent/child indent + reparent) is deferred —
// ship flat reorder first per the build spec; nesting can layer on later.

const styles = StyleSheet.create({
  root: {
    width: '100%',
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 4,
    paddingRight: 6,
    borderRadius: radii.sm,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dragging: {
    opacity: 0.85,
    borderColor: colors.border2,
    backgroundColor: colors.glass2,
  },
  disabledRow: {
    opacity: 0.6,
  },
  handle: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.sm,
  },
  content: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 8,
  },
  contentText: {
    fontFamily: fonts.ui,
    fontSize: 14.5,
    lineHeight: 18,
    color: colors.text,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ctrl: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.sm,
  },
  ctrlDisabled: {
    opacity: 0.35,
  },
  chevronUp: {
    transform: [{ rotate: '-90deg' }],
  },
  chevronDown: {
    transform: [{ rotate: '90deg' }],
  },
});
